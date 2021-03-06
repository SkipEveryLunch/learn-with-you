<template>
  <div data-testid="password-edit-page" class="outerFormContainer">
    <div>
      <h1 class="titleContainer">パスワード変更</h1>
    </div>
    <div class="formContainer">
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
<script lang="ts">
import {
  reactive,
  watch,
  ref,
  computed,
  onMounted,
  defineComponent,
} from 'vue';
import Input from '../../components/Input.vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { pushToArr, deleteFromArr } from '../../helper';
export default defineComponent({
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
    const onChangePassword = (payload: string) => {
      form.password = payload;
    };
    const onChangePasswordConfirm = (payload: string) => {
      form.password_confirm = payload;
    };
    const user = computed(() => {
      return store.state.user;
    });
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
    onMounted(() => {
      if (!store.state.user) {
        router.push('/login');
      }
    });
    const onUpdate = async () => {
      if (user.value.is_test_user) {
        store.dispatch('setModal', {
          type: 'caution',
          messages: ['テストユーザーはパスワードを', '変更できません'],
        });
      } else {
        isCalling.value = true;
        try {
          const { status } = await axios.put('password_update', {
            password: form.password,
          });
          if (status === 202) {
            store.dispatch('setModal', {
              type: 'notification',
              messages: ['変更しました'],
            });
          } else {
            store.dispatch('setModal', {
              type: 'notification',
              messages: ['不明なエラーです'],
            });
          }
        } catch (e) {
          store.dispatch('setModal', {
            type: 'caution',
            messages: ['不明なエラーです'],
          });
        }
        isCalling.value = false;
      }
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
});
</script>
