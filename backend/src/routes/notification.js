const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification');
const { verifyToken, requireRoles } = require('../middlewares/auth');

router.use(verifyToken);
router.use(requireRoles(['CANDIDATE']));

router.get('/', notificationController.getNotifications);
router.patch('/:id/read', notificationController.markAsRead);
router.post('/fcm-tokens', notificationController.registerFcmToken);
router.put('/fcm-tokens', notificationController.registerFcmToken);

module.exports = router;
