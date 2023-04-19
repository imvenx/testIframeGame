<template>
  <svg width="100%" height="100vh">
    <StickPad name="leftStick" x="25" y="50" color="brown"
      :events-name="{ left: 'left', right: 'right', up: 'up', down: 'down' }" :emit-raw-touch-events="true" />

    <StickpadArrow name="leftStick" x="75" y="50" color="brown"
      :events-name="{ left: 'left', right: 'right', up: 'up', down: 'down' }" :emit-raw-touch-events="true" />
  </svg>
</template>

<script setup lang="ts">
import StickPad from 'src/components/StickPad.vue';
import StickpadArrow from 'src/components/StickpadArrow.vue';

</script>

<style scoped>
svg {
  background-image: url('src/assets/wood_bg.png');
  background-repeat: no-repeat;
  background-size: 120% 100vh;
}
</style>