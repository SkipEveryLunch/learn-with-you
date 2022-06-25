<template>
  <div
    data-testid="modal"
    class="
      fixed
      z-20
      flex
      items-center
      justify-center
      w-full
      h-full
      transition-opacity
      bg-gray-900 bg-opacity-40
    "
  >
    <transition name="modalbox" appear>
      <div class="modal">
        <div class="py-2 pl-5 text-gray-100 bg-blue-500 dark:bg-blue-700">
          通知
        </div>
        <div class="p-5">
          <p>このポートフォリオを</p>
          <p>御覧頂きありがとうございます。</p>
          <p>テストユーザーとしてログインしますか？</p>
        </div>
        <div class="flex justify-end mr-3">
          <button
            class="mr-1 btn btn-primary"
            data-testid="modal-yes-button"
            @click="onTestLogin"
          >
            はい
          </button>
          <button
            class="btn btn-sub-white"
            data-testid="modal-no-button"
            @click="onClose"
          >
            いいえ
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import { useRouter } from 'vue-router';
export default defineComponent({
  name: 'ModalForTestLogin',
  setup() {
    const store = useStore();
    const router = useRouter();
    const onClose = () => {
      store.dispatch('toggleModalForTestLogin', false);
    };
    const onTestLogin = async () => {
      const {
        data: { user },
        status,
      } = await axios.post('test_login');
      if (status === 200 && user) {
        router.push('/');
        store.dispatch('setUser', user);
        onClose();
        const messages = [`おかえりなさい、${user.first_name}さん。`];
        if (user.role.id === 1) {
          messages.push('管理者権限でログインしました。');
        }
        if (user.unconfirmed_messages > 0) {
          messages.push(
            `${user.unconfirmed_messages}個の未読メッセージがあります`
          );
        }
        setTimeout(() => {
          store.dispatch('setModal', {
            type: 'notification',
            messages: messages,
            cbAfter:
              user.unconfirmed_messages > 0
                ? () => store.dispatch('toggleDropDown', true)
                : null,
          });
        }, 500);
      }
    };
    return {
      onClose,
      onTestLogin,
    };
  },
});
</script>
<style scoped>
.modalbox-enter-from {
  transform: translateY(-30px);
}
.modalbox-enter-to {
  transform: translateY(0);
}
.modalbox-enter-active {
  transition: all 0.25s ease;
}
</style>
