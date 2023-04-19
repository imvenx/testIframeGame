<template>
    <g v-on="touchEvents"
        :style="`transform:translate(${startX ? startX + 'px' : x + '%'}, ${startY ? startY + 'px' : y + '%'})`">

        <circle id="outerCircle" r="20%" style="filter:drop-shadow(0 0 1.5rem black)" />

        <circle ref="cursor" r="10%" id="cursor" :cx="cursorX - startX" :cy="cursorY - startY" />

        <!-- <text dominant-baseline="middle" text-anchor="middle" fill="white" font-size="2em">{{ name }}</text> -->
        <!-- <g style="transform:translate(-15%) rotate(90deg);">
            <polygon x="15%" points="0,0 30,0 15,15" />
        </g> -->
        <text x="-14%" dominant-baseline="middle" text-anchor="middle" font-size="2em">
            ◀
        </text>
        <text x="14%" dominant-baseline="middle" text-anchor="middle" font-size="2em">
            ▶</text>
        <text y="-30%" dominant-baseline="middle" text-anchor="middle" font-size="2em">
            ▲</text>
        <text y="30%" dominant-baseline="middle" text-anchor="middle" font-size="2em">
            ▼</text>
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
    touchmove: (e: TouchEvent) => onLeftCursorTouchMove(e),
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

    socket.emit(name + 'TouchStart', { x: e.touches[0].clientX, y: e.touches[0].clientY })

    // touchPressInterval = setInterval(onLeftCursorTouchPress, 33)

    // pressing.value = true
    startX.value = currentX = e.touches[0].clientX
    startY.value = currentY = e.touches[0].clientY

    cursorX.value = currentX
    cursorY.value = currentY

}

function onLeftCursorTouchMove(e: TouchEvent) {

    socket.volatile.emit(name + 'TouchMove', { x: e.touches[0].clientX, y: e.touches[0].clientY })

    clearInterval(touchPressInterval)
    // touchPressInterval = setInterval(onLeftCursorTouchPress, 33)

    currentX = e.touches[0].clientX
    currentY = e.touches[0].clientY

    cursorX.value = currentX
    cursorY.value = currentY

    const diffX = currentX - startX.value
    const diffY = currentY - startY.value

    if (_isActionTriggered) return

    if (Math.abs(diffX) > Math.abs(diffY)) {
        checkMove(diffX, 'x')
        return
    }

    checkMove(diffY, 'y')

}

// function onLeftCursorTouchPress() {

//     // socket.volatile.emit(name + 'TouchPress')

//     const diffX = currentX - startX.value
//     const diffY = currentY - startY.value

//     if (_isActionTriggered) return

//     if (Math.abs(diffX) > Math.abs(diffY)) {
//         checkMove(diffX, 'x')
//         return
//     }

//     checkMove(diffY, 'y')
// }

function onLeftCursorTouchEnd(e: TouchEvent) {

    socket.emit(name + 'TouchEnd')

    // pressing.value = false

    clearInterval(touchPressInterval)

    cursorX.value = cursorY.value = startX.value = startY.value = currentX = currentY = 0

}

function checkMove(diff: number, axis: 'x' | 'y') {

    if (Math.abs(diff) < cursorSensibility) return

    actionTriggered()

    const direction = diff > 0 ? '+' : '-'

    emitLeftCursorMoveEvent(axis, direction)
}

function emitLeftCursorMoveEvent(axis: 'x' | 'y', direction: '+' | '-') {

    if (axis === 'x') {
        if (direction === '-') {

            socket.emit(eventsName.left)
            return
        }

        socket.emit(eventsName.right)
        return
    }

    if (direction === '-') {

        socket.emit(eventsName.up)
        return
    }

    socket.emit(eventsName.down)
}

</script>

<style scoped>
text {
    user-select: none;
}

#outerCircle {
    fill: rgba(172, 102, 24, 0.5);
    stroke: black;
}

/* #cursor {
    fill: rgb(73, 2, 2);
} */

/* 

@keyframes outerCircleAnim {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
} */
</style>