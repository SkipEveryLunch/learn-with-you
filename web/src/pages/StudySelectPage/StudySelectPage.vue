<template>
  <div class="flex items-center h-full justfy-center">
    <div
      v-if="section"
      class="flex flex-col p-5 mx-auto bg-gray-700 rounded-lg"
    >
      <div class="mb-5 text-center text-gray-100">
        <h1 class="mb-2 text-2xl">{{ section.title }}</h1>
        <p class="descriptionContainer">
          {{ section.description }}
        </p>
        <p>問題数：{{ section.questions.length }}</p>
        <p>達成率：{{ Math.round(section.complete_rate * 100) }}%</p>
      </div>
      <div data-testid="study-start-message" class="flex justify-center">
        <router-link :to="`/section/${sectionId}/study_review`">
          <button class="mr-2 btn btn-primary" data-testid="review-button">
            <span class="whitespace-nowrap"> 復習 </span>
          </button>
        </router-link>
        <router-link :to="`/section/${sectionId}/study_new`">
          <button class="mr-2 btn btn-sub-white" data-testid="study-button">
            <span class="whitespace-nowrap"> 新問 </span>
          </button>
        </router-link>

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
import { Section } from '../../types';
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
export default {
  name: 'StudySelect',
  setup() {
    const {
      params: { sectionId },
    } = useRoute();
    const section = ref<null | Section>(null);
    const store = useStore();
    const router = useRouter();
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
    const user = computed(() => {
      return store.state.user;
    });
    return {
      section,
      user,
      sectionId,
    };
  },
};
</script>
<style scoped>
.buttonContainer {
  height: 45px;
  @apply:flex justify-center items-center;
}
.descriptionContainer {
  width: 350px;
  overflow: hidden;
  @apply m-3;
}
</style>
