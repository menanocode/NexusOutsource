const prisma = require('../utils/prisma');

exports.getMe = async (req, res, next) => {
  try {
    const candidateId = req.user.id;
    const candidate = await prisma.candidates.findUnique({
      where: { id: candidateId },
      include: {
        documents: true,
      }
    });

    if (!candidate) return res.status(404).json({ success: false, error: { message: 'Candidate not found' } });

    res.status(200).json({ success: true, data: { candidate } });
  } catch (err) {
    next(err);
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    const candidateId = req.user.id;
    const data = req.body;
    
    // In MVP, just update the provided fields directly (excluding restricted ones like id, nik encrypted, etc.)
    const allowedFields = ['full_name', 'phone', 'address', 'education_level', 'institution', 'major', 'years_of_experience', 'availability_status'];
    const updateData = {};
    for (const key of allowedFields) {
      if (data[key] !== undefined) updateData[key] = data[key];
    }

    const updated = await prisma.candidates.update({
      where: { id: candidateId },
      data: updateData
    });

    res.status(200).json({ success: true, data: { candidate: updated } });
  } catch (err) {
    next(err);
  }
};

exports.uploadDocument = async (req, res, next) => {
  try {
    const candidateId = req.user.id;
    
    if (!req.file) {
      return res.status(400).json({ success: false, error: { message: 'No file uploaded' } });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    
    // Save to DB
    const document = await prisma.candidate_documents.create({
      data: {
        candidate_id: candidateId,
        doc_type: 'CV', // MVP handles CV primarily
        file_url: fileUrl,
        file_name: req.file.originalname,
        file_size_bytes: req.file.size
      }
    });

    // Update CV url in candidate profile automatically for MVP
    await prisma.candidates.update({
      where: { id: candidateId },
      data: { cv_url: fileUrl }
    });

    res.status(200).json({ success: true, message: 'Document uploaded successfully', data: { document } });
  } catch (err) {
    next(err);
  }
};

exports.getMyApplications = async (req, res, next) => {
  try {
    const candidateId = req.user.id;
    
    const applications = await prisma.applications.findMany({
      where: { candidate_id: candidateId },
      include: {
        job: {
          include: { partner: true }
        },
        stages: {
          orderBy: { changed_at: 'desc' }
        }
      },
      orderBy: { applied_at: 'desc' }
    });

    res.status(200).json({ success: true, data: { applications } });
  } catch (err) {
    next(err);
  }
};
