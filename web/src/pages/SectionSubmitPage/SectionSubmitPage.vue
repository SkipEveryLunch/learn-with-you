<template>
  <div class="flex flex-col items-center">
    <div>
      <h1 class="mt-5 text-3xl font-bold text-gray-700 mb-7">
        セクションの投稿
      </h1>
    </div>
    <div
      data-testid="section-submit-page"
      v-if="user"
      class="w-1/3 p-5 bg-front rounded pr-7"
    >
      <Input
        id="title"
        name="タイトル"
        @custom-input="onChangeTitle"
        :modelValue="form.title"
        :error="errors.title"
      />
      <TextArea
        id="description"
        row="4"
        name="説明文"
        @custom-input="onChangeDescription"
        :modelValue="form.description"
        :error="errors.description"
      />
      <div class="flex flex-col mb-3">
        <label class="mb-2 text-md">シリーズ名:</label>
        <select class="formInput" v-model="form.series_id">
          <option
            v-for="aSeries in series"
            :key="aSeries.id"
            :value="aSeries.id"
          >
            {{ aSeries.name }}
          </option>
        </select>
      </div>

      <div class="flex justify-center mt-7">
        <div class="flex">
          <button
            data-testid="submit-button"
            class="mr-2 btn btn-primary"
            @click="onSubmit"
            v-if="!isCalling"
            :disabled="disabled"
          >
            投稿
          </button>
          <button
            data-testid="submiting-message"
            class="mr-2 btn btn-primary"
            v-else
          >
            投稿中…
          </button>
          <router-link to="/">
            <button class="btn btn-sub-white">戻る</button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  ref,
  reactive,
  watch,
  computed,
  onMounted,
  defineComponent,
} from 'vue';
import Input from '../../components/Input.vue';
import TextArea from '../../components/TextArea.vue';
import axios from 'axios';
import { Series } from '../../types';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
export default defineComponent({
  name: 'LoginPage',
  components: { Input, TextArea },
  setup() {
    const router = useRouter();
    const store = useStore();
    const series = ref<Series[]>([]);
    const form = reactive({
      title: '',
      description: '',
      series_id: '',
    });
    const errors = reactive({
      title: ['タイトルが未入力です'],
      description: ['説明文が未入力です'],
    });
    const isCalling = ref(false);
    const onChangeTitle = (payload: string) => {
      form.title = payload;
    };
    const onChangeDescription = (payload: string) => {
      form.description = payload;
    };
    watch(form, () => {
      if (form.title.length === 0) {
        pushToArr(errors.title, 'タイトルが未入力です');
      } else {
        deleteFromArr(errors.title, 'タイトルが未入力です');
      }
      if (form.title.length > 25) {
        pushToArr(errors.title, 'タイトルは25字以内です');
      } else {
        deleteFromArr(errors.title, 'タイトルは25字以内です');
      }
      if (form.description.length === 0) {
        pushToArr(errors.description, '説明文が未入力です');
      } else {
        deleteFromArr(errors.description, '説明文が未入力です');
      }
      if (form.description.length > 100) {
        pushToArr(errors.description, '説明文は100字以内です');
      } else {
        deleteFromArr(errors.description, '説明文は100字以内です');
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
      return !(errors.title.length === 0);
    });
    const user = computed(() => {
      return store.state.user;
    });
    onMounted(async () => {
      if (!user.value) {
        store.dispatch('setModal', {
          type: 'error',
          messages: ['実行するにはログインしてください'],
        });
        router.push('/login');
      } else {
        const { data, status } = await axios.get('series');
        if (status === 200) {
          if (data.series.length > 0) {
            series.value = data.series;
            form.series_id = data.series[0].id;
          }
        }
      }
    });
    const onSubmit = async () => {
      isCalling.value = true;
      try {
        const {
          data: { section },
          status,
        } = await axios.post('sections', form);
        isCalling.value = false;
        if (status === 201 && section) {
          store.dispatch('setUser', section);
          router.push('/');
          store.dispatch('setModal', {
            type: 'notification',
            messages: ['セクションを作成しました'],
          });
        }
      } catch (e) {
        if (e.response.status === 401) {
          store.dispatch('setModal', {
            type: 'error',
            messages: ['投稿はログインしないとできません'],
          });
        } else if (e.response.status === 409) {
          store.dispatch('setModal', {
            type: 'error',
            messages: ['既に登録されているタイトルです'],
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
      onChangeTitle,
      onChangeDescription,
      onSubmit,
      disabled,
      errors,
      isCalling,
      user,
      series,
    };
  },
});
</script>
<style scoped>
.formInput {
  @apply w-full px-2 py-1 mx-2 border 
  text-gray-700 border-gray-700 rounded focus:outline-none focus:border-blue-400;
}
</style>
