<template>
  <div class="h-full bg-white canvas-container">
    <canvas class="canvas" ref="canvasRef" width="800" height="800"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  const c1 = canvasRef.value
  if (c1) {
    const ctx = c1.getContext('2d')
    // ctx?.fillRect(100, 100, 300, 100)
    // ctx?.strokeRect(100, 100, 200, 100)
    // ctx?.fillRect(200, 150, 200, 100)
    let height = 0
    const timer = setInterval(() => {
      if (height <= c1.clientHeight) {
        height++
        ctx?.clearRect(0, 0, c1.clientWidth, height)
      } else {
        clearInterval(timer)
      }
    })

    ctx?.beginPath()
    ctx?.rect(100, 100, 200, 100)
    ctx?.stroke()
    ctx?.closePath()

    ctx?.beginPath()
    ctx?.rect(200, 150, 200, 100)
    ctx?.fill()
    ctx?.closePath()
  }
})
</script>

<style lang="scss" scoped>
.canvas-container {
  // background-color: $c-primary-6;
  @include linear-gradient(
    to right,
    $c-primary-6,
    $c-success-6,
    $c-warn-6,
    $c-error-6,
    $c-cyan-6
  );
  color: get-theme(dark);
}

$color-list: red, green, blue, turquoise, darkmagenta;
@each $color in $color-list {
}
</style>
