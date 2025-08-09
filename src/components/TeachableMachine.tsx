import React, { useEffect, useRef, useState } from "react";
import * as tmImage from "@teachablemachine/image";

const MODEL_URL = "/model/";

export default function TeachableModel() {
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
  const [predictions, setPredictions] = useState<tmImage.Prediction[]>([]);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    async function loadModel() {
      const loadedModel = await tmImage.load(MODEL_URL + "model.json", MODEL_URL + "metadata.json");
      setModel(loadedModel);
    }
    loadModel();
  }, []);

  async function predict() {
    if (model && imageRef.current) {
      const predictionResult = await model.predict(imageRef.current);
      setPredictions(predictionResult);
    }
  }

  return (
    <div>
      <h2>Teachable Machine Model Demo</h2>
      <img
        ref={imageRef}
        src="/test-image.jpg" // Put a test image in public folder or upload dynamically
        alt="Test"
        width={300}
        height={300}
      />
      <button onClick={predict} disabled={!model}>
        Predict
      </button>

      <ul>
        {predictions.map((p) => (
          <li key={p.className}>
            {p.className}: {(p.probability * 100).toFixed(2)}%
          </li>
        ))}
      </ul>
    </div>
  );
}
