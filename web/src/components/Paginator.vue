<template>
  <nav class="my-2">
    <ul class="flex items-center justify-center w-full px-3 text-mid">
      <li class="mr-2">
        <a href="javascript:void(0)" @click="prev"
          ><font-awesome-icon
            class="fa-md"
            :class="isArrowLight(page !== 1)"
            :icon="faChevronLeft"
        /></a>
      </li>
      <div
        class="px-2 mx-1 border-2 rounded-sm hover:bg-gray-300"
        v-for="p in range(1, lastPage)"
        :class="isBoxLight(p === page)"
        @click="() => goTo(p)"
        :key="p"
      >
        <span class="text-large"> {{ p }} </span>
      </div>

      <li class="ml-2">
        <a href="javascript:void(0)" @click="next"
          ><font-awesome-icon
            class="fa-md"
            :class="isArrowLight(page !== lastPage)"
            :icon="faChevronRight"
        /></a>
      </li>
    </ul>
  </nav>
</template>
<script lang="ts">
const range = (start: number, end: number) => {
  const list = [];
  for (let i = start; i <= end; i++) {
    list.push(i);
  }
  return list;
};
import { defineComponent, computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
interface paginatorProps {
  lastPage: number;
  page: number;
}
export default defineComponent({
  name: 'Paginator',
  emits: ['page-change'],
  components: {
    FontAwesomeIcon,
  },
  props: ['lastPage', 'page'],
  setup(props: paginatorProps, context) {
    const next = () => {
      if (props.page < props.lastPage) {
        context.emit('page-change', props.page + 1);
      }
    };
    const goTo = (p: number) => {
      context.emit('page-change', p);
    };
    const prev = () => {
      if (props.page > 1) {
        context.emit('page-change', props.page - 1);
      }
    };
    const isBoxLight = (bool: boolean) => {
      if (bool) {
        return 'text-normal border-gray-100 hover:bg-gray-500 cursor-default';
      } else {
        return 'text-gray-400 border-gray-400 cursor-pointer';
      }
    };
    const isArrowLight = (bool: boolean) => {
      if (bool) {
        return 'text-normal border-gray-100 hover:bg-gray-500 cursor-pointer';
      } else {
        return 'text-gray-400 border-gray-400 cursor-default';
      }
    };
    return {
      next,
      prev,
      faChevronLeft,
      faChevronRight,
      range,
      isBoxLight,
      isArrowLight,
      goTo,
    };
  },
});
</script>
