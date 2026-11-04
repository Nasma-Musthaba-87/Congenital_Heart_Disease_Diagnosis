from feature_extraction import extract_echo_features

image_path = "../backend/uploads/1793339262450-796677521.png"

features = extract_echo_features(image_path)

print("Feature extraction successful!")

print("Number of features:", len(features))

print("First 10 features:", features[:10])