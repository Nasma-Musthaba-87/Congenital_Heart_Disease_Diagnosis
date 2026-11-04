from fastapi import (
    FastAPI,
    UploadFile,
    File,
    Form,
    HTTPException
)

from fastapi.middleware.cors import CORSMiddleware

from PIL import Image

import os
import io
import json
import torch
import numpy as np

from rag_module import MedicalRAG

from explanation_generator import (
    generate_explanation
)

from feature_extraction import (
    extract_ecg_features,
    extract_echo_features
)

from cross_attention import (
    CrossAttentionFusion
)


# =====================================================
# RAG INITIALIZATION
# =====================================================

rag = MedicalRAG()

knowledge_path = os.path.join(
    os.path.dirname(__file__),
    "knowledge_base",
    "medical_knowledge.txt"
)

rag.load_documents(knowledge_path)


# =====================================================
# FASTAPI APPLICATION
# =====================================================

app = FastAPI(
    title="CardioAI - Explainable CHD Research",
    description=(
        "Cross-Attention Guided Retrieval-Augmented "
        "Multimodal Framework for Explainable "
        "Congenital Heart Disease Research"
    ),
    version="1.0.0"
)


# =====================================================
# CORS CONFIGURATION
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# =====================================================
# HOME ENDPOINT
# =====================================================

@app.get("/")
def home():

    return {
        "success": True,
        "message": (
            "CardioAI Explainable Research "
            "Prototype is running"
        ),
        "version": "1.0.0"
    }


# =====================================================
# HEALTH CHECK
# =====================================================

@app.get("/api/health")
def health_check():

    return {
        "success": True,
        "service": "Python AI Service",
        "status": "Running"
    }


# =====================================================
# IMAGE VALIDATION
# =====================================================

def validate_image(image_bytes):

    try:

        image = Image.open(
            io.BytesIO(image_bytes)
        )

        image.verify()

        return True

    except Exception:

        return False


# =====================================================
# IMAGE PREPROCESSING
# =====================================================

def preprocess_image(image_bytes):

    try:

        image = Image.open(
            io.BytesIO(image_bytes)
        ).convert("RGB")

        original_size = image.size

        processed_image = image.resize(
            (224, 224)
        )

        image_array = np.array(
            processed_image
        ).astype(np.float32) / 255.0

        return {

            "original_size": list(
                original_size
            ),

            "processed_size": [
                224,
                224
            ],

            "image_shape": list(
                image_array.shape
            ),

            "mean_pixel_value": round(
                float(image_array.mean()),
                4
            )

        }

    except Exception as error:

        raise ValueError(
            f"Image preprocessing failed: {str(error)}"
        )


# =====================================================
# IMAGE PREPROCESSING API
# =====================================================

@app.post("/api/preprocess")
async def preprocess_data(

    ecg_file: UploadFile = File(...),

    echo_file: UploadFile = File(...),

    clinical_data: str = Form("{}")

):

    try:

        # Read uploaded files

        ecg_bytes = await ecg_file.read()

        echo_bytes = await echo_file.read()


        # Parse clinical data

        clinical = json.loads(
            clinical_data
        )


        # Validate ECG image

        if not validate_image(
            ecg_bytes
        ):

            raise ValueError(
                "Invalid ECG image file."
            )


        # Validate Echo image

        if not validate_image(
            echo_bytes
        ):

            raise ValueError(
                "Invalid echocardiography image."
            )


        # ECG preprocessing

        ecg_result = preprocess_image(
            ecg_bytes
        )


        # Echo preprocessing

        echo_result = preprocess_image(
            echo_bytes
        )


        return {

            "success": True,

            "message": (
                "Multimodal preprocessing "
                "completed successfully"
            ),

            "ecg": ecg_result,

            "echocardiography": echo_result,

            "clinical_data": clinical,

            "next_stage": (
                "Feature extraction and "
                "cross-attention fusion"
            ),

            "diagnosis_available": False

        }


    except Exception as error:

        raise HTTPException(

            status_code=400,

            detail=str(error)

        )


# =====================================================
# RAG + EXPLAINABLE AI API
# =====================================================

@app.post("/api/generate-explanation")
async def generate_ai_explanation(

    data: dict

):

    try:

        # Clinical information

        clinical_data = data.get(
            "clinical_data",
            {}
        )


        # Extracted features

        ecg_features = data.get(
            "ecg_features",
            []
        )

        echo_features = data.get(
            "echo_features",
            []
        )


        # RAG query

        query = f"""

        Congenital heart disease educational
        cardiovascular information.

        Patient age:
        {clinical_data.get("age", "Not provided")}

        Reported symptoms:
        {clinical_data.get("symptoms", "Not provided")}

        Medical history:
        {clinical_data.get("medical_history", "Not provided")}

        ECG and echocardiography evaluation.

        """


        # Retrieve medical knowledge

        retrieved_documents = rag.retrieve(

            query,

            top_k=3

        )


        # Generate explanation

        explanation = generate_explanation(

            retrieved_documents,

            clinical_data,

            ecg_features,

            echo_features

        )


        return {

            "success": True,

            "message": (
                "Research explanation "
                "generated successfully"
            ),

            "explanation": explanation,

            "retrieved_documents": (
                retrieved_documents
            )

        }


    except Exception as error:

        raise HTTPException(

            status_code=500,

            detail=str(error)

        )


