<template>
  <div class="flex justify-center">
    <div class="form-check form-switch">
      <input
        class="float-left h-5 -ml-10 align-top bg-white bg-gray-300 bg-no-repeat bg-contain rounded-full shadow-sm appearance-none cursor-pointer  form-check-input w-9 focus:outline-none"
        type="checkbox"
        role="switch"
        id="flexSwitchCheckChecked"
        :checked="isDarkMode"
        @click="toggleIsDarkMode"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { ref, watch, defineComponent } from 'vue';
export default defineComponent({
  name: 'ToggleDarkButton',
  setup() {
    const isDarkMode = ref(false);
    const toggleIsDarkMode = () => {
      isDarkMode.value = !isDarkMode.value;
    };
    watch(isDarkMode, (val) => {
      val
        ? document.body.classList.add('dark')
        : document.body.classList.remove('dark');
    });
    return {
      isDarkMode,
      toggleIsDarkMode,
    };
  },
});
</script>
