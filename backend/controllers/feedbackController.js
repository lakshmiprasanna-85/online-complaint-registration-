const { body } = require('express-validator');
const Feedback = require('../models/Feedback');
const Complaint = require('../models/Complaint');

exports.feedbackValidation = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim().isLength({ max: 1000 }),
];

exports.createFeedback = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.complaintId);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (complaint.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (!['Resolved', 'Closed'].includes(complaint.status)) {
      return res.status(400).json({
        success: false,
        message: 'Feedback can only be submitted for resolved complaints',
      });
    }

    const existing = await Feedback.findOne({ complaint: complaint._id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Feedback already submitted' });
    }

    const feedback = await Feedback.create({
      complaint: complaint._id,
      user: req.user._id,
      agent: complaint.assignedAgent,
      rating: req.body.rating,
      comment: req.body.comment,
    });

    const populated = await Feedback.findById(feedback._id)
      .populate('complaint', 'ticketId title')
      .populate('user', 'name')
      .populate('agent', 'name');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

exports.getFeedbackByComplaint = async (req, res, next) => {
  try {
    const feedback = await Feedback.findOne({ complaint: req.params.complaintId })
      .populate('user', 'name')
      .populate('agent', 'name');

    if (!feedback) {
      return res.status(404).json({ success: false, message: 'No feedback found' });
    }

    res.json({ success: true, data: feedback });
  } catch (error) {
    next(error);
  }
};

exports.getAgentFeedback = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find({ agent: req.user._id })
      .populate('complaint', 'ticketId title')
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    const avgRating =
      feedbacks.length > 0
        ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
        : 0;

    res.json({
      success: true,
      count: feedbacks.length,
      averageRating: Math.round(avgRating * 10) / 10,
      data: feedbacks,
    });
  } catch (error) {
    next(error);
  }
};
