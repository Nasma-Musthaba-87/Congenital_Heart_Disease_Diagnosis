import torch
import torch.nn as nn
import pandas as pd
import numpy as np
import io

class ECGTransformer(nn.Module):
    def __init__(self, d_model=64, nhead=4, num_layers=2):
        super().__init__()

        self.input_projection = nn.Linear(1, d_model)

        encoder_layer = nn.TransformerEncoderLayer(
            d_model=d_model,
            nhead=nhead,
            batch_first=True
        )

        self.transformer = nn.TransformerEncoder(
            encoder_layer,
            num_layers=num_layers
        )

    def forward(self, x):
        x = self.input_projection(x)
        x = self.transformer(x)
        return x.mean(dim=1)


def extract_ecg_features(file_bytes):
    data = pd.read_csv(io.BytesIO(file_bytes), header=None)

    data = data.apply(
        pd.to_numeric, errors="coerce"
    ).dropna()

    if data.empty:
        raise ValueError("No valid numeric ECG data found")

    signal = data.iloc[:, 0].values.astype(np.float32)

    signal = signal[:500]

    if len(signal) < 2:
        raise ValueError("ECG signal contains insufficient data")

    signal = (signal - signal.mean()) / (signal.std() + 1e-8)

    tensor = torch.tensor(signal).reshape(1, -1, 1)

    model = ECGTransformer()
    model.eval()

    with torch.no_grad():
        features = model(tensor)

    return features.squeeze().tolist()

