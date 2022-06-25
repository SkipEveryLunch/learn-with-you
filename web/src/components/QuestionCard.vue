<template>
  <div class="grid grid-cols-10 gap-3 card bg-front text-normal">
    <div class="flex flex-col justify-center col-span-7">
      <div class="flex mb-auto">
        <div v-if="isPostedByMe" class="mr-2">
          <Flag>Posted</Flag>
        </div>
        <div v-if="isCommentedByMe">
          <Flag colorType="blue">Commented</Flag>
        </div>
      </div>
      <div class="flex flex-col gap-2 justify-center mb-auto text-mid">
        <div>
          <p>{{ question.front }}</p>
        </div>
        <div class="border-u"></div>
        <div>
          <p>{{ question.back }}</p>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-3 items-end col-span-3">
      <div>
        <CommentIcon
          :isCommented="isCommentedByMe"
          :count="question.commented_by.length"
          @comment="showModal"
        />
      </div>
      <div class="text-small whitespace-nowrap flex flex-col items-end">
        <p>
          レベル:
          {{ question.learning_stage ? question.learning_stage : '未学習' }}
        </p>
        <p>
          次回:
          {{ question.next_period ? question.next_period : '未学習' }}
        </p>
      </div>

      <div
        v-if="isAbleToSeeComments"
        data-testid="edit-buttons"
        class="flex gap-1"
      >
        <router-link
          :to="`/section/${question.section_id}/question/${question.id}/edit`"
        >
          <button class="whitespace-nowrap btn btn-primary">編集</button>
        </router-link>
        <button
          data-testid="question-delete-button"
          @click="onDelete"
          class="btn btn-sub-white whitespace-nowrap"
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
import Flag from './Flag.vue';
interface QuestionCardProps {
  question: Question;
}
export default defineComponent({
  props: ['question'],
  emits: ['load'],
  components: {
    CommentIcon,
    Flag,
  },
  setup(props: QuestionCardProps, { emit }: SetupContext) {
    const store = useStore();
    const router = useRouter();
    const user = computed(() => {
      return store.state.user;
    });
    const isPostedByMe = computed(() => {
      return props.question.posted_by === user.value.id;
    });
    const isAbleToSeeComments = computed(() => {
      return isPostedByMe.value || user.value.role.id === 1;
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
      isPostedByMe,
    };
  },
});
</script>
<style scoped>
.card {
  @apply py-1 px-3 rounded w-full;
  min-height: 120px;
}
.border-u {
  border-bottom: 1px solid rgba(163, 163, 163);
}
</style>
