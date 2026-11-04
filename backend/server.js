// ======================================
// IMPORT PACKAGES
// ======================================

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const analysisRoutes = require("./routes/analysisRoutes");

// ======================================
// LOAD ENVIRONMENT VARIABLES
// ======================================

dotenv.config();

// ======================================
// INITIALIZE EXPRESS
// ======================================

const app = express();

// ======================================
// MIDDLEWARE
// ======================================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// Parse JSON requests
app.use(express.json());

// Parse URL-encoded requests
app.use(express.urlencoded({ extended: true }));

// ======================================
// HEALTH CHECK
// ======================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "Cross-Attention Guided Retrieval-Augmented Multimodal Framework",
    status: "Backend is running",
  });
});

// ======================================
// API HEALTH CHECK
// ======================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Node.js backend is healthy",
    service: "CHD Research Backend",
    port: process.env.PORT || 5000,
  });
});

// ======================================
// AI SERVICE STATUS
// ======================================

app.get("/api/ai/status", async (req, res) => {
  try {
    const axios = require("axios");

    const response = await axios.get(
      "http://127.0.0.1:8000/api/health",
      {
        timeout: 5000,
      }
    );

    res.status(200).json({
      success: true,
      message: "Python AI service is running",
      aiService: response.data,
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: "Python AI service is unavailable",
      error: error.message,
    });
  }
});

// ======================================
// ANALYSIS ROUTES
// ======================================

app.use("/api/analysis", require("./routes/analysisRoutes"));

// ======================================
// 404 HANDLER
// ======================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ======================================
// GLOBAL ERROR HANDLER
// ======================================

app.use((error, req, res, next) => {
  console.error("Backend Error:", error);

  res.status(error.status || 500).json({
    success: false,
    message:
      error.message || "Internal Server Error",
  });
});

// ======================================
// MONGODB CONNECTION
// ======================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB only if URI is configured
    if (process.env.MONGODB_URI) {
      await mongoose.connect(
        process.env.MONGODB_URI
      );

      console.log("MongoDB connected successfully");
    } else {
      console.log(
        "MongoDB URI not configured. Running without database."
      );
    }

    // Start Express server
    app.listen(PORT, () => {
      console.log(
        `Node.js backend running on http://localhost:${PORT}`
      );

      console.log(
        `Health check: http://localhost:${PORT}/api/health`
      );

      console.log(
        `AI status: http://localhost:${PORT}/api/ai/status`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start backend:",
      error.message
    );

    process.exit(1);
  }
};

// ======================================
// START APPLICATION
// ======================================

startServer();