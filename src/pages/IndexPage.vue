<template>
  <div style="color:white">
    <svg style="border:1px solid grey;" width="100%" height="100vh">

      <!-- <defs>
        <filter id="MyFilter" filterUnits="userSpaceOnUse" x="0" y="0" width="2000" height="1200">
          <feGaussianBlur in="SourceAlpha" stdDeviation="14" result="blur" />
          <feOffset in="blur" dx="0" dy="0" result="offsetBlur" />

          <feSpecularLighting in="blur" surfaceScale="15" specularConstant=".75" specularExponent="20"
            lighting-color="#bbbbbb" result="specOut">
            <fePointLight x="-5000" y="-10000" z="20000" />
          </feSpecularLighting>
          <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut" />
          <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="5" k2="1" k3="1" k4="0"
            result="litPaint" />

          <feMerge>
            <feMergeNode in="offsetBlur" />
            <feMergeNode in="litPaint" />
          </feMerge>
        </filter>
      </defs> -->

      <g id="cloudsCont" style="transform:translate(50%); opacity: .9;">
        <g v-for="i in 5" :style="`transform: translate(${i * -50}%, 0);`">
          <g class="cloud" style="transform: translate(10%);">
            <circle r="50" cx="100" cy="120" fill="white" />
            <circle r="80" cx="50" cy="100" fill="white" />
            <circle r="70" cx="70" cy="40" fill="white" />
          </g>

          <g class="cloud" style="transform: translate(20%);">
            <circle r="50" cx="100" cy="120" fill="white" />
            <circle r="80" cx="50" cy="100" fill="white" />
            <circle r="70" cx="70" cy="40" fill="white" />
          </g>


          <g class="cloud" style="transform: translate(0%, 50%);">
            <circle r="50" cx="100" cy="120" fill="white" />
            <circle r="80" cx="50" cy="100" fill="white" />
            <circle r="70" cx="70" cy="40" fill="white" />
          </g>

          <g class="cloud" style="transform: translate(10%, 80%);">
            <circle r="50" cx="100" cy="120" fill="white" />
            <circle r="80" cx="50" cy="100" fill="white" />
            <circle r="70" cx="70" cy="40" fill="white" />
          </g>
        </g>
      </g>


      <g style="transform:translate(10%, 20%)">
        <circle r="1400" cx="2000" cy="250" fill="green" stroke="black" />
        <circle r="300" cx="300" cy="250" fill="green" stroke="black" />
        <circle r="100" fill="yellowgreen" stroke="black" />
        <circle r="180" cx="300" cy="370" fill="yellowgreen" />

        <g filter="url(#MyFilter)">
          <circle r="150" cx="300" cy="370" id="house" />
          <circle r="110" cx="300" cy="370" id="house" />
          <circle r="70" cx="300" cy="370" id="house" />
          <circle r="40" cx="300" cy="370" id="house" />
          <circle r="10" cx="300" cy="370" id="house" />
        </g>
      </g>

      <g :style="`transform:translate(${playerPos.x}px, ${playerPos.y}px)`">



        <g :style="`transform:rotate(${angle}deg)`">

          <g style="transform: translate(2%, -4%) scale(0.08) rotate(25deg)">
            <Sword />
          </g>
          <!-- <image ref="sword" width="50" height="50" href="../assets/sword.svg" style="transform:rotate(50deg)" /> -->

          <circle r="30" fill="green" stroke="black" style="filter: drop-shadow(0px 0px .3rem rgba(0,0,0,1))" />


        </g>
      </g>
    </svg>
  </div>
  <!-- <router-view /> -->
  <div style="color:white">
    <!-- {{ playerPos }} -->
  </div>
</template>

<script setup lang="ts">
import { socket } from 'src/modules/global';
import { onMounted, ref } from 'vue';
import Sword from '../components/gameComponents/Sword.vue'

const controllerCoords = { x: 0, y: 0 }
const playerPos = ref({ x: 100, y: 120 })
let startVals = { x: 0, y: 0 }


const swordEl = ref<HTMLElement>()

onMounted(() => {
  swordEl.value = document.getElementById('sword')!
})

let previousTimeStamp = 0

function step(timestamp: number) {
  const deltaTime = timestamp - previousTimeStamp;

  playerPos.value.x += controllerCoords.x * deltaTime * 0.001
  playerPos.value.y += controllerCoords.y * deltaTime * 0.001

  previousTimeStamp = timestamp;
  window.requestAnimationFrame(step);
}

window.requestAnimationFrame(step);

socket.on('leftStickTouchStart', ({ x, y }: any) => {
  startVals = { x, y }
  console.log('start')
})

const angle = ref(0)

socket.on('leftStickTouchMove', ({ x, y }: any) => {
  const diffX = x - startVals.x
  const diffY = y - startVals.y

  angle.value = Math.atan2(diffY, diffX) * 180 / Math.PI

  controllerCoords.x = diffX
  controllerCoords.y = diffY

})

socket.on('leftStickTouchEnd', () => {
  controllerCoords.x = 0
  controllerCoords.y = 0
})

socket.on('attack', () => {
  swordEl.value?.parentElement!.animate([
    { offset: 0.6, transform: 'translate(1%, -2%) scale(0.08) rotate(-45deg)' },
    { transform: 'translate(-0%, -4%) scale(0.08) rotate(-25deg)' },
    // { transform: 'translate(20px)' },
    // { transform: 'translate(0px)' },
  ], { duration: 250, easing: 'ease-out' })
})

</script>

<style scoped>
svg {
  background-color: rgb(156, 215, 238);
}

#cloudsCont {
  animation: cloudAnim 250s infinite;
}

@keyframes cloudAnim {
  100% {
    transform: translate(300%)
  }
}

#house {
  fill: rgb(143, 67, 22);
  stroke: black;
  filter: drop-shadow(0px 0px .3rem rgba(0, 0, 0, 1));

}
</style>