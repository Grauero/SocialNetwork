import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE
} from '../../../src/store/types';
import profileReducer from '../../../src/store/reducers/profileReducer';

const initialState = {
  profile: 'profile',
  profiles: 'profiles',
  loading: false
};

it('returns initial state if fails to proceed action', () => {
  const res = profileReducer(initialState, 'UNKNOWN_ACTION');

  expect(res).toEqual(initialState);
});

it('switches loading field to true if ACTION.TYPE is PROFILE_LOADING', () => {
  const res = profileReducer(initialState, { type: PROFILE_LOADING });

  expect(res.loading).not.toBe(initialState.loading);
  expect(res.loading).toBe(true);
  expect(res.profile).toBe(initialState.profile);
  expect(res.profiles).toBe(initialState.profiles);
});

it('sets profile field to NULL if ACTION.TYPE is CLEAR_CURRENT_PROFILE', () => {
  const res = profileReducer(initialState, { type: CLEAR_CURRENT_PROFILE });

  expect(res.profile).toBeNull();
  expect(res.profile).not.toBe(initialState.profile);
  expect(res.profiles).toBe(initialState.profiles);
});

describe('GET_PROFILE', () => {
  const action = {
    type: GET_PROFILE,
    payload: 'payload'
  };

  it('sets profile field as ACTION.PAYLOAD', () => {
    const res = profileReducer(initialState, action);

    expect(res.profile).toBe(action.payload);
    expect(res.profile).not.toBe(initialState.profile);
    expect(res.profiles).toBe(initialState.profiles);
  });

  it('switches loading field to false', () => {
    const res = profileReducer(initialState, action);

    expect(res.loading).toBe(false);
    expect(res.profiles).toBe(initialState.profiles);
  });
});

describe('GET_PROFILES', () => {
  const action = {
    type: GET_PROFILES,
    payload: 'payload'
  };

  it('sets profiles field as a ACTION.PAYLOAD', () => {
    const res = profileReducer(initialState, action);

    expect(res.profiles).toBe(action.payload);
    expect(res.profiles).not.toBe(initialState.profiles);
    expect(res.profile).toBe(initialState.profile);
  });

  it('switches loading field to false', () => {
    const res = profileReducer(initialState, action);

    expect(res.loading).toBe(false);
    expect(res.profile).toBe(initialState.profile);
  });
});
