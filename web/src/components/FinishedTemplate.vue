<template>
  <div class="outerFormContainer w-full h-full">
    <div
      data-testid="study-finish-message"
      class="py-4 m-4 text-center text-normal bg-front rounded-lg w-max px-7"
    >
      本日の学習は終了しました。
      <div class="flex justify-center mt-5">
        <button class="mr-2 btn btn-primary" @click="onSubmit">同期</button>
        <router-link to="/">
          <button class="btn btn-sub-white">戻る</button>
        </router-link>
      </div>
    </div>
    <p class="text-xlarge text-center">学習した問題一覧</p>
    <div>
      <transition-group
        appear
        @before-enter="beforeEnter"
        @enter="enter"
        class="w-full mt-2 scroller"
        tag="ul"
      >
        <li
          v-for="(question, idx) in answeredQuestions"
          :key="question.id"
          :data-idx="idx"
        >
          <QuestionCard :question="question" @load="load" />
        </li>
      </transition-group>
    </div>
  </div>
</template>
<script lang="ts">
import gsap from 'gsap';
import QuestionCard from './QuestionCard.vue';
import { computed, defineComponent, SetupContext } from 'vue';
import { Question } from '../types';
interface FinishedTemplateProps {
  questions: Question[];
  answeredIds: number[];
}
export default defineComponent({
  props: ['questions', 'answeredIds'],
  emits: ['submit'],
  components: { QuestionCard },
  setup(props: FinishedTemplateProps, { emit }: SetupContext) {
    const onSubmit = () => {
      emit('submit');
    };
    const load = () => {
      emit('load');
    };
    const answeredQuestions = computed<Question[]>(() => {
      return props.questions.filter((question: Question) => {
        return props.answeredIds.includes(question.id);
      });
    });
    const beforeEnter = (el: HTMLElement) => {
      el.style.transform = 'translateX(60px)';
      el.style.opacity = '0';
    };
    const enter = (el: HTMLElement) => {
      if (typeof el.dataset.idx === 'string') {
        gsap.to(el, {
          x: 0,
          opacity: 1,
          duration: 0.5,
          delay:
            parseInt(el.dataset.idx) < 4 ? parseInt(el.dataset.idx) * 0.2 : 0,
        });
      }
    };
    return {
      onSubmit,
      load,
      answeredQuestions,
      beforeEnter,
      enter,
    };
  },
});
</script>
