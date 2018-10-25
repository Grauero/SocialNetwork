const request = require('supertest');

const Post = require('../models/Post');
const User = require('../models/User');

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

async function createToken() {
  await request(server).post('/api/users/register').send(newUser);
  delete newUser.password2;
  token = (await request(server).post('/api/users/login').send(newUser)).body.token;
}

describe('/api/posts', () => {
  beforeEach(() => { server = require('../server'); });
  afterEach(() => { server.close(); });

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
    beforeAll(() => createToken());
    afterAll(async () => User.deleteMany({}));

    it('should return 401 when user isnt authorized', async () => {
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
  });
});
