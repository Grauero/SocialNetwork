const request = require('supertest');

const User = require('../../../models/User');

let server;

beforeEach(() => {
  server = require('../../../server');
});
afterEach(async () => {
  server.close();
  await User.deleteMany({});
});

describe('POST /api/users/register', () => {
  it('returns status 400 when user provided invalid data', async () => {
    const res = await request(server).post('/api/users/register');

    expect(res.status).toBe(400);
  });

  it('returns status 400 with message when Email already exists', async () => {
    const newUser = {
      name: 'name',
      password: 'password',
      password2: 'password',
      email: 'name@gmail.com'
    };

    await request(server)
      .post('/api/users/register')
      .send(newUser);
    const res = await request(server)
      .post('/api/users/register')
      .send(newUser);

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({ email: 'That email already exists' });
  });

  it('registers user if user provided unique valid data', async () => {
    const newUser = {
      name: 'name',
      password: 'password',
      password2: 'password',
      email: 'name@gmail.com'
    };
    const res = await request(server)
      .post('/api/users/register')
      .send(newUser);

    expect(res.body).toHaveProperty('email', newUser.email);
    expect(res.body).toHaveProperty('name', newUser.name);
  });
});

describe('POST /api/users/login', () => {
  it('returns status 400 when user provided invalid data', async () => {
    const res = await request(server).post('/api/users/login');

    expect(res.status).toBe(400);
  });

  it('returns status 404 with message when user not found in DB', async () => {
    const newUser = {
      name: 'name',
      password: 'password',
      password2: 'password',
      email: 'name@gmail.com'
    };
    const res = await request(server)
      .post('/api/users/login')
      .send(newUser);

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ email: 'User not found' });
  });

  it('returns status 400 with message when provided passwords didnt match', async () => {
    // register user
    const newUser = {
      name: 'name',
      password: 'password',
      password2: 'password',
      email: 'name@gmail.com'
    };
    await request(server)
      .post('/api/users/register')
      .send(newUser);

    // invalid data
    const invalidUser = {
      name: 'name',
      password: 'invalidpassword',
      email: 'name@gmail.com'
    };

    const res = await request(server)
      .post('/api/users/login')
      .send(invalidUser);

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({ password: 'Password incorrect' });
  });

  it('logins user and returns JWT token if user registered and provided valid data', async () => {
    // register user
    const newUser = {
      name: 'name',
      password: 'password',
      password2: 'password',
      email: 'name@gmail.com'
    };
    await request(server)
      .post('/api/users/register')
      .send(newUser);
    delete newUser.password2;

    const res = await request(server)
      .post('/api/users/login')
      .send(newUser);

    expect(res.body).toMatchObject({ success: true, token: res.body.token });
  });
});

describe('GET /api/users/current', () => {
  it('returns status 401 when user isnt authorized', async () => {
    const res = await request(server).get('/api/users/current');

    expect(res.status).toBe(401);
  });

  it('returns user data if user provided valid data', async () => {
    // register and login user
    const newUser = {
      name: 'name',
      password: 'password',
      password2: 'password',
      email: 'name@gmail.com'
    };
    const registeredUser = (await request(server)
      .post('/api/users/register')
      .send(newUser)).body;
    delete newUser.password2;
    const token = (await request(server)
      .post('/api/users/login')
      .send(newUser)).body.token;

    const res = await request(server)
      .get('/api/users/current')
      .set('Authorization', token);

    expect(res.body).toMatchObject({
      _id: registeredUser._id,
      name: registeredUser.name,
      email: registeredUser.email
    });
  });
});
