const request = require('supertest');

const User = require('../../../models/User');
const Profile = require('../../../models/Profile');

let server;
const newUser = {
  // test user
  name: 'name',
  password: 'password',
  password2: 'password',
  email: 'name@gmail.com'
};
const profile = {
  // test profile
  handle: 'handle',
  company: 'company',
  website: 'website.com',
  location: 'location',
  status: 'status',
  skills: 'skill1, skill2',
  bio: 'bio',
  githubUserName: 'github'
};
let token; // auth token
let registrationResult; // registration response

beforeEach(async () => {
  server = require('../../../server');
  await User.deleteMany({});
  await Profile.deleteMany({});
  registrationResult = await request(server)
    .post('/api/users/register')
    .send(newUser);
  token = (await request(server)
    .post('/api/users/login')
    .send(newUser)).body.token;
});
afterEach(() => server.close());
afterAll(async () => {
  await User.deleteMany({});
  await Profile.deleteMany({});
  token = '';
});

describe('GET api/profile/', () => {
  it('should return status 401 when user isnt authorized', async () => {
    const res = await request(server).get('/api/profile/');

    expect(res.status).toBe(401);
  });

  it('should return status 404 with message if user pass authentication but dont have profile', async () => {
    const res = await request(server)
      .get('/api/profile/')
      .set('Authorization', token);

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ noProfile: 'There is no profile' });
  });

  it('should return users profile if it exists', async () => {
    // create profile for user
    await request(server)
      .post('/api/profile/')
      .set('Authorization', token)
      .send(profile);
    const res = await request(server)
      .get('/api/profile/')
      .set('Authorization', token);

    expect(res.body).toHaveProperty('bio', profile.bio);
    expect(res.body).toHaveProperty('company', profile.company);
    expect(res.body).toHaveProperty('githubUserName', profile.githubUserName);
    expect(res.body).toHaveProperty('handle', profile.handle);
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

  it('should create users profile if user passed authentication and validation', async () => {
    const res = await request(server)
      .post('/api/profile/')
      .set('Authorization', token)
      .send(profile);

    expect(res.body).toHaveProperty('bio', profile.bio);
    expect(res.body).toHaveProperty('company', profile.company);
    expect(res.body).toHaveProperty('githubUserName', profile.githubUserName);
    expect(res.body).toHaveProperty('handle', profile.handle);
  });

  it('should return status 400 with message if provided handler already exists', async () => {
    // create profile
    await request(server)
      .post('/api/profile/')
      .set('Authorization', token)
      .send(profile);

    // create another user
    const user = {
      name: 'name',
      password: 'password',
      password2: 'password',
      email: 'test@gmail.com'
    };
    await request(server)
      .post('/api/users/register')
      .send(user);
    token = (await request(server)
      .post('/api/users/login')
      .send(user)).body.token;

    const res = await request(server)
      .post('/api/profile/')
      .set('Authorization', token)
      .send(profile);

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({ handle: 'That handle already exists' });
  });

  it('should update users profile if profile doesnt exists and user provided valid data', async () => {
    // create profile
    await request(server)
      .post('/api/profile/')
      .set('Authorization', token)
      .send(profile);

    // update profile
    const updatedProfile = Object.assign({}, profile, {
      company: '',
      website: '',
      location: '',
      bio: '',
      githubUserName: '',
      youtube: 'youtube.com',
      twitter: 'twitter.com',
      facebook: 'facebook.com',
      linkedin: 'linkedin.com',
      instagram: 'instagram.com'
    });

    const res = await request(server)
      .post('/api/profile/')
      .set('Authorization', token)
      .send(updatedProfile);

    expect(res.body).toHaveProperty('handle', profile.handle);
    expect(res.body).toHaveProperty('status', profile.status);
  });
});

describe('DELETE api/profile', () => {
  it('should return status 401 when user isnt authorized', async () => {
    const res = await request(server).delete('/api/profile/');

    expect(res.status).toBe(401);
  });

  it('should delete user&profile and return success status', async () => {
    // create profile
    await request(server)
      .post('/api/profile/')
      .set('Authorization', token)
      .send(profile);

    const res = await request(server)
      .delete('/api/profile/')
      .set('Authorization', token);

    expect(res.body).toMatchObject({ succes: true });
  });
});
