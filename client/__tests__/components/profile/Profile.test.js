import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { mount, shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';

import { Profile } from '../../../src/components/profile/Profile';

const props = {
  profile: {
    profile: {
      education: [],
      experience: [],
      user: { name: 'name' },
      skills: []
    },
    loading: false
  },
  match: { params: { handle: 'handle' } },
  history: { push: jest.fn() },
  getProfileByHandle: jest.fn()
};
let component;

beforeEach(
  () =>
    (component = mount(
      <BrowserRouter>
        <Profile {...props} />
      </BrowserRouter>
    ))
);

afterEach(() => component.unmount());

it('calls getProfileByHandle when component is mount', () => {
  expect(props.getProfileByHandle).toHaveBeenCalled();
  expect(props.getProfileByHandle).toHaveBeenCalledWith(
    props.match.params.handle
  );
});

it('renders <ProfileHeader />, <ProfileAbout />, <ProfileCreds /> components if profile exists', () => {
  const profileHeader = component.find('ProfileHeader');
  const profileAbout = component.find('ProfileAbout');
  const profileCreds = component.find('ProfileCreds');

  expect(profileHeader.debug()).toBeTruthy();
  expect(profileAbout.debug()).toBeTruthy();
  expect(profileCreds.debug()).toBeTruthy();
});

it('renders <ProfileGithub /> component if user have github user name in profile', () => {
  const testProps = Object.assign({}, props, {
    profile: { profile: { ...props.profile.profile, githubUserName: 'name' } }
  });
  component = shallow(<Profile {...testProps} />);
  const githubUserName = component.find('ProfileGithub');

  expect(toJSON(githubUserName)).toMatchSnapshot();
});

it('did NOT renders <ProfileGithub /> component if user dont have github user name in profile', () => {
  const githubUserName = component.find('ProfileGithub');

  expect(githubUserName.debug()).toBeFalsy();
});

it('renders <Spinner /> component if profile doesnt exists', () => {
  const testProps = Object.assign({}, props, {
    profile: { profile: null }
  });

  component = mount(
    <BrowserRouter>
      <Profile {...testProps} />
    </BrowserRouter>
  );
  const spinner = component.find('Spinner');

  expect(toJSON(spinner)).toMatchSnapshot();
});

it('renders <Spinner /> component if profile loading', () => {
  const testProps = Object.assign({}, props, {
    profile: { ...props.profile, loading: true }
  });

  component = mount(
    <BrowserRouter>
      <Profile {...testProps} />
    </BrowserRouter>
  );
  const spinner = component.find('Spinner');

  expect(toJSON(spinner)).toMatchSnapshot();
});
