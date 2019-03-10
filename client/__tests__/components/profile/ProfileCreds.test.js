import React from 'react';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';

import ProfileCreds from '../../../src/components/profile/ProfileCreds';

const props = {
  experience: [
    {
      _id: 'id',
      company: 'company',
      from: 'from',
      to: 'to',
      title: 'title',
      location: 'location',
      description: 'description'
    }
  ],
  education: [
    {
      _id: 'id',
      school: 'school',
      from: 'from',
      to: 'to',
      degree: 'degree',
      fieldOfStudy: 'field',
      description: 'description'
    }
  ]
};
let component;

beforeEach(() => (component = shallow(<ProfileCreds {...props} />)));

afterEach(() => component.unmount());

function generateTestForProps(category, param) {
  it(`NOT renders ${param} if its not defined`, () => {
    const testProps = Object.assign({}, props, {
      [category]: [{ ...props[category][0], [param]: '' }]
    });

    component = shallow(<ProfileCreds {...testProps} />);
    const ul = component.find(`ul[data-${param}]`);
    const item = ul.find(`span[data-${param}]`);

    expect(item.debug()).toBe('');
  });
}

generateTestForProps('experience', 'location');
generateTestForProps('experience', 'description');
generateTestForProps('education', 'description');

it('matches snapshot', () => {
  expect(toJSON(component)).toMatchSnapshot();
});

it('NOT renders any experience if experience is empty', () => {
  const testProps = Object.assign({}, props, { experience: [] });

  component = shallow(<ProfileCreds {...testProps} />);
  const ul = component.find('ul[data-experience]');

  expect(ul.debug()).toBe('');
});

it('NOT renders any education if education is empty', () => {
  const testProps = Object.assign({}, props, { education: [] });

  component = shallow(<ProfileCreds {...testProps} />);
  const ul = component.find('ul[data-education]');

  expect(ul.debug()).toBe('');
});
