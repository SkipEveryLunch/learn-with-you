<template>
  <form class="search_container">
    <input type="text" @input="onInput" :value="modelValue" />
    <button @click.prevent="onSubmit">
      <font-awesome-icon :icon="faSearch" />
    </button>
  </form>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
export default defineComponent({
  props: ['modelValue'],
  emits: ['on-input', 'on-submit'],
  components: {
    FontAwesomeIcon,
  },
  setup(_, { emit }) {
    const onInput = (e: { target: HTMLButtonElement }) => {
      emit('on-input', e.target.value);
    };
    const onSubmit = () => {
      emit('on-submit');
    };
    return {
      faSearch,
      onSubmit,
      onInput,
    };
  },
});
</script>
<style scoped>
.search_container {
  box-sizing: border-box;
  @apply text-gray-700 rounded-md relative bg-gray-100;
  width: 15rem;
  display: block;
  overflow: hidden;
}
.search_container input {
  border: none;
  @apply bg-gray-100 w-full p-1 pl-2;
}
.search_container input:focus {
  outline: 0;
}
.search_container button {
  cursor: pointer;
  border: none;
  @apply absolute right-2;
  outline: none;
}
</style>
