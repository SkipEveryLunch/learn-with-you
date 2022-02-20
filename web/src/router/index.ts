import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Wrapper from '../components/Wrapper.vue';
import Authorization from '../components/Authorization.vue';
import axios from 'axios';
axios.defaults.baseURL = `${process.env.VUE_APP_API_BASE}`;
axios.defaults.withCredentials = true;
import SectionsPage from '../pages/SectionsPage/SectionsPage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    component: Wrapper,
    children: [
      {
        path: '',
        name: 'SectionsPage',
        component: SectionsPage,
      },
      {
        path: '/login',
        name: 'LoginPage',
        component: () => import('../pages/LoginPage/LoginPage.vue'),
      },
      {
        path: '/register',
        name: 'RegisterPage',
        component: () => import('../pages/RegisterPage/RegisterPage.vue'),
      },

      {
        path: '/',
        component: Authorization,
        children: [
          {
            path: '/section/:sectionId/edit',
            name: 'SectionEdit',
            component: () =>
              import('../pages/SectionEditPage/SectionEditPage.vue'),
          },
          {
            path: '/message_show',
            name: 'MessageShowPage',
            component: () =>
              import('../pages/MessageShowPage/MessageShowPage.vue'),
          },
          {
            path: '/profile_show',
            name: 'ProfileShowPage',
            component: () =>
              import('../pages/ProfileShowPage/ProfileShowPage.vue'),
          },
          {
            path: '/profile_edit',
            name: 'ProfileEditPage',
            component: () =>
              import('../pages/ProfileEditPage/ProfileEditPage.vue'),
          },
          {
            path: '/password_edit',
            name: 'PasswordEditPage',
            component: () =>
              import('../pages/PasswordEditPage/PasswordEditPage.vue'),
          },
          {
            path: '/section_submit',
            name: 'SectionSubmitPage',
            component: () =>
              import('../pages/SectionSubmitPage/SectionSubmitPage.vue'),
          },
          {
            path: '/section/:sectionId/study',
            name: 'StudySelectPage',
            component: () =>
              import('../pages/StudySelectPage/StudySelectPage.vue'),
          },
          {
            path: '/section/:sectionId/study_new',
            name: 'StudyNewPage',
            component: () => import('../pages/StudyNewPage/StudyNewPage.vue'),
          },
          {
            path: '/section/:sectionId/study_review',
            name: 'StudyReviewPage',
            component: () =>
              import('../pages/StudyReviewPage/StudyReviewPage.vue'),
          },

          {
            path: '/section/:sectionId/submit',
            name: 'QuestionSubmitPage',
            component: () =>
              import('../pages/QuestionSubmitPage/QuestionSubmitPage.vue'),
          },
          {
            path: '/section/:sectionId/question/:questionId/edit',
            name: 'QuestionEditPage',
            component: () =>
              import('../pages/QuestionEditPage/QuestionEditPage.vue'),
          },
          {
            path: '/section/:sectionId/question/:questionId/comment',
            name: 'CommentShowPage',
            component: () =>
              import('../pages/CommentShowPage/CommentShowPage.vue'),
          },
        ],
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('../pages/NotFoundPage/NotFoundPage.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
