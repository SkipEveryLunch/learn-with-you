<template>
  <div class="relative cursor-pointer" @click="onComment" :class="colorClass">
    <div>
      <font-awesome-icon class="fa-lg" :icon="faCommentDots" />
    </div>
    <span class="count">{{ count }}</span>
  </div>
</template>
<script>
import { computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';
export default {
  name: 'CommentIcon',
  props: ['count', 'isCommented'],
  emits: ['comment'],
  components: {
    FontAwesomeIcon,
  },
  setup(props, { emit }) {
    const onComment = () => {
      emit('comment');
    };
    const colorClass = computed(() => {
      return props.isCommented ? 'text-gray-100' : 'text-gray-400';
    });
    return {
      faCommentDots,
      onComment,
      colorClass,
    };
  },
};
</script>
<style scoped>
.count {
  text-shadow: 2px 2px 0 black, -2px -2px 0 black, -2px 2px 0 black,
    2px -2px 0 black, 0px 2px 0 black, 0-2px 0 black, -2px 0 0 black,
    2px 0 0 black;
  position: absolute;
  left: 20px;
  top: 5px;
}
</style>
