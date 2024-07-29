// backend/routes/PasswordResetRouter.js
const express = require('express');
const router = express.Router();
const { requestPasswordReset, resetPassword } = require('../Controllers/PasswordResetController');
const { emailValidation, passwordValidation } = require('../Middlewares/AuthValidation');

router.post('/forgot-password', emailValidation, requestPasswordReset);
router.post('/reset-password/:id/:token', passwordValidation, resetPassword);

module.exports = router;
