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

describe('POST api/posts/like/:id', () => {
  it('should return status 401 when user isnt authorized', async () => {
    const res = await request(server).post('/api/posts/like/test');

    expect(res.status).toBe(401);
  });

  it('should return status 404 with message when no posts find with that ID', async () => {
    const res = await request(server)
      .post('/api/posts/like/1')
      .set('Authorization', token);

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ postNotFound: 'No post found' });
  });

  it('should apply like from the authorized user and return liked post', async () => {
    // create post
    const postId = (await request(server)
      .post('/api/posts/')
      .set('Authorization', token)
      .send(post)).body._id;

    // like post
    const res = await request(server)
      .post(`/api/posts/like/${postId}`)
      .set('Authorization', token);

    expect(res.body).toHaveProperty('text', post.text);
  });

  it('should not apply second like from the same user', async () => {
    // create post
    const postId = (await request(server)
      .post('/api/posts/')
      .set('Authorization', token)
      .send(post)).body._id;

    // like post
    await request(server)
      .post(`/api/posts/like/${postId}`)
      .set('Authorization', token);
    // second like
    const res = await request(server)
      .post(`/api/posts/like/${postId}`)
      .set('Authorization', token);

    expect(res.body).toMatchObject({ alreadyLiked: 'User already liked this post' });
  });
});

describe('POST api/posts/unlike/:id', () => {
  it('should return status 401 when user isnt authorized', async () => {
    const res = await request(server).post('/api/posts/unlike/test');

    expect(res.status).toBe(401);
  });

  it('should return status 404 with message when no posts find with that ID', async () => {
    const res = await request(server)
      .post('/api/posts/unlike/test')
      .set('Authorization', token);

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ postNotFound: 'No post found' });
  });

  it('should remove like from the authorized user and return post', async () => {
    // create post
    const postId = (await request(server)
      .post('/api/posts/')
      .set('Authorization', token)
      .send(post)).body._id;
    // like post
    await request(server)
      .post(`/api/posts/like/${postId}`)
      .set('Authorization', token);
    // unlike post
    const res = await request(server)
      .post(`/api/posts/unlike/${postId}`)
      .set('Authorization', token);

    expect(res.body).toHaveProperty('text', post.text);
  });

  it('should not remove like if user dont have one', async () => {
    // create post
    const postId = (await request(server)
      .post('/api/posts/')
      .set('Authorization', token)
      .send(post)).body._id;

    // unlike post
    const res = await request(server)
      .post(`/api/posts/unlike/${postId}`)
      .set('Authorization', token);

    expect(res.body).toMatchObject({ notLiked: 'User havent yet liked this post' });
  });
});
