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

describe('GET api/profile/all', () => {
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

describe('GET api/profile/handle/:handle', () => {
  it('should return status 404 with message if requested handler doesnt exists', async () => {
    const res = await request(server).get('/api/profile/handle/1');

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ noProfile: 'Profile doesnt exist' });
  });

  it('should return users profile if requested handler exists', async () => {
    await request(server)
      .post('/api/profile/')
      .set('Authorization', token)
      .send(profile);

    const res = await request(server).get(`/api/profile/handle/${profile.handle}`);

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
    const res = await request(server).get(`/api/profile/user/${registrationResult.body._id}`);

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ noProfile: 'Profile doesnt exist' });
  });

  it('should return user profile if user provided correct data', async () => {
    await request(server)
      .post('/api/profile/')
      .set('Authorization', token)
      .send(profile);
    const res = await request(server).get(`/api/profile/user/${registrationResult.body._id}`);

    expect(res.body).toHaveProperty('bio', profile.bio);
    expect(res.body).toHaveProperty('company', profile.company);
    expect(res.body).toHaveProperty('githubUserName', profile.githubUserName);
    expect(res.body).toHaveProperty('handle', profile.handle);
  });
});
