<template>
  <circle id="outerCircle" cx="100" cy="100" r="80" filter="url(#innerShadow)"></circle>

  <circle id="innerCircle" cx="100" cy="100" r="50">
    <animate attributeName="r" values="60;75;60" dur="5s" repeatCount="indefinite" />
    <animate attributeName="opacity" values=".1;.5;.1;.3;0" dur="5s" repeatCount="indefinite" />
  </circle>

  <defs>
    <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
      <feComponentTransfer in="SourceAlpha">
        <feFuncA type="table" tableValues="1 0" />
      </feComponentTransfer>
      <feGaussianBlur stdDeviation="20" />
      <feOffset result="offsetblur" />
      <feFlood flood-color="black" result="color" />
      <feComposite in2="offsetblur" operator="in" />
      <feComposite in2="SourceAlpha" operator="in" />
      <feMerge>
        <feMergeNode in="SourceGraphic" />
        <feMergeNode />
      </feMerge>
    </filter>
  </defs>
</template>

<style scoped>
#outerCircle {
  fill: aquamarine;
  stroke: rgba(0, 0, 0, 0.172);
  /* stroke: rgb(218, 117, 29); */
  stroke-width: 3;
}

#innerCircle {
  fill-opacity: 0;
  opacity: 0.5;
  stroke: white;
  stroke-width: 3px;
}
</style>
