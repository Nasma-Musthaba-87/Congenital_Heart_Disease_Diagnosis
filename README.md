# Cross-Attention Guided Retrieval-Augmented Multimodal Framework for Explainable Congenital Heart Disease Diagnosis

## Project Overview

This project presents a research prototype of a multimodal framework designed to explore the integration of electrocardiogram (ECG) signals, echocardiography images, and clinical information for congenital heart disease (CHD) research.

The framework combines Transformer-based feature extraction, cross-attention fusion, Retrieval-Augmented Generation (RAG), and explainable AI techniques to demonstrate a multimodal research pipeline.

## Architecture

1. Multimodal Data Input
2. Data Preprocessing
3. Transformer-Based Feature Extraction
4. Cross-Attention Feature Fusion
5. RAG-Based Medical Knowledge Retrieval
6. Explainable Research Interpretation
7. Final Research Output

## Technologies Used

### Frontend

* React.js
* Vite
* CSS
* React Router

### Backend

* Node.js
* Express.js
* Multer
* Axios

### AI Service

* Python
* FastAPI
* PyTorch
* Transformers
* Swin Transformer
* ECG Transformer
* Cross-Attention
* Sentence Transformers
* FAISS

## Project Structure

```text
Congenital_Heart_Disease_Diagnosis/
│
├── frontend/
│   └── React application
│
├── backend/
│   ├── server.js
│   └── routes/
│
├── ai-service/
│   ├── app.py
│   ├── feature_extraction.py
│   ├── ecg_transformer.py
│   ├── cross_attention.py
│   ├── rag_module.py
│   ├── explanation_generator.py
│   └── knowledge_base/
│
└── README.md
```

## Execution

### Python AI Service

```bash
cd ai-service
venv\Scripts\activate
python -m uvicorn app:app --reload --port 8000
```

### Node.js Backend

```bash
cd backend
npm install
npm run dev
```

### React Frontend

```bash
cd frontend
npm install
npm run dev
```

## Research Limitations

This project is an experimental academic prototype.

* The ECG Transformer is not trained on a CHD-specific dataset.
* The cross-attention fusion module is not clinically trained or validated.
* The Swin Transformer uses pretrained image representations.
* A trained clinical encoder and CHD classification model have not been implemented.
* The generated explanation is a research-oriented template, not a validated clinical LLM system.
* The prototype does not generate validated diagnostic predictions, severity classifications, or confidence scores.
* Clinical evaluation and validation on appropriate datasets are required before any diagnostic use.

## Conclusion

The prototype demonstrates the technical integration of multimodal data preprocessing, Transformer-based feature extraction, cross-attention fusion, retrieval of educational medical knowledge, and explainable research interpretation.

The framework provides a foundation for future research involving clinically validated datasets, trained classification models, and medical expert evaluation.

**Disclaimer:** This research prototype is intended for academic and educational purposes only. It is not a medical device and must not be used for diagnosis or treatment decisions.
