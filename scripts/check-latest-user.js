//Josh Andrei Aguiluz
// Quick script to check the most recent user signup
require('dotenv').config();
const connectDB = require('../db');
const User = require('../models/User');

const checkLatestUser = async () => {
  try {
    await connectDB();
    
    // Get the most recent user
    const latestUser = await User.findOne().sort({ created_at: -1 }).select('-password');
    
    console.log('\n📋 LATEST USER SIGNUP:');
    console.log('='.repeat(60));
    console.log(`👤 Username: ${latestUser.username}`);
    console.log(`📧 Email: ${latestUser.email}`);
    console.log(`🔑 Role: ${latestUser.role}`);
    console.log(`📝 Requested Role: ${latestUser.requested_role || 'none'}`);
    console.log(`✅ Is Approved: ${latestUser.is_approved}`);
    console.log(`📅 Created: ${new Date(latestUser.created_at).toLocaleString()}`);
    console.log('='.repeat(60));
    
    if (latestUser.requested_role === 'admin' || latestUser.requested_role === 'partner') {
      if (latestUser.role === 'user') {
        console.log('\n✅ CORRECT! User is starting as "user" with pending request.');
        console.log(`   They requested: ${latestUser.requested_role}`);
        console.log('   They cannot login until approved.');
      } else {
        console.log('\n❌ WRONG! User got role directly without approval!');
        console.log('   🚨 SERVER NEEDS TO BE RESTARTED! 🚨');
      }
    } else if (latestUser.role === 'admin' || latestUser.role === 'partner') {
      console.log('\n❌ PROBLEM DETECTED!');
      console.log('   User has admin/partner role without going through approval.');
      console.log('   🚨 SERVER NEEDS TO BE RESTARTED! 🚨');
    } else {
      console.log('\n✅ Regular user signup - looks good!');
    }
    
    const mongoose = require('mongoose');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkLatestUser();

