<template>
  <div class="flex items-center w-full mb-2">
    <div class="mr-2">
      <div class="p-2 text-center bg-gray-700 rounded-full w-14 h-14">
        <font-awesome-icon class="text-gray-100 fa-2x" :icon="faUser" />
      </div>
    </div>
    <div class="triangle"></div>
    <div class="card" data-testId="comment-card">
      <div class="flex w-full px-5 py-3">
        <div class="flex flex-col pr-2">
          <div class="mb-1">
            <p>
              {{ comment.comment_type.name }}
            </p>
          </div>
          <div class="text-sm">
            <p>{{ comment.comment_detail }}</p>
          </div>
        </div>
      </div>
      <div
        v-if="user.role.id === 1"
        data-testid="comment-delete-button"
        class="flex items-end justify-end px-3 py-2"
      >
        <button
          class="btn btn-primary"
          @click="() => deleteComment(comment.id)"
        >
          削除する
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import axios from 'axios';
import { useStore } from 'vuex';
import { computed, defineComponent } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
export default defineComponent({
  name: 'CommentCard',
  props: ['comment'],
  emits: ['reload'],
  components: {
    FontAwesomeIcon,
  },
  setup(_, { emit }) {
    const store = useStore();
    const user = computed(() => {
      return store.state.user;
    });
    const deleteComment = async (commentId: number) => {
      const { status } = await axios.delete(`comments/${commentId}`);
      if (status === 204) {
        store.dispatch('setModal', {
          type: 'notification',
          messages: ['コメントを削除しました'],
        });
        emit('reload');
      } else {
        store.dispatch('setModal', {
          type: 'caution',
          messages: ['不明なエラーです'],
        });
      }
    };
    return {
      faUser,
      deleteComment,
      user,
    };
  },
});
</script>
<style scoped>
.card {
  @apply w-full text-gray-100 bg-gray-700 rounded;
}
.triangle {
  height: 15px;
  border-top: 15px solid transparent;
  border-right: 20px solid rgba(64, 64, 64);
  border-bottom: 15px solid transparent;
}
</style>
