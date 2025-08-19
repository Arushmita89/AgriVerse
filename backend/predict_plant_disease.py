from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import json

# Load the trained model
model = load_model('plant_disease_model.keras')

# Load class labels (names of diseases)
with open('class_indices.json', 'r') as f:
    class_indices = json.load(f)
labels = {v: k for k, v in class_indices.items()}

# Load and prepare the new image
<<<<<<< HEAD
img_path = 'predict.JPG'
img = image.load_img(img_path, target_size=(160, 160))
x = image.img_to_array(img) / 255.0  
x = np.expand_dims(x, axis=0) 
=======
img_path = 'predict.JPG'  
img = image.load_img(img_path, target_size=(160, 160))  
x = image.img_to_array(img) / 255.0  
x = np.expand_dims(x, axis=0)  
>>>>>>> d3acf4abb920d73602bcb84e11fd6a8f0349309d

# Predict
pred = model.predict(x)
predicted_class = np.argmax(pred, axis=1)[0]

print("Predicted disease:", labels[predicted_class])
