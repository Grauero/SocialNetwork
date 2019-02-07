import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { mount } from 'enzyme';

import Spinner from '../../../src/components/common/Spinner';
import { MessageFeed } from '../../../src/components/message/MessageFeed';
import { Message } from '../../../src/components/message/Message';

const props = {
  profile: {
    profile: {
      messages: [
        {
          id: 'id',
          from: { handle: 'from' },
          to: { handle: 'to' },
          title: 'title',
          message: 'message'
        }
      ]
    }
  },
  getCurrentProfile: jest.fn()
};
const store = createStore(() => {});
let component;

beforeEach(() => {
  component = mount(
    <BrowserRouter>
      <Provider store={store}>
        <MessageFeed {...props} />
      </Provider>
    </BrowserRouter>
  );
});

afterEach(() => component.unmount());

it('calls getCurrentProfile when component is rendered', () => {
  expect(props.getCurrentProfile).toHaveBeenCalled();
});

it('renders <Spinner /> if users profile is null', () => {
  const testProps = Object.assign({}, props, { profile: { profile: null } });
  const component = mount(<MessageFeed {...testProps} />);
  const spinner = component.find(Spinner);

  expect(spinner.debug()).toBeTruthy();
});

it('renders <Spinner /> if profile is loading', () => {
  const testProps = Object.assign({}, props, { profile: { loading: true } });
  const component = mount(<MessageFeed {...testProps} />);
  const spinner = component.find(Spinner);

  expect(spinner.debug()).toBeTruthy();
});

it('renders messages if user have loaded profile', () => {
  const message = component.find(Message);

  expect(message.debug()).toBeTruthy();
});
