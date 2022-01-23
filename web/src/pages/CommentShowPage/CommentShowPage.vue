<template>
  <div v-if="!isLoading" data-testid="comment-show-page" class="flex h-full">
    <div class="flex flex-col w-1/3 px-4 py-3">
      <div class="pt-2 pb-3 text-4xl font-bold text-gray-700">
        コメント一覧
        <p class="text-lg">{{ comments.length }}件の改善要望が届いています</p>
      </div>
      <div class="flex pr-1 mt-1 mb-2">
        <div class="flex flex-col ml-2">
          <div
            v-for="type in commentTypes"
            class="flex justify-between py-2 cursor-pointer sideRow"
            :key="type.id"
            @click="() => filterCommentsByType(type.id)"
          >
            <div class="mr-5">
              <p>
                {{ type.name }}
              </p>
            </div>
            <div>
              <p>{{ type.count }}件</p>
            </div>
          </div>
          <div class="sideRow">
            <router-link
              data-testid="section-submit-link"
              :to="`/section/${sectionId}/edit`"
              ><p>戻る</p></router-link
            >
          </div>
        </div>
      </div>
    </div>
    <div v-if="fComments.length > 0 && question" class="w-full">
      <div class="px-3">
        <div class="flex card">
          <div class="flex w-full">
            <div class="w-1/2 p-2 border-r">
              <p>質問:</p>
              <p>{{ question.front }}</p>
            </div>
            <div class="w-1/2 p-2 ml-2">
              <p>解答:</p>
              <p>{{ question.back }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <transition-group
          tag="ul"
          class="flex flex-col w-full p-3"
          appear
          @before-enter="beforeEnter"
          @enter="enter"
        >
          <li
            data-testid="question-card"
            v-for="(comment, idx) in fComments"
            :key="idx"
            :data-idx="idx"
          >
            <CommentCard :comment="comment" @reload="reloadComments" />
          </li>
        </transition-group>
      </div>
    </div>
  </div>
  <div v-else class="w-full h-full">
    <Spinner />
  </div>
</template>
<script lang="ts">
import { ref, computed, onMounted, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { Comment, Question, CountedCommentType } from '../../types';
import { useRoute, useRouter } from 'vue-router';
import Spinner from '../../components/Spinner.vue';
import gsap from 'gsap';
import axios from 'axios';
import CommentCard from '../../components/CommentCard.vue';
export default defineComponent({
  name: 'CommentShowPage',
  components: {
    Spinner,
    CommentCard,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const isPostedByUser = ref(false);
    const commentTypes = ref<CountedCommentType[]>([]);
    const user = computed(() => {
      return store.state.user;
    });
    const {
      params: { questionId, sectionId },
    } = useRoute();
    const isLoading = ref(true);
    const comments = ref<Comment[]>([]);
    const fComments = ref<Comment[]>([]);
    const question = ref<Question>();
    const showAllComments = () => {
      fComments.value = comments.value;
    };
    const filterCommentsByType = (type: number) => {
      fComments.value = comments.value.filter((el) => {
        return el.comment_type.id === type;
      });
    };
    const reloadComments = async () => {
      isLoading.value = true;
      const commentsData = await axios.get(
        `/questions_several_comments/${questionId}`
      );
      if (commentsData.status === 200) {
        comments.value = commentsData.data.comments;
        fComments.value = commentsData.data.comments;
        commentTypes.value = commentsData.data.comment_types;
        isLoading.value = false;
      } else {
        store.dispatch('setModal', {
          type: 'caution',
          messages: ['不明なエラーです'],
        });
      }
    };
    onMounted(async () => {
      if (!user.value) {
        router.push(`/section/${sectionId}/edit`);
        return;
      }
      try {
        const commentsData = await axios.get(
          `/questions_several_comments/${questionId}`
        );
        const questionData = await axios.get(`/questions/${questionId}`);
        if (commentsData.status === 200 && questionData.status === 200) {
          if (
            user.value.role.id === 1 ||
            user.value.id === commentsData.data.commented_to
          ) {
            isPostedByUser.value = true;
            comments.value = commentsData.data.comments;
            fComments.value = commentsData.data.comments;
            commentTypes.value = commentsData.data.comment_types;
            question.value = questionData.data.question;
            isLoading.value = false;
          } else {
            router.push(`/section/${sectionId}/edit`);
          }
        }
      } catch (e) {
        console.log(e);
      }
    });
    const beforeEnter = (el: HTMLElement) => {
      el.style.transform = 'translateY(60px)';
      el.style.opacity = '0';
    };
    const enter = (el: HTMLElement) => {
      if (typeof el.dataset.idx === 'string') {
        gsap.to(el, {
          y: 0,
          opacity: 1,
          duration: 0.5,
          rotateY: 0,
          delay: parseInt(el.dataset.idx) * 0.2,
        });
      }
    };
    return {
      comments,
      fComments,
      sectionId,
      user,
      isPostedByUser,
      beforeEnter,
      enter,
      showAllComments,
      commentTypes,
      filterCommentsByType,
      isLoading,
      question,
      reloadComments,
    };
  },
});
</script>
<style scoped>
.card {
  @apply p-3 mb-2 bg-gray-700 rounded flex w-full;
}
.border-r {
  border-right: 2px solid rgba(115, 115, 115);
}
</style>
