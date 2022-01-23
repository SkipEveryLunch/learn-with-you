<template>
  <div data-testid="register-page" class="flex flex-col items-center">
    <div>
      <h1 class="mt-5 text-3xl font-bold text-gray-700 mb-7">
        プロフィール編集
      </h1>
    </div>
    <div class="w-1/3 p-5 bg-gray-700 rounded pr-7">
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
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import Input from '../../components/Input.vue';
import axios from 'axios';
export default {
  name: 'LoginPage',
  components: { Input },
  setup() {
    const router = useRouter();
    const store = useStore();
    const form = reactive({
      first_name: '',
      last_name: '',
      email: '',
    });
    const errors = reactive({
      first_name: ['名字が未入力です'],
      last_name: ['名前が未入力です'],
      email: ['メールアドレスが未入力です'],
    });
    const isCalling = ref(false);
    const onChangeFirstName = (payload) => {
      form.first_name = payload;
    };
    const onChangeLastName = (payload) => {
      form.last_name = payload;
    };
    const onChangeEmail = (payload) => {
      form.email = payload;
    };
    const user = computed(() => {
      return store.state.user;
    });
    onMounted(() => {
      if (!store.state.user) {
        router.push('/login');
      }
    });
    watch(user, () => {
      form.first_name = user.value.first_name;
      form.last_name = user.value.last_name;
      form.email = user.value.email;
    });
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
    const onUpdate = async () => {
      isCalling.value = true;
      try {
        const {
          data: { user },
        } = await axios.put('user_update', form);
        await store.dispatch('setUser', user);
        isCalling.value = false;
      } catch (e) {
        console.log(e);
      }
    };
    const goBack = () => {
      if (
        form.first_name.length > 0 ||
        form.last_name.length > 0 ||
        form.email.length > 0
      ) {
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
    const disabled = computed(() => {
      return !(
        errors.first_name.length === 0 &&
        errors.last_name.length === 0 &&
        errors.email.length === 0
      );
    });
    return {
      form,
      onChangeFirstName,
      onChangeLastName,
      onChangeEmail,
      errors,
      disabled,
      isCalling,
      onUpdate,
      goBack,
    };
  },
};
</script>
