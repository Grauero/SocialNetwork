import React from 'react';
import { shallow } from 'enzyme';

import ProfileHeader from '../../../src/components/profile/ProfileHeader';

const props = {
  profile: {
    user: { avatar: 'avatar', name: 'name' },
    company: 'company',
    location: 'location',
    website: 'website',
    social: {
      twitter: 'twitter',
      facebook: 'facebook',
      linkedin: 'linkedin',
      youtube: 'youtube',
      instagram: 'instagram'
    }
  }
};
let component;

beforeEach(() => (component = shallow(<ProfileHeader {...props} />)));

afterEach(() => component.unmount());

function generateTestForProps(param) {
  it(`should NOT render ${param} if its not defined`, () => {
    const testProps = Object.assign({}, props, {
      profile: {
        ...props.profile,
        social: { ...props.profile.social, [param]: '' }
      }
    });

    component = shallow(<ProfileHeader {...testProps} />);
    const item = component.find(`a[data-${param}]`);

    expect(item.debug()).toBe('');
  });
}

generateTestForProps('twitter');
generateTestForProps('facebook');
generateTestForProps('linkedin');
generateTestForProps('youtube');
generateTestForProps('instagram');

it('should NOT render company if its not defined', () => {
  const testProps = Object.assign({}, props, {
    profile: {
      ...props.profile,
      company: ''
    }
  });

  component = shallow(<ProfileHeader {...testProps} />);
  const item = component.find('span[data-company]');

  expect(item.debug()).toBe('');
});

it('should NOT render location if its not defined', () => {
  const testProps = Object.assign({}, props, {
    profile: {
      ...props.profile,
      location: ''
    }
  });

  component = shallow(<ProfileHeader {...testProps} />);
  const item = component.find('p[data-location]');

  expect(item.debug()).toBe('');
});

it('should NOT render website if its not defined', () => {
  const testProps = Object.assign({}, props, {
    profile: {
      ...props.profile,
      website: ''
    }
  });

  component = shallow(<ProfileHeader {...testProps} />);
  const item = component.find('a[data-website]');

  expect(item.debug()).toBe('');
});
