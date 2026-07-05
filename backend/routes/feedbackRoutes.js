const express = require('express');
const {
  createFeedback,
  getFeedbackByComplaint,
  getAgentFeedback,
  feedbackValidation,
} = require('../controllers/feedbackController');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/:complaintId', authorize('USER'), feedbackValidation, validate, createFeedback);
router.get('/complaint/:complaintId', getFeedbackByComplaint);
router.get('/agent/me', authorize('AGENT'), getAgentFeedback);

module.exports = router;
