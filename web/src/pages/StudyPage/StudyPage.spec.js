import StudyPage from './StudyPage.vue';
import { render, screen } from '@testing-library/vue';
import '@testing-library/jest-dom';
import router from '../../router/index.ts';
import userEvent from '@testing-library/user-event';
import store from '../../store/index.ts';
import { server, userData, questionsData } from '../../mocks/mockServer';
import { rest } from 'msw';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());

const setup = () => {
  render(StudyPage, {
    global: { plugins: [router, store] },
  });
};

it('shows not found message when not logged in', async () => {
  await setup();
  const notFoundMessage = screen.getByTestId('not-found-message');
  expect(notFoundMessage).toBeInTheDocument();
});

it('shows start study message when logged in', async () => {
  store.dispatch('setUser', userData);
  await setup();
  const studyStartMessage = await screen.findByTestId('study-start-message');
  expect(studyStartMessage).toBeInTheDocument();
});

it('shows start study message when logged in', async () => {
  store.dispatch('setUser', userData);
  await setup();
  const studyStartMessage = await screen.findByTestId('study-start-message');
  expect(studyStartMessage).toBeInTheDocument();
});

it('shows start study message when logged in', async () => {
  store.dispatch('setUser', userData);
  setup();
  const studyButton = await screen.findByTestId('study-button');
  await userEvent.click(studyButton);
  const questionWindow = await screen.findByTestId('question-window');
  expect(questionWindow).toBeInTheDocument();
});

it('shows finish study message after answering all questions', async () => {
  server.use(
    rest.get(
      `${process.env.VUE_APP_API_BASE}sections/*/new_questions`,
      (req, res, ctx) => {
        return res.once(ctx.json({ questions: [questionsData[0]] }));
      }
    )
  );
  store.dispatch('setUser', userData);
  setup();
  const studyButton = await screen.findByTestId('study-button');
  await userEvent.click(studyButton);
  const flipCard = await screen.findByTestId('flipcard-front');
  userEvent.click(flipCard);
  const correctButton = await screen.findByTestId('correct-button');
  await userEvent.click(correctButton);
  const studyFinishMessage = await screen.findByTestId('study-finish-message');
  expect(studyFinishMessage).toBeInTheDocument();
});
