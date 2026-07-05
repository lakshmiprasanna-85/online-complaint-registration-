const express = require('express');
const {
  getMessages,
  sendMessage,
  messageValidation,
} = require('../controllers/messageController');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/:complaintId', getMessages);
router.post('/:complaintId', messageValidation, validate, sendMessage);

module.exports = router;
