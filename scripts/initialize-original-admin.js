//Josh Andrei Aguiluz
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const initializeOriginalAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find the admin@hau.edu.ph user
    const originalAdmin = await User.findOne({ email: 'admin@hau.edu.ph' });
    
    if (!originalAdmin) {
      console.log('❌ admin@hau.edu.ph not found in database');
      console.log('Please ensure this user exists before running this script');
      process.exit(1);
    }

    // Update the original admin
    originalAdmin.role = 'admin';
    originalAdmin.is_approved = true;
    originalAdmin.is_original_admin = true;
    originalAdmin.requested_role = null; // Clear any pending requests
    
    await originalAdmin.save();
    
    console.log('✅ Successfully updated admin@hau.edu.ph as the original admin');
    console.log('Original admin details:');
    console.log(`- Email: ${originalAdmin.email}`);
    console.log(`- Role: ${originalAdmin.role}`);
    console.log(`- Is Approved: ${originalAdmin.is_approved}`);
    console.log(`- Is Original Admin: ${originalAdmin.is_original_admin}`);

    // Also check and fix partner@hau.edu.ph if it exists
    const originalPartner = await User.findOne({ email: 'partner@hau.edu.ph' });
    
    if (originalPartner) {
      originalPartner.role = 'partner';
      originalPartner.is_approved = true;
      originalPartner.requested_role = null;
      await originalPartner.save();
      console.log('✅ Also fixed partner@hau.edu.ph as an approved partner');
    }

    // Check student@hau.edu.ph
    const originalStudent = await User.findOne({ email: 'student@hau.edu.ph' });
    
    if (originalStudent) {
      originalStudent.role = 'user';
      originalStudent.is_approved = true;
      originalStudent.requested_role = null;
      await originalStudent.save();
      console.log('✅ Also fixed student@hau.edu.ph as an approved user');
    }

    console.log('\n🎉 Original accounts initialization complete!');
    
  } catch (error) {
    console.error('❌ Error initializing original admin:', error);
  } finally {
    mongoose.connection.close();
  }
};

initializeOriginalAdmin();
