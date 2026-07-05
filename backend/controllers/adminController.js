const User = require('../models/User');
const Complaint = require('../models/Complaint');
const Agent = require('../models/Agent');
const Feedback = require('../models/Feedback');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalAgents,
      totalComplaints,
      statusBreakdown,
      categoryBreakdown,
      recentComplaints,
      avgFeedback,
    ] = await Promise.all([
      User.countDocuments({ role: 'USER' }),
      User.countDocuments({ role: 'AGENT' }),
      Complaint.countDocuments(),
      Complaint.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Complaint.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Complaint.find()
        .populate('user', 'name')
        .populate('assignedAgent', 'name')
        .sort({ createdAt: -1 })
        .limit(5),
      Feedback.aggregate([
        { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
      ]),
    ]);

    const priorityBreakdown = await Complaint.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    const monthlyTrend = await Complaint.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 },
    ]);

    const agentPerformance = await Agent.find()
      .populate('user', 'name email')
      .sort({ resolvedCount: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalAgents,
          totalComplaints,
          averageRating: avgFeedback[0]?.avgRating
            ? Math.round(avgFeedback[0].avgRating * 10) / 10
            : 0,
          totalFeedback: avgFeedback[0]?.count || 0,
        },
        statusBreakdown,
        categoryBreakdown,
        priorityBreakdown,
        monthlyTrend,
        recentComplaints,
        agentPerformance,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['USER', 'AGENT', 'ADMIN'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (role === 'AGENT') {
      const existing = await Agent.findOne({ user: user._id });
      if (!existing) await Agent.create({ user: user._id });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ success: true, data: { _id: user._id, isActive: user.isActive } });
  } catch (error) {
    next(error);
  }
};

exports.getAllAgents = async (req, res, next) => {
  try {
    const agents = await Agent.find()
      .populate('user', 'name email phone isActive')
      .populate({
        path: 'assignedComplaints',
        select: 'ticketId title status priority',
      });

    res.json({ success: true, count: agents.length, data: agents });
  } catch (error) {
    next(error);
  }
};
