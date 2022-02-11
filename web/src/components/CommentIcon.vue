<template>
  <div class="relative cursor-pointer" @click="onComment" :class="colorClass">
    <div>
      <font-awesome-icon class="fa-lg" :icon="faCommentDots" />
    </div>
    <span :class="[isDarkMode ? 'count-dark' : 'count']">{{ count }}</span>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { useStore } from 'vuex';
export default defineComponent({
  name: 'CommentIcon',
  props: ['count', 'isCommented'],
  emits: ['comment'],
  components: {
    FontAwesomeIcon,
  },
  setup(props, { emit }) {
    const store = useStore();
    const isDarkMode = computed(() => {
      return store.state.isDarkMode;
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
  text-shadow: 2px 2px 1px rgb(64, 64, 64), -2px 2px 1px rgb(64, 64, 64),
    2px -2px 1px rgb(64, 64, 64), -2px -2px 1px rgb(64, 64, 64),
    2px 0px 1px rgb(64, 64, 64), 0px 2px 1px rgb(64, 64, 64),
    -2px 0px 1px rgb(64, 64, 64), 0px -2px 1px rgb(64, 64, 64);
  position: absolute;
  left: 20px;
  top: 5px;
}
</style>
