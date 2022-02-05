<template>
  <div>
    <div
      v-if="user"
      data-testid="question-submit-page"
      class="flex flex-col items-center"
    >
      <div>
        <h1 class="mt-5 text-3xl font-bold text-gray-700 mb-7">問題の投稿</h1>
      </div>
      <div class="w-1/3 p-5 bg-gray-700 rounded pr-7">
        <TextArea
          row="4"
          id="front"
          name="問題"
          @custom-input="onChangeFront"
          :modelValue="form.front"
          :error="errors.front"
        />
        <TextArea
          row="4"
          id="back"
          name="解答"
          @custom-input="onChangeBack"
          :modelValue="form.back"
          :error="errors.back"
        />
        <div class="flex justify-center mt-5">
          <button
            v-if="!isCalling"
            data-testid="submit-button"
            class="btn btn-primary"
            @click="onSubmit"
            :disabled="disabled"
          >
            投稿
          </button>
          <button
            v-else
            data-testid="submitting-message"
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
    <div data-testid="not-found-message"></div>
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
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import TextArea from '../../components/TextArea.vue';
import axios from 'axios';
export default defineComponent({
  name: 'QuestionSubmitPage',
  components: { TextArea },
  setup() {
    const router = useRouter();
    const store = useStore();
    const route = useRoute();
    const form = reactive({
      front: '',
      back: '',
      section_id: '',
    });
    const errors = reactive({
      front: ['問題が未入力です'],
      back: ['解答が未入力です'],
    });
    const isCalling = ref(false);
    const onChangeFront = (payload) => {
      form.front = payload;
    };
    const onChangeBack = (payload) => {
      form.back = payload;
    };
    const user = computed(() => {
      return store.state.user;
    });
    onMounted(() => {
      if (!store.state.user) {
        router.push('/login');
      } else {
        form.section_id = route.params.sectionId;
      }
    });
    watch(form, () => {
      if (form.front.length === 0) {
        pushToArr(errors.front, '問題が未入力です');
      } else {
        deleteFromArr(errors.front, '問題が未入力です');
      }
      if (form.front.length > 100) {
        pushToArr(errors.front, '問題は100字以内です');
      } else {
        deleteFromArr(errors.front, '問題は100字以内です');
      }
      if (form.back.length === 0) {
        pushToArr(errors.back, '解答が未入力です');
      } else {
        deleteFromArr(errors.back, '解答が未入力です');
      }
      if (form.back.length > 180) {
        pushToArr(errors.back, '解答は180字以内です');
      } else {
        deleteFromArr(errors.back, '解答は180字以内です');
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
    const onSubmit = async () => {
      isCalling.value = true;
      try {
        const { status } = await axios.post('questions', form);
        if (status === 201) {
          isCalling.value = false;
          form.front = '';
          form.back = '';
          store.dispatch('setModal', {
            type: 'notification',
            messages: ['新しい問題を作成しました'],
          });
        } else {
          store.dispatch('setModal', {
            type: 'error',
            messages: ['不明なエラーです'],
          });
        }
      } catch (e) {
        store.dispatch('setModal', {
          type: 'error',
          messages: ['不明なエラーです'],
        });
      }
    };
    const disabled = computed(() => {
      return !(errors.front.length === 0 && errors.back.length === 0);
    });
    const goBack = () => {
      if (form.front.length > 0 || form.back.length > 0) {
        store.dispatch('setModal', {
          type: 'caution',
          messages: ['戻ると編集内容は破棄されます'],
          cb: {
            name: '破棄して戻る',
            cb: () => {
              router.push(`/section/${route.params.sectionId}/edit`);
              store.dispatch('discardModal');
            },
          },
        });
      } else {
        router.push(`/section/${route.params.sectionId}/edit`);
      }
    };
    return {
      user,
      form,
      onChangeFront,
      onChangeBack,
      errors,
      disabled,
      isCalling,
      onSubmit,
      goBack,
    };
  },
});
</script>
