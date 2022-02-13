<template>
  <div
    class="
      flex flex-col
      h-screen
      bg-gray-300
      dark:bg-gray-500
      text-gray-700
      dark:text-normal;
    "
  >
    <transition name="modal" appear>
      <Modal v-if="modal" :modal="modal" />
    </transition>
    <transition name="modal" appear>
      <ModalForTestLogin v-if="modalForTestLogin" />
    </transition>
    <transition name="modal" appear>
      <CommentModal
        v-if="commentModal"
        :questionId="commentModal.questionId"
        :mode="commentModal.modalMode"
      />
    </transition>
    <Header />
    <div class="h-full overflow-y-scroll">
      <router-view />
    </div>
  </div>
</template>
<script lang="ts">
import Header from './Header/Header.vue';
import Modal from './Modal.vue';
import ModalForTestLogin from './ModalForTestLogin.vue';
import CommentModal from './CommentModal.vue';
import axios from 'axios';
import { onMounted, computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
export default defineComponent({
  name: 'Wrapper',
  components: {
    Header,
    Modal,
    ModalForTestLogin,
    CommentModal,
  },
  setup() {
    const store = useStore();
    const modal = computed(() => {
      if (store.state.modal) {
        return store.state.modal;
      } else {
        return null;
      }
    });
    const modalForTestLogin = computed(() => {
      return store.state.modalForTestLogin;
    });
    const commentModal = computed(() => {
      if (store.state.commentModal) {
        return store.state.commentModal;
      } else {
        return null;
      }
    });
    onMounted(async () => {
      try {
        const {
          data: { user },
        } = await axios.get('current_user');
        store.dispatch('setUser', user);
      } catch (e) {
        // await router.push('/login');
        store.dispatch('discardUser');
        store.dispatch('toggleModalForTestLogin', true);
      }
    });
    return {
      modal,
      commentModal,
      modalForTestLogin,
    };
  },
});
</script>
<style scoped>
.modal-enter-from {
  opacity: 0;
}
.modal-enter-active {
  transition: all 0.25s ease;
}
.modal-leave-to {
  opacity: 0;
}
.modal-leave-active {
  transition: all 0.25s ease;
}
</style>
