<script setup>
import { onMounted, ref } from 'vue';
import waterImg from '@/assets/img/water.jpg';
import logo from '@/assets/img/wasa.png';
import { useToast } from 'vue-toastification';
import * as faceapi from 'face-api.js';


    const message = ref('');
    const video = ref(null);
    const canvas = ref(null);
    const toast=useToast();
    const isLoading = ref(false);


    const startCamera = async () => {
      await loadModels();
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      video.value.srcObject = stream;
      console.log('Camera started', stream);
    };

const loadModels = async () => {
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
};
const captureFace = async () => {
  const detections = await faceapi.detectSingleFace(video.value, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
  
  if (detections) {
    const faceEmbedding = detections.descriptor;
    saveEmbedding(faceEmbedding);
  } else {
    alert("No face detected. Try again!");
  }
};

    const saveEmbedding=(embedding)=> {
      // Log the embedding data to the console for debugging
      console.log('Face embedding data:', embedding);
      localStorage.setItem('faceEmbedding', JSON.stringify(embedding));
      alert("Face embedding data saved successfully!");

  
    }

    onMounted(() => {
      startCamera();
    });


</script>





<template>
   
    <div class="flex flex-col items-center justify-center min-h-screen space-y-8 p-4 relative">
      <!-- Dark overlay using ::before pseudo-element -->
      <div class=" h-full absolute inset-0 bg-black opacity-30 z-0"></div> <!-- Overlay -->
  
      <div class="w-full h-full bg-cover mt-0 bg-center absolute top-0 left-0 z-[-1]" :style="{ backgroundImage: 'url(' + waterImg + ')' }"></div>
      
      <div class="w-[600px] h-[800px] bg-gray-200 rounded-xl shadow-lg flex flex-col items-center justify-center space-y-8 z-10">
 
        <img class="h-40 w-auto " v-bind:src="logo"  />    
 
       <h1 class="text-5xl font-bold text-[#2596be]">
         <span class="letter">F</span>
         <span class="letter">A</span>
         <span class="letter">C</span>
         <span class="letter">E</span>
         <span>&nbsp;</span>
         <span class="letter">R</span>
         <span class="letter">E</span>
         <span class="letter">C</span>
         <span class="letter">O</span>
         <span class="letter">G</span>
         <span class="letter">N</span>
         <span class="letter">I</span>
         <span class="letter">T</span>
         <span class="letter">I</span>
         <span class="letter">O</span>
         <span class="letter">N</span>
       </h1>

       <video ref="video"  autoplay class=" border rounded shadow w-[90%] max-w-[500px] "></video>
       <canvas ref="canvas" style="display: none;"></canvas>

       
      
        <!-- Content container -->
        <div class="flex flex-col items-center space-y-4">
          <div v-if="!isLoading">
              <button @click="captureFace"  class="text-white bg-green-800 hover:bg-green-900 hover:text-white rounded-md px-40 py-2 mt-4 cursor-pointer">
               <i class="pi pi-verified text-white mr-2"></i>Validate</button>
          </div>

          <div v-if="isLoading" >
                <button class="text-white bg-black hover:bg-red-700 hover:text-white rounded-md px-40 py-2 mt-4  cursor-pointer">
                  <i class="pi pi-spin pi-spinner text-white"></i> Loading...
                </button>
              </div>
        </div>
      </div>
      
    </div>
  
 </template>
 
 
 <style>
   .letter {
     animation: lightUp 2s infinite;
     animation-fill-mode: both;
   }
 
   @keyframes lightUp {
     0% { color: #2596be; }
     50% { color: #1e5f76; }
     100% { color: #2596be; }
   }
 
   .letter:nth-child(1) { animation-delay: 0s; }
   .letter:nth-child(2) { animation-delay: 0.2s; }
   .letter:nth-child(3) { animation-delay: 0.4s; }
   .letter:nth-child(4) { animation-delay: 0.6s; }
   .letter:nth-child(5) { animation-delay: 0.8s; }
   .letter:nth-child(6) { animation-delay: 1s; }
   .letter:nth-child(8) { animation-delay: 1.2s; }
   .letter:nth-child(9) { animation-delay: 1.4s; }
   .letter:nth-child(11) { animation-delay: 1.6s; }
   .letter:nth-child(12) { animation-delay: 1.8s; }
   .letter:nth-child(13) { animation-delay: 2s; }
   .letter:nth-child(14) { animation-delay: 2.2s; }
   .letter:nth-child(15) { animation-delay: 2.4s; }

   video {
  width: 100%;
  height: auto;
}
canvas {
  display: none;
}
</style>
  