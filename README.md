# PariharBack - Backend Server

Backend API server for the Parihar project, featuring user authentication, feedback collection system, and data management.

## 📋 Features

✅ **User Authentication**
- Sign up and sign in with JWT tokens
- Password encryption with bcrypt
- Token-based authorization

✅ **Feedback System** 
- Collect user feedback with ratings
- Store feedback in Excel format
- Track feedback by user ID and timestamp
- Protected endpoints requiring authentication

✅ **Database Integration**
- MongoDB for user data storage
- Local Excel files for feedback data
- Modular data models

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm

### Installation

1. **Clone Repository**
```bash
git clone https://github.com/Hello-sketch-ux/PariharBack.git
cd PariharBack
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure Environment**
Create `.env` file in the root directory:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_secret_key_here
PORT=5000
```

4. **Start Server**
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Endpoints

### Authentication

**Sign Up**
```
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Sign In**
```
POST /api/auth/signin
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Feedback (Protected Route)

**Submit Feedback**
```
POST /api/feedback
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "rating": 5,
  "message": "Great service!"
}
```

## 📂 Project Structure

```
PariharBack/
├── server.js              # Main server file with all endpoints
├── package.json           # Dependencies
├── models/
│   └── User.js           # User schema and model
├── data/                 # Feedback data storage
│   ├── .gitkeep
│   └── feedback.xlsx     # Auto-created feedback file
├── .env                  # Environment variables (not in git)
├── .gitignore
├── FEEDBACK_SETUP.md     # Detailed feedback system documentation
├── QUICK_START.md        # Quick setup guide
└── README.md             # This file
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based access
- **Password Hashing**: Bcrypt for password security
- **CORS**: Cross-origin resource sharing configured
- **Token Verification**: Protected feedback endpoints
- **Input Validation**: Server-side validation for all inputs
- **Error Handling**: Comprehensive error logging and responses

## 📊 Feedback System

The feedback system stores all user feedback in an Excel file for easy access and analysis by the team.

### How It Works
```
Frontend → Sends feedback with JWT token
           ↓
Backend  → Verifies token + validates data
           ↓
Excel    → Saves to data/feedback.xlsx
           ↓
Team     → Can view/analyze feedback locally
```

### Feedback Data Structure
| Column | Type | Description |
|--------|------|-------------|
| Name | Text | User's name |
| Email | Email | User's email |
| Rating | 1-5 | Satisfaction rating |
| Message | Text | Feedback message |
| User ID | MongoDB ID | User identifier |
| Date | DateTime | Submission timestamp |

**For detailed feedback system documentation, see [FEEDBACK_SETUP.md](./FEEDBACK_SETUP.md)**

## 👥 Team Collaboration

### Key Points for Team Members

✅ **Feedback Excel File**
- Location: `PariharBack/data/feedback.xlsx`
- Not committed to Git (in .gitignore)
- Each team member has their own local copy
- Created automatically on first feedback submission

✅ **GitHub Workflow**
- Pull latest code: `git pull origin main`
- Feedback data stays on each machine locally
- Share insights via team discussions

✅ **Setup On New Machine**
- Run `npm install` after pulling
- Update `.env` with your credentials
- Run `npm start` - Excel file creates automatically

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection failed | Check MONGO_URI in .env and verify MongoDB is running |
| Port already in use | Change PORT in .env to different number |
| Cannot save feedback | Verify data/ folder exists and has write permissions |
| Token expired | User needs to sign in again to get new token |
| Feedback not appearing in Excel | Check if server is running and token is valid |

## 📞 Support

For issues or questions:
1. Check [FEEDBACK_SETUP.md](./FEEDBACK_SETUP.md) for detailed documentation
2. Review [QUICK_START.md](./QUICK_START.md) for setup help
3. Check console logs for error details
4. Verify .env configuration

## 📦 Dependencies

```json
{
  "express": "^5.1.0",        // Web framework
  "mongoose": "^8.14.3",      // MongoDB ODM
  "jsonwebtoken": "^9.0.2",   // JWT authentication
  "bcrypt": "^6.0.0",         // Password hashing
  "xlsx": "^0.18.5",          // Excel file handling
  "cors": "^2.8.5",           // Cross-origin requests
  "dotenv": "^16.5.0"         // Environment variables
}
```

## 🚀 Next Steps / Future Enhancements

- [ ] Add feedback retrieval endpoint  (GET feedback data)
- [ ] Admin panel for feedback management
- [ ] Feedback statistics and analytics
- [ ] Email notifications for new feedback
- [ ] Export feedback to CSV/PDF formats
- [ ] Feedback response/reply system
- [ ] Automated backup system

## 📄 License

ISC License

## 👨‍💼 Maintainer

Development Team

---

**Last Updated**: March 2026  
**Version**: 1.0.0
