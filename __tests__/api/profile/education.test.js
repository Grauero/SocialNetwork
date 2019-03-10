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
const education = {
  // test education
  school: 'school',
  degree: 'degree',
  fieldOfStudy: 'field',
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

describe('POST api/profile/education', () => {
  it('returns status 401 when user isnt authorized', async () => {
    const res = await request(server).post('/api/profile/education');

    expect(res.status).toBe(401);
  });

  it('returns status 400 when users data didnt pass validation', async () => {
    const res = await request(server)
      .post('/api/profile/education')
      .set('Authorization', token)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({
      school: 'School field is required',
      degree: 'Degree field is required',
      fieldOfStudy: 'Field of study field is required',
      from: 'From date field is required'
    });
  });

  it('returns status 404 with message if user pass authentication but dont have profile', async () => {
    const res = await request(server)
      .post('/api/profile/education')
      .set('Authorization', token)
      .send(education);

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ handle: 'Profile doesnt exist' });
  });

  it('creates new education for users profile and returns it if user provided valid data', async () => {
    // create profile
    await request(server)
      .post('/api/profile/')
      .set('Authorization', token)
      .send(profile);

    const res = await request(server)
      .post('/api/profile/education')
      .set('Authorization', token)
      .send(education);

    expect(res.body.education[0]).toHaveProperty('school', education.school);
    expect(res.body.education[0]).toHaveProperty('degree', education.degree);
    expect(res.body.education[0]).toHaveProperty('fieldOfStudy', education.fieldOfStudy);
  });
});

describe('DELETE api/profile/education/:edu_id', () => {
  it('returns status 401 when user isnt authorized', async () => {
    const res = await request(server).delete('/api/profile/education/edu_id');

    expect(res.status).toBe(401);
  });

  it('returns status 404 with message if user pass authentication but dont have profile', async () => {
    const res = await request(server)
      .delete('/api/profile/education/edu_id')
      .set('Authorization', token);

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ handle: 'Profile doesnt exist' });
  });

  it('deletes experience from profile if user provided vavlid data', async () => {
    // create profile
    await request(server)
      .post('/api/profile/')
      .set('Authorization', token)
      .send(profile);
    // create education
    const { _id } = await request(server)
      .post('/api/profile/education')
      .set('Authorization', token)
      .send(education);

    const res = await request(server)
      .delete(`/api/profile/education/${_id}`)
      .set('Authorization', token);

    expect(res.body).toHaveProperty('bio', profile.bio);
    expect(res.body).toHaveProperty('company', profile.company);
    expect(res.body).toHaveProperty('githubUserName', profile.githubUserName);
    expect(res.body).toHaveProperty('handle', profile.handle);
  });
});
