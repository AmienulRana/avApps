<template>
  <div class="loading">
    <div class="dot bg-primary"></div>
    <div class="dot bg-primary"></div>
    <div class="dot bg-primary"></div>
    <div class="dot bg-primary"></div>
  </div>
</template>

<script>
export default {
  name: "LoadingComponent",
};
</script>

<style scoped>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.dot {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  margin: 0 5px;
  animation: bounce 1s infinite;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

.dot:nth-child(4) {
  animation-delay: 0.6s;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
