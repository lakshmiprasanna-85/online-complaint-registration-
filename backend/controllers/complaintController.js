const { body } = require('express-validator');
const Complaint = require('../models/Complaint');
const Agent = require('../models/Agent');
const { sendEmail, complaintStatusEmail } = require('../utils/email');

exports.createValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('priority').optional().isIn(['Low', 'Medium', 'High', 'Critical']),
];

exports.updateStatusValidation = [
  body('status')
    .isIn(['Submitted', 'Assigned', 'In Progress', 'Resolved', 'Closed', 'Rejected'])
    .withMessage('Invalid status'),
];

exports.createComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.create({
      ...req.body,
      user: req.user._id,
    });

    const populated = await Complaint.findById(complaint._id)
      .populate('user', 'name email')
      .populate('assignedAgent', 'name email');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

exports.getMyComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id })
      .populate('assignedAgent', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: complaints.length, data: complaints });
  } catch (error) {
    next(error);
  }
};

exports.getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('assignedAgent', 'name email phone');

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const isOwner = complaint.user._id.toString() === req.user._id.toString();
    const isAgent =
      complaint.assignedAgent &&
      complaint.assignedAgent._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAgent && !isAdmin && req.user.role !== 'AGENT') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: complaint });
  } catch (error) {
    next(error);
  }
};

exports.updateComplaint = async (req, res, next) => {
  try {
    let complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const isOwner = complaint.user.toString() === req.user._id.toString();
    const isAgent =
      complaint.assignedAgent &&
      complaint.assignedAgent.toString() === req.user._id.toString();

    if (req.user.role === 'USER' && isOwner) {
      if (!['Submitted', 'Assigned'].includes(complaint.status)) {
        return res.status(400).json({
          success: false,
          message: 'Cannot edit complaint after work has started',
        });
      }
      const { title, description, category, priority } = req.body;
      complaint = await Complaint.findByIdAndUpdate(
        req.params.id,
        { title, description, category, priority },
        { new: true, runValidators: true }
      );
    } else if ((req.user.role === 'AGENT' && isAgent) || req.user.role === 'ADMIN') {
      const { status, resolutionNotes, priority } = req.body;
      const updates = {};
      if (status) updates.status = status;
      if (resolutionNotes) updates.resolutionNotes = resolutionNotes;
      if (priority) updates.priority = priority;

      if (status === 'Resolved') {
        updates.resolvedAt = new Date();
        const agentProfile = await Agent.findOne({ user: req.user._id });
        if (agentProfile) {
          agentProfile.resolvedCount += 1;
          await agentProfile.save();
        }
      }

      complaint = await Complaint.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
      });

      const user = await require('../models/User').findById(complaint.user);
      if (user && status) {
        await sendEmail({
          to: user.email,
          subject: `Complaint ${complaint.ticketId} - Status Updated`,
          html: complaintStatusEmail(user.name, complaint.ticketId, status),
        });
      }
    } else {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const populated = await Complaint.findById(complaint._id)
      .populate('user', 'name email')
      .populate('assignedAgent', 'name email');

    res.json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

exports.deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (req.user.role !== 'ADMIN' && complaint.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await complaint.deleteOne();
    res.json({ success: true, message: 'Complaint deleted' });
  } catch (error) {
    next(error);
  }
};

exports.getAllComplaints = async (req, res, next) => {
  try {
    const { status, category, priority } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const complaints = await Complaint.find(filter)
      .populate('user', 'name email')
      .populate('assignedAgent', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: complaints.length, data: complaints });
  } catch (error) {
    next(error);
  }
};

exports.getAgentComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({ assignedAgent: req.user._id })
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: complaints.length, data: complaints });
  } catch (error) {
    next(error);
  }
};

exports.assignAgent = async (req, res, next) => {
  try {
    const { agentId } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const agentUser = await require('../models/User').findById(agentId);
    if (!agentUser || agentUser.role !== 'AGENT') {
      return res.status(400).json({ success: false, message: 'Invalid agent' });
    }

    let agentProfile = await Agent.findOne({ user: agentId });
    if (!agentProfile) {
      agentProfile = await Agent.create({ user: agentId });
    }

    if (agentProfile.assignedComplaints.length >= agentProfile.maxCapacity) {
      return res.status(400).json({ success: false, message: 'Agent at full capacity' });
    }

    complaint.assignedAgent = agentId;
    complaint.status = 'Assigned';
    await complaint.save();

    if (!agentProfile.assignedComplaints.includes(complaint._id)) {
      agentProfile.assignedComplaints.push(complaint._id);
      await agentProfile.save();
    }

    const populated = await Complaint.findById(complaint._id)
      .populate('user', 'name email')
      .populate('assignedAgent', 'name email');

    res.json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};
