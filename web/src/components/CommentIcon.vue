<template>
  <div class="relative cursor-pointer" @click="onComment" :class="colorClass">
    <div>
      <font-awesome-icon class="fa-lg" :icon="faCommentDots" />
    </div>
    <span :class="[isDarkMode ? 'count-dark' : 'count']">{{ count }}</span>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, watch } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';
export default defineComponent({
  name: 'CommentIcon',
  props: ['count', 'isCommented'],
  emits: ['comment'],
  components: {
    FontAwesomeIcon,
  },
  setup(props, { emit }) {
    const isDarkMode = computed(() => {
      return document.body.classList.contains('dark');
    });
    const onComment = () => {
      emit('comment');
    };
    const colorClass = computed(() => {
      return props.isCommented ? 'text-blue-500' : 'text-gray-300';
    });
    return {
      faCommentDots,
      onComment,
      colorClass,
      isDarkMode,
    };
  },
});
</script>
<style scoped>
.count {
  color: rgb(64, 64, 64);
  position: absolute;
  left: 20px;
  top: 5px;
}
.count-dark {
  color: rgb(245, 245, 245);
  position: absolute;
  left: 20px;
  top: 5px;
}
</style>
