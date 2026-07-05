require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Agent = require('../models/Agent');
const Complaint = require('../models/Complaint');
const Feedback = require('../models/Feedback');
const Message = require('../models/Message');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    await Promise.all([
      User.deleteMany(),
      Agent.deleteMany(),
      Complaint.deleteMany(),
      Feedback.deleteMany(),
      Message.deleteMany(),
    ]);

    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@resolvehub.com',
      password: 'Rh!Admin2026Secure',
      phone: '9876543210',
      role: 'ADMIN',
    });

    const agent1 = await User.create({
      name: 'Sarah Agent',
      email: 'agent@resolvehub.com',
      password: 'Rh!Agent2026Secure',
      phone: '9876543211',
      role: 'AGENT',
    });

    const agent2 = await User.create({
      name: 'Mike Support',
      email: 'mike@resolvehub.com',
      password: 'Rh!Agent2026Secure',
      phone: '9876543212',
      role: 'AGENT',
    });

    const user1 = await User.create({
      name: 'John Doe',
      email: 'user@resolvehub.com',
      password: 'Rh!User2026Secure',
      phone: '9876543213',
      role: 'USER',
    });

    const user2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@resolvehub.com',
      password: 'Rh!User2026Secure',
      phone: '9876543214',
      role: 'USER',
    });

    const agentProfile1 = await Agent.create({
      user: agent1._id,
      department: 'Technical Support',
      resolvedCount: 12,
    });

    const agentProfile2 = await Agent.create({
      user: agent2._id,
      department: 'Billing',
      resolvedCount: 8,
    });

    const complaintsData = [
      {
        title: 'Internet connection drops frequently',
        description:
          'My internet connection has been unstable for the past week. It disconnects every 30 minutes.',
        category: 'Technical',
        priority: 'High',
        status: 'In Progress',
        user: user1._id,
        assignedAgent: agent1._id,
      },
      {
        title: 'Incorrect billing charge',
        description: 'I was charged twice for my monthly subscription on my last invoice.',
        category: 'Billing',
        priority: 'Medium',
        status: 'Assigned',
        user: user2._id,
        assignedAgent: agent2._id,
      },
      {
        title: 'Product arrived damaged',
        description: 'The package I received had visible damage and the product inside is broken.',
        category: 'Product Defect',
        priority: 'Critical',
        status: 'Submitted',
        user: user1._id,
      },
      {
        title: 'Late delivery complaint',
        description: 'Order was supposed to arrive in 3 days but took 2 weeks.',
        category: 'Delivery',
        priority: 'Low',
        status: 'Resolved',
        user: user2._id,
        assignedAgent: agent1._id,
        resolutionNotes: 'Apologized and provided shipping refund.',
        resolvedAt: new Date(),
      },
      {
        title: 'Account access issue',
        description: 'Unable to reset my password using the forgot password link.',
        category: 'Account',
        priority: 'High',
        status: 'Closed',
        user: user1._id,
        assignedAgent: agent1._id,
        resolutionNotes: 'Reset link was expired. Manually reset credentials.',
        resolvedAt: new Date(Date.now() - 86400000),
      },
    ];

    const complaints = [];
    for (const data of complaintsData) {
      complaints.push(await Complaint.create(data));
    }

    agentProfile1.assignedComplaints = [
      complaints[0]._id,
      complaints[3]._id,
      complaints[4]._id,
    ];
    agentProfile2.assignedComplaints = [complaints[1]._id];
    await agentProfile1.save();
    await agentProfile2.save();

    await Feedback.create({
      complaint: complaints[3]._id,
      user: user2._id,
      agent: agent1._id,
      rating: 5,
      comment: 'Excellent service! Issue resolved quickly.',
    });

    await Feedback.create({
      complaint: complaints[4]._id,
      user: user1._id,
      agent: agent1._id,
      rating: 4,
      comment: 'Good support, took a bit longer than expected.',
    });

    await Message.create([
      {
        complaint: complaints[0]._id,
        sender: user1._id,
        message: 'Hi, this issue started after the recent update.',
      },
      {
        complaint: complaints[0]._id,
        sender: agent1._id,
        message: 'Thank you for reporting. I am looking into this now.',
      },
      {
        complaint: complaints[0]._id,
        sender: agent1._id,
        message: 'Can you tell me your router model number?',
      },
    ]);

    console.log('\n✅ Database seeded successfully!\n');
    console.log('Demo Accounts:');
    console.log('  Admin:  admin@resolvehub.com  / Rh!Admin2026Secure');
    console.log('  Agent:  agent@resolvehub.com  / Rh!Agent2026Secure');
    console.log('  User:   user@resolvehub.com   / Rh!User2026Secure');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();