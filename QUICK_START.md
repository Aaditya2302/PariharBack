# 🚀 Quick Start Guide - Feedback System

## For New Team Members

### 1️⃣ Pull Latest Code
```bash
git pull origin main
cd PariharBack
npm install
```

### 2️⃣ Set Up Environment Variables
Create or update `.env` file in `PariharBack/`:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### 3️⃣ Start Backend
```bash
npm start
```

You should see:
```
✅ Feedback Excel file initialized successfully!
📄 Feedback Excel path: C:\...\PariharBack\data\feedback.xlsx
✅ Server running on http://localhost:5000
```

### 4️⃣ Start Frontend
```bash
cd ../PariharProject
npm install
npm run dev
```

### 5️⃣ Test Feedback Submission
1. Open browser to frontend URL (usually http://localhost:5173)
2. Go to Feedback page
3. Log in with your account (or sign up first)
4. Fill feedback form and submit
5. Check `PariharBack/data/feedback.xlsx` - new entry should appear!

---

## 📁 Key File Locations

| File | Purpose |
|------|---------|
| `PariharBack/server.js` | Backend API with feedback endpoint |
| `PariharBack/data/feedback.xlsx` | Where feedback data is stored |
| `PariharBack/.gitignore` | Excludes *.xlsx from git |
| `PariharProject/src/Pages/Feedback.tsx` | Frontend feedback form |
| `FEEDBACK_SETUP.md` | Full documentation |

---

## ✅ How It Works

1. **User logs in** with JWT token
2. **Submits feedback form** with name, email, rating (1-5), message
3. **Frontend sends** to backend with Authorization header
4. **Backend verifies** JWT token
5. **Saves to Excel file** with timestamp and user ID
6. **All team members** can view the Excel file locally

---

## 🔍 Troubleshooting

### "You must be logged in to submit feedback"
- Make sure you've signed up and logged in to the app
- Check browser console for authentication errors

### "Unable to save feedback to file"
- Check that `data/` folder exists in PariharBack
- Verify folder has write permissions
- Restart the server

### "Unauthorized: Invalid token"
- Your token may have expired, log in again
- Check that token is being saved to localStorage

### Backend won't run
- Verify MongoDB connection string in `.env`
- Check that MongoDB is running
- Verify all dependencies installed: `npm install`

---

## 💾 Viewing Feedback Data

1. **Using Excel**: Open `PariharBack/data/feedback.xlsx` directly
2. **Columns**: Name | Email | Rating | Message | User ID | Date
3. **Tips**: 
   - Sort by Date to see newest first
   - Filter by Rating to find patterns
   - Create pivot tables for analytics

---

## 📤 GitHub Workflow

✅ **DO commit**: 
- server.js changes
- Feedback.tsx changes
- FEEDBACK_SETUP.md documentation
- data/ folder structure (.gitkeep)

❌ **DO NOT commit**:
- `data/feedback.xlsx` (excluded in .gitignore)
- `.env` file
- node_modules/

---

**Questions?** Review `FEEDBACK_SETUP.md` for full documentation!
