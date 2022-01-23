<template>
  <div v-if="!isLoading" class="flex h-full">
    <div class="flex flex-col w-1/3 px-4 py-3">
      <div
        class="pt-2 pb-3 text-4xl font-bold text-gray-700 cursor-pointer w-max"
        @click="showAllMessages"
      >
        メッセージ一覧
        <p class="text-lg">
          <span class="mr-3">全{{ messages.length }}件</span>
          <span data-testid="unconfirmed">うち{{ unconfirmed }}件未読</span>
        </p>
      </div>
      <div class="flex pr-1 mt-1 mb-2">
        <SearchBox
          @on-submit="filterNewMessages"
          @on-input="onChangeSearch"
          :modelValue="search"
        />
      </div>
      <div class="flex flex-col ml-2">
        <div class="sideRow" @click="filterNewMessages">
          <p>未読のメッセージ</p>
        </div>
        <div class="sideRow">
          <router-link data-testid="section-submit-link" to="/"
            ><p>戻る</p></router-link
          >
        </div>
      </div>
    </div>
    <div v-if="fMessages.length > 0" class="w-full">
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
      <div class="text-lg">
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
import SearchBox from '../../components/SearchBox.vue';
export default defineComponent({
  name: 'MessageShowPage',
  components: { Spinner, SearchBox, MessageCard, Paginator },
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
