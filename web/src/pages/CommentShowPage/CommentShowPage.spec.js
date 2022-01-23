import CommentShowPage from './CommentShowPage.vue';
import { render, screen } from '@testing-library/vue';
import '@testing-library/jest-dom';
import router from '../../router/index.ts';
import {
  server,
  adminData,
  userData,
  commentsData,
} from '../../mocks/mockServer';
import store from './../../store/index.ts';

const setup = () => {
  render(CommentShowPage, {
    global: { plugins: [router, store] },
  });
};

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());

it('show spinner when not logged in', async () => {
  setup();
  const spinner = await screen.findByTestId('spinner');
  expect(spinner).toBeInTheDocument();
});

it('show spinner when wrong user is logged in', async () => {
  store.dispatch('setUser', { ...userData, id: 1 });
  setup();
  const spinner = await screen.findByTestId('spinner');
  expect(spinner).toBeInTheDocument();
});

it('has the same number of commentCards as API sent', async () => {
  store.dispatch('setUser', userData);
  setup();
  const commentCards = await screen.findAllByTestId('comment-card');
  expect(commentCards.length).toBe(commentsData.length);
});

it('shows CommentShowPage when logged in as an admin', async () => {
  store.dispatch('setUser', adminData);
  setup();
  const commentShowPage = await screen.findByTestId('comment-show-page');
  expect(commentShowPage).toBeInTheDocument();
});

it('shows CommentDeleteButton when logged in as an admin', async () => {
  store.dispatch('setUser', adminData);
  setup();
  const commentDeleteButtons = await screen.findAllByTestId(
    'comment-delete-button'
  );
  expect(commentDeleteButtons[0]).toBeInTheDocument();
});
