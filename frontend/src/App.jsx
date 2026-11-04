import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

import "./styles/App.css";

const API_URL = "http://localhost:5000/api/analysis/full-analysis";

// ========================================
// MAIN APPLICATION
// ========================================

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new-analysis" element={<NewAnalysis />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

// ========================================
// NAVIGATION BAR
// ========================================

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-icon">❤️</span>
        CHD Explainable AI
      </Link>

      <div className="navbar-links">
        <Link to="/">Dashboard</Link>
        <Link to="/new-analysis">New Analysis</Link>
      </div>
    </nav>
  );
}

// ========================================
// DASHBOARD
// ========================================

function Dashboard() {
  return (
    <div className="dashboard-container">
      <div className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">
            AI-ASSISTED RESEARCH PROTOTYPE
          </span>

          <h1>
            Congenital Heart Disease
            <br />
            <span>Explainable AI Framework</span>
          </h1>

          <p>
            A multimodal research prototype that processes ECG images,
            echocardiogram images, and clinical information using image
            feature extraction, cross-attention fusion, and
            retrieval-augmented generation.
          </p>

          <Link to="/new-analysis" className="primary-button">
            Start New Analysis →
          </Link>
        </div>

        <div className="hero-heart">
          ❤️
        </div>
      </div>

      <div className="feature-grid">
        <FeatureCard
          icon="📈"
          title="ECG Image Processing"
          description="Upload an ECG image for preprocessing and visual feature extraction."
        />

        <FeatureCard
          icon="🫀"
          title="Echocardiogram Processing"
          description="Process an echocardiogram image to extract general visual features."
        />

        <FeatureCard
          icon="🔗"
          title="Cross-Attention Fusion"
          description="Explore multimodal feature fusion between ECG and echocardiogram inputs."
        />

        <FeatureCard
          icon="📚"
          title="Medical Knowledge Retrieval"
          description="Retrieve relevant educational information from the knowledge base."
        />
      </div>

      <div className="notice-box">
        <strong>Important:</strong> This is an academic research prototype.
        It is not a clinically validated diagnostic system and cannot
        confirm or rule out congenital heart disease.
      </div>
    </div>
  );
}

// ========================================
// FEATURE CARD
// ========================================

