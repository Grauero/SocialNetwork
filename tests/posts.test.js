const request = require('supertest');

const Post = require('../models/Post');
const User = require('../models/User');

describe('/api/posts/', () => {
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

  beforeEach(() => { server = require('../server'); });
  afterEach(() => server.close());

  describe('GET /', () => {
    afterEach(async () => {
      await Post.deleteMany({});
    });

    it('should return all posts', async () => {
      await new Post(post).save();
      const res = await request(server).get('/api/posts/');

      expect(res.body.some(obj => obj.text === post.text)).toBeTruthy();
    });

    it('should return status 404 when posts doesnt exists', async () => {
      const res = await request(server).get('/api/posts/');

      expect(res.status).toBe(404);
    });
  });

  describe('GET /:id', () => {
    afterEach(async () => {
      await Post.deleteMany({});
    });

    it('should return post by ID', async () => {
      await new Post(post).save();
      const res = await request(server).get(`/api/posts/${post._id}`);

      expect(res.body).toHaveProperty('text', post.text);
    });

    it('should return status 404 when ID of post doesnt exists', async () => {
      await new Post(post).save();
      const res = await request(server).get('/api/posts/1');

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({ noPostFound: 'No post found with that ID' });
    });
  });

  describe('POST /', () => {
    beforeAll(async () => {
      await request(server).post('/api/users/register').send(newUser);
      delete newUser.password2;
      token = (await request(server).post('/api/users/login').send(newUser)).body.token;
    });
    afterAll(async () => {
      User.deleteMany({});
      token = '';
    });

    it('should return status 401 when user isnt authorized', async () => {
      const res = await request(server).post('/api/posts/');

      expect(res.status).toBe(401);
    });

    it('should create and return new post when user is authorized and pass validation', async () => {
      const res = await request(server)
        .post('/api/posts/')
        .set('Authorization', token)
        .send(post);

      expect(res.body).toHaveProperty('text', post.text);
    });

    it('should return status 400 when users data didnt pass validation', async () => {
      const res = await request(server)
        .post('/api/posts/')
        .set('Authorization', token)
        .send({ text: '' });

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ text: 'Text field is required' });
    });
  });

  describe('DELETE /:id', () => {
    beforeAll(async () => {
      await request(server).post('/api/users/register').send(newUser);
      delete newUser.password2;
      token = (await request(server).post('/api/users/login').send(newUser)).body.token;
    });
    afterAll(async () => {
      User.deleteMany({});
      Post.deleteMany({});
      token = '';
    });

    it('should return status 401 when user isnt authorized', async () => {
      const res = await request(server).delete('/api/posts/test');

      expect(res.status).toBe(401);
    });

    it('should delete post when user is authorized', async () => {
      const id = (await request(server)
        .post('/api/posts/')
        .set('Authorization', token)
        .send(post)).body._id;

      const res = await request(server)
        .delete(`/api/posts/${id}`)
        .set('Authorization', token);

      expect(res.body).toMatchObject({ success: true });
    });

    it('should return status 401 with message when user have no access', async () => {
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

      await request(server).post('/api/users/register').send(anotherUser);
      delete anotherUser.password2;
      const anotherToken = (await request(server).post('/api/users/login').send(anotherUser)).body.token;

      const res = await request(server)
        .delete(`/api/posts/${postId}`)
        .set('Authorization', anotherToken);

      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({ noAccess: 'User didnt create that post' });
    });

    it('should return status 404 with message when no posts find with that ID', async () => {
      const res = await request(server)
        .delete('/api/posts/1')
        .set('Authorization', token);

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({ postNotFound: 'No post found' });
    });
  });

  describe('POST api/posts/like/:id', () => {
    beforeAll(async () => {
      await request(server).post('/api/users/register').send(newUser);
      delete newUser.password2;
      token = (await request(server).post('/api/users/login').send(newUser)).body.token;
    });
    afterAll(async () => {
      User.deleteMany({});
      Post.deleteMany({});
      token = '';
    });

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
    beforeAll(async () => {
      await request(server).post('/api/users/register').send(newUser);
      delete newUser.password2;
      token = (await request(server).post('/api/users/login').send(newUser)).body.token;
    });
    afterAll(async () => {
      User.deleteMany({});
      Post.deleteMany({});
      token = '';
    });

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

  describe('POST api/posts/comment/:id', () => {
    beforeAll(async () => {
      await request(server).post('/api/users/register').send(newUser);
      delete newUser.password2;
      token = (await request(server).post('/api/users/login').send(newUser)).body.token;
    });
    afterAll(async () => {
      User.deleteMany({});
      Post.deleteMany({});
      token = '';
    });

    it('should return status 401 when user isnt authorized', async () => {
      const res = await request(server).post('/api/posts/comment/test');

      expect(res.status).toBe(401);
    });

    it('should return status 400 when users data didnt pass validation', async () => {
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

    it('should return status 404 with message when no posts find with that ID', async () => {
      const res = await request(server)
        .post('/api/posts/comment/test')
        .set('Authorization', token)
        .send({ text: '12345678910' }); // for validation requirement

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({ postNotFound: 'No post found' });
    });

    it('should add users comment and return post if user provided valid data', async () => {
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
    beforeAll(async () => {
      await request(server).post('/api/users/register').send(newUser);
      delete newUser.password2;
      token = (await request(server).post('/api/users/login').send(newUser)).body.token;
    });
    afterAll(async () => {
      User.deleteMany({});
      Post.deleteMany({});
      token = '';
    });

    it('should return status 401 when user isnt authorized', async () => {
      const res = await request(server).delete('/api/posts/comment/post_id/comment_id');

      expect(res.status).toBe(401);
    });

    it('should return status 404 with message when no posts find with that ID', async () => {
      const res = await request(server)
        .delete('/api/posts/comment/test/comment_id')
        .set('Authorization', token);

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({ postNotFound: 'No post found' });
    });

    it('should return status 404 with message when user tries to delete comment that doesnt exist', async () => {
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

    it('should remove existing comment if user provided valid data', async () => {
      // create post
      const postId = (await request(server)
        .post('/api/posts/')
        .set('Authorization', token)
        .send(post)).body._id;

      // post comment
      const commentId = (await request(server)
        .post(`/api/posts/comment/${postId}`)
        .set('Authorization', token)
        .send({ text: '12345678910' })) // for validation requirement
        .body.comments[0]._id;

      // delete comment
      const res = await request(server)
        .delete(`/api/posts/comment/${postId}/${commentId}`)
        .set('Authorization', token);

      expect(res.body).toHaveProperty('text', post.text);
    });
  });
});