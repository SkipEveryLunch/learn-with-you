<template>
  <div class="card" data-testId="message-card">
    <div class="flex flex-col w-full p-3">
      <div class="flex items-center mb-1">
        <div>
          <span class="text-2xl">
            {{ message.title }}
          </span>
        </div>
        <div class="ml-1" v-if="!message.is_confirmed">
          <span class="px-1 text-xs text-yellow-700 bg-yellow-300 rounded-sm">
            new!</span
          >
        </div>
      </div>
      <div class="text-base">
        <p>{{ message.body }}</p>
      </div>
    </div>
    <div class="flex flex-col justify-between w-1/4 h-full p-2">
      <div class="text-sm text-right">
        受信日：{{ message.created_at.slice(0, 10) }}
      </div>
      <div class="flex justify-end mt-5">
        <button @click="onConfirm" class="mr-2 btn btn-primary">
          確認する
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Message } from '../types';
import { defineComponent } from 'vue';
interface MessageCardProps {
  message: Message;
}
export default defineComponent({
  name: 'MessageCard',
  props: ['message'],
  emits: ['confirm'],
  setup(props: MessageCardProps, { emit }) {
    const onConfirm = () => {
      emit('confirm');
    };
    return { onConfirm };
  },
});
</script>
<style scoped>
.card {
  @apply flex p-2 mb-2 text-gray-100 bg-gray-700 rounded;
  min-height: 120px;
}
</style>
