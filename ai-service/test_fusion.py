import torch
from cross_attention import CrossAttentionFusion

# Generate sample feature vectors
echo_features = torch.randn(1, 768)
ecg_features = torch.randn(1, 64)

# Initialize fusion model
model = CrossAttentionFusion()

model.eval()

# Perform cross-attention fusion
with torch.no_grad():
    fused_features, attention_weights = model(
        echo_features,
        ecg_features
    )

print("Cross-Attention Fusion successful!")
print("Fused feature shape:", fused_features.shape)

print("ECG-to-Echo attention shape:",
      attention_weights["ecg_to_echo_attention"].shape)

print("Echo-to-ECG attention shape:",
      attention_weights["echo_to_ecg_attention"].shape)