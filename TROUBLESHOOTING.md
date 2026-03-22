# 🔧 Troubleshooting - Feedback Form 401 Error

## Problem: "Unauthorized: Invalid token" (401 Error)

If you're getting a **401 Unauthorized** error when submitting feedback, here are the solutions:

---

## ✅ Quick Fix

### Step 1: Check Backend is Running
```bash
cd PariharBack
npm start
```

You should see:
```
Server running on http://localhost:5000
MongoDB connected successfully
```

### Step 2: Log Out and Log In Again
1. Clear browser localStorage (or just log out)
2. Sign up or log in again to get a new valid token
3. Try submitting feedback again

### Step 3: Verify JWT_SECRET in .env
Make sure `.env` file has a valid JWT_SECRET:
```env
JWT_SECRET=parihar_super_secret_jwt_key_2024_change_this_in_production_12345
```

> ⚠️ **Important**: `JWT_SECRET` must be a random string, NOT a JWT token itself!

---

## 🔍 Common Causes

| Issue | Solution |
|-------|----------|
| **Old token** | Log out and log in again |
| **JWT_SECRET not set** | Add JWT_SECRET to .env |
| **JWT_SECRET is a JWT string** | Replace with a random string |
| **Backend not running** | Start backend with `npm start` |
| **Token expired** | JWT tokens expire after 7 days, log in again |
| **Wrong API_URL** | Check VITE_API_URL matches backend |

---

## 🐛 Debugging

### Check if Token is Being Sent
Open Browser Console (F12) → Network tab:
1. Submit feedback form
2. Look at the POST request to `/api/feedback`
3. Check "Headers" → look for `Authorization: Bearer <token>`

### Check Backend Logs
The backend console will show:
- ✅ `Feedback request from: email User ID: xxxxx` = Token verified successfully
- ❌ `Token verification failed: ...` = Token is invalid

---

## 🛠️ Advanced Solutions

### Option 1: Clear All Tokens (Nuclear Option)
```bash
# In browser console:
localStorage.clear()
```

Then log in again.

### Option 2: Reset Backend
```bash
cd PariharBack
npm install
npm start
```

### Option 3: Check MongoDB Connection
JWT tokens depend on user records in MongoDB. Verify:
1. MongoDB is running
2. User exists in database
3. User ID is correct in token

---

## 📋 What Changed Recently

**JWT_SECRET Fix:**
- Old: `JWT_SECRET=eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwicm9sZSI6InVzZXIiLCJleHAiOjE3MDAwMDAwMDB9`
- New: `JWT_SECRET=parihar_super_secret_jwt_key_2024_change_this_in_production_12345`

**Why It Was Broken:**
- Old secret was a base64-encoded JWT (wrong format)
- JWT verification failed silently
- Tokens created with one secret can't be verified with another

---

## ✨ Best Practices

1. **Always keep JWT_SECRET in .env** (never commit)
2. **Use a strong random string** for JWT_SECRET
3. **Never use JWT tokens as secrets**
4. **Log out users when you change JWT_SECRET** (old tokens become invalid)
5. **Monitor backend logs** for token verification failures

---

## 📞 Still Having Issues?

Check the [FEEDBACK_SETUP.md](./FEEDBACK_SETUP.md) for full documentation or:

1. Verify .env has `JWT_SECRET` set
2. Restart backend server
3. Create new user account and log in
4. Try submitting feedback again

---

**Last Updated:** March 19, 2026
