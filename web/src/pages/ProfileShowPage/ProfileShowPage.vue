<template>
  <div v-if="user" class="outerFormContainer" data-testid="profile-page">
    <div>
      <h1 class="titleContainer">プロフィール</h1>
    </div>
    <div class="formContainer">
      <div class="my-5">
        <p class="mb-3">
          名前：<span data-testid="user-firstname">
            {{ user.first_name }}
          </span>
          <span class="ml-3" data-testid="user-lastname">
            {{ user.last_name }}
          </span>
          <span v-if="user.role.id === 1" data-testid="user-isadmin">
            (管理者)
          </span>
          <span v-else data-testid="user-isadmin">(一般ユーザー)</span>
        </p>
        <p class="mb-3">
          メールアドレス：<span data-testid="user-email">
            {{ user.email }}
          </span>
        </p>
        <p class="mb-3" data-testid="user-created-at">
          登録日：{{ user.created_at }}
        </p>
        <p class="mb-3" data-testid="user-updated-at">
          更新日：{{ user.updated_at }}
        </p>
      </div>
      <div class="flex justify-end">
        <router-link to="/">
          <button class="mr-2 btn btn-sub-white">戻る</button>
        </router-link>
        <router-link to="/profile_edit">
          <button class="btn btn-primary">編集</button>
        </router-link>
      </div>
    </div>
  </div>
  <div v-else data-testid="profile-page">
    <Spinner />
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import Spinner from '../../components/Spinner.vue';
export default defineComponent({
  name: 'ProfileShowPage',
  components: {
    Spinner,
  },
  setup() {
    const store = useStore();
    const user = computed(() => {
      if (store.state.user) {
        return store.state.user;
      } else {
        return null;
      }
    });
    return {
      user,
    };
  },
});
</script>
