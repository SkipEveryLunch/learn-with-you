<template>
  <nav
    data-testid="header"
    class="flex justify-between px-3 mb-2 text-lg text-gray-100 bg-gray-700"
  >
    <div class="flex space-x-1">
      <div class="flex items-center px-2 py-3">
        <router-link to="/">
          <Logo />
        </router-link>
      </div>
    </div>
    <div v-if="name.length === 0">
      <div class="flex items-center px-2 py-3">
        <router-link
          data-testid="login-link"
          to="/login"
          class="px-2 py-1 mr-3 rounded-md hover:bg-gray-600"
          >ログイン</router-link
        >
        <router-link to="/register" class="px-2 py-1 text-lg btn btn-primary"
          >新規登録</router-link
        >
      </div>
    </div>
    <!-- <div v-else class="flex items-center"> -->
    <div v-else class="relative flex items-center px-2 py-3">
      <div
        class="flex px-2 rounded-md hover:bg-gray-600"
        @click="() => toggleDropDown(!showDropDown)"
        data-testid="profile-menu"
      >
        <span class="py-1 mr-2 cursor-pointer">
          {{ name }}
        </span>
        <span class="mt-1 ml-1 text-sm arrow" :class="{ up: showDropDown }">
          <font-awesome-icon class="fa-lg" :icon="faChevronDown" />
        </span>
      </div>
      <transition name="dropdown" appear>
        <ProfileDropDown v-if="showDropDown" :toggleDropDown="toggleDropDown" />
      </transition>
    </div>
  </nav>
</template>
<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import ProfileDropDown from '../ProfileDropDown.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Logo from '../../assets/Logo.vue';
export default {
  name: 'Header',
  components: { ProfileDropDown, FontAwesomeIcon, Logo },
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
    const toggleDropDown = (isShown) => {
      store.dispatch('toggleDropDown', isShown);
    };

    return {
      name,
      showDropDown,
      toggleDropDown,
      faChevronDown,
    };
  },
};
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
.arrow {
  transition: all 0.25s ease-out;
  transform: translateY(0.3rem);
}
.arrow.up {
  transform: translateY(-0.3rem) rotate(-180deg);
}
</style>
