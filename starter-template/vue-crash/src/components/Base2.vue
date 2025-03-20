<script setup>
import { onMounted, ref } from 'vue';
import waterImg from '@/assets/img/water.jpg';
import logo from '@/assets/img/wasa.png';
import { useToast } from 'vue-toastification';


    const message = ref('');
    const video = ref(null);
    const canvas = ref(null);
    const toast=useToast();
    const isLoading = ref(false);

    const startCamera = () => {
      // Start the camera feed
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (video.value) {
            video.value.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error('Error accessing the camera', err);
          message.value = 'Error accessing the camera';
        });
    };

    const captureFace = () => {
      const videoElement = video.value;
      const canvasElement = canvas.value;
      const context = canvasElement.getContext('2d');

      // Set canvas size to video size
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;

      // Draw the current video frame to the canvas
      context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

      // Convert the canvas image to Base64
      const imageBase64 = canvasElement.toDataURL('image/jpeg');
      console.log('Captured image:', imageBase64);
      // Send the image to the backend
      isLoading.value = true;
      sendFaceToBackend(imageBase64);
      
    };

    const sendFaceToBackend = async (imageBase64) => {
      try {
        const response = await fetch('/api/validate-face', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image_base64: imageBase64.split(',')[1], // Remove the 'data:image/jpeg;base64,' part
          }),
        });

        const data = await response.json();
        if (data.success) {
         // message.value = `Face matched: ${data.matched_face}`;
         toast.success(`Face matched: ${data.matched_face}`);
         isLoading.value = false;
        } else {
         // message.value = `No match found: ${data.message}`;
         toast.error(`No match found: ${data.message}`);
         isLoading.value = false;
        }
      } catch (error) {
       // console.error('Error sending face data', error);
      //  message.value = 'Error communicating with the backend';
        toast.error('Error communicating with the backend');
        isLoading.value = false;
      }
    };

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
  