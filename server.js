import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import XLSX from "xlsx";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./models/User.js";

dotenv.config();

/*  PATH FIX  */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ================= FEEDBACK DATA STORAGE ================= */
const DATA_FOLDER = path.join(__dirname, "data");
const FEEDBACK_FILE = path.join(DATA_FOLDER, "feedback.xlsx");

// Initialize feedback storage system
const initializeFeedbackSystem = () => {
  try {
    if (!fs.existsSync(DATA_FOLDER)) {
      fs.mkdirSync(DATA_FOLDER, { recursive: true });
    }
    
    if (!fs.existsSync(FEEDBACK_FILE)) {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet([]);
      worksheet['!cols'] = [
        { wch: 15 },
        { wch: 25 },
        { wch: 8 },
        { wch: 40 },
        { wch: 15 },
        { wch: 20 }
      ];
      XLSX.utils.book_append_sheet(workbook, worksheet, "Feedback");
      XLSX.writeFile(workbook, FEEDBACK_FILE);
    }
  } catch (error) {
    console.error("Error initializing feedback system:", error.message);
  }
};

initializeFeedbackSystem();

/*  DATABASE CONNECTION  */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

/*  MIDDLEWARE  */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*  JWT VERIFICATION MIDDLEWARE  */
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No authorization header"
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token format"
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("ERROR: JWT_SECRET is not set in .env file");
      return res.status(500).json({
        success: false,
        message: "Server configuration error"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({
      success: false,
      message: error.name === 'TokenExpiredError' 
        ? "Unauthorized: Token expired. Please log in again."
        : error.name === 'JsonWebTokenError'
        ? "Unauthorized: Invalid token"
        : "Unauthorized: Token verification failed"
    });
  }
};

/*  HEALTH CHECK  */
app.get("/", (req, res) => {
  res.send("Parihar Backend is running 🚀");
});

/*  VALIDATION HELPER  */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/*  SIGN UP API  */
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required"
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered"
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Sign Up Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: error.message
    });
  }
});


// ✅ Logged-in / Registered Users Count (Dashboard Stats)
app.get('/api/stats/loggedInUsersCount', async (req, res) => {
  try {
    const count = await User.countDocuments();

    res.status(200).json({
      success: true,
      count: count
    });
  } catch (error) {
    console.error('Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});
 





/*  SIGN IN API  */
app.post("/api/auth/signin", async (req, res) => {

  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email"
      });
    }

    // Find user and include password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("User signed in successfully:", user.email);
    res.status(200).json({
      success: true,
      message: "Signed in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (error) {
    console.error("Sign In Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error during sign in",
      error: error.message
    });
  }
});

const validateFeedback = (name, email, rating, message) => {
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  }

  if (!email || !validateEmail(email)) {
    errors.push("Valid email is required");
  }

  if (!rating || rating < 1 || rating > 5) {
    errors.push("Rating must be between 1 and 5");
  }

  if (!message || message.trim().length < 5) {
    errors.push("Message must be at least 5 characters");
  }

  return errors;
};

/*  FEEDBACK API - PROTECTED WITH AUTH  */
app.post("/api/feedback", verifyToken, async (req, res) => {
  try {
    const { name, email, rating, message } = req.body;
    const userId = req.user.userId;

    console.log("Feedback request from:", email, "User ID:", userId);

    // Validate input
    const validationErrors = validateFeedback(name, email, rating, message);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: validationErrors.join(", ")
      });
    }

    // Read existing feedback data
    let workbook = XLSX.utils.book_new();
    let feedbackData = [];

    if (fs.existsSync(FEEDBACK_FILE)) {
      try {
        workbook = XLSX.readFile(FEEDBACK_FILE);
        const sheet = workbook.Sheets["Feedback"];
        if (sheet) {
          feedbackData = XLSX.utils.sheet_to_json(sheet);
        }
      } catch (err) {
        console.error("Failed to read feedback file:", err.message);
      }
    }

    // Add new feedback entry
    feedbackData.push({
      Name: name.trim(),
      Email: email.trim(),
      Rating: parseInt(rating),
      Message: message.trim(),
      "User ID": userId,
      Date: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    });

    // Update Excel sheet
    const worksheet = XLSX.utils.json_to_sheet(feedbackData);
    worksheet['!cols'] = [
      { wch: 15 },
      { wch: 25 },
      { wch: 8 },
      { wch: 40 },
      { wch: 15 },
      { wch: 20 }
    ];

    if (workbook.SheetNames.includes("Feedback")) {
      workbook.Sheets["Feedback"] = worksheet;
    } else {
      XLSX.utils.book_append_sheet(workbook, worksheet, "Feedback");
    }

    // Save to file
    XLSX.writeFile(workbook, FEEDBACK_FILE);
    console.log(`Feedback saved from ${email}`);

    res.status(200).json({
      success: true,
      message: "Thank you! Your feedback has been saved successfully."
    });

  } catch (error) {
    console.error("Feedback submission error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error: Unable to save feedback. Please try again."
    });
  }
});

/*  START SERVER  */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});