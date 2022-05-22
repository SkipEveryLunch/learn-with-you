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
          {{ typeName }}
        </div>
        <div class="p-5">
          <p v-for="(msg, idx) in modal.messages" :key="idx">{{ msg }}</p>
        </div>
        <div class="flex justify-end mr-3" v-if="modal.cb">
          <button
            v-if="modal.cb"
            class="mr-1 btn btn-primary"
            data-testid="modal-yes-button"
            @click="modal.cb.cb"
          >
            {{ modal.cb.name }}
          </button>
          <button
            class="btn btn-sub-white"
            data-testid="modal-no-button"
            @click="onClose"
          >
            いいえ
          </button>
        </div>
        <div v-else class="flex justify-end mr-3">
          <button
            class="btn btn-primary"
            data-testid="modal-button"
            @click="onClose"
          >
            閉じる
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>
<script lang="ts">
import { onMounted, onUnmounted, computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { Modal } from '../types';
interface ModalProps {
  modal: Modal;
}
export default defineComponent({
  name: 'Modal',
  props: ['modal'],
  setup(props: ModalProps) {
    const store = useStore();
    const onClose = () => {
      store.dispatch('discardModal');
    };
    const typeName = computed(() => {
      switch (props.modal.type) {
        case 'notification':
          return '通知';
        case 'caution':
          return '注意';
        case 'error':
          return 'エラー';
        default:
          return '';
      }
    });
    onMounted(() => {
      if (!props.modal.cb) {
        setTimeout(() => {
          store.dispatch('discardModal');
        }, 2000);
      }
    });
    onUnmounted(() => {
      if (props.modal.cbAfter) {
        props.modal.cbAfter();
      }
    });
    return {
      onClose,
      typeName,
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
.modal {
  @apply flex flex-col pb-3 bg-gray-100 rounded-md text-gray-700;
  width: 300px;
  overflow: hidden;
}
</style>
