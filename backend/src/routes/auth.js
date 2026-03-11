const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { validate } = require('../middlewares/validate');
const { AuthSchemas } = require('../validations/auth.schema');

router.post('/register', validate(AuthSchemas.candidateRegister), authController.candidateRegister);
router.post('/send-otp', validate(AuthSchemas.sendOtp), authController.sendOtp);
router.post('/verify-otp', validate(AuthSchemas.verifyOtp), authController.verifyOtp);
router.post('/portal-login', validate(AuthSchemas.portalLogin), authController.portalLogin);
router.post('/refresh', authController.refresh);

module.exports = router;
