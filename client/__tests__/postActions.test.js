import * as actionCreators from '../src/store/actions/postActions';
import { POST_LOADING, CLEAR_ERRORS } from '../src/store/types';

describe('sync post action creators', () => {
  describe('setPostLoading', () => {
    it('should create an action POST_LOADING', () => {
      const expectedAction = { type: POST_LOADING };

      expect(actionCreators.setPostLoading()).toEqual(expectedAction);
    });
  });

  describe('clearErrors', () => {
    it('should create an action CLEAR_ERRORS', () => {
      const expectedAction = { type: CLEAR_ERRORS };

      expect(actionCreators.clearErrors()).toEqual(expectedAction);
    });
  });
});
