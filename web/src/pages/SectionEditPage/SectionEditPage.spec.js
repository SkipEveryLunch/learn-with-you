import SectionEditPage from './SectionEditPage.vue';
import { render, screen } from '@testing-library/vue';
import '@testing-library/jest-dom';
import router from '../../router/index.ts';
import userEvent from '@testing-library/user-event';
import store from '../../store/index.ts';
import {
  server,
  adminData,
  userData,
  sectionData,
} from '../../mocks/mockServer';
import { rest } from 'msw';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());

const setup = () => {
  render(SectionEditPage, {
    global: { plugins: [router, store] },
  });
};

it('shows spinner when not logged in', async () => {
  await setup();
  const spinner = screen.getByTestId('spinner');
  expect(spinner).toBeInTheDocument();
});

it('shows section title when logged in', async () => {
  store.dispatch('setUser', userData);
  await setup();
  const title = await screen.findByText(sectionData.title);
  expect(title).toBeInTheDocument();
});

it('shows the same number of questions as the server returned', async () => {
  store.dispatch('setUser', userData);
  await setup();
  const questions = await screen.findAllByTestId('question-card');
  expect(questions.length).toBe(sectionData.questions.length);
});
it('shows edit buttons when logged in as an admin', async () => {
  store.dispatch('setUser', adminData);
  setup();
  const editButtons = await screen.findAllByTestId('edit-buttons');
  expect(editButtons[0]).toBeInTheDocument();
});
