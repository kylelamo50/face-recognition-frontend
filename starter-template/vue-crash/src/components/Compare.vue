<template>
    <div>
      <button @click="startCamera">Capture & Store Face</button>
      <video ref="video" autoplay></video>
    </div>
  </template>
  
<script setup>
  import * as faceapi from 'face-api.js';
  import { ref } from 'vue';
  
  const video = ref(null);
  const firstfaceEmbedding = ref(null);

  // Load the face embedding from the public folder
async function loadFaceEmbedding() {
  try {
    const response = await fetch('/face_embedding.json'); // Path to file in the public folder
    if (!response.ok) {
      throw new Error('Failed to load face embedding');
    }
    const json = await response.json();
    firstfaceEmbedding.value = json; // Store the face embedding
    console.log('First Face data:', firstfaceEmbedding.value);
  } catch (error) {
    console.error('Error loading face embedding:', error);
  }
}

  
  async function startCamera() {
    await loadModels();
    await loadFaceEmbedding();
    video.value = video.value || document.querySelector('video');
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    video.value.srcObject = stream;
    console.log('Camera started', stream);
  
    setTimeout(captureFace, 3000); // Give time for camera to start
  }
  
  async function loadModels() {
    try {
      console.log('Loading models...');
      await faceapi.nets.tinyFaceDetector.loadFromUri('/weights');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/weights');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/weights');
      console.log('Models loaded successfully');
    } catch (error) {
      console.error('Error loading models:', error);
      alert("There was an issue loading the models. Please check the model files and paths.");
    }
  }
  

  async function captureFace() {
    const detections = await faceapi.detectSingleFace(video.value, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
  
    if (detections) {
      const secondfaceEmbedding = detections.descriptor;
      console.log('Second Face data:', secondfaceEmbedding);
      const firstfaceEmbedding2 = Object.values(firstfaceEmbedding.value);
      console.log('First Face loaded:', firstfaceEmbedding2);
      const secondfaceEmbedding2=Object.values(secondfaceEmbedding);
      console.log('Second Face loaded:', secondfaceEmbedding2);
    

      const calculateEuclideanDistance=(firstfaceEmbedding2, secondfaceEmbedding2)=> {
        let sum = 0;
        for (let i = 0; i < firstfaceEmbedding2.length; i++) {
            sum += Math.pow(firstfaceEmbedding2[i] - secondfaceEmbedding2[i], 2);
        }
        return Math.sqrt(sum);
    }

      const distance = calculateEuclideanDistance(firstfaceEmbedding2, secondfaceEmbedding2);
      console.log("Distance between faces:", distance);

    if (distance < 0.6) {
      alert("Faces match!");
    } else {
      alert("Faces do not match.");
    }
      
    } 
    else {
      alert("No face detected. Try again!");
    }
    
   

}






  
  </script>
  
  <style>
  video {
    width: 300px;
    height: auto;
  }
  </style>