<template>
  <div class="w-full px-3">
    <div class="flex justify-between w-full p-3 bg-front">
      <div class="flex">
        <form v-if="!isSelectMode" class="search_container">
          <input type="text" @input="onInput" :value="modelValue" />
          <button @click.prevent="onSubmit">
            <font-awesome-icon :icon="faSearch" />
          </button>
        </form>
        <form v-if="series && isSelectMode" class="search_container">
          <select v-model="selectedSeries">
            <option :value="0">全てのシリーズのセクションを表示</option>
            <option
              v-for="oneSeries in series"
              :key="oneSeries.id"
              :value="oneSeries.id"
            >
              {{ oneSeries.name }}
            </option>
          </select>
        </form>

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
        <button class="mr-1 btn btn-sub-white text-md" @click="showAll">
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
import { Series } from '../types';
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
  props: {
    modelValue: { type: String, required: true },
    series: { type: Object as () => Series[], required: false },
    goBackPath: { type: String, required: false },
    addPath: { type: String, required: false },
    isMessage: { type: Boolean, required: true },
  },
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
    const stopChangeSeries = ref(false);
    const toggleSelectMode = (value: boolean) => {
      isSelectMode.value = value;
      selectedSeries.value = 0;
    };
    watch(selectedSeries, () => {
      if (!stopChangeSeries.value) {
        emit('change-series', selectedSeries.value);
      }
    });
    const showAll = () => {
      emit('show-all');
    };
    const filterMine = async () => {
      stopChangeSeries.value = true;
      selectedSeries.value = 0;
      emit('filter-mine');
      setTimeout(() => {
        stopChangeSeries.value = false;
      }, 10);
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
  @apply text-gray-700 bg-gray-100 rounded-md relative mr-2 border border-gray-400;
  width: 15rem;
  display: block;
  overflow: hidden;
}
.search_container input {
  @apply w-full p-1 pl-2;
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
.search_container select {
  @apply w-full p-1 pl-2;
}
.search_container select:focus {
  outline: 0;
}
</style>
