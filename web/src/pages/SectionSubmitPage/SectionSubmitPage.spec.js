import SectionSubmitPage from './SectionSubmitPage.vue';
import { render, screen } from '@testing-library/vue';
import '@testing-library/jest-dom';
import router from '../../router/index.ts';
import userEvent from '@testing-library/user-event';
import store from '../../store/index.ts';
import { server, userData } from '../../mocks/mockServer';
import { rest } from 'msw';

const setup = () => {
  render(SectionSubmitPage, {
    global: { plugins: [router, store] },
  });
};
