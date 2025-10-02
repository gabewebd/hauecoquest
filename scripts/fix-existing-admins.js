//Josh Andrei Aguiluz
// Script to fix existing users in database who have admin/partner roles but aren't approved
require('dotenv').config();
const connectDB = require('../db');
const User = require('../models/User');

const fixExistingUsers = async () => {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB successfully!');

    // Find all users who have role admin/partner but is_approved is false
    const problematicUsers = await User.find({
      role: { $in: ['admin', 'partner'] },
      is_approved: false
    });

    console.log(`Found ${problematicUsers.length} users with unapproved admin/partner roles`);

    for (const user of problematicUsers) {
      console.log(`\nFixing user: ${user.username} (${user.email})`);
      console.log(`  Current role: ${user.role}`);
      console.log(`  Is approved: ${user.is_approved}`);
      
      // Store the role they were trying to get
      user.requested_role = user.role;
      // Downgrade them to regular user
      user.role = 'user';
      // Keep is_approved as false
      user.is_approved = false;
      
      await user.save();
      
      console.log(`  ✅ Fixed! Now role: ${user.role}, requested_role: ${user.requested_role}`);
    }

    console.log(`\n✅ Successfully fixed ${problematicUsers.length} users!`);
    console.log('\nThese users now need admin approval to become admin/partner.');
    
    const mongoose = require('mongoose');
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing users:', error);
    process.exit(1);
  }
};

fixExistingUsers();

