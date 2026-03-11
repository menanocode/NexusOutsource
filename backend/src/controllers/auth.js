const prisma = require('../utils/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateTokens = (user) => {
  const payload = { id: user.id, role: user.role };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

exports.candidateRegister = async (req, res, next) => {
  try {
    const { full_name, email, phone } = req.body;
    
    const existing = await prisma.candidates.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ success: false, error: { message: 'Email already exists' } });

    const newUser = await prisma.candidates.create({
      data: { full_name, email, phone }
    });

    res.status(201).json({ success: true, data: newUser });
  } catch (err) {
    next(err);
  }
};

exports.sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const candidate = await prisma.candidates.findUnique({ where: { email } });
    if (!candidate) return res.status(404).json({ success: false, error: { message: 'Candidate not found' } });

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store in Redis (expires in 5 mins)
    await redisClient.setex(`otp:${email}`, 300, otp);
    
    // In real app, send email/SMS here. For now, just return it in dev.
    console.log(`OTP for ${email}: ${otp}`);

    res.status(200).json({ success: true, message: 'OTP sent successfully', data: { dev_otp: otp } });
  } catch (err) {
    next(err);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const storedOtp = await redisClient.get(`otp:${email}`);

    if (!storedOtp || storedOtp !== otp) {
      return res.status(401).json({ success: false, error: { message: 'Invalid or expired OTP' } });
    }

    await redisClient.del(`otp:${email}`);

    const candidate = await prisma.candidates.findUnique({ where: { email } });
    const tokens = generateTokens({ id: candidate.id, role: 'CANDIDATE' });

    res.status(200).json({ success: true, data: { user: candidate, tokens } });
  } catch (err) {
    next(err);
  }
};

exports.portalLogin = async (req, res, next) => {
  try {
    const { email, password, type } = req.body;
    
    let user = null;
    let role = null;

    if (type === 'ADMIN') {
      user = await prisma.admin_users.findUnique({ where: { email } });
      if (user) role = user.role;
    } else if (type === 'PARTNER') {
      user = await prisma.partner_users.findUnique({ where: { email }, include: { partner: true } });
      if (user) role = user.role; // Needs mapping or specific role checks depending on what portal expects
    }

    if (!user) return res.status(404).json({ success: false, error: { message: 'User not found' } });
    if (!user.is_active) return res.status(403).json({ success: false, error: { message: 'Account is inactive' } });

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) return res.status(401).json({ success: false, error: { message: 'Invalid credentials' } });

    // Generate tokens, encode real role and user id
    const payload = { 
      id: user.id, 
      role: type === 'PARTNER' ? `PARTNER_${role}` : role,
      partner_id: type === 'PARTNER' ? user.partner_id : null
    };
    
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id, type }, process.env.JWT_SECRET, { expiresIn: '7d' });

    delete user.password_hash;
    res.status(200).json({ success: true, data: { user, tokens: { accessToken, refreshToken } } });
  } catch (err) {
    next(err);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(401).json({ success: false, error: { message: 'Refresh token required' } });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Real implementation would verify against DB to check if user still exists/active, 
    // and if refresh token is not revoked. For MVP stateless mapping:
    // ...
    res.status(200).json({ success: true, data: { decoded } });
  } catch (err) {
    return res.status(401).json({ success: false, error: { message: 'Invalid refresh token' } });
  }
};
