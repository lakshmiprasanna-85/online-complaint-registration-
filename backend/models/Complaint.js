const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: 5000,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Billing',
        'Technical',
        'Service Quality',
        'Product Defect',
        'Delivery',
        'Account',
        'Other',
      ],
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Submitted', 'Assigned', 'In Progress', 'Resolved', 'Closed', 'Rejected'],
      default: 'Submitted',
    },
    attachments: [
      {
        filename: String,
        url: String,
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolutionNotes: {
      type: String,
      maxlength: 3000,
    },
    resolvedAt: Date,
    ticketId: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

complaintSchema.index({ status: 1 });
complaintSchema.index({ user: 1 });
complaintSchema.index({ assignedAgent: 1 });
complaintSchema.index({ category: 1 });
complaintSchema.index({ createdAt: -1 });

complaintSchema.pre('save', async function () {
  if (this.ticketId) return;
  const last = await mongoose.model('Complaint')
    .findOne({ ticketId: { $exists: true, $ne: null } })
    .sort({ ticketId: -1 })
    .select('ticketId');
  let num = 1;
  if (last?.ticketId) {
    const match = last.ticketId.match(/CMP-(\d+)/);
    if (match) num = parseInt(match[1], 10) + 1;
  }
  this.ticketId = `CMP-${String(num).padStart(6, '0')}`;
});

module.exports = mongoose.model('Complaint', complaintSchema);
