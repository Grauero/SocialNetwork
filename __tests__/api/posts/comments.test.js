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

describe('POST api/posts/comment/:id', () => {
  it('returns status 401 when user isnt authorized', async () => {
    const res = await request(server).post('/api/posts/comment/test');

    expect(res.status).toBe(401);
  });

  it('returns status 400 when users data didnt pass validation', async () => {
    // create post
    const postId = (await request(server)
      .post('/api/posts/')
      .set('Authorization', token)
      .send(post)).body._id;

    // post comment
    const res = await request(server)
      .post(`/api/posts/comment/${postId}`)
      .set('Authorization', token)
      .send({ text: '123' }); // for validation fail

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({ text: 'Post must be between 10 and 300 characters' });
  });

  it('returns status 404 with message when no posts find with that ID', async () => {
    const res = await request(server)
      .post('/api/posts/comment/test')
      .set('Authorization', token)
      .send({ text: '12345678910' }); // for validation requirement

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ postNotFound: 'No post found' });
  });

  it('adds users comment and returns post if user provided valid data', async () => {
    // create post
    const postId = (await request(server)
      .post('/api/posts/')
      .set('Authorization', token)
      .send(post)).body._id;

    // post comment
    const res = await request(server)
      .post(`/api/posts/comment/${postId}`)
      .set('Authorization', token)
      .send({ text: '12345678910' }); // for validation requirement

    expect(res.body).toHaveProperty('text', post.text);
  });
});

describe('DELETE api/posts/comment/:id/:comment_id', () => {
  it('returns status 401 when user isnt authorized', async () => {
    const res = await request(server).delete('/api/posts/comment/post_id/comment_id');

    expect(res.status).toBe(401);
  });

  it('returns status 404 with message when no posts find with that ID', async () => {
    const res = await request(server)
      .delete('/api/posts/comment/test/comment_id')
      .set('Authorization', token);

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ postNotFound: 'No post found' });
  });

  it('returns status 404 with message when user tries to delete comment that doesnt exist', async () => {
    // create post
    const postId = (await request(server)
      .post('/api/posts/')
      .set('Authorization', token)
      .send(post)).body._id;

    // delete comment
    const res = await request(server)
      .delete(`/api/posts/comment/${postId}/comment_id`)
      .set('Authorization', token);

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ commentNotExist: 'Comment doesnt exist' });
  });

  it('removes existing comment if user provided valid data', async () => {
    // create post
    const postId = (await request(server)
      .post('/api/posts/')
      .set('Authorization', token)
      .send(post)).body._id;

    // post comment
    const commentId = (await request(server)
      .post(`/api/posts/comment/${postId}`)
      .set('Authorization', token)
      .send({ text: '12345678910' })).body.comments[0]._id; // for validation requirement

    // delete comment
    const res = await request(server)
      .delete(`/api/posts/comment/${postId}/${commentId}`)
      .set('Authorization', token);

    expect(res.body).toHaveProperty('text', post.text);
  });
});
