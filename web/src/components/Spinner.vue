<template>
  <div class="flex items-center justify-center h-full" data-testid="spinner">
    <div>
      <font-awesome-icon
        class="mr-3 text-gray-500 dark:text-blue-200 fa-2x fa-spin"
        :icon="faSpinner"
      />
    </div>
    <p class="text-xlarge text-center text-gray-500 dark:text-blue-200 flicker">
      Loading...
    </p>
  </div>
</template>
<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Spinner',
  components: { FontAwesomeIcon },
  setup() {
    return { faSpinner };
  },
});
</script>
<style scoped>
.flicker {
  animation: flicker 2000ms infinite;
}
@keyframes flicker {
  0% {
    opacity: 100;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 100;
  }
}
</style>
