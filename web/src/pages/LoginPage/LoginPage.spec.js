import LoginPage from './LoginPage.vue';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/vue';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import store from '../../store/index.ts';
import router from '../../router/index.ts';
import { server, reqBody } from '../../mocks/mockServer';

const setup = () => {
  render(LoginPage, {
    global: { plugins: [router, store] },
  });
};

it('has Email Input', async () => {
  setup();
  const emailInput = screen.queryByTestId('email-input');
  expect(emailInput).toBeInTheDocument();
});

it('has Email Input which has the value user input', async () => {
  setup();
  const emailInput = screen.queryByTestId('email-input');
  const str = 'test';
  await userEvent.type(emailInput, str);
  expect(emailInput.value).toBe(str);
});

it('has Password Input', async () => {
  setup();
  const passwordInput = screen.queryByTestId('password-input');
  expect(passwordInput).toBeInTheDocument();
});

it('has Password Input which has the value user input', async () => {
  setup();
  const passwordInput = screen.queryByTestId('password-input');
  const str = 'test';
  await userEvent.type(passwordInput, str);
  expect(passwordInput.value).toBe(str);
});

it('has Login Button', async () => {
  setup();
  const loginButton = screen.queryByTestId('login-button');
  expect(loginButton).toBeInTheDocument();
});

describe('validation', () => {
  it('has Login Button initially disabled', async () => {
    setup();
    const loginButton = screen.queryByTestId('login-button');
    expect(loginButton).toBeDisabled();
  });

  it('should show alert when an improper email is input', async () => {
    setup();
    const emailInput = screen.queryByTestId('email-input');
    userEvent.type(emailInput, 'aaaatest.io');
    const message = await screen.findByText(
      '正しいメールアドレスを入力して下さい'
    );
    expect(message).toBeInTheDocument();
  });

  it('should not show alert when a proper email is input', async () => {
    setup();
    const emailInput = screen.queryByTestId('email-input');
    userEvent.type(emailInput, 'aaaa@test.io');
    const message = screen.queryByText('正しいメールアドレスを入力して下さい');
    expect(message).not.toBeInTheDocument();
  });

  it.each`
    input         | jap
    ${`email`}    | ${`メールアドレス`}
    ${`password`} | ${`パスワード`}
  `("should show alert when $input isn't filled in", async (params) => {
    const { input, jap } = params;
    setup();
    const emailInput = screen.queryByTestId('email-input');
    const passwordInput = screen.queryByTestId('password-input');
    userEvent.type(emailInput, '01@test.io');
    userEvent.type(passwordInput, '1234');

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
    setup();
    const emailInput = screen.queryByTestId('email-input');
    const passwordInput = screen.queryByTestId('password-input');
    await userEvent.type(emailInput, '01@test.io');
    await userEvent.type(passwordInput, '1234');
    const loginButton = screen.queryByTestId('login-button');
    userEvent.click(loginButton);
    const loginginMessage = await screen.findByTestId('logingin-message');
    await waitForElementToBeRemoved(loginginMessage);
    expect(reqBody).toEqual({
      email: '01@test.io',
      password: '1234',
    });
  });
});
