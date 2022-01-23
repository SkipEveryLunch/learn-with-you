import MessageShowPage from './MessageShowPage.vue';
import { render, screen } from '@testing-library/vue';
import '@testing-library/jest-dom';
import router from '../../router/index.ts';
import { server, userData, messagesData } from '../../mocks/mockServer';
import store from './../../store/index.ts';

const setup = () => {
  render(MessageShowPage, {
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

it('has the same number of messageCards as API sent', async () => {
  store.dispatch('setUser', userData);
  setup();
  const messageCards = await screen.findAllByTestId('message-card');
  expect(messageCards.length).toBe(messagesData.length);
});

it('displays the number of unconfirmed messages', async () => {
  store.dispatch('setUser', userData);
  setup();
  const unconfirmed = await screen.findByTestId('unconfirmed');
  let unconfirmedNum = 0;
  messagesData.forEach((el) => {
    if (!el.is_confirmed) unconfirmedNum += 1;
  });
  expect(unconfirmed.innerHTML).toBe(`うち${unconfirmedNum}件未読`);
});
