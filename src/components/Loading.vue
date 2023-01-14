<template>
  <section
    class="absolute top-0 left-0 w-full h-full flex items-center justify-center"
  >
    <div class="loading-dots">
      <div
        class="dot"
        v-for="(dot, i) in new Array(4)"
        :key="i"
        :class="dotColor === 'white' ? 'bg-white' : 'bg-primary'"
      ></div>
    </div>
  </section>
</template>

<script>
export default {
  name: "LoadingComponent",
  props: { dotColor: String },
};
</script>
<style scoped>
.absolute {
  background-color: rgba(248, 246, 246, 0.8);
}
.loading-dots {
  display: flex;
  justify-content: center;
}

.dot {
  border-radius: 50%;
  width: 10px;
  height: 10px;
  margin: 0 5px;
  animation: dot-blink 1s ease-in-out infinite;
}

.dot:nth-child(2) {
  animation-delay: 0.3s;
}

.dot:nth-child(3) {
  animation-delay: 0.5s;
}

.dot:nth-child(4) {
  animation-delay: 0.7s;
}

@keyframes dot-blink {
  0% {
    transform: scale(0);
  }
  20% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(0);
  }
}
</style>
