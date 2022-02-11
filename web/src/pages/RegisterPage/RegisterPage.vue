<template>
  <div data-testid="register-page" class="flex flex-col items-center mb-5">
    <div>
      <h1 class="mt-5 text-4xl font-bold text-gray-700 mb-7">新規登録</h1>
    </div>
    <div class="w-1/3 p-5 bg-front rounded pr-7">
      <Input
        id="first-name"
        name="名字"
        @custom-input="onChangeFirstName"
        :modelValue="form.first_name"
        :error="errors.first_name"
      />
      <Input
        id="last-name"
        name="名前"
        @custom-input="onChangeLastName"
        :modelValue="form.last_name"
        :error="errors.last_name"
      />
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
          data-testid="register-button"
          class="mr-2 btn btn-primary"
          @click="onRegister"
          :disabled="disabled"
        >
          投稿する
        </button>
        <button
          v-else
          data-testid="registering-message"
          class="mr-2 btn btn-primary"
          disabled="true"
        >
          投稿中...
        </button>
        <router-link to="login"
          ><button class="btn btn-sub-white">ログイン</button></router-link
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { reactive, watch, ref, computed, defineComponent } from 'vue';
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
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password_confirm: '',
    });
    const errors = reactive({
      first_name: ['名字が未入力です'],
      last_name: ['名前が未入力です'],
      email: ['メールアドレスが未入力です'],
      password: ['パスワードが未入力です'],
      password_confirm: ['パスワード確認が未入力です'],
    });
    const isCalling = ref(false);
    const onChangeFirstName = (payload: string) => {
      form.first_name = payload;
    };
    const onChangeLastName = (payload: string) => {
      form.last_name = payload;
    };
    const onChangeEmail = (payload: string) => {
      form.email = payload;
    };
    const onChangePassword = (payload: string) => {
      form.password = payload;
    };
    const onChangePasswordConfirm = (payload: string) => {
      form.password_confirm = payload;
    };
    watch(form, () => {
      if (form.first_name.length === 0) {
        pushToArr(errors.first_name, '名字が未入力です');
      } else {
        deleteFromArr(errors.first_name, '名字が未入力です');
      }
      if (form.first_name.length > 12) {
        pushToArr(errors.first_name, '名字は12字以内です');
      } else {
        deleteFromArr(errors.first_name, '名字は12字以内です');
      }
      if (form.last_name.length === 0) {
        pushToArr(errors.last_name, '名前が未入力です');
      } else {
        deleteFromArr(errors.last_name, '名前が未入力です');
      }
      if (form.last_name.length > 12) {
        pushToArr(errors.last_name, '名前は12字以内です');
      } else {
        deleteFromArr(errors.last_name, '名前は12字以内です');
      }
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
    const onRegister = async () => {
      isCalling.value = true;
      try {
        const {
          status,
          data: { user },
        } = await axios.post('register', form);
        if (user && status === 201) {
          router.push('/login');
          store.dispatch('setModal', {
            type: 'notification',
            messages: ['登録が完了しました'],
          });
        }
      } catch (e) {
        if (e.response.status === 409) {
          store.dispatch('setModal', {
            type: 'error',
            messages: ['そのメールアドレスは既に使われています'],
          });
        } else {
          store.dispatch('setModal', {
            type: 'error',
            messages: ['不明なエラーです'],
          });
        }
      }
      isCalling.value = false;
    };
    const disabled = computed(() => {
      return !(
        errors.first_name.length === 0 &&
        errors.last_name.length === 0 &&
        errors.email.length === 0 &&
        errors.password.length === 0 &&
        errors.password_confirm.length === 0
      );
    });
    return {
      form,
      onChangeFirstName,
      onChangeLastName,
      onChangeEmail,
      onChangePassword,
      onChangePasswordConfirm,
      errors,
      disabled,
      isCalling,
      onRegister,
    };
  },
});
</script>
