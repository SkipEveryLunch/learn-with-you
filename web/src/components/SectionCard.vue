<template>
  <div
    class="
      flex flex-col
      sm:grid sm:grid-cols-10
      justify-between
      bg-front
      text-normal
      sm:mx-1
      py-2
      sm:px-2
      rounded-sm
      gap-2
    "
  >
    <div
      class="
        flex flex-row
        sm:flex-col
        items-center
        sm:items-start sm:col-span-3
        gap-2
      "
    >
      <p class="text-xlarge">{{ section.title }}</p>
      <span
        class="
          w-max
          text-xs
          rounded
          p-1
          text-gray-700
          bg-transparent bg-gray-100
          border border-gray-400
          dark:border-gray-100
        "
        >{{ section.series.name }}</span
      >
    </div>
    <div
      class="text-mid flex flex-col justify-center flex-2 wrap sm:col-span-5"
    >
      <div>
        <p>{{ section.description }}</p>
      </div>
    </div>

    <div
      class="
        flex
        sm:flex-col
        lg:flex-row
        whitespace-nowrap
        self-end
        justify-self-end
        gap-1
        sm:self-center sm:col-span-2
      "
    >
      <router-link :to="`/section/${section.id}/study`">
        <button class="btn btn-primary">学習する</button>
      </router-link>
      <router-link :to="`/section/${section.id}/edit`">
        <button class="btn btn-sub-white">問題一覧</button>
      </router-link>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, defineComponent } from 'vue';
export default defineComponent({
  name: 'SectionCard',
  props: ['section'],
  setup() {
    const isFliped = ref(false);
    const flip = (value: boolean) => {
      isFliped.value = value;
    };
    return {
      flip,
      isFliped,
    };
  },
});
</script>
<style scoped>
.card {
  @apply w-full pl-2 py-3 mb-2 rounded justify-around;
  min-height: 90px;
}
.slide-enter-from {
  transform: translateX(120px);
  opacity: 0;
}
.slide-enter-to {
  transform: translateX(0px);
}
.slide-enter-active {
  transition: all 0.25s ease-in;
}
.slide-leave-from {
  transform: translateX(0px);
}
.slide-leave-to {
  transform: translateX(-120px);
  opacity: 0;
}
.slide-leave-active {
  transition: all 0.25s ease-out;
}
</style>
