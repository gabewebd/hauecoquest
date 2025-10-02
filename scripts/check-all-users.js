//Josh Andrei Aguiluz
// Script to check all users in the database
require('dotenv').config();
const connectDB = require('../db');
const User = require('../models/User');

const checkUsers = async () => {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB successfully!\n');

    // Find all users
    const allUsers = await User.find({}).select('-password');

    console.log(`📊 Total users in database: ${allUsers.length}\n`);
    console.log('=' .repeat(80));

    allUsers.forEach((user, index) => {
      console.log(`\n👤 User #${index + 1}: ${user.username}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Requested Role: ${user.requested_role || 'none'}`);
      console.log(`   Is Approved: ${user.is_approved}`);
      console.log(`   Created: ${new Date(user.created_at).toLocaleString()}`);
      
      // Show status
      if (user.requested_role && !user.is_approved) {
        console.log(`   ⚠️  STATUS: Pending ${user.requested_role} approval`);
      } else if (user.role === 'admin') {
        console.log(`   👑 STATUS: Active Admin`);
      } else if (user.role === 'partner') {
        console.log(`   🤝 STATUS: Active Partner`);
      } else {
        console.log(`   ✅ STATUS: Regular User`);
      }
    });

    console.log('\n' + '='.repeat(80));
    
    // Summary
    const pendingRequests = allUsers.filter(u => u.requested_role && !u.is_approved);
    const admins = allUsers.filter(u => u.role === 'admin' && u.is_approved);
    const partners = allUsers.filter(u => u.role === 'partner' && u.is_approved);
    const users = allUsers.filter(u => u.role === 'user' && !u.requested_role);
    
    console.log('\n📈 SUMMARY:');
    console.log(`   Regular Users: ${users.length}`);
    console.log(`   Active Admins: ${admins.length}`);
    console.log(`   Active Partners: ${partners.length}`);
    console.log(`   Pending Requests: ${pendingRequests.length}`);

    if (pendingRequests.length > 0) {
      console.log('\n⚠️  PENDING REQUESTS:');
      pendingRequests.forEach(u => {
        console.log(`   - ${u.username} (${u.email}) requesting: ${u.requested_role}`);
      });
    }

    const mongoose = require('mongoose');
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkUsers();

