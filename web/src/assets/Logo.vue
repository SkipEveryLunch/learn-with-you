<template>
  <div class="container">
    <transition name="svg">
      <svg
        version="1.1"
        id="Layer_1"
        x="0px"
        y="0px"
        viewBox="0 0 100 100"
        style="enable-background: new 0 0 500 500"
        xml:space="preserve"
      >
        <!-- <defs>
          <linearGradient id="l_g">
            <stop offset="0%" stop-color="rgb(150,200,250)" />
            <stop offset="100%" stop-color="rgb(150,225,225)" />
          </linearGradient>
          <linearGradient id="l_g_hover">
            <stop offset="0%" stop-color="rgb(100,150,200)" />
            <stop offset="100%" stop-color="rgb(100,175,175)" />
          </linearGradient>
        </defs> -->
        <polyline
          points="0,10 5,0 85,0 90,10 85,20 5,20 0,10"
          class="polyline"
          stroke-dasharray="300px"
          stroke-dashoffset="300px"
          fill="none"
        ></polyline>
        <text
          class="text"
          x="37.5"
          y="9"
          dominant-baseline="central"
          stroke="none"
          text-anchor="middle"
        >
          Learn w/
        </text>
        <text
          x="75"
          y="9"
          dominant-baseline="central"
          stroke="none"
          text-anchor="middle"
          class="tspan"
        >
          U
        </text>
      </svg>
    </transition>
  </div>
</template>
>
<style scoped>
.container {
  @apply w-40 h-8;
}
.container:hover .text {
  fill: rgb(14, 116, 144);
}
.container:hover .polyline {
  stroke: rgb(14, 116, 144);
}
.container:hover .tspan {
  fill: rgb(14, 116, 144);
}
.text {
  font-size: 14px;
  animation: text_animation 1.5s both;
  fill: rgb(6, 182, 212);
}
.polyline {
  animation: line_animation 1.5s both;
  stroke: rgb(6, 182, 212);
  stroke-width: 1;
}
.tspan {
  font-size: 16px;
  animation: tspan_animation 0.5s both;
  fill: rgb(6, 182, 212);
}
@keyframes tspan_animation {
  0% {
    opacity: 0; /*# 0秒では間隔を300px */
    transform: translateX(7.5px);
  }
  100% {
    opacity: 1; /*# 0秒では間隔を300px */
    transform: translateX(0px);
  }
}
@keyframes line_animation {
  0% {
    stroke-width: 1.5;
    stroke-dashoffset: 350px; /*# 0秒では間隔を300px */
  }
  100% {
    stroke-width: 1;
    stroke-dashoffset: 0px;
  }
}
@keyframes text_animation {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
