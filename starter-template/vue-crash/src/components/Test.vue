<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <button 
      @click="startCamera" 
      class="bg-blue-500 text-white font-bold py-2 px-4 rounded shadow hover:bg-blue-600 transition duration-300">
      Capture & Store Face
    </button>
    <video ref="video" autoplay class="mt-5 border rounded shadow w-[90%] max-w-[400px]"></video>
  </div>
</template>

<script>
import * as faceapi from 'face-api.js';

export default {
  data() {
    return {
      video: null,
    };
  },
  methods: {
    async startCamera() {
      await this.loadModels();
      this.video = this.$refs.video;
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      this.video.srcObject = stream;
      console.log('Camera started',stream);
      
      setTimeout(this.captureFace, 3000); // Give time for camera to start
    },
    async loadModels() {
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
},
    async captureFace() {
      const detections = await faceapi.detectSingleFace(this.video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
      
      if (detections) {
        const faceEmbedding = detections.descriptor;
        this.saveEmbedding(faceEmbedding);
      } else {
        alert("No face detected. Try again!");
      }
    },
    saveEmbedding(embedding) {
  // Log the embedding data to the console for debugging
  console.log('Face embedding data:', embedding);
  localStorage.setItem('faceEmbedding', JSON.stringify(embedding));
  alert("Face embedding data saved successfully!");

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(embedding));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "face_embedding.json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  document.body.removeChild(downloadAnchor);
}

  }
};
</script>

<style>
video {
  width: 100%;
  height: auto;
}
</style>


