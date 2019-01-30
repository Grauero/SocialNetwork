import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { mount } from 'enzyme';

import { Profiles } from '../../../src/components/profiles/Profiles';

const props = {
  profile: {
    profiles: [{ user: { avatar: 'avatar' }, skills: [], _id: 'id' }],
    loading: false
  },
  getProfiles: jest.fn()
};
let component;

beforeEach(
  () =>
    (component = mount(
      <BrowserRouter>
        <Profiles {...props} />
      </BrowserRouter>
    ))
);

afterEach(() => component.unmount());

it('calls getProfiles when component is mount', () => {
  expect(props.getProfiles).toBeCalled();
  expect(props.getProfiles).toBeCalledWith();
});

it('renders <ProfileItem /> component if profiles exists', () => {
  const profile = component.find('ProfileItem');

  expect(profile.debug()).toBeTruthy();
});

it('didnt renders items if no profiles is present', () => {
  const testProps = Object.assign({}, props, {
    profile: { ...props.profile, profiles: [] }
  });

  component = mount(
    <BrowserRouter>
      <Profiles {...testProps} />
    </BrowserRouter>
  );
  const message = component.find('h4');

  expect(message.html()).toBe('<h4>No profiles found...</h4>');
});

it('renders <Spinner /> component if profiles doesnt exists', () => {
  const testProps = Object.assign({}, props, {
    profile: { ...props.profile, profiles: null }
  });

  component = mount(
    <BrowserRouter>
      <Profiles {...testProps} />
    </BrowserRouter>
  );
  const spinner = component.find('Spinner');

  expect(spinner.debug()).toBeTruthy();
});

it('renders <Spinner /> component if profiles is loading', () => {
  const testProps = Object.assign({}, props, {
    profile: { ...props.profile, loading: true }
  });

  component = mount(
    <BrowserRouter>
      <Profiles {...testProps} />
    </BrowserRouter>
  );
  const spinner = component.find('Spinner');

  expect(spinner.debug()).toBeTruthy();
});
