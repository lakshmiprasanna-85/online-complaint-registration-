const Message = require('../models/Message');
const Complaint = require('../models/Complaint');
const { body } = require('express-validator');

exports.messageValidation = [
  body('message').trim().notEmpty().withMessage('Message is required'),
];

const canAccessComplaint = async (complaintId, user) => {
  const complaint = await Complaint.findById(complaintId);
  if (!complaint) return null;

  const isOwner = complaint.user.toString() === user._id.toString();
  const isAgent =
    complaint.assignedAgent && complaint.assignedAgent.toString() === user._id.toString();
  const isAdmin = user.role === 'ADMIN';

  if (isOwner || isAgent || isAdmin) return complaint;
  return false;
};

exports.getMessages = async (req, res, next) => {
  try {
    const access = await canAccessComplaint(req.params.complaintId, req.user);
    if (!access) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const messages = await Message.find({ complaint: req.params.complaintId })
      .populate('sender', 'name role')
      .sort({ createdAt: 1 });

    res.json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    next(error);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const access = await canAccessComplaint(req.params.complaintId, req.user);
    if (!access) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const message = await Message.create({
      complaint: req.params.complaintId,
      sender: req.user._id,
      message: req.body.message,
    });

    const populated = await Message.findById(message._id).populate('sender', 'name role');

    const io = req.app.get('io');
    if (io) {
      io.to(`complaint-${req.params.complaintId}`).emit('new-message', populated);
    }

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

module.exports.canAccessComplaint = canAccessComplaint;
