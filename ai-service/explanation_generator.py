# ==========================================
# EXPLAINABLE AI REPORT GENERATOR
# ==========================================

def generate_explanation(
    retrieved_documents,
    clinical_data,
    ecg_features,
    echo_features
):

    age = clinical_data.get("age", "Not provided")

    gender = clinical_data.get("gender", "Not provided")

    symptoms = clinical_data.get(
        "symptoms",
        "Not provided"
    )

    heart_rate = clinical_data.get(
        "heart_rate",
        "Not provided"
    )

    blood_pressure = clinical_data.get(
        "blood_pressure",
        "Not provided"
    )

    oxygen = clinical_data.get(
        "oxygen_saturation",
        "Not provided"
    )

    history = clinical_data.get(
        "medical_history",
        "Not provided"
    )


    # ==========================================
    # CLINICAL INFORMATION SUMMARY
    # ==========================================

    clinical_summary = f"""

PATIENT INFORMATION SUMMARY

Age: {age}

Gender: {gender}

Heart Rate: {heart_rate}

Blood Pressure: {blood_pressure}

Oxygen Saturation: {oxygen}

Reported Symptoms: {symptoms}

Medical History: {history}

"""


    # ==========================================
    # IMAGE PROCESSING SUMMARY
    # ==========================================

    ecg_summary = """

ECG IMAGE ANALYSIS

The uploaded ECG image was processed using a
pretrained Swin Transformer-based image encoder.

Visual feature representations were extracted
from the uploaded image.

Important:
This prototype does not perform validated
ECG waveform interpretation or automated
abnormality detection.

"""


    echo_summary = """

ECHOCARDIOGRAPHY IMAGE ANALYSIS

The uploaded echocardiography image was
processed using a pretrained Swin Transformer.

Image feature representations were extracted
for the experimental multimodal framework.

Important:
The system does not perform clinically
validated structural heart measurements
or automated CHD detection.


"""


    # ==========================================
    # MULTIMODAL FUSION SUMMARY
    # ==========================================

    fusion_summary = f"""

MULTIMODAL FEATURE FUSION

ECG feature extraction: Completed

ECG feature dimension: {len(ecg_features)}

Echocardiography feature extraction: Completed

Echo feature dimension: {len(echo_features)}

Cross-attention fusion: Executed

The extracted feature representations were
combined through an experimental cross-attention
fusion module.

The fused representation is not a validated
CHD classification output.


"""


    # ==========================================
    # KNOWLEDGE RETRIEVAL
    # ==========================================

    knowledge_summary = """

RETRIEVED EDUCATIONAL MEDICAL KNOWLEDGE

"""

    for index, document in enumerate(
        retrieved_documents,
        start=1
    ):

        knowledge_summary += (

            f"\n{index}. {document}\n"

        )


    # ==========================================
    # USER-FRIENDLY INTERPRETATION
    # ==========================================

    interpretation = """

WHAT DOES THIS RESULT MEAN?

The research system has successfully processed
the uploaded ECG and echocardiography images
and combined their extracted features.

However, successful image processing does not
mean that a heart condition has been detected
or ruled out.

The current prototype cannot reliably determine:

• Whether congenital heart disease is present
• The specific type of heart defect
• The severity of a heart condition
• The probability or confidence of a diagnosis


"""


    # ==========================================
    # MEDICAL GUIDANCE
    # ==========================================

    guidance = """

SHOULD YOU CONSULT A DOCTOR?

If you or the patient has symptoms, concerns
about heart health, or an abnormal clinical
report, please consult a qualified physician
or cardiologist for proper evaluation.

A doctor may recommend appropriate clinical
examination, ECG interpretation, and
echocardiography assessment based on the
individual's medical history and symptoms.

Do not rely on this experimental research
prototype to make medical decisions.

If someone experiences severe chest pain,
difficulty breathing, fainting, or sudden
serious symptoms, seek emergency medical care.


"""


    # ==========================================
    # FINAL DISCLAIMER
    # ==========================================

    disclaimer = """

IMPORTANT DISCLAIMER

This application is an academic research
prototype developed for educational purposes.

It is not a clinically validated medical device.

It does not provide a confirmed diagnosis,
treatment prescription, severity classification,
or diagnostic confidence score.

All medical decisions must be made by
qualified healthcare professionals.


"""


    # ==========================================
    # FINAL REPORT
    # ==========================================

    final_report = (

        "CONGENITAL HEART DISEASE "
        "EXPLAINABLE AI RESEARCH REPORT\n"

        + "=" * 55

        + "\n\n"

        + clinical_summary

        + ecg_summary

        + echo_summary

        + fusion_summary

        + knowledge_summary

        + interpretation

        + guidance

        + disclaimer

    )


    return final_report