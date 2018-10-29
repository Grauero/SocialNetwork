const request = require('supertest');

const User = require('../models/User');
const Profile = require('../models/Profile');

describe('/api/posts/', () => {
  let server;
  const newUser = { // test user
    name: 'name',
    password: 'password',
    password2: 'password',
    email: 'name@gmail.com'
  };
  const profile = { // test profile
    handle: 'handle',
    company: 'company',
    website: 'website.com',
    location: 'location',
    status: 'status',
    skills: 'skill1, skill2',
    bio: 'bio',
    githubUserName: 'github'
  };
  const experience = { // test experience
    title: 'title',
    company: 'company',
    from: new Date()
  };
  const education = { // test education
    school: 'school',
    degree: 'degree',
    fieldOfStudy: 'field',
    from: new Date()
  };
  let token; // auth token
  let registrationResult; // registration response

  beforeEach(async () => {
    server = require('../server');
    await User.deleteMany({});
    await Profile.deleteMany({});
    registrationResult = await request(server).post('/api/users/register').send(newUser);
    token = (await request(server).post('/api/users/login').send(newUser)).body.token;
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
      await request(server).post('/api/profile/').set('Authorization', token).send(profile);

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
      await request(server).post('/api/profile/').set('Authorization', token).send(profile);
      const res = await request(server).get(`/api/profile/user/${registrationResult.body._id}`);

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
      await request(server).post('/api/profile/').set('Authorization', token).send(profile);

      // create another user
      const user = {
        name: 'name',
        password: 'password',
        password2: 'password',
        email: 'test@gmail.com'
      };
      await request(server).post('/api/users/register').send(user);
      token = (await request(server).post('/api/users/login').send(user)).body.token;

      const res = await request(server).post('/api/profile/').set('Authorization', token).send(profile);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ handle: 'That handle already exists' });
    });

    it('should update users profile if profile doesnt exists and user provided valid data', async () => {
      // create profile
      await request(server).post('/api/profile/').set('Authorization', token).send(profile);

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

      const res = await request(server).post('/api/profile/').set('Authorization', token).send(updatedProfile);

      expect(res.body).toHaveProperty('handle', profile.handle);
      expect(res.body).toHaveProperty('status', profile.status);
    });
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
      await request(server).post('/api/profile/').set('Authorization', token).send(profile);

      const res = await request(server)
        .post('/api/profile/experience')
        .set('Authorization', token)
        .send(experience);

      expect(res.body.experience[0]).toHaveProperty('company', experience.company);
      expect(res.body.experience[0]).toHaveProperty('title', experience.title);
    });
  });

  describe('POST api/profile/education', () => {
    it('should return status 401 when user isnt authorized', async () => {
      const res = await request(server).post('/api/profile/education');

      expect(res.status).toBe(401);
    });

    it('should return status 400 when users data didnt pass validation', async () => {
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

    it('should return status 404 with message if user pass authentication but dont have profile', async () => {
      const res = await request(server)
        .post('/api/profile/education')
        .set('Authorization', token)
        .send(education);

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({ handle: 'Profile doesnt exist' });
    });

    it('should create new education for users profile and return it if user provided valid data', async () => {
      // create profile
      await request(server).post('/api/profile/').set('Authorization', token).send(profile);

      const res = await request(server)
        .post('/api/profile/education')
        .set('Authorization', token)
        .send(education);

      expect(res.body.education[0]).toHaveProperty('school', education.school);
      expect(res.body.education[0]).toHaveProperty('degree', education.degree);
      expect(res.body.education[0]).toHaveProperty('fieldOfStudy', education.fieldOfStudy);
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
      await request(server).post('/api/profile/').set('Authorization', token).send(profile);
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

  describe('DELETE api/profile/education/:edu_id', () => {
    it('should return status 401 when user isnt authorized', async () => {
      const res = await request(server).delete('/api/profile/education/edu_id');

      expect(res.status).toBe(401);
    });

    it('should return status 404 with message if user pass authentication but dont have profile', async () => {
      const res = await request(server)
        .delete('/api/profile/education/edu_id')
        .set('Authorization', token);

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({ handle: 'Profile doesnt exist' });
    });

    it('should delete experience from profile if user provided vavlid data', async () => {
      // create profile
      await request(server).post('/api/profile/').set('Authorization', token).send(profile);
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

  describe('DELETE api/profile', () => {
    it('should return status 401 when user isnt authorized', async () => {
      const res = await request(server).delete('/api/profile/');

      expect(res.status).toBe(401);
    });

    it('should delete user&profile and return success status', async () => {
      // create profile
      await request(server).post('/api/profile/').set('Authorization', token).send(profile);

      const res = await request(server).delete('/api/profile/').set('Authorization', token);

      expect(res.body).toMatchObject({ succes: true });
    });
  });
});
