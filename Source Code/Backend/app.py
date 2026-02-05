from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
import numpy as np

app = Flask(__name__)
CORS(app)

# Load the model
model = load_model("eq_model.h5", compile=False)

# Define the exact number of features the model expects
EXPECTED_FEATURES = 900

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        waveform_features = data.get("features")

        # --- INPUT VALIDATION ---
        # Check if the input data exists and has the correct number of features
        if waveform_features is None or len(waveform_features) != EXPECTED_FEATURES:
            return jsonify({
                "error": f"Invalid input. The model expects exactly {EXPECTED_FEATURES} numerical features, but received {len(waveform_features)}."
            }), 400 # 400 means "Bad Request"

        # --- THE FIX from before ---
        # 1. Waveform Input: Reshape the input to (1, 300, 3)
        waveform_input = np.array(waveform_features).reshape(1, 300, 3)

        # 2. Coord Input: Create a placeholder/dummy input.
        coord_input = np.zeros((1, 2))

        # 3. Early Features Input: Create another placeholder.
        early_features_input = np.zeros((1, 3))

        # Predict by passing a list of the three inputs
        prediction = model.predict([waveform_input, coord_input, early_features_input])

        # Format the response
        response = {
            "distance": float(prediction[0][0][0]),
            "magnitude": float(prediction[1][0][0]),
            "azimuth": float(prediction[2][0][0]),
            "depth": float(prediction[3][0][0])
        }
        return jsonify(response)

    except Exception as e:
        return jsonify({"error": f"An error occurred during prediction: {str(e)}"}), 500

if __name__ == "__main__":
    print(" * Starting Flask server on http://127.0.0.1:5000")
    app.run(debug=True, use_reloader=False)

