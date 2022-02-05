<template>
  <div class="flex items-center justify-center w-full h-full">
    <div
      v-if="questions.length > 0 && remains.length === 0"
      data-testid="study-finish-message"
      class="py-4 m-4 text-gray-100 bg-gray-700 rounded-lg px-7"
    >
      本日の学習は終了しました。
      <div class="flex justify-center mt-5">
        <button class="mr-2 btn btn-primary" @click="onSubmit">同期</button>
        <router-link to="/">
          <button class="btn btn-sub-white">戻る</button>
        </router-link>
      </div>
    </div>
    <div
      v-else-if="questions.length > 0"
      data-testid="question-window"
      class="py-4 m-4 text-gray-100 bg-gray-700 rounded-lg px-7"
    >
      <p class="mb-3 text-center">{{ progress + 1 }}/{{ questions.length }}</p>
      <FlipCard
        :front="questions[progress].front"
        :back="questions[progress].back"
        :phase="phase"
        @flip="onFlip"
      />
      <div class="buttonContainer">
        <div
          class="flex flex-col justify-center h-full"
          v-if="phase === 'question'"
        >
          <div class="text-center">カードをクリックすると答えが見れます</div>
        </div>
        <div v-else-if="phase === 'answer'" class="flex justify-center">
          <button
            class="mr-2 btn btn-primary"
            @click="() => next(true)"
            data-testid="correct-button"
          >
            正解！
          </button>
          <button class="btn btn-sub-white" @click="() => next(false)">
            もう一度
          </button>
        </div>
      </div>
    </div>
    <div
      v-else-if="section"
      class="flex flex-col w-2/3 p-5 mx-auto bg-gray-700 rounded-lg"
    >
      <div class="mb-5 text-center text-gray-100">
        <h1 class="mb-2 text-2xl">{{ section.title }}</h1>
        <p>
          {{ section.description }}
        </p>
        <p>問題数：{{ section.questions.length }}</p>
        <p>達成率：{{ Math.round(section.complete_rate * 100) }}%</p>
      </div>
      <div data-testid="study-start-message" class="flex justify-center">
        <button
          class="mr-2 btn btn-primary"
          data-testid="review-button"
          @click="fetchReview"
        >
          <span class="whitespace-nowrap"> 復習 </span>
        </button>
        <button
          class="mr-2 btn btn-sub-white"
          data-testid="study-button"
          @click="fetchNew"
        >
          <span class="whitespace-nowrap"> 新問 </span>
        </button>
        <router-link to="/">
          <button class="btn btn-sub-white" data-testid="goback-link">
            <span class="whitespace-nowrap"> 戻る</span>
          </button>
        </router-link>
      </div>
    </div>
    <div v-else data-testid="not-found-message"></div>
  </div>
</template>
<script lang="ts">
interface FormState {
  question_ids: number[];
}
import { Section, Question } from '../../types';
import axios from 'axios';
import { ref, reactive, onMounted, computed, defineComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import FlipCard from '../../components/FlipCard.vue';
const range = (start: number, end: number) => {
  const list = [];
  for (let i = start; i <= end; i++) {
    list.push(i);
  }
  return list;
};
export default defineComponent({
  name: 'Study',
  components: {
    FlipCard,
  },
  setup() {
    const {
      params: { sectionId },
    } = useRoute();
    const questions = ref<Question[]>([]);
    const remains = ref<number[]>([]);
    const form = reactive<FormState>({
      question_ids: [],
    });
    const section = ref<null | Section>(null);
    const isReviewMode = ref(false);
    const progress = ref(0);
    const store = useStore();
    const router = useRouter();
    const phase = ref('question');
    onMounted(async () => {
      await load();
    });
    const load = async () => {
      try {
        const { data } = await axios.get(`/sections/${sectionId}`);
        section.value = data.section;
      } catch (e) {
        store.dispatch('setModal', {
          type: 'error',
          messages: ['不明なエラーです'],
        });
      }
    };
    const fetchNew = async () => {
      try {
        const { status, data } = await axios.get(
          `sections/${sectionId}/new_questions`
        );
        if (data.message === "next assignment isn't yet") {
          store.dispatch('setModal', {
            type: 'notification',
            messages: ['本日の新規学習は終了しました。', '明日また頑張ろうね'],
          });
        } else if (status == 200) {
          questions.value = data.questions;
          isReviewMode.value = false;
          remains.value = range(0, questions.value.length - 1);
        } else {
          store.dispatch('setModal', {
            type: 'error',
            messages: ['不明なエラーです'],
          });
        }
      } catch (e) {
        store.dispatch('setModal', {
          type: 'error',
          messages: ['不明なエラーです'],
        });
      }
    };
    const fetchReview = async () => {
      const { status, data } = await axios.get(
        `sections/${sectionId}/review_questions`
      );
      if (status === 200) {
        if (data.questions.length === 0) {
          store.dispatch('setModal', {
            type: 'notification',
            messages: ['本日の復習は終了しました。', '明日また頑張ろうね'],
          });
        } else {
          questions.value = data.questions;
          isReviewMode.value = true;
          remains.value = range(0, questions.value.length - 1);
        }
      } else {
        store.dispatch('setModal', {
          type: 'error',
          messages: ['不明なエラーです'],
        });
      }
    };
    const onFlip = () => {
      if (phase.value === 'question') {
        phase.value = 'answer';
      } else {
        phase.value = 'question';
      }
    };
    const next = (isCorrect: boolean) => {
      if (isCorrect) {
        const newRemains = remains.value.filter((el) => {
          return el !== progress.value;
        });
        remains.value = newRemains;
        form.question_ids = [
          ...form.question_ids,
          questions.value[progress.value].id,
        ];
      }
      if (remains.value.length > 0) {
        do {
          if (progress.value < questions.value.length - 1) {
            progress.value = progress.value + 1;
          } else {
            progress.value = 0;
          }
        } while (!remains.value.includes(progress.value));
      }
      phase.value = 'question';
    };
    const onSubmit = async () => {
      const url = isReviewMode.value
        ? 'answer_reviews'
        : `sections/${sectionId}/answer_questions`;
      const { status, data } = await axios.post(url, form);
      if (status === 200) {
        store.dispatch('setModal', {
          type: 'notification',
          messages: ['同期しました'],
        });
        questions.value = [];
        remains.value = [];
        progress.value = 0;
        form.question_ids = [];
        await load();
      }
    };
    const user = computed(() => {
      return store.state.user;
    });
    return {
      questions,
      progress,
      next,
      section,
      fetchNew,
      remains,
      fetchReview,
      onSubmit,
      user,
      phase,
      onFlip,
    };
  },
});
</script>
<style scoped>
.buttonContainer {
  @apply mt-3 flex justify-center items-center;
}
</style>
