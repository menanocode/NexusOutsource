const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job');
const { verifyToken, requireRoles } = require('../middlewares/auth');

// Public endpoints
router.get('/', jobController.getJobs);
router.get('/:id', jobController.getJobDetails);

// Admin-only endpoints
router.use(verifyToken);
router.use(requireRoles(['SUPER_ADMIN', 'RECRUITER']));

router.post('/', jobController.createJob);
router.put('/:id', jobController.updateJob);
router.delete('/:id', jobController.deleteJob);
router.get('/:id/applications', jobController.getJobApplications);

module.exports = router;
