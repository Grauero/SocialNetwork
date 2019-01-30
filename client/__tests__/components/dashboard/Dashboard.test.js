import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { mount } from 'enzyme';

import { Dashboard } from '../../../src/components/dashboard/Dashboard';
import Spinner from '../../../src/components/common/Spinner';
import ProfileActions from '../../../src/components/dashboard/ProfileActions';
import Experience from '../../../src/components/dashboard/Experience';
import Education from '../../../src/components/dashboard/Education';

const props = {
  getCurrentProfile: jest.fn(),
  deleteAccount: jest.fn(),
  profile: {
    profile: { handle: 'handle', experience: [], education: [] },
    loading: false
  },
  auth: { user: { name: 'name' } }
};
const store = createStore(() => {});
let component;

beforeEach(
  () =>
    (component = mount(
      <BrowserRouter>
        <Provider store={store}>
          <Dashboard {...props} />
        </Provider>
      </BrowserRouter>
    ))
);

afterEach(() => component.unmount());

it('calls getCurrentProfile method when component is rendered', () => {
  expect(props.getCurrentProfile).toHaveBeenCalled();
});

it('renders <Spinner /> if users profile is null', () => {
  const testProps = Object.assign({}, props, { profile: { profile: null } });
  const component = mount(<Dashboard {...testProps} />);
  const spinner = component.find(Spinner);

  expect(spinner.debug()).toBeTruthy();
  expect(testProps.profile.profile).toBeNull();
});

it('renders <Spinner /> if profile is loading', () => {
  const testProps = Object.assign({}, props, { profile: { loading: true } });
  const component = mount(<Dashboard {...testProps} />);
  const spinnerComponent = component.find(Spinner);

  expect(spinnerComponent.debug()).toBeTruthy();
  expect(testProps.profile.loading).toBe(true);
});

it('renders <ProfileActions />, <Experience />, <Education /> component if users profile is provided', () => {
  const profileActions = component.find(ProfileActions);
  const experience = component.find(Experience);
  const education = component.find(Education);

  expect(profileActions.debug()).toBeTruthy();
  expect(experience.debug()).toBeTruthy();
  expect(education.debug()).toBeTruthy();
});

it('calls deleteAccount by pressing button', () => {
  component.find('button').simulate('click');

  expect(props.deleteAccount).toHaveBeenCalled();
  expect(props.deleteAccount).toHaveBeenCalledTimes(1);
});

it('renders message if user didnt have profile yet', () => {
  const testProps = Object.assign({}, props, { profile: { profile: {} } });
  const component = mount(
    <BrowserRouter>
      <Dashboard {...testProps} />
    </BrowserRouter>
  );
  const paragraph = component.find('p').get(1);

  expect(paragraph.props.children).toBe('You have not created profile');
});
