const request = require('supertest');

const User = require('../models/User');
const Profile = require('../models/Profile');

describe('/api/posts/', () => {
  let server;
  const newUser = {
    name: 'name',
    password: 'password',
    password2: 'password',
    email: 'name@gmail.com'
  };
  const profile = {
    handle: 'handle',
    company: 'company',
    website: 'website.com',
    location: 'location',
    status: 'status',
    skills: 'skill1, skill2',
    bio: 'bio',
    githubUserName: 'github',
    social: {
      youtube: 'youtube.com',
      twitter: 'twitter.com',
      facebook: 'facebook.com',
      linkedin: 'linkedin.com',
      instagram: 'instagram.com'
    }
  };
  let token;

  beforeAll(async () => {
    server = require('../server');
    await request(server).post('/api/users/register').send(newUser);
    delete newUser.password2;
    token = (await request(server).post('/api/users/login').send(newUser)).body.token;
  });
  beforeEach(async () => { server = require('../server'); });
  afterEach(() => server.close());
  afterAll(() => { User.deleteMany({}); Profile.deleteMany({}); token = ''; });

  describe('GET api/profile/', () => {
    beforeEach(() => Profile.deleteMany({}));
    it('should return status 401 when user isnt authorized', async () => {
      const res = await request(server).get('/api/profile/');

      expect(res.status).toBe(401);
    });

    it('should return status 404 with message if user pass authentication but dont have profile', async () => {
      const res = await request(server).get('/api/profile/').set('Authorization', token);

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({ noProfile: 'There is no profile' });
    });

    it('should return users profile if it exists', async () => {
      // create profile for user
      await request(server).post('/api/profile/').set('Authorization', token).send(profile);
      const res = await request(server).get('/api/profile/').set('Authorization', token);

      expect(res.body).toHaveProperty('bio', profile.bio);
      expect(res.body).toHaveProperty('company', profile.company);
      expect(res.body).toHaveProperty('githubUserName', profile.githubUserName);
      expect(res.body).toHaveProperty('handle', profile.handle);
    });
  });

  describe('GET /all', () => {
    afterEach(async () => {
      await Profile.deleteMany({});
    });

    it('should return all profiles', async () => {
      await new Profile(profile).save();
      const res = await request(server).get('/api/profile/all/');

      expect(res.body.some(obj => obj.handle === profile.handle)).toBeTruthy();
      expect(res.body.some(obj => obj.status === profile.status)).toBeTruthy();
    });

    it('should return status 404 when no profiles exists', async () => {
      const res = await request(server).get('/api/profile/all/');

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({ noProfiles: 'There are no profiles' });
    });
  });

  describe('POST api/profile/', () => {
    it('should return status 401 when user isnt authorized', async () => {
      const res = await request(server).post('/api/profile/');

      expect(res.status).toBe(401);
    });

    it('should return status 400 when users data didnt pass validation', async () => {
      const res = await request(server)
        .post('/api/profile/')
        .set('Authorization', token)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        handle: 'Profile handle is required',
        status: 'Status field is required',
        skills: 'Skills field is required'
      });
    });

    it('should update users profile if profile already exists and user passed authentication and validation', async () => {
      const res = await request(server)
        .post('/api/profile/')
        .set('Authorization', token)
        .send(profile);

      expect(res.body).toHaveProperty('bio', profile.bio);
      expect(res.body).toHaveProperty('company', profile.company);
      expect(res.body).toHaveProperty('githubUserName', profile.githubUserName);
      expect(res.body).toHaveProperty('handle', profile.handle);
    });
  });

  describe('GET api/profile/user/user_id', () => {
    it('should return status 404 with message if user with that id doesnt exists', async () => {
      const res = await request(server).get('/api/profile/user/fake_id');

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({ handle: 'User doesnt exist' });
    });

    it('should return status 404 with message if users profile doesnt exists', async () => {
      // create user
      const user = {
        name: 'name123',
        password: 'password',
        password2: 'password',
        email: 'name123@gmail.com'
      };
      const Id = (await request(server).post('/api/users/register').send(user)).body._id;
      delete user.password2;
      token = (await request(server).post('/api/users/login').send(user)).body.token;

      const res = await request(server).get(`/api/profile/user/${Id}`);

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({ noProfile: 'Profile doesnt exist' });
    });
  });
});
