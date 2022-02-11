<template>
  <div class="flex items-center">
    <div class="flex items-center">
      <font-awesome-icon
        class="mr-1 fa-lg"
        :class="[isDarkMode ? 'text-gray-300' : 'text-blue-400']"
        :icon="faSun"
      />
    </div>
    <div class="flex items-center">
      <input
        class="relative w-10 h-5 bg-gray-300 bg-no-repeat rounded-full shadow-sm appearance-none cursor-pointer  focus:outline-none"
        type="checkbox"
        role="switch"
        id="flexSwitchCheckChecked"
        :checked="isDarkMode"
        @click="toggleIsDarkMode"
      />
    </div>
    <div class="flex items-center">
      <font-awesome-icon
        class="ml-1 fa-lg"
        :icon="faMoon"
        :class="[isDarkMode ? 'text-blue-400' : 'text-gray-300']"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { ref, watch, defineComponent } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
export default defineComponent({
  name: 'ToggleDarkButton',
  components: { FontAwesomeIcon },
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
      faSun,
      faMoon,
    };
  },
});
</script>
<style>
input::before {
  position: absolute;
  content: '';
  width: 17px;
  height: 17px;
  top: 1px;
  left: 1px;
  border-radius: 20px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: left 150ms;
}
input:checked::before {
  left: 22px;
}
</style>
