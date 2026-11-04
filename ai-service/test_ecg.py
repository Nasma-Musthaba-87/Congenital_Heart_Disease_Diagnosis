import pandas as pd
import numpy as np

from ecg_transformer import extract_ecg_features

# Create sample ECG numerical data for testing
sample_signal = np.random.randn(500)

pd.DataFrame(sample_signal).to_csv(
    "sample_ecg.csv",
    index=False,
    header=False
)

with open("sample_ecg.csv", "rb") as file:
    features = extract_ecg_features(file.read())

print("ECG Transformer feature extraction successful!")
print("Number of features:", len(features))
print("First 10 features:", features[:10])