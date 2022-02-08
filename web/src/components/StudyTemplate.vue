<template>
  <div
    data-testid="question-window"
    class="py-4 m-4 text-normal bg-front rounded-lg px-7"
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
          @click="() => onNext(true)"
          data-testid="correct-button"
        >
          正解！
        </button>
        <button class="btn btn-sub-white" @click="() => onNext(false)">
          もう一度
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
const range = (start: number, end: number) => {
  const list = [];
  for (let i = start; i <= end; i++) {
    list.push(i);
  }
  return list;
};
import { ref, onMounted, defineComponent, SetupContext } from 'vue';
import { Question } from '../types';
import FlipCard from '../components/FlipCard.vue';
interface StudyTemplateProps {
  questions: Question[];
}
export default defineComponent({
  props: ['questions'],
  emits: ['finish', 'add-to-answer'],
  components: { FlipCard },
  setup(props: StudyTemplateProps, { emit }: SetupContext) {
    const phase = ref('question');
    const remains = ref<number[]>([]);
    const progress = ref(0);
    onMounted(() => {
      remains.value = range(0, props.questions.length - 1);
    });
    const onFlip = () => {
      if (phase.value === 'question') {
        phase.value = 'answer';
      } else {
        phase.value = 'question';
      }
      phase.value;
    };
    const onNext = (isCorrect: boolean) => {
      if (isCorrect) {
        const newRemains = remains.value.filter((el: number) => {
          return el !== progress.value;
        });
        remains.value = newRemains;
        emit('add-to-answer', props.questions[progress.value].id);
      }
      if (remains.value.length > 0) {
        do {
          if (progress.value < props.questions.length - 1) {
            progress.value = progress.value + 1;
          } else {
            progress.value = 0;
          }
        } while (!remains.value.includes(progress.value));
      } else {
        emit('finish');
      }
      phase.value = 'question';
    };
    return {
      onNext,
      onFlip,
      phase,
      progress,
    };
  },
});
</script>
<style scoped>
.buttonContainer {
  height: 35px;
}
</style>
