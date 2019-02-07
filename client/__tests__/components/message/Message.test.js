import React from 'react';
import { shallow } from 'enzyme';

import { Message } from '../../../src/components/message/Message';

const props = {
  id: 'id',
  from: { handle: 'from' },
  to: { handle: 'to' },
  title: 'title',
  message: 'message',
  deleteMessage: jest.fn()
};
let component;

beforeEach(() => {
  component = shallow(<Message {...props} />);
});

afterEach(() => component.unmount());

it('renders correct link to sender profile', () => {
  const link = component.find('Link').get(0);

  expect(link.props.to).toBe(`/profile/${props.from.handle}`);
});

it('renders correct link to receiver profile', () => {
  const link = component.find('Link').get(1);

  expect(link.props.to).toBe(`/profile/${props.to.handle}`);
});

it('renders correct title', () => {
  const header = component.find('h5');

  expect(header.html()).toBe(
    `<h5 class="text-center">Title: ${props.title}</h5>`
  );
});

it('renders correct message', () => {
  const paragraph = component.find('p');

  expect(paragraph.html()).toBe(`<p>${props.message}</p>`);
});

it('calls deleteMessage by pressing button', () => {
  component.find('i').simulate('click');

  expect(props.deleteMessage).toHaveBeenCalled();
  expect(props.deleteMessage).toHaveBeenCalledWith(props.id);
});
