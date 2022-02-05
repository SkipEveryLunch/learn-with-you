<template>
  <div class="flex flex-col mb-3">
    <label class="mb-2 text-md" :for="id"
      >{{ name }}:
      <span class="ml-1 text-sm text-red-400">{{
        error.join(' ')
      }}</span></label
    >
    <input
      :id="id"
      :type="type"
      class="formInput"
      @input="onInput"
      :value="modelValue"
      :data-testid="testid"
    />
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue';
export default defineComponent({
  props: ['name', 'id', 'error', 'modelValue'],
  emits: ['custom-input'],
  setup(props, { emit }) {
    const type = computed(() => {
      return props.id.includes('password') ? 'password' : 'text';
    });
    const onInput = (e) => {
      emit('custom-input', e.target.value);
    };
    const testid = computed(() => `${props.id}-input`);
    return {
      type,
      testid,
      onInput,
    };
  },
});
</script>
<style scoped>
.formInput {
  @apply w-full px-2 py-1 mx-2 border 
  text-gray-700 border-gray-700 rounded focus:outline-none focus:border-blue-400;
}
</style>
