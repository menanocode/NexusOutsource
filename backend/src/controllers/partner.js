const prisma = require('../utils/prisma');

// Admin: Get all partners
exports.getPartners = async (req, res, next) => {
  try {
    const partners = await prisma.partners.findMany({
      include: { users: true }
    });
    res.status(200).json({ success: true, data: { partners } });
  } catch (err) {
    next(err);
  }
};

// Admin: Create partner
exports.createPartner = async (req, res, next) => {
  try {
    const data = req.body;
    const partner = await prisma.partners.create({ data });
    res.status(201).json({ success: true, data: { partner } });
  } catch (err) {
    next(err);
  }
};

// Partner: Dashboard stats
exports.getPartnerDashboard = async (req, res, next) => {
  try {
    // req.user handles identifying the partner if user is a PARTNER_USER
    const partnerId = req.user.partner_id;
    if (!partnerId) return res.status(403).json({ success: false, error: { message: 'Not a partner' } });

    // Aggregate applications for this partner's jobs
    const jobs = await prisma.jobs.findMany({
      where: { partner_id: partnerId },
      select: { id: true }
    });
    const jobIds = jobs.map(j => j.id);

    const applications = await prisma.applications.findMany({
      where: { job_id: { in: jobIds } }
    });

    const stats = {
      pending: applications.filter(a => ['APPLIED', 'SCREENING', 'SHORTLISTED', 'SUBMITTED'].includes(a.current_stage)).length,
      interview: applications.filter(a => a.current_stage === 'INTERVIEW').length,
      hired: applications.filter(a => a.current_stage === 'HIRED').length,
      rejected: applications.filter(a => a.current_stage === 'REJECTED').length,
    };

    res.status(200).json({ success: true, data: { stats } });
  } catch (err) {
    next(err);
  }
};

// Partner: Get Candidates linked to their jobs
exports.getPartnerCandidates = async (req, res, next) => {
  try {
    const partnerId = req.user.partner_id;

    const jobs = await prisma.jobs.findMany({ where: { partner_id: partnerId }, select: { id: true } });
    const jobIds = jobs.map(j => j.id);

    const applications = await prisma.applications.findMany({
      where: { job_id: { in: jobIds }, current_stage: { in: ['SUBMITTED', 'INTERVIEW'] } },
      include: {
        candidate: { include: { documents: true } },
        job: true,
        feedbacks: true,
      }
    });

    res.status(200).json({ success: true, data: { applications } });
  } catch (err) {
    next(err);
  }
};

// Partner: Submit feedback rating/comment
exports.submitFeedback = async (req, res, next) => {
  try {
    const { application_id, rating, comment } = req.body;
    const partnerUserId = req.user.id; // user id of the partner portal user

    const feedback = await prisma.partner_feedbacks.create({
      data: {
        application_id,
        partner_user_id: partnerUserId,
        rating,
        comment
      }
    });

    res.status(201).json({ success: true, data: { feedback } });
  } catch (err) {
    next(err);
  }
};

// Partner: Output decision
exports.updateDecision = async (req, res, next) => {
  try {
    const { id } = req.params; // feedback id
    const { decision } = req.body;

    const feedback = await prisma.partner_feedbacks.update({
      where: { id },
      data: { decision }
    });

    // Option: Trigger Stage API automatically if Partner Hired/Rejected
    if (decision === 'HIRED' || decision === 'REJECTED') {
      await prisma.applications.update({
        where: { id: feedback.application_id },
        data: { current_stage: decision, updated_at: new Date() }
      });
      // also record stage history
      await prisma.application_stages.create({
        data: {
          application_id: feedback.application_id,
          stage: decision,
          notes: `Partner decision: ${decision}`
        }
      });
    }

    res.status(200).json({ success: true, data: { feedback } });
  } catch (err) {
    next(err);
  }
};
