import QuestionSubmitPage from './QuestionSubmitPage.vue';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/vue';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import store from '../../store/index.ts';
import router from '../../router/index.ts';
import { server, userData, reqBody } from '../../mocks/mockServer';

const setup = () => {
  render(QuestionSubmitPage, {
    global: { plugins: [router, store] },
  });
};
it('shows not found message when not logged in', async () => {
  setup();
  const notFoundMessage = await screen.findByTestId('not-found-message');
  expect(notFoundMessage).toBeInTheDocument();
});

it('has Front Input', async () => {
  store.dispatch('setUser', userData);
  setup();
  const frontInput = screen.queryByTestId('front-input');
  expect(frontInput).toBeInTheDocument();
});

it('has Front Input which has the value user input', async () => {
  store.dispatch('setUser', userData);
  setup();
  const frontInput = screen.queryByTestId('front-input');
  const str = 'test';
  await userEvent.type(frontInput, str);
  expect(frontInput.value).toBe(str);
});

it('has Back Input', async () => {
  store.dispatch('setUser', userData);
  setup();
  const backInput = screen.queryByTestId('back-input');
  expect(backInput).toBeInTheDocument();
});

it('has Back Input which has the value user input', async () => {
  store.dispatch('setUser', userData);
  setup();
  const backInput = screen.queryByTestId('back-input');
  const str = 'test';
  await userEvent.type(backInput, str);
  expect(backInput.value).toBe(str);
});

it('has Submit Button', async () => {
  store.dispatch('setUser', userData);
  setup();
  const submitButton = screen.queryByTestId('submit-button');
  expect(submitButton).toBeInTheDocument();
});

describe('validation', () => {
  it('has Submit Button initially disabled', async () => {
    store.dispatch('setUser', userData);
    setup();
    const submitButton = screen.queryByTestId('submit-button');
    expect(submitButton).toBeDisabled();
  });

  it.each`
    input      | jap
    ${`front`} | ${`問題`}
    ${`back`}  | ${`解答`}
  `("should show alert when $input isn't filled in", async (params) => {
    const { input, jap } = params;
    setup();
    const frontInput = screen.queryByTestId('front-input');
    const backInput = screen.queryByTestId('back-input');
    userEvent.type(frontInput, '1234');
    userEvent.type(backInput, '1234');

    const inputToBlank = screen.queryByTestId(`${input}-input`);
    userEvent.clear(inputToBlank);

    const message = await screen.findByText(`${jap}が未入力です`, {
      exact: false,
    });
    expect(message).toBeInTheDocument();
  });
});

describe('API interaction', () => {
  beforeAll(() => server.listen());
  afterAll(() => server.close());
  it('sends proper values', async () => {
    store.dispatch('setUser', userData);
    setup();
    const frontInput = screen.queryByTestId('front-input');
    const backInput = screen.queryByTestId('back-input');
    await userEvent.type(frontInput, '1234');
    await userEvent.type(backInput, '1234');
    const submitButton = screen.queryByTestId('submit-button');
    userEvent.click(submitButton);
    const submittingMessage = await screen.findByTestId('submitting-message');
    await waitForElementToBeRemoved(submittingMessage);
    expect(reqBody).toEqual({
      front: '1234',
      back: '1234',
    });
  });
});
