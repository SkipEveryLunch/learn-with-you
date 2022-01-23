import ProfileEditPage from './ProfileEditPage.vue';
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
  render(ProfileEditPage, {
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

  it('has UpdatePassword Button initially disabled', async () => {
    setup();
    const updatePasswordButton = screen.queryByTestId('update-button');
    expect(updatePasswordButton).toBeDisabled();
  });

  it('should show alert when the length of first name is more than 12', async () => {
    setup();
    const nameInput = screen.queryByTestId('first-name-input');
    userEvent.type(nameInput, 'aaaaaaaaaaaaa');
    const message = await screen.findByText('名字は12字以内です');
    expect(message).toBeInTheDocument();
  });
  it('should not show alert when the length of first name is less or equal to 12', async () => {
    setup();
    const nameInput = screen.queryByTestId('first-name-input');
    userEvent.type(nameInput, 'aaaaaaaaaaaa');
    const message = screen.queryByText('名前は12字以内です');
    expect(message).not.toBeInTheDocument();
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
    input           | jap
    ${`first-name`} | ${`名字`}
    ${`last-name`}  | ${`名前`}
    ${`email`}      | ${`メールアドレス`}
  `("should show alert when $input isn't filled in", async (params) => {
    const { input, jap } = params;
    setup();
    const firstNameInput = screen.queryByTestId('first-name-input');
    const lastNameInput = screen.queryByTestId('last-name-input');
    const emailInput = screen.queryByTestId('email-input');
    userEvent.type(firstNameInput, '01');
    userEvent.type(lastNameInput, '01');
    userEvent.type(emailInput, '01@test.io');

    const inputToBlank = screen.queryByTestId(`${input}-input`);
    userEvent.clear(inputToBlank);

    const message = await screen.findByText(`${jap}が未入力です`, {
      exact: false,
    });
    expect(message).toBeInTheDocument();
  });
});

// describe('API interaction', () => {
//   beforeEach(() => store.dispatch('discardUser'));
//   it('sends correct user information', async () => {
//     await setup();
//     const firstNameInput = screen.queryByTestId('first-name-input');
//     const lastNameInput = screen.queryByTestId('last-name-input');
//     const emailInput = screen.queryByTestId('email-input');
//     const updateButton = screen.queryByTestId('update-button');
//     const fname = 'test';
//     const lname = 'test';
//     const email = '01@test.io';
//     await userEvent.type(firstNameInput, fname);
//     await userEvent.type(lastNameInput, lname);
//     await userEvent.type(emailInput, email);
//     userEvent.click(updateButton);
//     const updateMessage = await screen.findByTestId('user-update-message');
//     await waitForElementToBeRemoved(updateMessage);
//     expect(reqBody).toEqual({
//       first_name: fname,
//       last_name: lname,
//       email,
//     });
//   });

//   it('updates user information in store', async () => {
//     await setup();
//     const firstNameInput = screen.queryByTestId('first-name-input');
//     const lastNameInput = screen.queryByTestId('last-name-input');
//     const emailInput = screen.queryByTestId('email-input');
//     const updateButton = screen.queryByTestId('update-user-button');
//     const fname = 'test';
//     const lname = 'test';
//     const email = '01@test.io';
//     await userEvent.type(firstNameInput, fname);
//     await userEvent.type(lastNameInput, lname);
//     await userEvent.type(emailInput, email);
//     userEvent.click(updateButton);
//     const updateMessage = await screen.findByTestId('user-update-message');
//     await waitForElementToBeRemoved(updateMessage);
//     expect(store.state.user).toEqual({
//       first_name: fname,
//       last_name: lname,
//       email,
//     });
//   });
// });