function FeatureCard({ icon, title, description }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

// ========================================
// NEW ANALYSIS PAGE
// ========================================

function NewAnalysis() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    heartRate: "",
    bloodPressure: "",
    oxygenSaturation: "",
    symptoms: "",
    medicalHistory: "",
  });

  const [ecgFile, setEcgFile] = useState(null);
  const [echoFile, setEchoFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ========================================
  // HANDLE CLINICAL FORM INPUT
  // ========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // ========================================
  // VALIDATE IMAGE
  // ========================================

  const validateImage = (file) => {
    if (!file) {
      return "Please upload both ECG and echocardiogram images.";
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      return "Please upload PNG, JPG, JPEG, or WEBP image files.";
    }

    const maximumSize = 10 * 1024 * 1024;

    if (file.size > maximumSize) {
      return "Image size must be less than 10 MB.";
    }

    return null;
  };

  // ========================================
  // HANDLE FORM SUBMISSION
  // ========================================

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const ecgValidation = validateImage(ecgFile);

    if (ecgValidation) {
      setError(ecgValidation);
      return;
    }

    const echoValidation = validateImage(echoFile);

    if (echoValidation) {
      setError(echoValidation);
      return;
    }

    setLoading(true);

    try {
      const clinicalData = {
        age: formData.age ? Number(formData.age) : null,
        gender: formData.gender || "Not provided",

        heart_rate: formData.heartRate
          ? Number(formData.heartRate)
          : null,

        blood_pressure: formData.bloodPressure || "Not provided",

        oxygen_saturation: formData.oxygenSaturation
          ? Number(formData.oxygenSaturation)
          : null,

        symptoms: formData.symptoms
          ? formData.symptoms.split(",").map((item) => item.trim())
          : [],

        medical_history: formData.medicalHistory || "Not provided",
      };

      const formPayload = new FormData();

      formPayload.append("ecg_file", ecgFile);
      formPayload.append("echo_file", echoFile);
      formPayload.append(
        "clinical_data",
        JSON.stringify(clinicalData)
      );

      const response = await fetch(API_URL, {
        method: "POST",
        body: formPayload,
      });

      const result = await response.json();

if (!response.ok) {
  const errorMessage =
    typeof result.detail === "string"
      ? result.detail
      : result.detail?.message ||
        result.message ||
        JSON.stringify(result.detail) ||
        "Analysis failed.";

  throw new Error(errorMessage);
}

if (!result.success) {
  throw new Error(
    result.message || "Analysis could not be completed."
  );
}

      if (!result.success) {
        throw new Error(
          result.message || "The analysis could not be completed."
        );
      }

      // Store results for Results page
      sessionStorage.setItem(
        "chdAnalysisResult",
        JSON.stringify(result)
      );

      navigate("/results");
    } catch (err) {
      console.error("Analysis Error:", err);

      setError(
        err.message ||
          "Unable to connect to the analysis server. Please ensure the backend and AI services are running."
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // UI
  // ========================================

  return (
    <div className="analysis-container">
      <div className="page-heading">
        <Link to="/" className="back-link">
          ← Back to Dashboard
        </Link>

        <h1>New Research Analysis</h1>

        <p>
          Provide clinical information and upload the required
          medical images to begin the multimodal research workflow.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="analysis-form">
        {/* ================================= */}
        {/* PATIENT INFORMATION */}
        {/* ================================= */}

        <div className="form-section">
          <div className="section-heading">
            <span className="section-number">01</span>
            <div>
              <h2>Clinical Information</h2>
              <p>Enter the available patient information.</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="age">Age (years)</label>

              <input
                type="number"
                id="age"
                name="age"
                min="0"
                max="120"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter age"
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender</label>

              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Not provided">Prefer not to say</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="heartRate">
                Heart Rate (BPM)
              </label>

              <input
                type="number"
                id="heartRate"
                name="heartRate"
                min="0"
                value={formData.heartRate}
                onChange={handleChange}
                placeholder="e.g. 80"
              />
            </div>

            <div className="form-group">
              <label htmlFor="bloodPressure">
                Blood Pressure (mmHg)
              </label>

              <input
                type="text"
                id="bloodPressure"
                name="bloodPressure"
                value={formData.bloodPressure}
                onChange={handleChange}
                placeholder="e.g. 120/80"
              />
            </div>

            <div className="form-group">
              <label htmlFor="oxygenSaturation">
                Oxygen Saturation (SpO₂ %)
              </label>

              <input
                type="number"
                id="oxygenSaturation"
                name="oxygenSaturation"
                min="0"
                max="100"
                value={formData.oxygenSaturation}
                onChange={handleChange}
                placeholder="e.g. 98"
              />
            </div>

            <div className="form-group">
              <label htmlFor="symptoms">
                Symptoms
              </label>

              <input
                type="text"
                id="symptoms"
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                placeholder="Comma-separated symptoms"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="medicalHistory">
                Medical History
              </label>

              <textarea
                id="medicalHistory"
                name="medicalHistory"
                rows="3"
                value={formData.medicalHistory}
                onChange={handleChange}
                placeholder="Enter relevant medical history, if available..."
              />
            </div>
          </div>
        </div>

        {/* ================================= */}
        {/* ECG IMAGE */}
        {/* ================================= */}

        <div className="form-section">
          <div className="section-heading">
            <span className="section-number">02</span>

            <div>
              <h2>ECG Image</h2>
              <p>Upload an ECG image for visual feature extraction.</p>
            </div>
          </div>

          <div className="upload-box">
            <div className="upload-icon">📈</div>

            <label htmlFor="ecgFile" className="upload-label">
              {ecgFile
                ? "Change ECG Image"
                : "Choose ECG Image"}
            </label>

            <input
              type="file"
              id="ecgFile"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={(event) =>
                setEcgFile(event.target.files?.[0] || null)
              }
            />

            <p>
              {ecgFile
                ? `Selected: ${ecgFile.name}`
                : "PNG, JPG, JPEG, or WEBP • Maximum 10 MB"}
            </p>
          </div>
        </div>

        {/* ================================= */}
        {/* ECHOCARDIOGRAM IMAGE */}
        {/* ================================= */}

        <div className="form-section">
          <div className="section-heading">
            <span className="section-number">03</span>

            <div>
              <h2>Echocardiogram Image</h2>
              <p>Upload an echocardiogram image for visual feature extraction.</p>
            </div>
          </div>

          <div className="upload-box">
            <div className="upload-icon">🫀</div>

            <label htmlFor="echoFile" className="upload-label">
              {echoFile
                ? "Change Echocardiogram Image"
                : "Choose Echocardiogram Image"}
            </label>

            <input
              type="file"
              id="echoFile"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={(event) =>
                setEchoFile(event.target.files?.[0] || null)
              }
            />

            <p>
              {echoFile
                ? `Selected: ${echoFile.name}`
                : "PNG, JPG, JPEG, or WEBP • Maximum 10 MB"}
            </p>
          </div>
        </div>

        {/* ================================= */}
        {/* ERROR MESSAGE */}
        {/* ================================= */}

        {error && (
          <div className="error-message">
            <strong>⚠️ Error:</strong> {error}
          </div>
        )}

        {/* ================================= */}
        {/* DISCLAIMER */}
        {/* ================================= */}

        <div className="notice-box">
          <strong>Research Disclaimer:</strong>

          This application is an academic research prototype.
          Its output is not a clinically validated diagnosis,
          medical prescription, or substitute for professional
          medical evaluation.
        </div>

        {/* ================================= */}
        {/* SUBMIT BUTTON */}
        {/* ================================= */}

        <button
          type="submit"
          className="primary-button submit-button"
          disabled={loading}
        >
          {loading
            ? "Processing Images & Generating Research Report..."
            : "Start Multimodal Analysis →"}
        </button>
      </form>
    </div>
  );
}

// ========================================
// RESULTS PAGE
// ========================================

function Results() {
  const navigate = useNavigate();

  const storedResult = sessionStorage.getItem(
    "chdAnalysisResult"
  );

  const result = storedResult
    ? JSON.parse(storedResult)
    : null;

  if (!result) {
    return (
      <div className="results-container">
        <h2>No Analysis Results Found</h2>

        <p>
          Please complete a research analysis first.
        </p>

        <button
          className="primary-button"
          onClick={() => navigate("/new-analysis")}
        >
          Start New Analysis
        </button>
      </div>
    );
  }

  const clinical = result.clinical_data || {};
  const fusion = result.fusion || {};
  const rag = result.rag || {};
  const explanation = result.explanation || {};

  const researchReport =
    result.final_output?.research_report ||
    explanation.research_report ||
    explanation.explanation ||
    result.research_report ||
    "The research processing completed. No clinically validated diagnosis is generated by this prototype.";

  return (
    <div className="results-container">
      <div className="results-header">
        <div>
          <span className="hero-badge">
            RESEARCH PROCESSING COMPLETED
          </span>

          <h1>Analysis Results</h1>

          <p>
            Below is a summary of the multimodal research
            processing performed by the prototype.
          </p>
        </div>

        <div className="status-badge">
          ✓ Processing Completed
        </div>
      </div>

      {/* ================================= */}
      {/* PATIENT SUMMARY */}
      {/* ================================= */}

      <div className="result-card">
        <h2>👤 Clinical Information Summary</h2>

        <div className="result-grid">
          <ResultItem
            label="Age"
            value={
              clinical.age !== null && clinical.age !== undefined
                ? `${clinical.age} years`
                : "Not provided"
            }
          />

          <ResultItem
            label="Gender"
            value={clinical.gender || "Not provided"}
          />

          <ResultItem
            label="Heart Rate"
            value={
              clinical.heart_rate
                ? `${clinical.heart_rate} BPM`
                : "Not provided"
            }
          />

          <ResultItem
            label="Blood Pressure"
            value={
              clinical.blood_pressure || "Not provided"
            }
          />

          <ResultItem
            label="Oxygen Saturation"
            value={
              clinical.oxygen_saturation !== null &&
              clinical.oxygen_saturation !== undefined
                ? `${clinical.oxygen_saturation}%`
                : "Not provided"
            }
          />

          <ResultItem
            label="Symptoms"
            value={
              Array.isArray(clinical.symptoms)
                ? clinical.symptoms.join(", ") || "Not provided"
                : clinical.symptoms || "Not provided"
            }
          />
        </div>
      </div>

      {/* ================================= */}
      {/* ECG PROCESSING */}
      {/* ================================= */}

      <div className="result-card">
        <h2>📈 ECG Image Processing</h2>

        <p>
          The uploaded ECG image was processed using a pretrained
          visual feature extraction model.
        </p>

        <ul className="result-list">
          <li>Image validation and preprocessing completed.</li>
          <li>Image resized to the model input dimensions.</li>
          <li>General visual feature representation extracted.</li>
        </ul>

        <div className="technical-info">
          Feature Dimension:{" "}
          <strong>
            {result.feature_dimensions?.ecg ||
              result.preprocessing?.ecg?.feature_dimension ||
              "Available in backend output"}
          </strong>
        </div>
      </div>

      {/* ================================= */}
      {/* ECHO PROCESSING */}
      {/* ================================= */}

      <div className="result-card">
        <h2>🫀 Echocardiogram Image Processing</h2>

        <p>
          The uploaded echocardiogram image was processed using
          a pretrained visual feature extraction model.
        </p>

        <ul className="result-list">
          <li>Image validation and preprocessing completed.</li>
          <li>Image resized to the model input dimensions.</li>
          <li>General visual feature representation extracted.</li>
        </ul>

        <div className="technical-info">
          Feature Dimension:{" "}
          <strong>
            {result.feature_dimensions?.echo ||
              result.preprocessing?.echo?.feature_dimension ||
              "Available in backend output"}
          </strong>
        </div>
      </div>

      {/* ================================= */}
      {/* CROSS ATTENTION */}
      {/* ================================= */}

      <div className="result-card">
        <h2>🔗 Multimodal Cross-Attention Fusion</h2>

        <p>
          The framework combines the extracted ECG and
          echocardiogram feature representations through a
          cross-attention fusion module.
        </p>

        <div className="result-highlight">
          <span>Fusion Status</span>

          <strong>
            {fusion.completed
              ? "Completed"
              : result.fusion_completed
              ? "Completed"
              : "Check backend response"}
          </strong>
        </div>

        <div className="technical-info">
          Fusion Dimension:{" "}
          <strong>
            {fusion.dimension ||
              result.fusion_dimension ||
              "Not provided"}
          </strong>
        </div>
      </div>

      {/* ================================= */}
      {/* RAG */}
      {/* ================================= */}

      <div className="result-card">
        <h2>📚 Retrieval-Augmented Knowledge</h2>

        <p>
          The system retrieved relevant educational information
          from its medical knowledge base to support the research
          explanation.
        </p>

        <div className="result-highlight">
          <span>Retrieved Documents</span>

          <strong>
            {rag.documents_retrieved ??
              result.rag_documents_retrieved ??
              result.retrieved_documents?.length ??
              0}
          </strong>
        </div>

        {Array.isArray(result.retrieved_documents) &&
          result.retrieved_documents.length > 0 && (
            <div className="documents-list">
              {result.retrieved_documents.map((doc, index) => (
                <div className="document-item" key={index}>
                  <strong>
                    {doc.title || `Knowledge Document ${index + 1}`}
                  </strong>

                  <p>
                    {doc.content ||
                      doc.text ||
                      JSON.stringify(doc)}
                  </p>
                </div>
              ))}
            </div>
          )}
      </div>

      {/* ================================= */}
      {/* PLAIN LANGUAGE REPORT */}
      {/* ================================= */}

      <div className="result-card report-card">
        <h2>📝 Research Summary & Explanation</h2>

        <div className="research-report">
          {typeof researchReport === "string"
            ? researchReport
            : JSON.stringify(researchReport, null, 2)}
        </div>
      </div>

      {/* ================================= */}
      {/* CONSULTATION GUIDANCE */}
      {/* ================================= */}

      <div className="consultation-card">
        <h2>🩺 General Health Guidance</h2>

        <p>
          This prototype cannot determine whether congenital
          heart disease is present or absent. It also cannot
          assess disease severity or recommend medication.
        </p>

        <ul>
          <li>
            If you have symptoms or concerns about heart health,
            consult a qualified healthcare professional.
          </li>

          <li>
            A cardiologist can determine whether additional
            clinical examinations or diagnostic tests are needed.
          </li>

          <li>
            If severe chest pain, difficulty breathing,
            fainting, or another emergency symptom occurs,
            seek emergency medical care immediately.
          </li>
        </ul>
      </div>

      {/* ================================= */}
      {/* DISCLAIMER */}
      {/* ================================= */}

      <div className="notice-box">
        <strong>Academic Prototype Disclaimer</strong>

        <p>
          This system is developed for academic and research
          demonstration purposes only. The visual features
          extracted by pretrained models and the fusion output
          are not clinically validated biomarkers. The research
          summary must not be used to make medical decisions,
          diagnose a condition, or prescribe treatment.
        </p>
      </div>

      {/* ================================= */}
      {/* ACTION BUTTONS */}
      {/* ================================= */}

      <div className="results-actions">
        <button
          className="secondary-button"
          onClick={() => navigate("/")}
        >
          ← Dashboard
        </button>

        <button
          className="primary-button"
          onClick={() => navigate("/new-analysis")}
        >
          Start New Analysis
        </button>
      </div>
    </div>
  );
}

// ========================================
// RESULT ITEM
// ========================================

function ResultItem({ label, value }) {
  return (
    <div className="result-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

// ========================================
// EXPORT
// ========================================

export default App;

