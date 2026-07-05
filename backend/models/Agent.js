const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    department: {
      type: String,
      default: 'General',
      trim: true,
    },
    assignedComplaints: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Complaint',
      },
    ],
    isAvailable: {
      type: Boolean,
      default: true,
    },
    maxCapacity: {
      type: Number,
      default: 10,
    },
    resolvedCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

agentSchema.index({ isAvailable: 1 });

module.exports = mongoose.model('Agent', agentSchema);
