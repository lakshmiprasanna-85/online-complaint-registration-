const express = require('express');
const {
  register,
  login,
  getMe,
  updateProfile,
  registerValidation,
  loginValidation,
} = require('../controllers/authController');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
