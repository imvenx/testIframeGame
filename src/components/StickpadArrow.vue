<template>
    <g v-on="touchEvents" :style="`transform:translate(${x}%, ${y}%)`">

        <circle id="outerCircle" r="20%" />
        <image style="transform:translate(-80px, -80px);" width="160px" height="160px" href="src/assets/sword.svg" />

        <!-- <circle ref="cursor" r="10%" fill="brown" :cx="cursorX - startX" :cy="cursorY - startY" /> -->


    </g>
</template>

<script lang="ts" setup>
import { socket } from "src/modules/global";
import { onMounted, ref } from "vue";

const cursor = ref<HTMLElement>()

const { name, x, y, color, eventsName } = withDefaults(defineProps<{
    name: string,
    x: string,
    y: string,
    color: string,
    eventsName: { left: string, right: string, up: string, down: string },
    emitRawTouchEvents: boolean
}>(), { color: 'green', emitRawTouchEvents: false })


const startX = ref(0)
const startY = ref(0)
let currentX = 0
let currentY = 0
const cursorX = ref(0)
const cursorY = ref(0)
const cursorSensibility = 30

const actionTriggerRefreshTime = 200
let _isActionTriggered = false
function actionTriggered() {
    _isActionTriggered = true
    setTimeout(() => _isActionTriggered = false, actionTriggerRefreshTime)
}

let touchPressInterval: any

const touchEvents = {
    touchstart: (e: TouchEvent) => onLeftCursorTouchStart(e),
    // touchmove: (e: TouchEvent) => onLeftCursorTouchMove(e),
    touchend: (e: TouchEvent) => onLeftCursorTouchEnd(e),
}

onMounted(() => {
    // cursor.value?.animate([
    //     { filter: `drop-shadow(0 0 0rem ${color})` },
    //     { filter: `drop-shadow(0 0 1.7rem ${color})` },
    // ], { duration: 1000, iterations: Infinity, direction: "alternate", easing: 'ease' })
})


// const pressing = ref(false)

function onLeftCursorTouchStart(e: TouchEvent) {
    socket.emit('attack')
}

function onLeftCursorTouchEnd(e: TouchEvent) {

}

</script>

<style scoped>
text {
    user-select: none;
}

#outerCircle {
    filter: drop-shadow(0 0 1.5rem black);
    stroke: black;
    fill: rgba(0, 0, 0, 0.5);
}

/* 

@keyframes outerCircleAnim {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
} */

image {
    animation: swordAnim 4s infinite linear;
}

@keyframes swordAnim {
    0% {
        filter: drop-shadow(0 0 .5em cyan);
    }

    33% {
        filter: drop-shadow(0px 0px .5em blue);
    }

    66% {
        filter: drop-shadow(0px 0px .5em orange);
    }

    100% {
        filter: drop-shadow(0px 0px .5em cyan);
    }
}
</style>