import {
  ADD_POST,
  POST_LOADING,
  GET_POSTS,
  GET_POST,
  DELETE_POST
} from '../src/store/types';
import postReducer from '../src/store/reducers/postReducer';

describe('post reducer', () => {
  const initialState = {
    posts: [],
    post: {},
    loading: false
  };

  it('should return initial state if fails to proceed action', () => {
    const res = postReducer(initialState, 'UNKNOWN_ACTION');

    expect(res).toEqual(initialState);
  });

  it('should switch loading field to true if ACTION.TYPE is POST_LOADING', () => {
    const res = postReducer(initialState, { type: POST_LOADING });

    expect(res.loading).not.toBe(initialState.loading);
    expect(res.loading).toBe(true);
    expect(res.post).toBe(initialState.post);
    expect(res.posts).toEqual(initialState.posts);
  });

  describe('GET_POSTS', () => {
    const action = {
      type: GET_POSTS,
      payload: 'payload'
    };

    it('should set posts field as a ACTION.PAYLOAD', () => {
      const res = postReducer(initialState, action);

      expect(res.posts).toEqual(action.payload);
      expect(res.posts).not.toBe(initialState.profile);
      expect(res.post).toBe(initialState.post);
    });

    it('should switch loading field to false', () => {
      const res = postReducer(initialState, action);

      expect(res.loading).toBe(false);
      expect(res.post).toBe(initialState.post);
    });
  });

  describe('GET_POST', () => {
    const action = {
      type: GET_POST,
      payload: 'payload'
    };

    it('should set post field as a ACTION.PAYLOAD', () => {
      const res = postReducer(initialState, action);

      expect(res.post).toBe(action.payload);
      expect(res.post).not.toBe(initialState.post);
      expect(res.posts).toEqual(initialState.posts);
    });

    it('should switch loading field to false', () => {
      const res = postReducer(initialState, action);

      expect(res.loading).toBe(false);
      expect(res.posts).toEqual(initialState.posts);
    });
  });

  it('should add new post from ACTION.PAYLOAD to posts array if ACTION.TYPE is ADD_POST', () => {
    const action = { type: ADD_POST, payload: 'new post' };
    let res = postReducer(initialState, action);

    expect(res.loading).toBe(initialState.loading);
    expect(res.post).toEqual(initialState.post);
    expect(res.posts).not.toEqual(initialState.posts);
    expect(res.posts.length).toBeGreaterThan(initialState.posts.length);
    expect(res.posts.length).toBe(1);
    expect(res.posts).toContain(action.payload);

    res = postReducer(res, action);

    expect(res.posts.length).toBe(2);
  });

  describe('DELETE_POST', () => {
    it('should delete post with ID equal to ACTION.PAYLOAD from posts array', () => {
      const initialState = {
        posts: [{ _id: 1 }, { _id: 2 }, { _id: 3 }],
        post: {},
        loading: false
      };
      const action = { type: DELETE_POST, payload: 1 };
      const res = postReducer(initialState, action);

      expect(res.loading).toBe(initialState.loading);
      expect(res.post).toEqual(initialState.post);
      expect(res.posts).not.toEqual(initialState.posts);
      expect(res.posts.length).toBeLessThan(initialState.posts.length);
      expect(res.posts).not.toContain(action.payload);
    });

    it('should NOT delete post if provided ID doesnt exists in posts array', () => {
      const initialState = {
        posts: [{ _id: 1 }, { _id: 2 }, { _id: 3 }],
        post: {},
        loading: false
      };
      const action = { type: DELETE_POST, payload: 4 };
      const res = postReducer(initialState, action);

      expect(res.loading).toBe(initialState.loading);
      expect(res.post).toEqual(initialState.post);
      expect(res.posts).toEqual(initialState.posts);
      expect(res.posts.length).toBe(initialState.posts.length);
      expect(res.posts).not.toContain(action.payload);
    });
  });
});
