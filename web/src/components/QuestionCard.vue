<template>
  <div class="grid grid-cols-10 card">
    <div class="flex flex-col justify-center col-span-8">
      <div class="pb-2 border-u">
        <p>{{ question.front }}</p>
      </div>
      <div class="mt-2">
        <p>{{ question.back }}</p>
      </div>
    </div>
    <div class="grid grid-cols-10 col-span-2 grid-rows-10">
      <div
        class="col-span-4 col-start-2 row-span-3 row-start-1 text-sm  whitespace-nowrap"
      >
        <p>
          レベル:
          {{ question.learning_stage ? question.learning_stage : '未学習' }}
        </p>
        <p>
          次回:
          {{ question.next_period ? question.next_period : '未学習' }}
        </p>
      </div>
      <div class="col-span-2 col-start-9 row-span-2 row-start-1">
        <CommentIcon
          :isCommented="isCommentedByMe"
          :count="question.commented_by.length"
          @comment="showModal"
        />
      </div>
      <div
        v-if="isAbleToSeeComments"
        data-testid="edit-buttons"
        class="flex items-center justify-center col-span-8 col-start-3 row-span-1  row-start-9"
      >
        <router-link
          :to="`/section/${question.section_id}/question/${question.id}/edit`"
        >
          <button class="mr-2 whitespace-nowrap btn btn-primary">編集</button>
        </router-link>
        <button
          data-testid="question-delete-button"
          @click="onDelete"
          class="mr-2 btn btn-sub-white whitespace-nowrap"
        >
          削除
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, SetupContext } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { Question } from '../types';
import CommentIcon from './CommentIcon.vue';
interface QuestionCardProps {
  question: Question;
}
export default defineComponent({
  props: ['question'],
  emits: ['load'],
  components: {
    CommentIcon,
  },
  setup(props: QuestionCardProps, { emit }: SetupContext) {
    const store = useStore();
    const router = useRouter();
    const user = computed(() => {
      return store.state.user;
    });
    const isAbleToSeeComments = computed(() => {
      return (
        props.question.posted_by === user.value.id || user.value.role.id === 1
      );
    });
    const isCommentedByMe = computed(() => {
      return props.question.commented_by.includes(user.value.id);
    });
    const showModal = () => {
      if (isAbleToSeeComments.value) {
        router.push(
          `/section/${props.question.section_id}/question/${props.question.id}/comment`
        );
      } else {
        store.dispatch('setCommentModal', {
          questionId: props.question.id,
          modalMode: isCommentedByMe.value ? 'edit' : 'new',
        });
      }
    };
    const onDelete = () => {
      store.dispatch('setModal', {
        type: 'caution',
        messages: ['本当に削除しますか?'],
        cb: {
          name: '削除します',
          cb: async () => {
            try {
              const { status } = await axios.delete(
                `questions/${props.question.id}`
              );
              if (status === 204) {
                await store.dispatch('discardModal');
                store.dispatch('setModal', {
                  type: 'notification',
                  messages: ['削除しました'],
                });
                emit('load');
              } else {
                store.dispatch('setModal', {
                  type: 'error',
                  messages: ['不明なエラーです'],
                });
              }
            } catch (e) {
              if (e.response.status === 404) {
                store.dispatch('setModal', {
                  type: 'error',
                  messages: ['質問が見つかりません'],
                });
              } else {
                store.dispatch('setModal', {
                  type: 'error',
                  messages: ['不明なエラーです'],
                });
              }
            }
          },
        },
      });
    };
    return {
      onDelete,
      user,
      showModal,
      isAbleToSeeComments,
      isCommentedByMe,
    };
  },
});
</script>
<style scoped>
.card {
  @apply p-3 mb-2 bg-gray-700 rounded w-full;
  min-height: 120px;
}
.border-u {
  border-bottom: 2px solid rgba(115, 115, 115);
}
</style>
