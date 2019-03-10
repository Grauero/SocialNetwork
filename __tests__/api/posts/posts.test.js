const request = require('supertest');

const Post = require('../../../models/Post');
const User = require('../../../models/User');

let server;
const post = new Post({
  text: Array(11).join('a') // for validation requirement
});
const newUser = {
  name: 'name',
  password: 'password',
  password2: 'password',
  email: 'name@gmail.com'
};
let token;

beforeEach(async () => {
  server = require('../../../server');
  await request(server)
    .post('/api/users/register')
    .send(newUser);
  delete newUser.password2;
  token = (await request(server)
    .post('/api/users/login')
    .send(newUser)).body.token;
});
afterEach(async () => {
  server.close();
  await Post.deleteMany({});
});
afterAll(async () => {
  await User.deleteMany({});
  token = '';
});

describe('GET /', () => {
  it('returns all posts', async () => {
    await new Post(post).save();
    const res = await request(server).get('/api/posts/');

    expect(res.body.some(obj => obj.text === post.text)).toBeTruthy();
  });

  it('returns status 404 when posts doesnt exists', async () => {
    const res = await request(server).get('/api/posts/');

    expect(res.status).toBe(404);
  });
});

describe('GET /:id', () => {
  it('returns post by ID', async () => {
    await new Post(post).save();
    const res = await request(server).get(`/api/posts/${post._id}`);

    expect(res.body).toHaveProperty('text', post.text);
  });

  it('returns status 404 when ID of post doesnt exists', async () => {
    await new Post(post).save();
    const res = await request(server).get('/api/posts/1');

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ noPostFound: 'No post found with that ID' });
  });
});

describe('POST /', () => {
  it('returns status 401 when user isnt authorized', async () => {
    const res = await request(server).post('/api/posts/');

    expect(res.status).toBe(401);
  });

  it('creates and returns new post when user is authorized and pass validation', async () => {
    const res = await request(server)
      .post('/api/posts/')
      .set('Authorization', token)
      .send(post);

    expect(res.body).toHaveProperty('text', post.text);
  });

  it('returns status 400 when users data didnt pass validation', async () => {
    const res = await request(server)
      .post('/api/posts/')
      .set('Authorization', token)
      .send({ text: '' });

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({ text: 'Text field is required' });
  });
});

describe('DELETE /:id', () => {
  it('returns status 401 when user isnt authorized', async () => {
    const res = await request(server).delete('/api/posts/test');

    expect(res.status).toBe(401);
  });

  it('deletes post when user is authorized', async () => {
    const id = (await request(server)
      .post('/api/posts/')
      .set('Authorization', token)
      .send(post)).body._id;

    const res = await request(server)
      .delete(`/api/posts/${id}`)
      .set('Authorization', token);

    expect(res.body).toMatchObject({ success: true });
  });

  it('returns status 401 with message when user have no access', async () => {
    const postId = (await request(server)
      .post('/api/posts/')
      .set('Authorization', token)
      .send(post)).body._id;

    const anotherUser = {
      name: 'name1',
      password: 'password1',
      password2: 'password1',
      email: 'name1@gmail.com'
    };

    await request(server)
      .post('/api/users/register')
      .send(anotherUser);
    delete anotherUser.password2;
    const anotherToken = (await request(server)
      .post('/api/users/login')
      .send(anotherUser)).body.token;

    const res = await request(server)
      .delete(`/api/posts/${postId}`)
      .set('Authorization', anotherToken);

    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({ noAccess: 'User didnt create that post' });
  });

  it('returns status 404 with message when no posts find with that ID', async () => {
    const res = await request(server)
      .delete('/api/posts/1')
      .set('Authorization', token);

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ postNotFound: 'No post found' });
  });
});
