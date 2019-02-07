import React from 'react';
import { mount } from 'enzyme';

import Spinner from '../../../src/components/common/Spinner';
import { CreateMessage } from '../../../src/components/message/CreateMessage';

const props = {
  profile: { profile: { _id: 'id' } },
  match: { params: { receiver: 'id' } },
  history: { history: 'test' },
  getCurrentProfile: jest.fn(),
  sendMessage: jest.fn()
};
const initialState = {
  title: 'title',
  message: 'message'
};
let component;

beforeEach(() => {
  component = mount(<CreateMessage {...props} />);
  component.setState(initialState);
});

afterEach(() => component.unmount());

it('calls getCurrentProfile when component is rendered', () => {
  expect(props.getCurrentProfile).toHaveBeenCalled();
});

it('handles form submit', () => {
  const expectedObj = {
    from: props.profile.profile._id,
    to: props.match.params.receiver,
    title: component.state().title,
    message: component.state().message
  };

  component.find('form').simulate('submit', { preventDefault: jest.fn() });

  expect(props.sendMessage).toHaveBeenCalled();
  expect(props.sendMessage).toHaveBeenCalledWith(expectedObj, props.history);
  expect(props.sendMessage).toHaveBeenCalledTimes(1);
});

it('handles inputs change', () => {
  const name = 'title';
  const value = 'updatedValue';
  const expectedState = Object.assign({}, initialState);
  expectedState[name] = value;

  component
    .find('input')
    .at(0)
    .simulate('change', {
      target: { name, value }
    });

  expect(component.state()).toEqual(expectedState);
});

it('renders <Spinner /> if users profile is null', () => {
  const testProps = Object.assign({}, props, { profile: { profile: null } });
  const component = mount(<CreateMessage {...testProps} />);
  const spinner = component.find(Spinner);

  expect(spinner.debug()).toBeTruthy();
});

it('renders <Spinner /> if profile is loading', () => {
  const testProps = Object.assign({}, props, { profile: { loading: true } });
  const component = mount(<CreateMessage {...testProps} />);
  const spinner = component.find(Spinner);

  expect(spinner.debug()).toBeTruthy();
});

it('renders form if user have loaded profile', () => {
  const spinner = component.find(Spinner);
  const form = component.find('form');
  const textarea = component.find('textarea');
  const input = component.find('input');

  expect(spinner.debug()).toBeFalsy();
  expect(form.debug()).toBeTruthy();
  expect(textarea.debug()).toBeTruthy();
  expect(input.debug()).toBeTruthy();
});
