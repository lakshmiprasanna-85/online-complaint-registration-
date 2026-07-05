const express = require('express');
const {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  getAllComplaints,
  getAgentComplaints,
  assignAgent,
  createValidation,
  updateStatusValidation,
} = require('../controllers/complaintController');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', authorize('USER', 'ADMIN'), createValidation, validate, createComplaint);
router.get('/my', authorize('USER'), getMyComplaints);
router.get('/agent', authorize('AGENT'), getAgentComplaints);
router.get('/', authorize('ADMIN'), getAllComplaints);
router.get('/:id', getComplaintById);
router.put('/:id', updateComplaint);
router.delete('/:id', deleteComplaint);
router.put('/:id/assign', authorize('ADMIN'), assignAgent);

module.exports = router;
