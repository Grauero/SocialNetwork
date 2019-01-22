import { GET_ERRORS, CLEAR_ERRORS } from '../src/store/types';
import errorsReducer from '../src/store/reducers/errorsReducer';

describe('errors reducer', () => {
  const initialState = { state: 'initial' };

  it('should return initial state if fails to proceed action', () => {
    const res = errorsReducer(initialState, 'UNKNOWN_ACTION');

    expect(res).toEqual(initialState);
  });

  it('should return {} if ACTION.TYPE is CLEAR_ERRORS', () => {
    const res = errorsReducer(initialState, { type: CLEAR_ERRORS });

    expect(res).toEqual({});
  });

  it('should return ACTION.PAYLOAD if ACTION.TYPE is GET_ERRORS', () => {
    const action = { type: GET_ERRORS, payload: 'payload' };
    const res = errorsReducer(initialState, action);

    expect(res).toBe(action.payload);
  });
});
