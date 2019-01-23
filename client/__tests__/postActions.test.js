import axios from 'axios';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';

import * as actionCreators from '../src/store/actions/postActions';
import {
  ADD_POST,
  GET_ERRORS,
  GET_POSTS,
  GET_POST,
  POST_LOADING,
  DELETE_POST,
  CLEAR_ERRORS
} from '../src/store/types';

const createMockStore = configureMockStore([thunk]);
const store = createMockStore({});

describe('sync post action creators', () => {
  it('should create an action POST_LOADING', () => {
    const expectedAction = { type: POST_LOADING };

    expect(actionCreators.setPostLoading()).toEqual(expectedAction);
  });

  it('should create an action CLEAR_ERRORS', () => {
    const expectedAction = { type: CLEAR_ERRORS };

    expect(actionCreators.clearErrors()).toEqual(expectedAction);
  });
});

describe('async auth action creators', () => {
  const mock = new MockAdapter(axios);
  afterEach(() => store.clearActions());

  describe('addPost', () => {
    const postData = 'postData';
    beforeEach(() =>
      mock.onPost('/api/posts').reply(function() {
        return new Promise((resolve, reject) =>
          resolve([200, { test: 'test' }])
        );
      })
    );
    afterEach(() => mock.reset());

    it('should make POST request to /api/posts', async () => {
      await store.dispatch(actionCreators.addPost(postData));

      expect(mock.history.post[0].data).toBe(postData);
    });

    it('should dispatch action CLEAR_ERRORS', async () => {
      const expectedAction = { type: CLEAR_ERRORS };
      await store.dispatch(actionCreators.addPost(postData));

      expect(store.getActions()[0]).toEqual(expectedAction);
    });

    it('should dispatch action ADD_POST', async () => {
      const expectedAction = { payload: { test: 'test' }, type: ADD_POST };
      await store.dispatch(actionCreators.addPost(postData));

      expect(store.getActions()[1]).toEqual(expectedAction);
    });

    it('should dispatch action GET_ERRORS if error is happened', () => {
      const expectedAction = { type: GET_ERRORS, payload: 'error' };
      const dispatch = jest.fn(() => {
        throw expectedAction;
      });

      actionCreators
        .addPost()(dispatch)
        .catch(err => expect(err).toEqual(expectedAction));
    });
  });

  describe('getPosts', () => {
    beforeEach(() =>
      mock.onGet('/api/posts').reply(function() {
        return new Promise((resolve, reject) =>
          resolve([200, { test: 'test' }])
        );
      })
    );
    afterEach(() => mock.reset());

    it('should make GET request to /api/posts', async () => {
      await store.dispatch(actionCreators.getPosts());

      expect(mock.history.get[0].url).toBe('/api/posts');
    });

    it('should dispatch action POST_LOADING', async () => {
      const expectedAction = { type: POST_LOADING };
      await store.dispatch(actionCreators.getPosts());

      expect(store.getActions()[0]).toEqual(expectedAction);
    });

    it('should dispatch action GET_POSTS', async () => {
      const expectedAction = { payload: { test: 'test' }, type: GET_POSTS };
      await store.dispatch(actionCreators.getPosts());

      expect(store.getActions()[1]).toEqual(expectedAction);
    });

    it('should dispatch action GET_POSTS if error is happened', async () => {
      const expectedAction = { payload: null, type: GET_POSTS };
      mock.onGet('/api/posts').reply(404);
      await store.dispatch(actionCreators.getPosts());

      expect(store.getActions()[1]).toEqual(expectedAction);
    });
  });

  describe('getPost', () => {
    const id = 'id';
    beforeEach(() =>
      mock.onGet(`/api/posts/${id}`).reply(function() {
        return new Promise((resolve, reject) =>
          resolve([200, { test: 'test' }])
        );
      })
    );
    afterEach(() => mock.reset());

    it('should make GET request to /api/posts/id', async () => {
      await store.dispatch(actionCreators.getPost(id));

      expect(mock.history.get[0].url).toBe(`/api/posts/${id}`);
    });

    it('should dispatch action POST_LOADING', async () => {
      const expectedAction = { type: POST_LOADING };
      await store.dispatch(actionCreators.getPost(id));

      expect(store.getActions()[0]).toEqual(expectedAction);
    });

    it('should dispatch action GET_POST', async () => {
      const expectedAction = { payload: { test: 'test' }, type: GET_POST };
      await store.dispatch(actionCreators.getPost(id));

      expect(store.getActions()[1]).toEqual(expectedAction);
    });

    it('should dispatch action GET_POST if error is happened', async () => {
      const expectedAction = { type: GET_POST, payload: null };
      mock.onGet(`/api/posts/${id}`).reply(404);
      await store.dispatch(actionCreators.getPost(id));

      expect(store.getActions()[1]).toEqual(expectedAction);
    });
  });

  describe('deletePost', () => {
    const id = 'id';
    beforeEach(() =>
      mock.onDelete(`/api/posts/${id}`).reply(function() {
        return new Promise((resolve, reject) =>
          resolve([200, { test: 'test' }])
        );
      })
    );
    afterEach(() => mock.reset());

    it('should make DELETE request to /api/posts/id', async () => {
      await store.dispatch(actionCreators.deletePost(id));

      expect(mock.history.delete[0].url).toBe(`/api/posts/${id}`);
    });

    it('should dispatch action DELETE_POST', async () => {
      const expectedAction = { payload: id, type: DELETE_POST };
      await store.dispatch(actionCreators.deletePost(id));

      expect(store.getActions()[0]).toEqual(expectedAction);
    });

    it('should dispatch action GET_ERRORS if error is happened', async () => {
      const expectedAction = { payload: undefined, type: GET_ERRORS };
      mock.onDelete(`/api/posts/${id}`).reply(404);
      await store.dispatch(actionCreators.deletePost(id));

      expect(store.getActions()[0]).toEqual(expectedAction);
    });
  });

  describe('addComent', () => {
    const id = 'id';
    beforeEach(() =>
      mock.onPost(`/api/posts/comment/${id}`).reply(function() {
        return new Promise((resolve, reject) =>
          resolve([200, { test: 'test' }])
        );
      })
    );
    afterEach(() => mock.reset());

    it('should make POST request to /api/posts/comment/id', async () => {
      await store.dispatch(actionCreators.addComment(id));

      expect(mock.history.post[0].url).toBe(`/api/posts/comment/${id}`);
    });

    it('should dispatch action CLEAR_ERRORS', async () => {
      const expectedAction = { type: CLEAR_ERRORS };
      await store.dispatch(actionCreators.addComment(id));

      expect(store.getActions()[0]).toEqual(expectedAction);
    });

    it('should dispatch action GET_POST', async () => {
      const expectedAction = { payload: { test: 'test' }, type: GET_POST };
      await store.dispatch(actionCreators.addComment(id));

      expect(store.getActions()[1]).toEqual(expectedAction);
    });

    it('should dispatch action GET_ERRORS if error is happened', async () => {
      const expectedAction = { payload: undefined, type: GET_ERRORS };
      mock.onPost(`/api/posts/comment/${id}`).reply(404);
      await store.dispatch(actionCreators.addComment(id));

      expect(store.getActions()[1]).toEqual(expectedAction);
    });
  });

  describe('deleteComment', () => {
    const postId = 'postId';
    const commentId = 'commentId';
    beforeEach(() =>
      mock
        .onDelete(`/api/posts/comment/${postId}/${commentId}`)
        .reply(function() {
          return new Promise((resolve, reject) =>
            resolve([200, { test: 'test' }])
          );
        })
    );
    afterEach(() => mock.reset());

    it('should make DELETE request to /api/posts/comment/postId/commentId', async () => {
      await store.dispatch(actionCreators.deleteComment(postId, commentId));

      expect(mock.history.delete[0].url).toBe(
        `/api/posts/comment/${postId}/${commentId}`
      );
    });

    it('should dispatch action GET_POST', async () => {
      const expectedAction = { payload: { test: 'test' }, type: GET_POST };
      await store.dispatch(actionCreators.deleteComment(postId, commentId));

      expect(store.getActions()[0]).toEqual(expectedAction);
    });

    it('should dispatch action GET_ERRORS if error is happened', async () => {
      const expectedAction = { payload: undefined, type: GET_ERRORS };
      mock.onDelete(`/api/posts/comment/${postId}/${commentId}`).reply(404);
      await store.dispatch(actionCreators.deleteComment(postId, commentId));

      expect(store.getActions()[0]).toEqual(expectedAction);
    });
  });

  describe('addLike', () => {
    const id = 'id';
    beforeEach(() => {
      mock.onPost(`/api/posts/like/${id}`).reply(function() {
        return new Promise((resolve, reject) =>
          resolve([200, { test: 'test' }])
        );
      });
    });
    afterEach(() => mock.reset());

    it('should make POST request to /api/posts/like/id', async () => {
      await store.dispatch(actionCreators.addLike(id));

      expect(mock.history.post[0].url).toBe(`/api/posts/like/${id}`);
    });

    it('should dispatch action POST_LOADING', async () => {
      const expectedAction = { type: POST_LOADING };
      await store.dispatch(actionCreators.addLike(id));

      expect(store.getActions()[0]).toEqual(expectedAction);
    });

    it('should dispatch action GET_ERRORS if error is happened', async () => {
      const expectedAction = { payload: undefined, type: GET_ERRORS };
      mock.onPost(`/api/posts/like/${id}`).reply(404);
      await store.dispatch(actionCreators.addLike(id));

      expect(store.getActions()[0]).toEqual(expectedAction);
    });
  });

  describe('removeLike', () => {
    const id = 'id';
    beforeEach(() => {
      mock.onPost(`/api/posts/unlike/${id}`).reply(function() {
        return new Promise((resolve, reject) =>
          resolve([200, { test: 'test' }])
        );
      });
    });
    afterEach(() => mock.reset());

    it('should make POST request to /api/posts/unlike/id', async () => {
      await store.dispatch(actionCreators.removeLike(id));

      expect(mock.history.post[0].url).toBe(`/api/posts/unlike/${id}`);
    });

    it('should dispatch action POST_LOADING', async () => {
      const expectedAction = { type: POST_LOADING };
      await store.dispatch(actionCreators.removeLike(id));

      expect(store.getActions()[0]).toEqual(expectedAction);
    });

    it('should dispatch action GET_ERRORS if error is happened', async () => {
      const expectedAction = { payload: undefined, type: GET_ERRORS };
      mock.onPost(`/api/posts/unlike/${id}`).reply(404);
      await store.dispatch(actionCreators.removeLike(id));

      expect(store.getActions()[0]).toEqual(expectedAction);
    });
  });
});
