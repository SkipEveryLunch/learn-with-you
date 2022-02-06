<template>
  <div class="w-full px-3">
    <div class="flex justify-between w-full p-3 bg-gray-700">
      <div class="flex">
        <form class="search_container">
          <input type="text" @input="onInput" :value="modelValue" />
          <button @click.prevent="onSubmit">
            <font-awesome-icon :icon="faSearch" />
          </button>
        </form>
        <button v-if="series" class="mr-1 btn btn-sub-white text-md">
          シリーズ別
        </button>
        <button class="mr-1 btn btn-sub-white text-md" @click="filterMine">
          自作のみ
        </button>
        <button class="mr-1 btn btn-sub-white text-md" @click="showAll">
          全て表示
        </button>
      </div>
      <div class="flex">
        <router-link v-if="goBackPath" :to="goBackPath">
          <button class="mr-1 btn btn-sub-white text-md">
            <font-awesome-icon :icon="faBackward" />
          </button>
        </router-link>
        <router-link v-if="addPath" :to="addPath">
          <button class="btn btn-primary text-md">
            <font-awesome-icon :icon="faPlus" />
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faPlus,
  faSearch,
  faBackward,
} from '@fortawesome/free-solid-svg-icons';
export default defineComponent({
  name: 'SearchWindow',
  components: { FontAwesomeIcon },
  props: ['modelValue', 'series', 'goBackPath', 'addPath'],
  emits: ['show-all', 'filter-mine', 'on-input', 'on-submit'],
  setup(_, { emit }) {
    const showAll = () => {
      emit('show-all');
    };
    const filterMine = () => {
      emit('filter-mine');
    };
    const onInput = (e: { target: HTMLButtonElement }) => {
      emit('on-input', e.target.value);
    };
    const onSubmit = () => {
      emit('on-submit');
    };
    return {
      faPlus,
      faBackward,
      faSearch,
      showAll,
      filterMine,
      onInput,
      onSubmit,
    };
  },
});
</script>
<style scoped>
.search_container {
  box-sizing: border-box;
  @apply text-gray-700 rounded-md relative bg-gray-100 mr-2;
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
