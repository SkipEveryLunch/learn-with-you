import PasswordEditPage from './PasswordEditPage.vue';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/vue';
import '@testing-library/jest-dom';
import store from '../../store/index.ts';
import router from '../../router/index.ts';
import { server, reqBody } from '../../mocks/mockServer';
import userEvent from '@testing-library/user-event';

const setup = async () => {
  render(PasswordEditPage, {
    global: { plugins: [store, router] },
  });
  await store.dispatch('setUser', userData);
};

const userData = {
  first_name: 'John',
  last_name: 'Smith',
  email: 'js@test.io',
};

beforeAll(() => server.listen());
afterAll(() => server.close());

describe('validation', () => {
  it('has UpdateUser Button initially disabled', async () => {
    setup();
    const updateButton = screen.queryByTestId('update-button');
    expect(updateButton).toBeDisabled();
  });
  it('should show alert when the password and password repeat are different', async () => {
    setup();
    const passwordInput = screen.queryByTestId('password-input');
    const passwordRepeatInput = screen.queryByTestId('password-confirm-input');
    userEvent.type(passwordInput, 'aaaa');
    userEvent.type(passwordRepeatInput, 'bbbb');
    const message = await screen.findByText('パスワードと違います');
    expect(message).toBeInTheDocument();
  });

  it.each`
    input                 | jap
    ${`password`}         | ${`パスワード`}
    ${`password-confirm`} | ${`パスワード確認`}
  `("should show alert when $input isn't filled in", async (params) => {
    const { input, jap } = params;
    setup();
    const passwordInput = screen.queryByTestId('password-input');
    const passwordConfirmInput = screen.queryByTestId('password-confirm-input');
    userEvent.type(passwordInput, '1234');
    userEvent.type(passwordConfirmInput, '1234');

    const inputToBlank = screen.queryByTestId(`${input}-input`);
    userEvent.clear(inputToBlank);

    const message = await screen.findByText(`${jap}が未入力です`, {
      exact: false,
    });
    expect(message).toBeInTheDocument();
  });
});

describe('API interaction', () => {
  beforeEach(() => store.dispatch('discardUser'));

  it('sends correct values', async () => {
    setup();
    const PasswordInput = screen.queryByTestId('password-input');
    const PasswordConfirmInput = screen.queryByTestId('password-confirm-input');
    const updateButton = screen.queryByTestId('update-button');
    const password = '1234';
    await userEvent.type(PasswordInput, password);
    await userEvent.type(PasswordConfirmInput, password);
    userEvent.click(updateButton);
    const updateMessage = await screen.findByTestId('updating-message');
    await waitForElementToBeRemoved(updateMessage);
    expect(reqBody).toEqual({
      password,
    });
  });
});
