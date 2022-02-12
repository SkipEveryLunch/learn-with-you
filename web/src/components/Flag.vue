<template>
  <span class="px-1 text-xs text-yellow-700 bg-yellow-300 rounded-sm">
    <slot></slot>
  </span>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Flag',
});
</script>
