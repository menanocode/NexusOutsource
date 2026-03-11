const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partner');
const { verifyToken, requireRoles } = require('../middlewares/auth');

router.use(verifyToken);

// Admin Routes for Managing Partner Companies
router.post('/', requireRoles(['SUPER_ADMIN']), partnerController.createPartner);
router.get('/', requireRoles(['SUPER_ADMIN', 'RECRUITER']), partnerController.getPartners);

// Partner Portal Routes
// Allowed roles depends on how we mapped the JWT. For simplicity, we assume generic PARTNER strings or similar mapping if it's dynamic.
// Our auth.js currently maps type === 'PARTNER' to role: `PARTNER_${user.role}` (e.g., PARTNER_ADMIN, PARTNER_VIEWER)
router.use(requireRoles(['PARTNER_ADMIN', 'PARTNER_VIEWER']));

router.get('/dashboard', partnerController.getPartnerDashboard);
router.get('/candidates', partnerController.getPartnerCandidates);
router.post('/feedbacks', partnerController.submitFeedback);
router.patch('/feedbacks/:id/decision', requireRoles(['PARTNER_ADMIN']), partnerController.updateDecision);

module.exports = router;
