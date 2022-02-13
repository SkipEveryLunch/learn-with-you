<template>
  <span class="px-1 text-xs rounded-sm" :class="colorClass">
    <slot></slot>
  </span>
</template>
<script lang="ts">
type ColorType = 'yellow' | 'blue';
import { defineComponent, computed } from 'vue';
export default defineComponent({
  name: 'Flag',
  props: {
    colorType: {
      type: String as () => ColorType,
      default: () => 'yellow',
      required: true,
    },
  },
  setup(props) {
    const colorClass = computed(() => {
      switch (props.colorType) {
        case 'yellow':
          return 'text-yellow-700 bg-yellow-300';
        case 'blue':
          return 'text-gray-100 bg-blue-500';
        default:
          return 'text-gray-100 bg-blue-500';
      }
    });
    return {
      colorClass,
    };
  },
});
</script>