# =====================================================
# FULL MULTIMODAL ANALYSIS API
# =====================================================

@app.post("/api/full-analysis")
async def full_analysis(

    ecg_file: UploadFile = File(...),

    echo_file: UploadFile = File(...),

    clinical_data: str = Form(...)

):

    try:

        # =============================================
        # STEP 1: INPUT DATA
        # =============================================

        ecg_bytes = await ecg_file.read()

        echo_bytes = await echo_file.read()


        clinical = json.loads(
            clinical_data
        )


        # =============================================
        # STEP 2: VALIDATE ECG IMAGE
        # =============================================

        if not validate_image(
            ecg_bytes
        ):

            raise ValueError(
                "Uploaded ECG file is not "
                "a valid image."
            )


        # =============================================
        # STEP 3: VALIDATE ECHOCARDIOGRAPHY IMAGE
        # =============================================

        if not validate_image(
            echo_bytes
        ):

            raise ValueError(
                "Uploaded echocardiography file "
                "is not a valid image."
            )


        # =============================================
        # STEP 4: PREPROCESSING
        # =============================================

        ecg_image = Image.open(

            io.BytesIO(
                ecg_bytes
            )

        ).convert("RGB")


        echo_image = Image.open(

            io.BytesIO(
                echo_bytes
            )

        ).convert("RGB")


        ecg_processed = ecg_image.resize(
            (224, 224)
        )


        echo_processed = echo_image.resize(
            (224, 224)
        )


        # =============================================
        # STEP 5: ECG FEATURE EXTRACTION
        # =============================================

        ecg_features = extract_ecg_features(
            ecg_bytes
        )


        # =============================================
        # STEP 6: ECHO FEATURE EXTRACTION
        # =============================================

        echo_features = extract_echo_features(
            echo_bytes
        )


        # =============================================
        # STEP 7: CONVERT FEATURES TO TENSORS
        # =============================================

        ecg_tensor = torch.tensor(

            ecg_features,

            dtype=torch.float32

        ).unsqueeze(0)


        echo_tensor = torch.tensor(

            echo_features,

            dtype=torch.float32

        ).unsqueeze(0)


        # =============================================
        # STEP 8: CROSS-ATTENTION FUSION
        # =============================================

        fusion_model = CrossAttentionFusion()

        fusion_model.eval()


        with torch.no_grad():

            fused_features, attention_weights = (
                fusion_model(

                    ecg_tensor,

                    echo_tensor

                )
            )


        # =============================================
        # STEP 9: RAG KNOWLEDGE RETRIEVAL
        # =============================================

        query = f"""

        Congenital heart disease educational
        cardiovascular information.

        Patient age:
        {clinical.get("age", "Not provided")}

        Reported symptoms:
        {clinical.get("symptoms", "Not provided")}

        Medical history:
        {clinical.get("medical_history", "Not provided")}

        ECG and echocardiography evaluation.

        """


        retrieved_documents = rag.retrieve(

            query,

            top_k=3

        )


        # =============================================
        # STEP 10: EXPLAINABLE AI REPORT
        # =============================================

        explanation = generate_explanation(

            retrieved_documents,

            clinical,

            ecg_features,

            echo_features

        )


        # =============================================
        # STEP 11: FINAL RESEARCH OUTPUT
        # =============================================

        return {

            "success": True,

            "research_status": (
                "Experimental multimodal "
                "research processing completed"
            ),


            # Clinical data

            "clinical_data": clinical,


            # Preprocessing

            "preprocessing": {

                "completed": True,

                "ecg_processed_size": [
                    224,
                    224
                ],

                "echo_processed_size": [
                    224,
                    224
                ]

            },


            # Feature extraction

            "feature_extraction": {

                "completed": True,

                "ecg_feature_dimension": len(
                    ecg_features
                ),

                "echo_feature_dimension": len(
                    echo_features
                )

            },


            # Cross-attention fusion

            "fusion": {

                "completed": True,

                "fused_feature_dimension": int(
                    fused_features.shape[-1]
                ),

                "description": (
                    "Experimental cross-attention "
                    "fusion of ECG and Echo "
                    "feature representations"
                )

            },


            # RAG

            "rag": {

                "retrieved_documents": (
                    retrieved_documents
                ),

                "documents_count": len(
                    retrieved_documents
                )

            },


            # Explainable AI

            "explanation": explanation,


            # Final research result

            "final_output": {

                "research_report": explanation,

                "chd_prediction": (
                    "Not available - "
                    "No clinically validated "
                    "classification model"
                ),

                "severity_assessment": (
                    "Not available"
                ),

                "confidence_score": (
                    "Not available"
                )

            },


            # Diagnostic limitations

            "diagnosis_available": False,

            "prediction_available": False,

            "severity_prediction_available": False,

            "confidence_score_available": False,


            # Medical disclaimer

            "disclaimer": (

                "This academic research prototype "
                "is not clinically validated and "
                "must not be used for medical diagnosis "
                "or treatment decisions."

            )

        }


    except Exception as error:

        print(
            "FULL ANALYSIS ERROR:",
            str(error)
        )

        raise HTTPException(

            status_code=500,

            detail={

                "success": False,

                "message": (
                    "Full multimodal analysis failed"
                ),

                "error": str(error)

            }

        )

