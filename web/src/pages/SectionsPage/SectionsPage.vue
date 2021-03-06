<template>
  <div class="w-full h-full">
    <div class="pb-3 pl-2 mt-3 text-xlarge2 font-bold text-gray-700 w-max">
      セクション一覧
    </div>
    <SearchWindow
      :series="series"
      addPath="/section_submit"
      @on-input="onChangeSearch"
      @on-submit="filterSections"
      @show-all="showAllSections"
      @filter-mine="findMySections"
      @change-series="(id) => filterBySeries(id)"
      :modelValue="search"
      :isMessage="false"
    />
    <div v-if="!isLoading" class="sm:px-5">
      <div
        v-if="fSections.length > 0"
        data-testid="section-page"
        class="w-full"
      >
        <Paginator :page="page" :lastPage="lastPage" />
        <transition-group
          tag="ul"
          appear
          class="flex flex-col gap-2 scroller"
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
        <div class="text-xlarge text-gray-200">セクションがありません</div>
      </div>
    </div>
    <div v-else class="w-full h-full">
      <Spinner />
    </div>
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
import SearchWindow from '../../components/SearchWindow.vue';
import Paginator from '../../components/Paginator.vue';
export default defineComponent({
  name: 'SectionsPage',
  components: {
    Spinner,
    SectionCard,
    SearchWindow,
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
      if (id !== 0) {
        fSections.value = sections.value.filter((el) => {
          return el.series.id === id;
        });
      } else {
        fSections.value = sections.value;
      }
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
