<template>
  <div class="w-full h-full">
    <div v-if="user" class="w-full h-full">
      <router-view />
    </div>
    <div v-else></div>
  </div>
</template>
<script lang="ts">
import { computed, onMounted, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
export default defineComponent({
  name: 'Authorization',
  setup() {
    const store = useStore();
    const user = computed(() => {
      return store.state.user;
    });
    const router = useRouter();
    onMounted(async () => {
      if (!user.value) {
        store.dispatch('setModal', {
          type: 'error',
          messages: ['ログインが必要です'],
        });
        router.push('/');
      }
    });
    return { user };
  },
});
</script>
