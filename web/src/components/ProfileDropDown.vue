<template>
  <div
    data-testid="profile-dropdown"
    class="absolute right-0 z-10 text-black bg-gray-100 border border-gray-400 rounded shadow-sm  top-full w-max"
    v-click-away="() => toggleDropDown(false)"
  >
    <ul>
      <li
        @click="goTo('/message_show')"
        :class="`flex
        items-center justify-between
        ${unconfirmedMessages > 0 ? 'shinyProfileList' : 'profileList'}`"
      >
        <div>
          <span data-testid="message-link"> メッセージを見る </span>
        </div>
        <div class="unconfirmedNotion" v-if="unconfirmedMessages > 0">
          {{ unconfirmedMessages }}
        </div>
      </li>
      <li @click="goTo('/profile_show')" class="profileList">
        <span data-testid="profile-link"> プロフィールを見る </span>
      </li>
      <li @click="goTo('/profile_edit')" class="profileList">
        <span> プロフィールを編集する </span>
      </li>
      <li @click="goTo('/password_edit')" class="profileList">
        <span> パスワードを変更する </span>
      </li>
      <li data-testid="logout-button" @click="onLogout" class="profileList">
        ログアウトする
      </li>
    </ul>
  </div>
</template>
<script>
import axios from 'axios';
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
export default {
  name: 'ProfileDropDown',
  props: ['toggleDropDown'],
  setup(props) {
    const router = useRouter();
    const store = useStore();
    const unconfirmedMessages = computed(() => {
      return store.state.unconfirmed;
    });
    const goTo = (path) => {
      props.toggleDropDown(false);
      router.push(path);
    };
    const onLogout = async () => {
      store.dispatch('setModal', {
        type: 'caution',
        messages: ['ログアウトしますか？'],
        cb: {
          name: 'はい',
          cb: async () => {
            store.dispatch('discardModal');
            try {
              const { data } = await axios.delete('logout');
              props.toggleDropDown(false);
              store.dispatch('discardUser', data);
              router.push('/');
              store.dispatch('setModal', {
                type: 'notification',
                messages: ['ログアウトしました'],
              });
            } catch (e) {
              console.log(e);
            }
          },
        },
      });
    };
    return {
      unconfirmedMessages,
      onLogout,
      goTo,
    };
  },
};
</script>
<style scoped>
.profileList {
  @apply w-full border-b pl-2 mr-4 py-2 text-gray-800 text-base hover:bg-gray-300 cursor-pointer;
}
.shinyProfileList {
  @apply w-full border-b pl-2 mr-4 py-2  relative text-gray-800 text-base hover:bg-gray-300 cursor-pointer overflow-hidden;
}
.shinyProfileList::after {
  content: '';
  position: absolute;
  top: -10%;
  left: -20%;
  width: 40px;
  height: 100%;
  transform: scale(2) rotate(20deg);
  background-image: linear-gradient(
    100deg,
    rgba(255, 255, 255, 0) 10%,
    rgba(255, 214, 79, 0.4) 100%,
    rgba(255, 255, 255, 0) 0%
  );
  animation: shining 1s infinite;
}
.unconfirmedNotion {
  @apply text-yellow-700 bg-yellow-300 mr-2 text-center text-xs rounded-full w-4;
}
@keyframes shining {
  0% {
    left: -20%;
  }
  100% {
    left: 120%;
  }
}
</style>
