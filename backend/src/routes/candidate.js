const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidate');
const { verifyToken, requireRoles } = require('../middlewares/auth');
const { upload } = require('../config/multer');

router.use(verifyToken);
// Candidates can only access their own profile
router.use(requireRoles(['CANDIDATE']));

router.get('/me', candidateController.getMe);
router.put('/me', candidateController.updateMe);
router.post('/documents', upload.single('file'), candidateController.uploadDocument);
router.get('/me/applications', candidateController.getMyApplications);

module.exports = router;
