const express = require('express');
const {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  getAllAgents,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('ADMIN'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.get('/agents', getAllAgents);

module.exports = router;
