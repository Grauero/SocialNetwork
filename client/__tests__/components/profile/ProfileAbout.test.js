import React from 'react';
import { shallow } from 'enzyme';

import ProfileAbout from '../../../src/components/profile/ProfileAbout';

const props = {
  profile: { user: { name: 'name' }, skills: ['skill1', 'skill2'], bio: 'bio' }
};
let component;

beforeEach(() => (component = shallow(<ProfileAbout {...props} />)));

afterEach(() => component.unmount());

it('should render users bio if its defined', () => {
  const bio = component.find('span');

  expect(bio.html()).toBe(`<span>${props.profile.bio}</span>`);
});

it('should NOT render users bio if its not defined', () => {
  const testProps = Object.assign({}, props, {
    profile: { ...props.profile, bio: '' }
  });
  component = shallow(<ProfileAbout {...testProps} />);
  const bio = component.find('span');

  expect(bio.html()).toBe(
    `<span>${props.profile.user.name} doesnt have a bio</span>`
  );
});

it('should render user skills', () => {
  const skill = component.find('.fa-check');

  expect(skill.debug()).toBeTruthy();
});
