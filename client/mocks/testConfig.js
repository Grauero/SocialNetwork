import axios from 'axios';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';

export const createMockStore = configureMockStore([thunk]);
export const store = createMockStore({});
export const mock = new MockAdapter(axios);

export const id = 'id';
export const token =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjNWIzZmU4YTYzZTA0ODcyYzIzNjM3NCIsIm5hbWUiOiJ1c2VyMSIsImF2YXRhciI6Ii8vd3d3LmdyYXZhdGFyLmNvbS9hdmF0YXIvNTkwMjkyNzY5NTU2NzczNTE0MjFiM2ZmNmJmNWVlNGM_cz0yMDAmcj1wZyZkPW0iLCJpYXQiOjE1NDk1NjYzNTcsImV4cCI6MTU0OTU2OTk1N30.LjTyTssCIdXp6_8Wf5fonrg43hUkYsGqmbc4VVP1LQU';
export const postId = 'postId';
export const commentId = 'commentId';
export const userData = 'userData';
export const postData = 'postData';
export const profileData = 'profileData';
export const experienceData = 'experienceData';
export const educationData = 'educationData';
export const handle = 'handle';
export const history = { push: jest.fn(path => path) };
