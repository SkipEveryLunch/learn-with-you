<template>
  <div
    data-testid="modal"
    class="fixed z-20 flex items-center justify-center w-full h-full transition-opacity bg-gray-900  bg-opacity-40"
    v-if="!isLoading"
  >
    <transition name="modalbox" appear>
      <div class="modal">
        <div class="py-2 pl-5 text-gray-100 bg-blue-700">コメントの投稿</div>
        <div class="flex flex-col m-5">
          <div class="flex flex-col">
            <div>
              <span v-if="mode === 'new'">
                改善要望を以下から選んでください
              </span>
              <span v-else> 以前に投稿した要望を編集・削除しますか？ </span>
            </div>
            <select
              class="border border-gray-300 rounded-sm focus:outline-none"
              v-model="form.comment_type_id"
            >
              <option
                v-for="type in commentTypes"
                :key="type.id"
                :value="type.id"
              >
                {{ type.name }}
              </option>
            </select>
          </div>

          <div class="flex flex-col mt-6">
            <label for="not-proper-detail">詳細を以下にご記入ください</label>
            <textarea
              rows="4"
              class="w-full p-1 border border-gray-300 focus:outline-none"
              id="not-proper-detail"
              v-model="form.comment_detail"
              type="text"
            />
          </div>
          <div class="mt-3">
            <div v-if="mode === 'new'" class="flex justify-center">
              <button
                class="mr-1 btn btn-primary"
                data-testid="modal-yes-button"
                @click="onSubmit"
                :disabled="isDisabled"
              >
                投稿
              </button>
              <button
                class="btn btn-sub-white"
                data-testid="modal-no-button"
                @click="onClose"
              >
                戻る
              </button>
            </div>
            <div v-else class="flex justify-center">
              <button
                class="mr-2 btn btn-primary"
                data-testid="modal-yes-button"
                @click="onEdit"
                :disabled="isDisabled"
              >
                編集
              </button>
              <button
                class="mr-1 btn btn-sub-white"
                data-testid="modal-yes-button"
                @click="onDelete"
              >
                削除
              </button>
              <button
                class="btn btn-sub-white"
                data-testid="modal-no-button"
                @click="onClose"
              >
                戻る
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script lang="ts">
import { reactive, computed, ref, onMounted, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { CommentType } from '../types';
import axios from 'axios';
interface CommentModalProps {
  questionId: number;
  mode: string;
}
export default defineComponent({
  name: 'CommentModal',
  props: ['questionId', 'mode'],
  setup(props: CommentModalProps) {
    const store = useStore();
    const isLoading = ref(true);
    const commentTypes = ref<CommentType[]>([]);
    const onClose = () => {
      store.dispatch('discardCommentModal');
    };
    const form = reactive({
      comment_type_id: null,
      comment_detail: '',
    });
    onMounted(async () => {
      const { data, status } = await axios('comment_types');
      if (status === 200) {
        commentTypes.value = data.comment_types;
        if (props.mode === 'edit') {
          const { status, data } = await axios(
            `questions_comments/${props.questionId}`
          );
          if (status === 200) {
            form.comment_type_id = data.comment.comment_type_id;
            form.comment_detail = data.comment.comment_detail;
          }
        }
        isLoading.value = false;
      }
    });

    const isDisabled = computed(() => {
      return form.comment_type_id === null;
    });
    const onSubmit = async () => {
      try {
        if (props.mode === 'new') {
          const { status } = await axios.post(
            `questions_comments/${props.questionId}`,
            {
              comment_type_id: form.comment_type_id,
              comment_detail:
                form.comment_detail === '' ? 'no detail' : form.comment_detail,
            }
          );
          if (status === 200) {
            store.dispatch('reloadSection');
            onClose();
            store.dispatch('setModal', {
              type: 'notification',
              messages: ['コメントを投稿しました'],
            });
          }
        }
      } catch (e) {
        onClose();
        store.dispatch('setModal', {
          type: 'caution',
          messages: ['投稿されておりません'],
        });
      }
    };
    const onEdit = async () => {
      try {
        if (props.mode === 'edit') {
          const { status } = await axios.put(
            `questions_comments/${props.questionId}`,
            {
              comment_type_id: form.comment_type_id,
              comment_detail:
                form.comment_detail === '' ? 'no detail' : form.comment_detail,
            }
          );
          if (status === 200) {
            onClose();
            store.dispatch('setModal', {
              type: 'notification',
              messages: ['コメントを編集しました'],
            });
          }
        }
      } catch (e) {
        onClose();
        store.dispatch('setModal', {
          type: 'caution',
          messages: ['投稿されておりません'],
        });
      }
    };
    const onDelete = async () => {
      try {
        if (props.mode === 'edit') {
          const { status } = await axios.delete(
            `questions_comments/${props.questionId}`
          );
          if (status === 204) {
            store.dispatch('reloadSection');
            onClose();
            store.dispatch('setModal', {
              type: 'notification',
              messages: ['コメントを削除しました'],
            });
          }
        }
      } catch (e) {
        onClose();
        store.dispatch('setModal', {
          type: 'caution',
          messages: ['投稿されておりません'],
        });
      }
    };
    return {
      onClose,
      form,
      isDisabled,
      onSubmit,
      onEdit,
      onDelete,
      commentTypes,
      isLoading,
    };
  },
});
</script>
<style scoped>
.modalbox-enter-from {
  transform: translateY(-30px);
}
.modalbox-enter-to {
  transform: translateY(0);
}
.modalbox-enter-active {
  transition: all 0.25s ease;
}
.modal {
  @apply flex flex-col  bg-gray-100 rounded-md w-1/4 text-gray-700;
  overflow: hidden;
}
</style>
