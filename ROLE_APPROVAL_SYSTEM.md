# Role Approval System - Implementation Summary

## Issues Fixed

### 1. LeaderboardPage Blank Page Issue
**Problem:** The leaderboard page was showing blank because `useUser` was used but not imported.

**Solution:** Added the missing import:
```javascript
import { useUser } from '../context/UserContext';
```

### 2. Admin/Partner Registration Without Approval
**Problem:** Users registering as admin or partner were immediately given those roles without requiring approval.

**Solution:** Implemented a complete role request and approval system.

---

## New Role Approval Flow

### How It Works Now

#### 1. **User Registration**
When a user signs up:
- **Regular User (role: 'user')**: 
  - Role is set to `'user'` immediately
  - `is_approved` is set to `true`
  - Can login and access the system right away
  
- **Partner Request (role: 'partner')**: 
  - Actual role is set to `'user'`
  - `requested_role` is set to `'partner'`
  - `is_approved` is set to `false`
  - **Cannot login** until admin approves
  
- **Admin Request (role: 'admin')**: 
  - Actual role is set to `'user'`
  - `requested_role` is set to `'admin'`
  - `is_approved` is set to `false`
  - **Cannot login** until admin approves

#### 2. **Login Restrictions**
Users with pending role requests (partner or admin) are blocked from logging in with a clear message:
```
"Your partner/admin account request is pending admin approval."
```

#### 3. **Admin Approval**
Admins can:
- **View all pending requests**: `GET /api/admin/partner-requests`
  - Returns all users with `requested_role` set and `is_approved: false`
  
- **Approve a request**: `PUT /api/admin/users/:id/approve`
  - Sets `role` to the value of `requested_role`
  - Clears `requested_role` (sets to `null`)
  - Sets `is_approved` to `true`
  - User can now login with their new role
  
- **Reject a request**: `PUT /api/admin/users/:id/reject`
  - Clears `requested_role` (sets to `null`)
  - Keeps `role` as `'user'`
  - Sets `is_approved` to `true`
  - User can now login as a regular user

---

## Database Changes

### User Model Updates
Added new field to the User schema:
```javascript
requested_role: {
  type: String,
  enum: ['user', 'partner', 'admin'],
  default: null
}
```

This field stores the role that a user is requesting when they sign up for partner or admin access.

---

## API Changes

### Modified Endpoints

#### `/api/auth/signup` (POST)
- Now accepts `role` parameter but uses it as `requested_role` for partner/admin
- Creates users with `role: 'user'` and `requested_role: 'partner'|'admin'` for elevated access requests
- Returns appropriate message: "Request submitted. Awaiting admin approval."

#### `/api/auth/login` (POST)
- Blocks users with pending role requests from logging in
- Returns 403 error with descriptive message

#### `/api/admin/users/:id/approve` (PUT)
- Promotes user from `requested_role` to actual `role`
- Clears `requested_role` field
- Sets `is_approved` to `true`

#### `/api/admin/partner-requests` (GET)
- Now returns **both** partner and admin pending requests
- Filters by `requested_role: { $in: ['partner', 'admin'] }` and `is_approved: false`

### New Endpoints

#### `/api/admin/users/:id/reject` (PUT)
- Rejects a role request
- Sets user as regular approved user
- Clears `requested_role`

---

## Frontend Changes

### SignUp.jsx
Updated the signup flow to:
1. Check if user has a `requested_role` after signup
2. If yes, show a message that approval is needed
3. Logout the user immediately (remove token)
4. Redirect to home page after 3 seconds
5. User cannot access the system until admin approves

### LeaderboardPage.jsx
- Fixed missing `useUser` import
- Page now works correctly

---

## Testing the New Flow

### Test Case 1: Regular User Signup
1. Sign up with role "Eco-Hero Student"
2. ✅ Should be logged in immediately
3. ✅ Should be redirected to dashboard
4. ✅ Can access the system right away

### Test Case 2: Partner Request
1. Sign up with role "Environmental Partner"
2. ✅ Should see message: "Partner request submitted. Awaiting admin approval. You cannot login until approved."
3. ✅ Should be logged out and redirected to home
4. ❌ Cannot login until admin approves
5. ✅ After admin approval, can login as partner

### Test Case 3: Admin Request
1. Sign up with role "Quest Master Admin"
2. ✅ Should see message: "Admin request submitted. Awaiting admin approval. You cannot login until approved."
3. ✅ Should be logged out and redirected to home
4. ❌ Cannot login until admin approves
5. ✅ After admin approval, can login as admin

### Test Case 4: Admin Rejection
1. User requests partner/admin role
2. Admin rejects the request
3. ✅ User's `requested_role` is cleared
4. ✅ User can now login as regular user
5. ✅ User can use the system normally

---

## Admin Dashboard Requirements

The admin dashboard should display pending role requests with:
- Username
- Email
- Requested Role (Partner or Admin)
- Date of request
- Approve button (calls `/api/admin/users/:id/approve`)
- Reject button (calls `/api/admin/users/:id/reject`)

Fetch pending requests using:
```javascript
GET /api/admin/partner-requests
```

---

## Important Notes

1. **First Admin**: You'll need to manually create the first admin in the database since all new signups go through the approval process. You can do this via MongoDB shell or create a seed script.

2. **Existing Users**: If you have existing users in the database with `role: 'partner'` or `role: 'admin'` but no `requested_role` field, they will continue to work normally.

3. **Security**: Users with pending requests cannot access the system at all - they are blocked at login and immediately logged out after signup.

4. **User Experience**: The signup page clearly shows "Requires Approval" badges for Partner and Admin roles, setting proper expectations.

---

## Files Modified

1. ✅ `client/src/pages/LeaderboardPage.jsx` - Fixed missing import
2. ✅ `models/User.js` - Added `requested_role` field
3. ✅ `routes/auth.js` - Updated signup and login logic
4. ✅ `routes/admin.js` - Updated approval endpoint and partner-requests endpoint, added reject endpoint
5. ✅ `client/src/pages/SignUp.jsx` - Updated signup flow to logout users with pending requests
6. ✅ `client/src/layout/Navigation.jsx` - Added checks to prevent dashboard access for pending requests
7. ✅ `client/src/pages/DashboardPage.jsx` - Added protection against pending role requests
8. ✅ `client/src/pages/AdminDashboard.jsx` - Updated to show both partner AND admin pending requests
9. ✅ `client/src/pages/PartnerDashboard.jsx` - Added protection against pending role requests

---

## Summary

The system now properly implements a role request and approval workflow where:
- Users start as regular users
- Partner/Admin requests are pending until approved
- Pending users cannot access the system
- Admins can approve or reject requests
- Approved users get promoted to their requested role
- Rejected users remain as regular users

This ensures proper access control and prevents unauthorized privilege escalation.

