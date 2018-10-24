const request = require('supertest');

const Profile = require('../models/Profile');

let server;

describe('/api/profile', () => {
  beforeEach(() => { server = require('../server'); });
  afterEach(() => { server.close(); });

  describe('GET /all', () => {
    afterEach(async () => {
      await Profile.deleteMany({});
    });

    it('should return all profiles', async () => {
      const profile = {
        handle: 'handle',
        status: 'status',
        skills: ['skill1', 'skill2']
      };

      await new Profile(profile).save();

      const res = await request(server).get('/api/profile/all/');
      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty('handle', profile.handle);
      expect(res.body[0]).toHaveProperty('status', profile.status);
      expect(res.body[0]).toHaveProperty('skills', profile.skills);
    });

    it('should return status 404 when no profiles exists', async () => {
      const res = await request(server).get('/api/profile/all/');
      expect(res.status).toBe(404);
    });
  });
});
