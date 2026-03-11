const prisma = require('../utils/prisma');

// Get all notifications for current candidate
exports.getNotifications = async (req, res, next) => {
  try {
    const candidateId = req.user.id;
    const notifications = await prisma.notifications.findMany({
      where: { candidate_id: candidateId },
      orderBy: { sent_at: 'desc' }
    });
    res.status(200).json({ success: true, data: { notifications } });
  } catch (err) {
    next(err);
  }
};

// Mark as read
exports.markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await prisma.notifications.update({
      where: { id },
      data: { status: 'DELIVERED' } // We use DELIVERED as read for MVP based on schema
    });
    res.status(200).json({ success: true, data: { notification } });
  } catch (err) {
    next(err);
  }
};

// Register FCM token
exports.registerFcmToken = async (req, res, next) => {
  try {
    const candidateId = req.user.id;
    const { device_token, device_info } = req.body;

    const token = await prisma.fcm_tokens.upsert({
      where: { device_token },
      update: { candidate_id: candidateId, device_info, is_active: true },
      create: { candidate_id: candidateId, device_token, device_info, is_active: true }
    });

    res.status(200).json({ success: true, message: 'FCM token registered successfully', data: { token } });
  } catch (err) {
    next(err);
  }
};
