<template>
  <div class="h-full">
    <transition name="flip" mode="out-in">
      <div
        v-if="phase === 'question'"
        class="card card-front"
        data-testid="flipcard-front"
        @click="flip"
      >
        <div class="w-full p-3">
          <div class="text-lg text-center">質問</div>
          <div class="paragraph-container">{{ front }}</div>
        </div>
      </div>
      <div v-else class="card card-back" @click="flip">
        <div class="w-full p-3 rounded-md">
          <div class="text-lg text-center">解答</div>
          <div class="paragraph-container">{{ back }}</div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  name: 'FlipCard',
  props: ['front', 'back', 'phase'],
  emits: ['flip'],
  setup(_, { emit }) {
    const flip = () => {
      emit('flip');
    };
    return {
      flip,
    };
  },
};
</script>
<style scoped>
.card {
  width: 300px;
  height: 250px;
  @apply p-3 m-3 rounded text-gray-700;
}
.card-front {
  @apply bg-gray-300;
}
.card-back {
  @apply bg-blue-200;
}
.flip-enter-from {
  transform: rotateY(90deg);
}
.flip-enter-to {
  transform: rotateY(0deg);
}
.flip-enter-active {
  transition: all 0.25s ease-in;
  transform-style: preserve-3d;
}
.flip-leave-from {
  transform: rotateY(0deg);
}
.flip-leave-to {
  transform: rotateY(-90deg);
}
.flip-leave-active {
  transition: all 0.25s ease-out;
}
.paragraph-container {
  @apply p-3;
  text-align: center;
}
</style>
