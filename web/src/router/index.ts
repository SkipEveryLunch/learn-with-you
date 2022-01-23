import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Wrapper from '../components/Wrapper.vue';
import LoginPage from '../pages/LoginPage/LoginPage.vue';
import RegisterPage from '../pages/RegisterPage/RegisterPage.vue';
import ProfileShowPage from '../pages/ProfileShowPage/ProfileShowPage.vue';
import PasswordEditPage from '../pages/PasswordEditPage/PasswordEditPage.vue';
import ProfileEditPage from '../pages/ProfileEditPage/ProfileEditPage.vue';
import SectionsPage from '../pages/SectionsPage/SectionsPage.vue';
import SectionSubmitPage from '../pages/SectionSubmitPage/SectionSubmitPage.vue';
import SectionEditPage from '../pages/SectionEditPage/SectionEditPage.vue';
import QuestionSubmitPage from '../pages/QuestionSubmitPage/QuestionSubmitPage.vue';
import QuestionEditPage from '../pages/QuestionEditPage/QuestionEditPage.vue';
import CommentShowPage from '../pages/CommentShowPage/CommentShowPage.vue';
import StudySelectPage from '../pages/StudySelectPage/StudySelectPage.vue';
import StudyNewPage from '../pages/StudyNewPage/StudyNewPage.vue';
import StudyReviewPage from '../pages/StudyReviewPage/StudyReviewPage.vue';
import MessageShowPage from '../pages/MessageShowPage/MessageShowPage.vue';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage.vue';
import axios from 'axios';
axios.defaults.baseURL = `${process.env.VUE_APP_API_BASE}`;
axios.defaults.withCredentials = true;

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
        component: LoginPage,
      },
      {
        path: '/register',
        name: 'RegisterPage',
        component: RegisterPage,
      },
      {
        path: '/message_show',
        name: 'MessageShowPage',
        component: MessageShowPage,
      },
      {
        path: '/profile_show',
        name: 'ProfileShowPage',
        component: ProfileShowPage,
      },
      {
        path: '/profile_edit',
        name: 'ProfileEditPage',
        component: ProfileEditPage,
      },
      {
        path: '/password_edit',
        name: 'PasswordEditPage',
        component: PasswordEditPage,
      },
      {
        path: '/section_submit',
        name: 'SectionSubmitPage',
        component: SectionSubmitPage,
      },
      {
        path: '/section/:sectionId/study',
        name: 'StudySelectPage',
        component: StudySelectPage,
      },
      {
        path: '/section/:sectionId/study_new',
        name: 'StudyNewPage',
        component: StudyNewPage,
      },
      {
        path: '/section/:sectionId/study_review',
        name: 'StudyReviewPage',
        component: StudyReviewPage,
      },
      {
        path: '/section/:sectionId/edit',
        name: 'SectionEdit',
        component: SectionEditPage,
      },
      {
        path: '/section/:sectionId/submit',
        name: 'QuestionSubmitPage',
        component: QuestionSubmitPage,
      },
      {
        path: '/section/:sectionId/question/:questionId/edit',
        name: 'QuestionEditPage',
        component: QuestionEditPage,
      },
      {
        path: '/section/:sectionId/question/:questionId/comment',
        name: 'CommentShowPage',
        component: CommentShowPage,
      },
      {
        path: '/:pathMatch(.*)*',
        component: NotFoundPage,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
