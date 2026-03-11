const prisma = require('../utils/prisma');

// Candidate: Apply for a job
exports.apply = async (req, res, next) => {
  try {
    const candidateId = req.user.id;
    const { job_id } = req.body;

    // Check if already applied
    const existing = await prisma.applications.findFirst({
      where: { candidate_id: candidateId, job_id }
    });

    if (existing) {
      return res.status(400).json({ success: false, error: { message: 'Already applied for this job' } });
    }

    const application = await prisma.applications.create({
      data: {
        candidate_id: candidateId,
        job_id,
        current_stage: 'APPLIED'
      }
    });

    // Record initial stage history
    await prisma.application_stages.create({
      data: {
        application_id: application.id,
        stage: 'APPLIED',
        notes: 'Initial application'
      }
    });

    res.status(201).json({ success: true, data: { application } });
  } catch (err) {
    next(err);
  }
};

// Public / Admin / Candidate details
exports.getDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const application = await prisma.applications.findUnique({
      where: { id },
      include: {
        candidate: { include: { documents: true } },
        job: true,
        stages: { orderBy: { changed_at: 'desc' } },
        scores: { include: { criteria: true } },
        feedbacks: { include: { partner_user: true } }
      }
    });

    if (!application) {
      return res.status(404).json({ success: false, error: { message: 'Application not found' } });
    }

    res.status(200).json({ success: true, data: { application } });
  } catch (err) {
    next(err);
  }
};

// Admin: Kanban Board
exports.getKanban = async (req, res, next) => {
  try {
    const { job_id } = req.query;
    if (!job_id) return res.status(400).json({ success: false, error: { message: 'job_id query param is required' } });

    const applications = await prisma.applications.findMany({
      where: { job_id },
      include: { candidate: true, scores: true }
    });

    // Group by stage
    const grouped = applications.reduce((acc, app) => {
      if (!acc[app.current_stage]) acc[app.current_stage] = [];
      acc[app.current_stage].push(app);
      return acc;
    }, {});

    res.status(200).json({ success: true, data: { kanban: grouped } });
  } catch (err) {
    next(err);
  }
};

// Admin: Update Single Stage
exports.updateStage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stage, notes } = req.body;
    const adminId = req.user.id;

    const application = await prisma.applications.update({
      where: { id },
      data: { current_stage: stage, updated_at: new Date() }
    });

    await prisma.application_stages.create({
      data: {
        application_id: id,
        stage,
        notes,
        changed_by: adminId
      }
    });

    // TODO: Trigger FCM Notification
    // require('../utils/fcm').sendNotification(application.candidate_id, `Application Update`, `Your application moved to ${stage}`);

    res.status(200).json({ success: true, data: { application } });
  } catch (err) {
    next(err);
  }
};

// Admin: Bulk Update Stage
exports.bulkUpdateStage = async (req, res, next) => {
  try {
    const { application_ids, stage, notes } = req.body;
    const adminId = req.user.id;

    await prisma.$transaction(async (tx) => {
      // Update applications
      await tx.applications.updateMany({
        where: { id: { in: application_ids } },
        data: { current_stage: stage, updated_at: new Date() }
      });

      // Insert stage histories
      const stageRecords = application_ids.map(id => ({
        application_id: id,
        stage,
        notes,
        changed_by: adminId
      }));
      await tx.application_stages.createMany({ data: stageRecords });
    });

    res.status(200).json({ success: true, message: `Updated ${application_ids.length} applications to ${stage}` });
  } catch (err) {
    next(err);
  }
};

// Admin: Add Scores
exports.addScores = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { scores } = req.body; // array of { criteria_id, score }
    const adminId = req.user.id;

    const scoreRecords = scores.map(s => ({
      application_id: id,
      criteria_id: s.criteria_id,
      score: s.score,
      scored_by: adminId
    }));

    await prisma.candidate_scores.createMany({ data: scoreRecords });

    res.status(201).json({ success: true, message: 'Scores added' });
  } catch (err) {
    next(err);
  }
};
