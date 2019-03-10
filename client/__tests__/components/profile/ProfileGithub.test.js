import React from 'react';
import { shallow } from 'enzyme';

import ProfileGithub from '../../../src/components/profile/ProfileGithub';
import { githubMockData } from '../../../mocks/testConfig';

const props = { username: 'username' };
const initialState = {
  clientId: 'clientId',
  clientSecret: 'clientSecret',
  count: 5,
  sort: 'created: asc',
  repos: githubMockData
};
let component;

beforeEach(() => {
  component = shallow(<ProfileGithub {...props} />);
  component.setState(initialState);
});

afterEach(() => component.unmount());

it('makes request to github API with provided data', () => {
  // mock fetch call to github API
  jest.spyOn(global, 'fetch').mockImplementation(jest.fn());

  const githubAPI = `https://api.github.com/users/${
    props.username
  }/repos?per_page=${initialState.count}&sort=${
    initialState.sort
  }&client_id=undefined&client_secret=undefined`;

  expect(fetch).toHaveBeenCalled();
  expect(fetch).toHaveBeenCalledWith(githubAPI);
  component.setState(initialState);
});

it('renders repos from state', () => {
  component = shallow(<ProfileGithub {...props} />, {
    disableLifecycleMethods: true
  });
  component.setState(initialState);

  const repos = component.find('.card');
  const reposDescription = component.find('p');

  expect(repos.length).toBe(2);
  expect(reposDescription.length).toBe(2);
});
