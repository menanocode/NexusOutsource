const prisma = require('../utils/prisma');

// Public
exports.getJobs = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    
    // Default to PUBLISHED for public access
    const where = { status: status || 'PUBLISHED' };
    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    const jobs = await prisma.jobs.findMany({
      where,
      include: { partner: true },
      orderBy: { created_at: 'desc' }
    });
    res.status(200).json({ success: true, data: { jobs } });
  } catch (err) {
    next(err);
  }
};

// Public
exports.getJobDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await prisma.jobs.findUnique({
      where: { id },
      include: { partner: true }
    });
    
    if (!job) return res.status(404).json({ success: false, error: { message: 'Job not found' } });
    
    res.status(200).json({ success: true, data: { job } });
  } catch (err) {
    next(err);
  }
};

// Admin
exports.createJob = async (req, res, next) => {
  try {
    const data = req.body;
    const job = await prisma.jobs.create({ data });
    res.status(201).json({ success: true, data: { job } });
  } catch (err) {
    next(err);
  }
};

// Admin
exports.updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    const job = await prisma.jobs.update({
      where: { id },
      data
    });
    res.status(200).json({ success: true, data: { job } });
  } catch (err) {
    next(err);
  }
};

// Admin
exports.deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.jobs.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Job deleted' });
  } catch (err) {
    next(err);
  }
};

// Admin
exports.getJobApplications = async (req, res, next) => {
  try {
    const { id } = req.params; // job id
    
    const applications = await prisma.applications.findMany({
      where: { job_id: id },
      include: {
        candidate: { include: { documents: true } },
        stages: true
      },
      orderBy: { applied_at: 'desc' }
    });

    res.status(200).json({ success: true, data: { applications } });
  } catch (err) {
    next(err);
  }
};
