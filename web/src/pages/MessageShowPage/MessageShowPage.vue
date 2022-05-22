<template>
  <div v-if="!isLoading" class="h-full">
    <div class="flex flex-col w-full mx-2">
      <div class="pt-3 pb-2 text-xlarge2 font-bold text-gray-700 w-max">
        メッセージ一覧
        <p class="text-large">
          <span class="mr-3">全{{ messages.length }}件</span>
          <span data-testid="unconfirmed">うち{{ unconfirmed }}件未読</span>
        </p>
      </div>
    </div>
    <SearchWindow
      @on-submit="filterMessages"
      @on-input="onChangeSearch"
      @filter-new="filterNewMessages"
      @show-all="showAllMessages"
      :modelValue="search"
      :isMessage="true"
      goBackPath="/"
    />
    <div v-if="fMessages.length > 0" class="w-full px-5">
      <Paginator :page="page" :lastPage="lastPage" />
      <transition-group
        tag="ul"
        class="flex flex-col scroller"
        appear
        @before-enter="beforeEnter"
        @enter="enter"
      >
        <li
          data-testid="question-card"
          v-for="(message, idx) in sMessages"
          :key="message.id"
          :data-idx="idx"
        >
          <MessageCard @confirm="() => onConfirm(message)" :message="message" />
        </li>
      </transition-group>
    </div>
    <div v-else class="flex items-center justify-center w-full h-full">
      <div class="text-large">
        <p>まだ問題がありません</p>
      </div>
    </div>
  </div>
  <div v-else class="w-full h-full">
    <Spinner />
  </div>
</template>
<script lang="ts">
import { ref, computed, onMounted, defineComponent } from 'vue';
import { Message } from '../../types';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import Paginator from '../../components/Paginator.vue';
import Spinner from '../../components/Spinner.vue';
import axios from 'axios';
import gsap from 'gsap';
import MessageCard from '../../components/MessageCard.vue';
import SearchWindow from '../../components/SearchWindow.vue';
export default defineComponent({
  name: 'MessageShowPage',
  components: { Spinner, SearchWindow, MessageCard, Paginator },
  setup() {
    const store = useStore();
    const isLoading = ref(true);
    const page = ref(1);
    const router = useRouter();
    const unconfirmed = ref(0);
    const search = ref('');
    const messages = ref<Message[]>([]);
    const fMessages = ref<Message[]>([]);
    const user = computed(() => {
      return store.state.user;
    });
    const sMessages = computed(() => {
      if (fMessages.value.length > 0) {
        return fMessages.value.slice((page.value - 1) * 15, page.value * 15);
      } else {
        return [];
      }
    });
    const lastPage = computed(() => {
      return Math.floor(fMessages.value.length / 15) + 1;
    });
    const showAllMessages = () => {
      fMessages.value = messages.value;
    };
    const onChangeSearch = (payload: string) => {
      search.value = payload;
    };
    const filterNewMessages = () => {
      fMessages.value = messages.value.filter((el) => {
        return el.is_confirmed === 0;
      });
    };
    const filterMessages = () => {
      fMessages.value = messages.value.filter((el) => {
        return el.title.includes(search.value);
      });
    };
    onMounted(async () => {
      if (!user.value) {
        router.push('/');
      }
      try {
        const { data, status } = await axios.get('/messages');
        if (status === 200) {
          messages.value = data.messages;
          fMessages.value = data.messages;
          let result = 0;
          messages.value.forEach((el) => {
            if (!el.is_confirmed) {
              result += 1;
            }
          });
          unconfirmed.value = result;
          isLoading.value = false;
        }
      } catch (e) {
        console.log(e);
      }
    });
    const onConfirm = async (message: Message) => {
      let linkTo = '';
      const { link_type, link_data } = message;
      if (link_type === 'comment') {
        const { section_id, question_id } = JSON.parse(link_data);
        linkTo = `/section/${section_id}/question/${question_id}/comment`;
      }
      router.push(linkTo);
      if (!message.is_confirmed) {
        const { status } = await axios.put(`/messages/${message.id}`);
        if (status !== 200) {
          store.dispatch('setModal', {
            type: 'error',
            messages: ['不明なエラーが発生しました'],
          });
        } else {
          store.dispatch('decreaseUnconfirmed');
        }
      }
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
      messages,
      beforeEnter,
      enter,
      isLoading,
      sMessages,
      fMessages,
      page,
      lastPage,
      onConfirm,
      unconfirmed,
      user,
      search,
      showAllMessages,
      onChangeSearch,
      filterNewMessages,
      filterMessages,
    };
  },
});
</script>
