<template>
  <div v-if="!isLoading" class="flex h-full">
    <div class="flex flex-col w-1/3 px-4 py-3">
      <div
        class="pt-2 pb-3 text-3xl font-bold text-gray-700 cursor-pointer w-max"
        @click="showAllSections"
      >
        セクション一覧
      </div>
      <div class="flex pr-1 mt-1 mb-2">
        <SearchBox
          @on-input="onChangeSearch"
          @on-submit="filterSections"
          :modelValue="search"
        />
      </div>
      <div class="flex flex-col ml-2">
        <div class="sideRow">
          <router-link
            v-if="user"
            to="section_submit"
            data-testid="section-submit-link"
            ><span>新規セクション作成</span></router-link
          >
        </div>

        <div @click="findMySections" class="sideRow" v-if="user">
          <span>投稿したセクション</span>
        </div>
        <div v-if="series.length > 0">
          <div
            v-for="(aSeries, idx) in series"
            :key="idx"
            class="sideRow"
            @click="() => filterBySeries(aSeries.id)"
          >
            <span>{{ aSeries.name }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="fSections.length > 0" data-testid="section-page" class="w-full">
      <Paginator :page="page" :lastPage="lastPage" />
      <transition-group
        tag="ul"
        appear
        class="flex flex-col scroller"
        @before-enter="beforeEnter"
        @enter="enter"
      >
        <li
          data-testid="section-card"
          v-for="(section, idx) in sSections"
          :key="section.id"
          :data-idx="idx"
        >
          <SectionCard :section="section" />
        </li>
      </transition-group>
    </div>
    <div v-else class="flex items-center justify-center w-full">
      <div class="text-xl text-gray-200">セクションがありません</div>
    </div>
  </div>
  <div v-else class="w-full h-full">
    <Spinner />
  </div>
</template>
<script lang="ts">
class ListElement extends HTMLElement {}
import gsap from 'gsap';
import { onMounted, computed, ref, defineComponent } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import { Section, Series } from '../../types';
import Spinner from '../../components/Spinner.vue';
import SectionCard from '../../components/SectionCard.vue';
import SearchBox from '../../components/SearchBox.vue';
import Paginator from '../../components/Paginator.vue';
export default defineComponent({
  name: 'SectionsPage',
  components: {
    Spinner,
    SectionCard,
    SearchBox,
    Paginator,
  },
  setup() {
    const sections = ref<Section[]>([]);
    const fSections = ref<Section[]>([]);
    const series = ref<Series[]>([]);
    const page = ref(1);
    const sSections = computed(() => {
      if (fSections.value.length > 0) {
        return fSections.value.slice((page.value - 1) * 15, page.value * 15);
      } else {
        return [];
      }
    });
    const lastPage = computed(() => {
      return Math.floor(fSections.value.length / 15) + 1;
    });
    const isLoading = ref(true);
    const store = useStore();
    const search = ref('');
    const user = computed(() => store.state.user);
    onMounted(async () => {
      const { data, status } = await axios.get('sections');
      if (status === 200) {
        isLoading.value = false;
        sections.value = data.sections;
        fSections.value = data.sections;
        series.value = data.series;
      }
    });
    const showAllSections = () => {
      fSections.value = sections.value;
    };
    const filterBySeries = (id: number) => {
      fSections.value = sections.value.filter((el) => {
        return el.series.id === id;
      });
    };
    const findMySections = () => {
      fSections.value = sections.value.filter((el) => {
        return el.posted_by === user.value.id;
      });
    };
    const filterSections = () => {
      fSections.value = sections.value.filter((el) => {
        return el.title.includes(search.value);
      });
    };
    const onChangeSearch = (payload: string) => {
      search.value = payload;
    };
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
      fSections,
      series,
      beforeEnter,
      enter,
      search,
      user,
      findMySections,
      showAllSections,
      isLoading,
      filterSections,
      onChangeSearch,
      filterBySeries,
      sSections,
      lastPage,
      page,
    };
  },
});
</script>
<style scoped>
.column {
  width: 20rem;
}
.formInput {
  @apply w-full focus:outline-none;
  border-top-left-radius: 0.15em;
  border-bottom-left-radius: 0.15em;
}
.formButton {
  @apply text-gray-100;
  padding: 3px 3px 3px 3px;
  border-top-right-radius: 0.15em;
  border-bottom-right-radius: 0.15em;
}
</style>
