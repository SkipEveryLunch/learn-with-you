import { setupServer } from 'msw/node';
import { rest } from 'msw';

const baseUrl = `${process.env.VUE_APP_API_BASE}`;

export let reqBody;
export const server = setupServer(
  rest.post(`${baseUrl}register`, (req, res, ctx) => {
    reqBody = req.body;
    return res(ctx.status(201), ctx.json({ user: userData }));
  }),
  rest.post(`${baseUrl}login`, (req, res, ctx) => {
    reqBody = req.body;
    return res(
      ctx.status(200),
      ctx.cookie('token', '12345'),
      ctx.json({ user: userData })
    );
  }),
  rest.delete(`${baseUrl}logout`, (req, res, ctx) => {
    reqBody = req.body;
    return res(
      ctx.status(200),
      ctx.cookie('token', '', { maxAge: 0 }),
      ctx.json({ user: userData })
    );
  }),
  rest.get(`${baseUrl}current_user`, (req, res, ctx) => {
    const { token } = req.cookies;
    if (token && token === '12345') {
      return res(ctx.status(200), ctx.json({ user: userData }));
    } else {
      return res(ctx.status(401), ctx.json({ message: 'not authenticated' }));
    }
  }),
  rest.put(`${baseUrl}user_update`, (req, res, ctx) => {
    reqBody = req.body;
    const copyUserData = deepCopy(userData);
    Object.assign(copyUserData, req.body);
    return res(ctx.status(200), ctx.json({ user: copyUserData }));
  }),
  rest.put(`${baseUrl}password_update`, (req, res, ctx) => {
    reqBody = req.body;
    return res(ctx.status(200), ctx.json({ user: userData }));
  }),
  rest.get(`${baseUrl}sections`, (req, res, ctx) => {
    reqBody = req.body;
    return res(
      ctx.status(200),
      ctx.json({ sections: sectionsData, series: seriesData })
    );
  }),
  rest.post(`${baseUrl}sections`, (req, res, ctx) => {
    reqBody = req.body;
    return res(ctx.status(201), ctx.json({ section: sectionsData[0] }));
  }),
  rest.get(`${baseUrl}sections/:sectionId`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ section: sectionData }));
  }),
  rest.get(`${baseUrl}sections/*/new_questions`, (req, res, ctx) => {
    reqBody = req.body;
    return res(ctx.status(200), ctx.json({ questions: questionsData }));
  }),
  rest.post(`${baseUrl}questions`, (req, res, ctx) => {
    reqBody = req.body;
    return res(ctx.status(201));
  }),
  rest.get(`${baseUrl}questions/*`, (req, res, ctx) => {
    reqBody = req.body;
    return res(ctx.status(200), ctx.json({ question: questionsData[0] }));
  }),
  rest.put(`${baseUrl}questions/*`, (req, res, ctx) => {
    reqBody = req.body;
    return res(ctx.status(202), ctx.json({ question: questionsData[0] }));
  }),
  rest.get(`${baseUrl}questions_several_comments/*`, (req, res, ctx) => {
    reqBody = req.body;
    return res(
      ctx.status(200),
      ctx.json({ comments: commentsData, commented_to: userData.id })
    );
  }),
  rest.get(`${baseUrl}messages`, (req, res, ctx) => {
    reqBody = req.body;
    return res(ctx.status(200), ctx.json({ messages: messagesData }));
  }),
  rest.get(`${baseUrl}series`, (req, res, ctx) => {
    reqBody = req.body;
    return res(ctx.status(200), ctx.json({ series: seriesData }));
  })
);
export const userData = {
  id: 1,
  first_name: 'John',
  last_name: 'Smith',
  email: 'js@test.io',
  role: {
    id: 2,
    name: 'user',
  },
};
export const adminData = {
  id: 2,
  first_name: 'Tom',
  last_name: 'Smith',
  email: 'ts@test.io',
  role: {
    id: 1,
    name: 'admin',
  },
};
export const seriesData = [
  {
    id: 1,
    name: '前置詞・名詞',
    created_at: '2021-12-26T12:59:06.000000Z',
    updated_at: '2021-12-26T12:59:06.000000Z',
  },
  {
    id: 2,
    name: '単位・度合',
    created_at: '2021-12-26T12:59:06.000000Z',
    updated_at: '2021-12-26T12:59:06.000000Z',
  },
  {
    id: 3,
    name: '時・条件',
    created_at: '2021-12-26T12:59:06.000000Z',
    updated_at: '2021-12-26T12:59:06.000000Z',
  },
  {
    id: 4,
    name: '仮定法',
    created_at: '2021-12-26T12:59:06.000000Z',
    updated_at: '2021-12-26T12:59:06.000000Z',
  },
];
export const sectionsData = [
  {
    id: 1,
    title: 'enim',
    created_at: '2021-09-11T13:42:10.000000Z',
    updated_at: '2021-09-11T13:42:10.000000Z',
    count_questions: 9,
    posted_by: 1,
    series: seriesData[1],
  },
  {
    id: 2,
    title: 'error',
    created_at: '2021-09-11T13:42:10.000000Z',
    updated_at: '2021-09-11T13:42:10.000000Z',
    count_questions: 9,
    posted_by: 1,
    series: seriesData[1],
  },
  {
    id: 3,
    title: 'sit',
    created_at: '2021-09-11T13:42:10.000000Z',
    updated_at: '2021-09-11T13:42:10.000000Z',
    count_questions: 9,
    posted_by: 1,
    series: seriesData[1],
  },
  {
    id: 4,
    title: 'amet',
    created_at: '2021-09-11T13:42:10.000000Z',
    updated_at: '2021-09-11T13:42:10.000000Z',
    count_questions: 9,
    posted_by: 1,
    series: seriesData[1],
  },
];
export const questionsData = [
  {
    id: 1,
    front:
      'Voluptas id doloremque similique recusandae. Nobis autem et quos recusandae inventore voluptate.',
    back: 'Similique minus dicta sint eius nulla vitae. Repellat et in vel illo quaerat. A rerum officia ullam est fugit sed.',
    section_id: 1,
    commented_by: [1, 2],
    created_at: '2021-09-19T07:44:06.000000Z',
    updated_at: '2021-09-19T07:44:06.000000Z',
  },
  {
    id: 2,
    front:
      'Dolores aliquam alias ab qui natus dignissimos nesciunt. Quo sit commodi facere. Accusamus quam debitis praesentium inventore ad adipisci magnam consequatur.',
    back: 'Eligendi quas aspernatur alias dolor tempore quibusdam. Officiis ullam tempore voluptates voluptatibus in.',
    section_id: 1,
    commented_by: [1, 2],
    created_at: '2021-09-19T07:44:06.000000Z',
    updated_at: '2021-09-19T07:44:06.000000Z',
  },
  {
    id: 3,
    front:
      'Molestiae necessitatibus aliquid aspernatur asperiores et maiores est. Aperiam nisi iusto aut incidunt voluptas illo eos.',
    back: 'Eos occaecati non hic veritatis ab est. Voluptates est vitae quisquam pariatur et accusamus. Sapiente autem illum maiores veritatis.',
    section_id: 1,
    commented_by: [1, 2],
    created_at: '2021-09-19T07:44:06.000000Z',
    updated_at: '2021-09-19T07:44:06.000000Z',
  },
  {
    id: 4,
    front:
      'Est est illo odit omnis. Enim ipsa adipisci ducimus. Autem rerum rerum cumque nostrum.',
    back: 'Ipsam amet accusantium officiis inventore debitis aut illo. Labore temporibus culpa eligendi rerum est consequatur. Nesciunt soluta delectus quam id explicabo placeat placeat.',
    section_id: 1,
    commented_by: [1, 2],
    created_at: '2021-09-19T07:44:06.000000Z',
    updated_at: '2021-09-19T07:44:06.000000Z',
  },
];
export const sectionData = {
  id: '1',
  title: 'cool section',
  created_at: '2021-09-20T10:16:39.000000Z',
  updated_at: '2021-09-20T10:16:39.000000Z',
  count_questions: questionsData.length,
  complete_rate: 0,
  questions: questionsData,
};
export const commentsData = [
  {
    id: '1',
    comment_type: 'qui',
    comment_detail:
      'Commodi voluptas animi debitis porro quas et aut. Et expedita esse aut enim. Iste rerum ipsam ducimus.',
    user_id: 1,
    question_id: 6,
    created_at: '2021-11-06T09:02:48.000000Z',
    updated_at: '2021-11-06T09:02:48.000000Z',
  },
  {
    id: '2',
    comment_type: 'qui',
    comment_detail:
      'Commodi voluptas animi debitis porro quas et aut. Et expedita esse aut enim. Iste rerum ipsam ducimus.',
    user_id: 1,
    question_id: 6,
    created_at: '2021-11-06T09:02:48.000000Z',
    updated_at: '2021-11-06T09:02:48.000000Z',
  },
  {
    id: '3',
    comment_type: 'qui',
    comment_detail:
      'Commodi voluptas animi debitis porro quas et aut. Et expedita esse aut enim. Iste rerum ipsam ducimus.',
    user_id: 1,
    question_id: 6,
    created_at: '2021-11-06T09:02:48.000000Z',
    updated_at: '2021-11-06T09:02:48.000000Z',
  },
];
export const messagesData = [
  {
    id: 1,
    title: 'voluptate',
    body: 'Non id dolores rem voluptatem quae aliquid quidem. Deserunt atque dolore veritatis quia ex perspiciatis voluptatibus. Ut totam voluptatum accusantium et natus quis.',
    user_id: 1,
    is_confirmed: 1,
    link_type: 'comment',
    link_data: '{"section_id": 2, "question_id": 54}',
    created_at: '2021-11-06T09:02:49.000000Z',
    updated_at: '2021-11-06T09:07:54.000000Z',
  },
  {
    id: 2,
    title: 'consequuntur',
    body: 'Dolor asperiores et incidunt quibusdam. Ut iure enim voluptatem quidem voluptatem.',
    user_id: 1,
    is_confirmed: 1,
    link_type: 'comment',
    link_data: '{"section_id": 3, "question_id": 73}',
    created_at: '2021-11-06T09:02:49.000000Z',
    updated_at: '2021-11-06T09:22:05.000000Z',
  },
  {
    id: 3,
    title: 'voluptate',
    body: 'Non id dolores rem voluptatem quae aliquid quidem. Deserunt atque dolore veritatis quia ex perspiciatis voluptatibus. Ut totam voluptatum accusantium et natus quis.',
    user_id: 1,
    is_confirmed: 1,
    link_type: 'comment',
    link_data: '{"section_id": 2, "question_id": 54}',
    created_at: '2021-11-06T09:02:49.000000Z',
    updated_at: '2021-11-06T09:07:54.000000Z',
  },
  {
    id: 4,
    title: 'consequuntur',
    body: 'Dolor asperiores et incidunt quibusdam. Ut iure enim voluptatem quidem voluptatem.',
    user_id: 1,
    is_confirmed: 1,
    link_type: 'comment',
    link_data: '{"section_id": 3, "question_id": 73}',
    created_at: '2021-11-06T09:02:49.000000Z',
    updated_at: '2021-11-06T09:22:05.000000Z',
  },
];

const deepCopy = (obj) => {
  return [obj].map((ob) => ({ ...ob }))[0];
};
