<template>
  <nav
    data-testid="header"
    class="
      flex
      justify-between
      items-center
      px-3
      text-large text-normal
      bg-front
    "
  >
    <div class="flex space-x-1">
      <div class="grid place-items-center px-2 py-3">
        <router-link to="/">
          <Logo />
        </router-link>
      </div>
    </div>
    <div class="flex">
      <ToggleDarkButton class="mr-3" />
      <div v-if="name.length === 0">
        <div class="flex flex-col sm:flex-row gap-2 items-center px-2 py-3">
          <router-link
            data-testid="login-link"
            to="/login"
            class="btn btn-sub-white w-full sm:w-max"
            >ログイン</router-link
          >
          <router-link to="/register" class="btn btn-primary"
            >新規登録</router-link
          >
        </div>
      </div>
      <div v-else class="relative flex items-center px-2 py-3">
        <div
          class="flex px-2 rounded-md dark:hover:bg-gray-600 hover:bg-gray-200"
          @click="() => toggleDropDown(!showDropDown)"
          data-testid="profile-menu"
        >
          <div class="py-1 mr-2 cursor-pointer">
            {{ name }}
          </div>
          <div
            class="mt-1 ml-1 text-small flex flex-col justify-center arrow"
            :class="{ up: showDropDown }"
          >
            <font-awesome-icon class="fa-lg" :icon="faChevronDown" />
          </div>
        </div>
        <transition name="dropdown" appear>
          <ProfileDropDown
            v-if="showDropDown"
            :toggleDropDown="toggleDropDown"
          />
        </transition>
      </div>
    </div>
  </nav>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import ProfileDropDown from '../ProfileDropDown.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Logo from '../../assets/Logo.vue';
import ToggleDarkButton from '../ToggleDarkButton.vue';
export default defineComponent({
  name: 'Header',
  components: { ProfileDropDown, FontAwesomeIcon, Logo, ToggleDarkButton },
  setup() {
    const store = useStore();
    const showDropDown = computed(() => {
      return store.state.showDropDown;
    });
    const name = computed(() => {
      return store.state.user
        ? `${store.state.user.first_name} ${store.state.user.last_name} `
        : '';
    });
    const toggleDropDown = (isShown: boolean) => {
      store.dispatch('toggleDropDown', isShown);
    };

    return {
      name,
      showDropDown,
      toggleDropDown,
      faChevronDown,
    };
  },
});
</script>
<style scoped>
.dropdown-enter-from {
  opacity: 0;
  transform-origin: top;
  transform: scaleY(0);
}
.dropdown-enter-to {
  opacity: 1;
  transform-origin: top;
  transform: scaleY(1);
}
.dropdown-enter-active {
  transition: all 0.25s ease-out;
}
.dropdown-leave-from {
  opacity: 1;
  transform-origin: top;
  transform: scaleY(1);
}
.dropdown-leave-to {
  opacity: 0;
  transform-origin: top;
  transform: scaleY(0);
}
.dropdown-leave-active {
  transition: all 0.25s ease-out;
}
.up {
  transform: rotate(-180deg);
}
</style>
