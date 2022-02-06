<template>
  <div class="w-full px-3">
    <div class="flex justify-between w-full p-3 bg-gray-700">
      <div class="flex">
        <form v-if="!isSelectMode" class="search_container">
          <input type="text" @input="onInput" :value="modelValue" />
          <button @click.prevent="onSubmit">
            <font-awesome-icon :icon="faSearch" />
          </button>
        </form>
        <select
          class="px-2 mr-2 text-gray-700 rounded-md"
          v-if="series && isSelectMode"
          v-model="selectedSeries"
        >
          <option :value="0">全てのシリーズのセクションを表示</option>
          <option
            v-for="oneSeries in series"
            :key="oneSeries.id"
            :value="oneSeries.id"
          >
            {{ oneSeries.name }}
          </option>
        </select>
        <button
          v-if="series && !isSelectMode"
          class="mr-1 btn btn-sub-white text-md"
          @click="() => toggleSelectMode(true)"
        >
          シリーズ検索
        </button>
        <button
          v-if="isSelectMode"
          class="mr-1 btn btn-sub-white text-md"
          @click="() => toggleSelectMode(false)"
        >
          タイトル検索
        </button>
        <button
          v-if="isMessage === false"
          class="mr-1 btn btn-sub-white text-md"
          @click="filterMine"
        >
          自作のみ
        </button>
        <button
          v-if="!isSelectMode"
          class="mr-1 btn btn-sub-white text-md"
          @click="showAll"
        >
          全て表示
        </button>
        <button
          v-if="isMessage === true"
          class="mr-1 btn btn-sub-white text-md"
          @click="filterNew"
        >
          未読のみ
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
import { ref, watch, defineComponent } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faPlus,
  faSearch,
  faBackward,
} from '@fortawesome/free-solid-svg-icons';
export default defineComponent({
  name: 'SearchWindow',
  components: { FontAwesomeIcon },
  props: ['modelValue', 'series', 'goBackPath', 'addPath', 'isMessage'],
  emits: [
    'show-all',
    'filter-mine',
    'on-input',
    'on-submit',
    'filter-new',
    'change-series',
  ],
  setup(_, { emit }) {
    const selectedSeries = ref(0);
    const isSelectMode = ref(false);
    const toggleSelectMode = (value: boolean) => {
      isSelectMode.value = value;
      selectedSeries.value = 0;
    };
    watch(selectedSeries, () => {
      emit('change-series', selectedSeries.value);
    });
    const showAll = () => {
      emit('show-all');
    };
    const filterMine = () => {
      emit('filter-mine');
    };
    const filterNew = () => {
      emit('filter-new');
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
      filterNew,
      onInput,
      onSubmit,
      isSelectMode,
      toggleSelectMode,
      selectedSeries,
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
  @apply absolute right-2 h-full;
  outline: none;
}
.search_container button:hover {
  @apply text-blue-600;
}
</style>
