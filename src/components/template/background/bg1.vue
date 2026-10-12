<template>
  <div class="glass-bg-container">
    <!-- لکه‌های نوریِ متحرک (Mesh Nodes) -->
    <div class="mesh-blob blob-1" />
    <div class="mesh-blob blob-2" />
    <div class="mesh-blob blob-3" />

    <!-- لایه نویز برای حس متریال واقعی -->
    <div class="noise-overlay" />
  </div>
</template>

<style scoped lang="scss">
.glass-bg-container {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;

  // زمینه روشن بماند تا لکه‌های رنگی دیده شوند
  background: #f8fafc;
}

.noise-overlay {
  position: absolute;
  inset: 0;
  opacity: 0.025;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

.mesh-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.45;
  animation: float-blob 18s infinite ease-in-out;
  will-change: transform;
}

.blob-1 {
  width: 600px;
  height: 600px;
  background: #ddd6fe;
  top: -100px;
  left: -100px;
  animation-duration: 22s;
}

.blob-2 {
  width: 500px;
  height: 500px;
  background: #bae6fd;
  bottom: -100px;
  right: -100px;
  animation-duration: 26s;
  animation-delay: -8s;
}

.blob-3 {
  width: 400px;
  height: 400px;
  background: #fbcfe8;
  top: 40%;
  left: 30%;
  animation-duration: 20s;
  animation-delay: -5s;
}

@keyframes float-blob {
  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }

  33% {
    transform: translate3d(45px, -25px, 0) scale(1.05);
  }

  66% {
    transform: translate3d(-25px, 45px, 0) scale(0.97);
  }
}

</style>
