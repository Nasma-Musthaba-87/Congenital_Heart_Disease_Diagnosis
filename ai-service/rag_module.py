from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import os


class MedicalRAG:

    def __init__(self):

        self.model = SentenceTransformer(
            "sentence-transformers/all-MiniLM-L6-v2"
        )

        self.documents = []

        self.index = None

    def load_documents(self, file_path):

        with open(file_path, "r", encoding="utf-8") as file:

            text = file.read()

        self.documents = [
            paragraph.strip()
            for paragraph in text.split("\n\n")
            if paragraph.strip()
        ]

        embeddings = self.model.encode(
            self.documents,
            convert_to_numpy=True
        )

        dimension = embeddings.shape[1]

        self.index = faiss.IndexFlatL2(dimension)

        self.index.add(
            np.array(embeddings, dtype=np.float32)
        )

        print("Medical knowledge base loaded successfully!")

    def retrieve(self, query, top_k=3):

        if self.index is None:

            raise ValueError("Knowledge base not loaded")

        query_embedding = self.model.encode(
            [query],
            convert_to_numpy=True
        )

        distances, indices = self.index.search(
            np.array(query_embedding, dtype=np.float32),
            min(top_k, len(self.documents))
        )

        results = []

        for index in indices[0]:

            if index >= 0:

                results.append(
                    self.documents[index]
                )

        return results