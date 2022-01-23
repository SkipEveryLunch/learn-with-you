import SectionsPage from './SectionsPage.vue';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/vue';
import '@testing-library/jest-dom';
import router from '../../router/index.ts';
import { server, userData, sectionsData } from '../../mocks/mockServer';
import store from './../../store/index.ts';

const setup = () => {
  render(SectionsPage, {
    global: { plugins: [router, store] },
  });
};

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());

it('has the same number of sectionCards as API sent', async () => {
  setup();
  const sectionCards = await screen.findAllByTestId('section-card');
  expect(sectionCards.length).toBe(sectionsData.length);
});

it('shows sectionSubmitLink when logged in', async () => {
  store.dispatch('setUser', userData);
  setup();
  const sectionSubmitLink = await screen.findByTestId('section-submit-link');
  expect(sectionSubmitLink).toBeInTheDocument();
});

it('does not show sectionSubmitLink when not logged in', async () => {
  store.dispatch('setUser', userData);
  setup();
  const sectionSubmitLink = await screen.findByTestId('section-submit-link');
  store.dispatch('discardUser');
  await waitForElementToBeRemoved(sectionSubmitLink);
  expect(sectionSubmitLink).not.toBeInTheDocument();
});
