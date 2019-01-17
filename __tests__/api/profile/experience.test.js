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
const experience = {
  // test experience
  title: 'title',
  company: 'company',
  from: new Date()
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

describe('POST api/profile/experience', () => {
  it('should return status 401 when user isnt authorized', async () => {
    const res = await request(server).post('/api/profile/experience');

    expect(res.status).toBe(401);
  });

  it('should return status 400 when users data didnt pass validation', async () => {
    const res = await request(server)
      .post('/api/profile/experience')
      .set('Authorization', token)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({
      title: 'Job title field is required',
      company: 'Company field is required',
      from: 'From date field is required'
    });
  });

  it('should return status 404 with message if user pass authentication but dont have profile', async () => {
    const res = await request(server)
      .post('/api/profile/experience')
      .set('Authorization', token)
      .send(experience);

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ handle: 'Profile doesnt exist' });
  });

  it('should create new experience for users profile and return it if user provided valid data', async () => {
    // create profile
    await request(server)
      .post('/api/profile/')
      .set('Authorization', token)
      .send(profile);

    const res = await request(server)
      .post('/api/profile/experience')
      .set('Authorization', token)
      .send(experience);

    expect(res.body.experience[0]).toHaveProperty('company', experience.company);
    expect(res.body.experience[0]).toHaveProperty('title', experience.title);
  });
});

describe('DELETE api/profile/experience/:exp_id', () => {
  it('should return status 401 when user isnt authorized', async () => {
    const res = await request(server).delete('/api/profile/experience/exp_id');

    expect(res.status).toBe(401);
  });

  it('should return status 404 with message if user pass authentication but dont have profile', async () => {
    const res = await request(server)
      .delete('/api/profile/experience/exp_id')
      .set('Authorization', token);

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ handle: 'Profile doesnt exist' });
  });

  it('should delete experience from profile if user provided vavlid data', async () => {
    // create profile
    await request(server)
      .post('/api/profile/')
      .set('Authorization', token)
      .send(profile);
    // create experience
    const { _id } = await request(server)
      .post('/api/profile/experience')
      .set('Authorization', token)
      .send(experience);

    const res = await request(server)
      .delete(`/api/profile/experience/${_id}`)
      .set('Authorization', token);

    expect(res.body).toHaveProperty('bio', profile.bio);
    expect(res.body).toHaveProperty('company', profile.company);
    expect(res.body).toHaveProperty('githubUserName', profile.githubUserName);
    expect(res.body).toHaveProperty('handle', profile.handle);
  });
});
