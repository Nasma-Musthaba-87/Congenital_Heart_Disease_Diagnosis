import torch
from PIL import Image
import io
import numpy as np
from transformers import AutoImageProcessor, SwinModel

# ==========================================
# PRETRAINED SWIN TRANSFORMER
# ==========================================

MODEL_NAME = "microsoft/swin-tiny-patch4-window7-224"

processor = AutoImageProcessor.from_pretrained(MODEL_NAME)
model = SwinModel.from_pretrained(MODEL_NAME)

model.eval()


# ==========================================
# IMAGE FEATURE EXTRACTION
# ==========================================

def extract_image_features(image_bytes):

    image = Image.open(
        io.BytesIO(image_bytes)
    ).convert("RGB")

    inputs = processor(
        images=image,
        return_tensors="pt"
    )

    with torch.no_grad():

        outputs = model(**inputs)

        features = outputs.last_hidden_state.mean(dim=1)

    features = features.squeeze()

    return features.numpy().tolist()


# ==========================================
# ECG IMAGE FEATURE EXTRACTION
# ==========================================

def extract_ecg_features(image_bytes):

    features = extract_image_features(image_bytes)

    return features


# ==========================================
# ECHOCARDIOGRAPHY FEATURE EXTRACTION
# ==========================================

def extract_echo_features(image_bytes):

    features = extract_image_features(image_bytes)

    return features