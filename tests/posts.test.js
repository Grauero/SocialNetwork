const request = require('supertest');

const Post = require('../models/Post');

let server;

describe('/api/posts', () => {
  beforeEach(() => { server = require('../server'); });
  afterEach(() => { server.close(); });

  const post = new Post({
    text: 'text',
    name: 'name',
    avatar: 'avatar',
    likes: [],
    comments: []
  });

  describe('GET /', () => {
    afterEach(async () => {
      await Post.deleteMany({});
    });

    it('should return all posts', async () => {
      await new Post(post).save();
      const res = await request(server).get('/api/posts/');
      expect(res.body[0]).toHaveProperty('text', post.text);
      expect(res.body[0]).toHaveProperty('name', post.name);
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
      expect(res.body).toHaveProperty('name', post.name);
    });

    it('should return status 404 when ID of post doesnt exists', async () => {
      await new Post(post).save();
      const res = await request(server).get('/api/posts/1');
      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({ noPostFound: 'No post found with that ID' });
    });
  });
});
