<template>
  <div style="color:white">
    <svg style="border:1px solid grey;" width="100%" height="100vh">
      <g :style="`transform:translate(${playerPos.x}px, ${playerPos.y}px)`">

        <g :style="`transform:rotate(${angle}deg)`">

          <image ref="sword" width="50" height="50" href="src/assets/sword.svg" style="transform:rotate(50deg)" />

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
import { ref } from 'vue';

const controllerCoords = { x: 0, y: 0 }
const playerPos = ref({ x: 100, y: 120 })
let startVals = { x: 0, y: 0 }


const sword = ref<SVGElement>()

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
  sword.value!.animate([
    { transform: 'translate(0px) rotate(50deg)' },
    { transform: 'translate(20px)' },
    { transform: 'translate(0px)' },
  ], { duration: 500, easing: 'ease-out' })
})

</script>

<style scoped>
svg {
  background-color: rgb(131, 129, 26);
}
</style>