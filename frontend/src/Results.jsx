import React from "react";

import {
  Link,
  useLocation
} from "react-router-dom";

function Results() {

  const location = useLocation();

  const result = location.state?.analysisResult;

  return (

    <div className="app-container">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <h2 className="logo">
          CardioAI
        </h2>

        <nav>

          <Link to="/">
            Dashboard
          </Link>

          <Link to="/new-analysis">
            New Analysis
          </Link>

          <Link
            to="/results"
            className="active"
          >
            Analysis Results
          </Link>

        </nav>

        <div className="sidebar-footer">

          <p>Research Prototype</p>

          <small>
            Multimodal CHD Framework
          </small>

        </div>

      </aside>

      {/* MAIN CONTENT */}

      <main className="main-content">

        <header className="dashboard-header">

          <div>

            <h1>
              Analysis Results
            </h1>

            <p>
              Explainable Multimodal Research Output
            </p>

          </div>

          <span className="status-badge">
            Experimental
          </span>

        </header>

        {!result ? (

          <div className="form-section">

            <h3>No Analysis Results Available</h3>

            <p>
              Please complete a new analysis first.
            </p>

            <Link
              to="/new-analysis"
              className="analyze-button"
            >
              Start New Analysis
            </Link>

          </div>

        ) : (

          <>

            {/* FEATURE EXTRACTION */}

            <section className="form-section">

              <h3>
                Feature Extraction
              </h3>

              <div className="result-grid">

                <p>
                  <strong>
                    Echo Feature Dimension:
                  </strong>

                  {" "}

                  {
                    result.feature_extraction
                      ?.echo_feature_dimension
                  }

                </p>

                <p>
                  <strong>
                    ECG Feature Dimension:
                  </strong>

                  {" "}

                  {
                    result.feature_extraction
                      ?.ecg_feature_dimension
                  }

                </p>

              </div>

            </section>

            {/* CROSS ATTENTION */}

            <section className="form-section">

              <h3>
                Cross-Attention Fusion
              </h3>

              <p>
                Fusion Completed:{" "}

                {
                  result.fusion?.completed
                    ? "Yes"
                    : "No"
                }

              </p>

              <p>
                Unified Feature Dimension:{" "}

                {
                  result.fusion
                    ?.fused_feature_dimension
                }

              </p>

            </section>

            {/* RAG */}

            <section className="form-section">

              <h3>
                Retrieved Medical Knowledge
              </h3>

              <div className="knowledge-box">

                <ol>

                  {
                    result.rag
                      ?.retrieved_documents
                      ?.map((document, index) => (

                        <li key={index}>

                          {document}

                        </li>

                      ))
                  }

                </ol>

              </div>

            </section>

            {/* EXPLANATION */}

            <section className="form-section">

              <h3>
                Explainable AI Research Report
              </h3>

              <div className="explanation-box">

                <pre className="result-output">

                  {result.explanation}

                </pre>

              </div>

            </section>

            {/* DISCLAIMER */}

            <div className="disclaimer">

              <strong>
                Important Research Disclaimer
              </strong>

              <p>

                {result.disclaimer}

              </p>

              <p>

                This system does not provide
                clinically validated CHD
                predictions, severity estimates,
                or confidence scores.

              </p>

            </div>

          </>

        )}

      </main>

    </div>

  );

}

export default Results;