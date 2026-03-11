const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application');
const { verifyToken, requireRoles } = require('../middlewares/auth');

router.use(verifyToken);

// Candidate apply
router.post('/', requireRoles(['CANDIDATE']), applicationController.apply);

// Admin / Candidate specific checks happens inside controller or via auth middleware abstraction
router.get('/:id', applicationController.getDetails);

// Admin endpoints
router.use(requireRoles(['SUPER_ADMIN', 'RECRUITER']));
router.get('/board/kanban', applicationController.getKanban);
router.patch('/:id/stage', applicationController.updateStage);
router.post('/bulk-stage', applicationController.bulkUpdateStage);
router.post('/:id/scores', applicationController.addScores);

module.exports = router;
