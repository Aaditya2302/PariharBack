# 📋 Feedback System Setup & Documentation

## Overview
This document explains the new **Feedback Collection System** for the Parihar project. The feedback is stored in Excel format in the local `data/` folder, making it easy for all team members to access and analyze feedback data.

---

## ✅ Key Features

1. **User Authentication**: Only logged-in users can submit feedback
2. **Secure Data Storage**: Feedback data stored locally in `data/feedback.xlsx`
3. **Team Collaboration**: All team members can see feedback data in their local copy
4. **No OneDrive Dependency**: No need to sync OneDrive files; works on any machine
5. **Automatic Initialization**: Excel file is created automatically on first feedback submission
6. **Detailed Tracking**: Each feedback entry includes user ID, timestamp, and rating

---

## 🚀 How to Setup

### Backend Setup (For All Team Members)

1. **Install Dependencies** (if not already done)
   ```bash
   cd PariharBack
   npm install
   ```

2. **Environment Variables** 
   Make sure your `.env` file contains:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

3. **Start the Backend Server**
   ```bash
   npm start
   ```
   You should see:
   ```
   ✅ Data folder created successfully!
   ✅ Feedback Excel file initialized successfully!
   ✅ Server running on http://localhost:5000
   ```

---

## 📝 API Endpoints

### Feedback Submission (Protected Route)

**Endpoint**: `POST /api/feedback`

**Headers Required**:
```json
{
  "Authorization": "Bearer <JWT_TOKEN>",
  "Content-Type": "application/json"
}
```

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "rating": 5,
  "message": "Great service! Very satisfied with the experience."
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Thank you! Your feedback has been saved successfully."
}
```

**Error Response (401 - Unauthorized)**:
```json
{
  "success": false,
  "message": "Unauthorized: No token provided"
}
```

---

## 📊 Feedback Data Structure

The Excel file (`data/feedback.xlsx`) has the following columns:

| Column       | Type             | Description                      |
|-------------|------------------|----------------------------------|
| **Name**    | Text             | User's full name                 |
| **Email**   | Email            | User's email address             |
| **Rating**  | Number (1-5)     | Satisfaction rating              |
| **Message** | Text             | Feedback message/comments        |
| **User ID** | MongoDB ID       | Unique user identifier           |
| **Date**    | DateTime         | Submission time (Asia/Kolkata TZ)|

---

## 🔄 How Data Flows

```
Frontend (Feedback.tsx)
    ↓
    ├─ User fills feedback form
    ├─ Validates all fields
    └─ Sends POST request with JWT token
         ↓
Backend (server.js)
    ↓
    ├─ Verifies JWT token
    ├─ Validates feedback data
    └─ Saves to Excel file
         ↓
Local Storage (PariharBack/data/feedback.xlsx)
    ↓
    └─ Can be viewed/analyzed by all team members
```

---

## 📂 File Locations

```
PariharBack/
├── .gitignore              (Updated to exclude *.xlsx but keep data folder)
├── server.js               (Main backend server with feedback endpoint)
├── package.json            (Dependencies including xlsx)
├── data/                   (Feedback data storage folder)
│   ├── .gitkeep           (Ensures folder is tracked)
│   └── feedback.xlsx      (Auto-created on first feedback submission)
└── models/
    └── User.js            (User schema for authentication)
```

---

## 🔐 Security Features

✅ **JWT Authentication**: Only authenticated users can submit feedback
✅ **Token Verification**: Each request includes token validation
✅ **Error Handling**: Proper error messages and logging
✅ **Data Validation**: All fields validated before saving to Excel
✅ **Local Storage**: No external dependencies for data storage

---

## 📤 How to Pull Latest Changes

When pulling from GitHub, the feedback system will work out of the box:

1. **Pull Latest Code**:
   ```bash
   git pull origin main
   ```

2. **Install Any New Dependencies** (if needed):
   ```bash
   npm install
   ```

3. **Start Backend**:
   ```bash
   npm start
   ```

4. **The `data/` folder will be created automatically** if it doesn't exist

---

## 💡 Team Member Tips

### For Viewing/Analyzing Feedback

After the backend has run and collected some feedback:

1. **Open the Excel file**: `PariharBack/data/feedback.xlsx`
2. **Use Excel features**: Sort, filter, and analyze feedback data
3. **Generate insights**: Create pivot tables, charts, etc.

### For GitHub Collaboration

- The `data/feedback.xlsx` file is **NOT committed** to GitHub (it's in `.gitignore`)
- Each team member has their own local copy
- The `data/` folder itself **IS tracked** to ensure everyone's setup is consistent
- Share important insights via team discussions

### If You Get an Error

**Error**: `"Unauthorized: No token provided"`
- **Solution**: Make sure the frontend is sending the JWT token in the Authorization header

**Error**: `"Unable to save feedback to file"`
- **Solution**: Check if the `data/` folder exists and has write permissions

**Error**: `"Server error during sign in"`
- **Solution**: Verify MongoDB connection string in `.env`

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| Feedback not saving | Verify user is logged in and token is valid |
| Excel file not created | Check if `data/` folder has write permissions |
| Can't connect to backend | Check if MongoDB is running and `.env` is correct |
| Token expired error | User needs to log in again to get new token |

---

## 📞 Support

If team members encounter issues:
1. Check the console logs on the backend
2. Verify `.env` configuration
3. Ensure MongoDB is running
4. Check browser console for frontend errors

---

## 🎯 Next Steps / Future Improvements

- [ ] Add feedback retrieval endpoint (to view all feedback)
- [ ] Add response/reply feature for admins
- [ ] Add feedback statistics/dashboard
- [ ] Export data to different formats (CSV, PDF)
- [ ] Add email notifications for new feedback

---

**Last Updated**: March 2026
**Maintained By**: Development Team
