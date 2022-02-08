import { createStore } from 'vuex';

export default createStore({
  state: {
    user: null,
    unconfirmed: 0,
    modal: null,
    commentModal: null,
    sectionReloader: false,
    showDropDown: false,
  },
  mutations: {
    SET_USER: (state, user) => {
      state.user = user;
      state.unconfirmed = user.unconfirmed_messages;
    },
    DECREASE_UNCONFIRMED: (state) => {
      state.unconfirmed = state.unconfirmed - 1;
    },
    DISCARD_USER: (state) => {
      state.user = null;
    },
    SET_MODAL: (state, modal) => {
      state.modal = modal;
    },
    DISCARD_MODAL: (state) => {
      state.modal = null;
    },
    SET_COMMENT_MODAL: (state, commentModal) => {
      state.commentModal = commentModal;
    },
    DISCARD_COMMENT_MODAL: (state) => {
      state.commentModal = null;
    },
    RELOAD_SECTION: (state) => {
      state.sectionReloader = !state.sectionReloader;
    },
    TOGGLE_DROP_DOWN: (state, isShown) => {
      state.showDropDown = isShown;
    },
  },
  actions: {
    setUser: ({ commit }, user) => {
      commit('SET_USER', user);
    },
    decreaseUnconfirmed: ({ commit }) => {
      commit('DECREASE_UNCONFIRMED');
    },
    discardUser: ({ commit }) => {
      commit('DISCARD_USER');
    },
    setModal: ({ commit }, modal) => {
      commit('SET_MODAL', modal);
    },
    discardModal: ({ commit }) => {
      commit('DISCARD_MODAL');
    },
    setCommentModal: ({ commit }, commentModal) => {
      commit('SET_COMMENT_MODAL', commentModal);
    },
    discardCommentModal: ({ commit }) => {
      commit('DISCARD_COMMENT_MODAL');
    },
    reloadSection: ({ commit }) => {
      commit('RELOAD_SECTION');
    },
    toggleDropDown: ({ commit }, isShown) => {
      commit('TOGGLE_DROP_DOWN', isShown);
    },
  },
});
