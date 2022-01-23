<template>
  <div data-testid="password-edit-page" class="flex flex-col items-center">
    <div>
      <h1 class="mt-5 text-3xl font-bold text-gray-700 mb-7">パスワード変更</h1>
    </div>
    <div class="w-1/3 p-5 bg-gray-700 rounded pr-7">
      <Input
        id="password"
        name="パスワード"
        @custom-input="onChangePassword"
        :modelValue="form.password"
        :error="errors.password"
      />
      <Input
        id="password-confirm"
        name="パスワード(確認)"
        @custom-input="onChangePasswordConfirm"
        :modelValue="form.password_confirm"
        :error="errors.password_confirm"
      />
      <div class="flex justify-center mt-5">
        <button
          v-if="!isCalling"
          data-testid="update-button"
          class="btn btn-primary"
          @click="onUpdate"
          :disabled="disabled"
        >
          投稿
        </button>
        <button
          v-else
          data-testid="updating-message"
          class="btn btn-primary"
          disabled="true"
        >
          投稿中...
        </button>
        <button
          data-testid="goback-button"
          class="ml-2 btn btn-sub-white"
          @click="goBack"
        >
          戻る
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive, watch, ref, computed, onMounted } from 'vue';
import Input from '../../components/Input.vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
export default {
  name: 'LoginPage',
  components: { Input },
  setup() {
    const router = useRouter();
    const store = useStore();
    const form = reactive({
      password: '',
      password_confirm: '',
    });
    const errors = reactive({
      password: ['パスワードが未入力です'],
      password_confirm: ['パスワード確認が未入力です'],
    });
    const isCalling = ref(false);
    const onChangePassword = (payload) => {
      form.password = payload;
    };
    const onChangePasswordConfirm = (payload) => {
      form.password_confirm = payload;
    };
    watch(form, () => {
      if (form.password.length === 0) {
        pushToArr(errors.password, 'パスワードが未入力です');
      } else {
        deleteFromArr(errors.password, 'パスワードが未入力です');
      }
      if (form.password_confirm.length === 0) {
        pushToArr(errors.password_confirm, 'パスワード確認が未入力です');
      } else {
        deleteFromArr(errors.password_confirm, 'パスワード確認が未入力です');
      }
      if (form.password !== form.password_confirm) {
        pushToArr(errors.password_confirm, 'パスワードと違います');
      } else {
        deleteFromArr(errors.password_confirm, 'パスワードと違います');
      }
    });
    const pushToArr = (arr, str) => {
      if (!arr.includes(str)) {
        arr.push(str);
      }
    };
    const deleteFromArr = (arr, str) => {
      if (arr.includes(str)) {
        arr = arr.splice(arr.indexOf(str), 1);
      }
    };
    onMounted(() => {
      if (!store.state.user) {
        router.push('/login');
      }
    });
    const onUpdate = async () => {
      isCalling.value = true;
      try {
        await axios.put('password_update', { password: form.password });
      } catch (e) {
        console.log(e);
      }
      isCalling.value = false;
    };
    const disabled = computed(() => {
      return !(
        errors.password.length === 0 && errors.password_confirm.length === 0
      );
    });
    const goBack = () => {
      if (form.password.length > 0 || form.password_confirm.length > 0) {
        store.dispatch('setModal', {
          type: 'caution',
          messages: ['戻ると編集内容は破棄されます。', '破棄して戻りますか？'],
          cb: {
            name: '戻る',
            cb: () => {
              router.push('/');
              store.dispatch('discardModal');
            },
          },
        });
      } else {
        router.push('/');
      }
    };
    return {
      form,
      onChangePassword,
      onChangePasswordConfirm,
      errors,
      disabled,
      isCalling,
      onUpdate,
      goBack,
    };
  },
};
</script>
