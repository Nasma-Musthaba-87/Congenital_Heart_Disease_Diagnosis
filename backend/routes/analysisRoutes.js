const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");

const router = express.Router();

// ========================================
// MULTER CONFIGURATION
// ========================================

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// ========================================
// PYTHON AI SERVICE URL
// ========================================

const AI_SERVICE_URL = "http://localhost:8000";

// ========================================
// FULL MULTIMODAL ANALYSIS
// ========================================

router.post(
  "/full-analysis",
  upload.fields([
    { name: "ecg_file", maxCount: 1 },
    { name: "echo_file", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      console.log("Full analysis request received.");

      // Check ECG file
      const ecgFile = req.files?.ecg_file?.[0];

      // Check Echo file
      const echoFile = req.files?.echo_file?.[0];

      // Check clinical information
      const clinicalData = req.body?.clinical_data;

      if (!ecgFile) {
        return res.status(400).json({
          success: false,
          message: "ECG image is missing.",
        });
      }

      if (!echoFile) {
        return res.status(400).json({
          success: false,
          message: "Echocardiogram image is missing.",
        });
      }

      if (!clinicalData) {
        return res.status(400).json({
          success: false,
          message: "Clinical information is missing.",
        });
      }

      console.log("ECG image:", ecgFile.originalname);
      console.log("Echo image:", echoFile.originalname);
      console.log("Clinical information received.");

      // ========================================
      // CREATE FORM DATA FOR PYTHON
      // ========================================

      const formData = new FormData();

      formData.append("ecg_file", ecgFile.buffer, {
        filename: ecgFile.originalname,
        contentType: ecgFile.mimetype,
      });

      formData.append("echo_file", echoFile.buffer, {
        filename: echoFile.originalname,
        contentType: echoFile.mimetype,
      });

      formData.append("clinical_data", clinicalData);

      // ========================================
      // SEND REQUEST TO FASTAPI
      // ========================================

      console.log("Sending images to Python AI service...");

      const aiResponse = await axios.post(
        `${AI_SERVICE_URL}/api/full-analysis`,
        formData,
        {
          headers: formData.getHeaders(),
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
          timeout: 300000,
        }
      );

      console.log("Python AI service response received.");

      // ========================================
      // RETURN RESPONSE TO REACT
      // ========================================

      return res.status(200).json(aiResponse.data);

    } catch (error) {
      console.error("FULL ANALYSIS BACKEND ERROR:");

      if (error.response) {
        console.error(
          "Python status:",
          error.response.status
        );

        console.error(
          "Python response:",
          error.response.data
        );

        return res.status(error.response.status).json({
          success: false,
          message: "Python AI service encountered an error.",
          detail: error.response.data,
        });
      }

      if (error.code === "ECONNREFUSED") {
        return res.status(503).json({
          success: false,
          message:
            "Python AI service is not running. Start FastAPI on port 8000.",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Backend analysis failed.",
        detail: error.message,
      });
    }
  }
);

// ========================================
// EXPORT ROUTER
// ========================================

module.exports = router;

