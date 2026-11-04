import torch
import torch.nn as nn


# ==========================================
# CROSS-ATTENTION FUSION
# ==========================================

class CrossAttentionFusion(nn.Module):

    def __init__(
        self,
        ecg_dim=768,
        echo_dim=768,
        hidden_dim=128
    ):

        super().__init__()

        self.ecg_projection = nn.Linear(
            ecg_dim,
            hidden_dim
        )

        self.echo_projection = nn.Linear(
            echo_dim,
            hidden_dim
        )

        self.ecg_to_echo_attention = nn.MultiheadAttention(
            embed_dim=hidden_dim,
            num_heads=4,
            batch_first=True
        )

        self.echo_to_ecg_attention = nn.MultiheadAttention(
            embed_dim=hidden_dim,
            num_heads=4,
            batch_first=True
        )

        self.fusion_layer = nn.Sequential(

            nn.Linear(hidden_dim * 2, hidden_dim),

            nn.ReLU(),

            nn.Dropout(0.2)

        )


    # ==========================================
    # FORWARD
    # ==========================================

    def forward(
        self,
        ecg_features,
        echo_features
    ):

        ecg = self.ecg_projection(ecg_features)

        echo = self.echo_projection(echo_features)

        ecg = ecg.unsqueeze(1)

        echo = echo.unsqueeze(1)


        # ECG attends to Echo

        ecg_attended, ecg_weights = (
            self.ecg_to_echo_attention(

                query=ecg,

                key=echo,

                value=echo

            )
        )


        # Echo attends to ECG

        echo_attended, echo_weights = (
            self.echo_to_ecg_attention(

                query=echo,

                key=ecg,

                value=ecg

            )
        )


        # Feature concatenation

        combined = torch.cat(

            [

                ecg_attended.squeeze(1),

                echo_attended.squeeze(1)

            ],

            dim=1

        )


        # Fusion

        fused_features = self.fusion_layer(
            combined
        )


        return fused_features, {

            "ecg_to_echo_attention": ecg_weights,

            "echo_to_ecg_attention": echo_weights

        }