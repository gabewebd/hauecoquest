# Fix: Admin/Partner Role Assigned Immediately Issue

## Problem
Users who sign up as admin/partner are getting `role: "admin"` or `role: "partner"` immediately, even though `is_approved: false`. This happens because the backend server is still running the old code.

---

## Solution: 3 Steps

### **Step 1: Stop the Server** 🛑

If your server is running, stop it:
- Press `Ctrl + C` in the terminal where the server is running
- Or close that terminal window

### **Step 2: Restart the Server** 🔄

Start the server again:
```bash
cd c:\Users\Josh\Desktop\WCSERVER-FINAL\6WCSERVER-Final-Project
node server.js
```

OR if you use nodemon:
```bash
nodemon server.js
```

The server will now load the NEW code where:
- Users requesting admin/partner will have `role: 'user'`
- Their requested role is stored in `requested_role: 'admin'` or `'partner'`
- They cannot login until approved

### **Step 3: Fix Existing Database Users** 🔧

If you already created users with admin/partner roles before the server restart, run this script to fix them:

```bash
node scripts/fix-existing-admins.js
```

This script will:
1. Find all users with `role: 'admin'` or `'partner'` who have `is_approved: false`
2. Change their `role` to `'user'`
3. Set their `requested_role` to the role they were trying to get
4. Keep `is_approved: false` so they need approval

---

## Verification

After restarting the server and running the fix script:

### **Test 1: New Signup**
1. Sign up as a new user and select "Quest Master Admin"
2. Check the database - you should see:
   ```javascript
   {
     role: "user",              // ✅ Should be 'user', NOT 'admin'
     requested_role: "admin",   // ✅ Their request
     is_approved: false         // ✅ Needs approval
   }
   ```

### **Test 2: Existing User Fixed**
Check the user "DAVEEEE" in the database:
```javascript
// BEFORE (what you showed me):
{
  role: "admin",          // ❌ Wrong!
  is_approved: false
}

// AFTER running fix script:
{
  role: "user",           // ✅ Correct!
  requested_role: "admin", // ✅ Stores their request
  is_approved: false      // ✅ Still needs approval
}
```

### **Test 3: Login Blocked**
Try to login with the account "DAVEEEE":
- ✅ Should see error: "Your admin account request is pending admin approval."
- ✅ Cannot access the system

### **Test 4: Admin Approval**
1. Login as an existing approved admin
2. Go to Admin Dashboard > Users tab
3. You should see "DAVEEEE" in the "Pending Role Requests" section
4. Click "Approve"
5. Now "DAVEEEE" can login and access admin dashboard

---

## Why This Happened

The changes I made to the code were saved, but:
1. **Node.js servers don't auto-reload** - they keep running the old code in memory
2. You need to **restart the server** to load the new code
3. Any users created BEFORE the restart have the old data structure

---

## Prevention

To avoid this in the future:

**Option 1: Use Nodemon (Recommended)**
```bash
npm install -g nodemon
nodemon server.js
```
Nodemon automatically restarts the server when code changes.

**Option 2: Manual Restart**
Always restart the server after making code changes:
- Stop: `Ctrl + C`
- Start: `node server.js`

---

## Quick Command Summary

```bash
# 1. Stop server (Ctrl + C)

# 2. Restart server
node server.js

# 3. In a NEW terminal, fix existing users
node scripts/fix-existing-admins.js

# 4. Test new signup - should now work correctly!
```

---

## Expected Behavior After Fix

✅ **New Admin/Partner Signup:**
- Role stored as `'user'`
- Request stored in `requested_role`
- Cannot login until approved
- Shows in admin's "Pending Role Requests"

✅ **Regular User Signup:**
- Role: `'user'`
- `requested_role`: `null`
- `is_approved`: `true`
- Can login immediately

✅ **After Admin Approves:**
- Role changes from `'user'` to `'partner'`/`'admin'`
- `requested_role` cleared to `null`
- `is_approved`: `true`
- User can now login with elevated privileges

