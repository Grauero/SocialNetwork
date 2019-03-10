import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { mount } from 'enzyme';

import ProfileItem from '../../../src/components/profiles/ProfileItem';

const props = {
  profile: {
    user: { avatar: 'avatar', name: 'name' },
    company: 'company',
    location: 'location',
    handle: 'handle',
    skills: ['skill1, skill2']
  }
};
let component;

beforeEach(
  () =>
    (component = mount(
      <BrowserRouter>
        <ProfileItem {...props} />
      </BrowserRouter>
    ))
);

afterEach(() => component.unmount());

it('renders profile skills', () => {
  const skill = component.find('span[data-skill]');

  expect(skill.html()).toBe(
    `<span data-skill="true">${props.profile.skills.join(',')}</span>`
  );
});

it('NOT renders company if its not defined', () => {
  const testProps = Object.assign({}, props, {
    profile: {
      ...props.profile,
      company: ''
    }
  });

  component = mount(
    <BrowserRouter>
      <ProfileItem {...testProps} />
    </BrowserRouter>
  );
  const item = component.find('span[data-company]');

  expect(item.debug()).toBe('');
});

it('NOT renders location if its not defined', () => {
  const testProps = Object.assign({}, props, {
    profile: {
      ...props.profile,
      location: ''
    }
  });

  component = mount(
    <BrowserRouter>
      <ProfileItem {...testProps} />
    </BrowserRouter>
  );
  const item = component.find('span[data-location]');

  expect(item.debug()).toBe('');
});
