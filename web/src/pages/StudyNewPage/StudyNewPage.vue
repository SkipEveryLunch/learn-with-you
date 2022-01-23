<template>
  <div class="flex items-center justify-center w-full h-full">
    <FinishedTemplate
      v-if="questions.length > 0 && isFinished"
      @submit="onSubmit"
      :questions="questions"
      :answeredIds="answeredIds"
    />
    <StudyTemplate
      v-else-if="questions.length > 0"
      :questions="questions"
      @finish="finish"
      @add-to-answer="AddToAnswer"
    />
    <Spinner v-else />
  </div>
</template>
<script lang="ts">
import { Section, Question } from '../../types';
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import StudyTemplate from '../../components/StudyTemplate.vue';
import FinishedTemplate from '../../components/FinishedTemplated.vue';
import Spinner from '../../components/Spinner.vue';
export default {
  name: 'StudyNewPage',
  components: {
    StudyTemplate,
    FinishedTemplate,
    Spinner,
  },
  setup() {
    const {
      params: { sectionId },
    } = useRoute();
    const isFinished = ref(false);
    const finish = () => {
      isFinished.value = true;
    };
    const questions = ref<Question[]>([]);
    const answeredIds = ref<number[]>([]);
    const section = ref<null | Section>(null);
    const store = useStore();
    const router = useRouter();
    onMounted(async () => {
      if (!user.value) {
        store.dispatch('setModal', {
          type: 'error',
          messages: ['ログインが必要です'],
        });
        router.push('/');
      } else {
        await load();
      }
    });
    const AddToAnswer = (answerId: number) => {
      answeredIds.value = [...answeredIds.value, answerId];
    };
    const load = async () => {
      try {
        const { status, data } = await axios.get(
          `sections/${sectionId}/new_questions`
        );
        if (data.message === "next assignment isn't yet") {
          store.dispatch('setModal', {
            type: 'notification',
            messages: ['本日の新規学習は終了しました。明日また頑張ろうね'],
          });
          router.push(`/section/${sectionId}/study`);
        } else if (status == 200) {
          if (data.questions.length > 0) {
            questions.value = data.questions;
          } else {
            store.dispatch('setModal', {
              type: 'notification',
              messages: ['学習する問題がありません'],
            });
            router.push(`/section/${sectionId}/study`);
          }
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
    const onSubmit = async () => {
      const { status, data } = await axios.post(
        `sections/${sectionId}/answer_questions`,
        {
          question_ids: answeredIds.value,
        }
      );
      if (status === 200) {
        store.dispatch('setModal', {
          type: 'notification',
          messages: ['同期しました'],
        });
        questions.value = [];
        answeredIds.value = [];
        router.push(`/section/${sectionId}/study`);
      }
    };
    const user = computed(() => {
      return store.state.user;
    });
    return {
      questions,
      section,
      onSubmit,
      user,
      isFinished,
      finish,
      AddToAnswer,
      answeredIds,
    };
  },
};
</script>
<style scoped>
.buttonContainer {
  height: 45px;
  @apply:flex justify-center items-center;
}
</style>
