import ProfileShowPage from './ProfileShowPage.vue';
import { userData, adminData } from '../../mocks/mockServer';
import { render, screen } from '@testing-library/vue';
import '@testing-library/jest-dom';
import store from '../../store/index.ts';
import router from '../../router/index.ts';

const setup = async () => {
  render(ProfileShowPage, {
    global: { plugins: [store, router] },
  });
  await store.dispatch('setUser', userData);
};

it('shows first name', async () => {
  setup();
  const userFirstName = await screen.findByTestId('user-firstname');
  expect(userFirstName.textContent).toBe(userData.first_name);
});

it('shows last name', async () => {
  setup();
  const userLastName = await screen.findByTestId('user-lastname');
  expect(userLastName.textContent).toBe(userData.last_name);
});

it('shows Email', async () => {
  setup();
  const userEmail = await screen.findByTestId('user-email');
  expect(userEmail.textContent).toBe(userData.email);
});

it('shows isAdmin when logged in as an admin', async () => {
  setup();
  await store.dispatch('setUser', adminData);
  const isAdminSpan = await screen.findByTestId('user-isadmin');
  expect(isAdminSpan).toBeInTheDocument();
});
