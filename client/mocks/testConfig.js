import axios from 'axios';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';

export const createMockStore = configureMockStore([thunk]);
export const store = createMockStore({});
export const mock = new MockAdapter(axios);

export const id = 'id';
export const postId = 'postId';
export const commentId = 'commentId';
export const userData = 'userData';
export const postData = 'postData';
export const profileData = 'profileData';
export const experienceData = 'experienceData';
export const educationData = 'educationData';
export const handle = 'handle';
export const history = { push: jest.fn(path => path) };
