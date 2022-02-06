<template>
  <div data-testid="login-page" class="flex flex-col items-center h-full">
    <div>
      <h1 class="mt-5 text-4xl font-bold text-gray-700 mb-7">ログイン</h1>
    </div>
    <div class="w-1/3 p-5 bg-gray-700 rounded pr-7">
      <Input
        id="email"
        name="メールアドレス"
        @custom-input="onChangeEmail"
        :modelValue="form.email"
        :error="errors.email"
      />
      <Input
        id="password"
        name="パスワード"
        @custom-input="onChangePassword"
        :modelValue="form.password"
        :error="errors.password"
      />
      <div class="flex justify-center mt-5">
        <button
          data-testid="login-button"
          class="mr-2 btn btn-primary"
          @click="onLogin"
          v-if="!isCalling"
          :disabled="disabled"
        >
          投稿する
        </button>
        <button
          data-testid="logingin-message"
          class="mr-2 btn btn-primary"
          v-else
        >
          投稿中…
        </button>
        <router-link to="register"
          ><button class="btn btn-sub-white">新規登録</button></router-link
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, reactive, watch, computed, defineComponent } from 'vue';
import Input from '../../components/Input.vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
export default defineComponent({
  name: 'LoginPage',
  components: { Input },
  setup() {
    const router = useRouter();
    const store = useStore();
    const form = reactive({
      email: '',
      password: '',
    });
    const errors = reactive({
      email: ['メールアドレスが未入力です'],
      password: ['パスワードが未入力です'],
    });
    const isCalling = ref(false);
    const onChangeEmail = (payload: string) => {
      form.email = payload;
    };
    const onChangePassword = (payload: string) => {
      form.password = payload;
    };
    watch(form, () => {
      const mailReg =
        /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}.[A-Za-z0-9]{1,}$/;
      if (form.email.length === 0) {
        pushToArr(errors.email, 'メールアドレスが未入力です');
      } else {
        deleteFromArr(errors.email, 'メールアドレスが未入力です');
      }
      if (form.email.length > 0 && !mailReg.test(form.email)) {
        pushToArr(errors.email, '正しいメールアドレスを入力して下さい');
      } else {
        deleteFromArr(errors.email, '正しいメールアドレスを入力して下さい');
      }
      if (form.password.length === 0) {
        pushToArr(errors.password, 'パスワードが未入力です');
      } else {
        deleteFromArr(errors.password, 'パスワードが未入力です');
      }
    });
    const pushToArr = (arr: string[], str: string) => {
      if (!arr.includes(str)) {
        arr.push(str);
      }
    };
    const deleteFromArr = (arr: string[], str: string) => {
      if (arr.includes(str)) {
        arr = arr.splice(arr.indexOf(str), 1);
      }
    };
    const disabled = computed(() => {
      return !(errors.email.length === 0 && errors.password.length === 0);
    });
    const onLogin = async () => {
      isCalling.value = true;
      try {
        const {
          data: { user },
          status,
        } = await axios.post('login', form);
        isCalling.value = false;
        if (status === 200 && user) {
          store.dispatch('setUser', user);
          router.push('/');
          const messages = [`おかえりなさい、${user.first_name}さん。`];
          if (user.role.id === 1) {
            messages.push('管理者権限でログインしました。');
          }
          if (user.unconfirmed_messages > 0) {
            messages.push(
              `${user.unconfirmed_messages}個の未読メッセージがあります`
            );
          }
          store.dispatch('setModal', {
            type: 'notification',
            messages: messages,
            cbAfter:
              user.unconfirmed_messages > 0
                ? () => store.dispatch('toggleDropDown', true)
                : null,
          });
        }
      } catch (e) {
        if (e.response.status === 401) {
          store.dispatch('setModal', {
            type: 'error',
            messages: ['メールアドレスかパスワードが違います'],
          });
        } else {
          store.dispatch('setModal', {
            type: 'error',
            messages: ['不明なエラーです'],
          });
        }
        isCalling.value = false;
      }
    };
    return {
      form,
      onChangeEmail,
      onChangePassword,
      onLogin,
      disabled,
      errors,
      isCalling,
    };
  },
});
</script>
