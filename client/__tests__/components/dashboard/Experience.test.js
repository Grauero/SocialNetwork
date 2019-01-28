import React from 'react';
import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';

import { Experience } from '../../../src/components/dashboard/Experience';

const _id = 'testId';
const props = {
  experience: [{ _id }],
  deleteExperience: jest.fn()
};

const component = mount(<Experience {...props} />);

it('deletes selected education by pressing button', () => {
  component.find('button').simulate('click');

  expect(props.deleteExperience).toHaveBeenCalled();
  expect(props.deleteExperience).toHaveBeenCalledTimes(1);
  expect(props.deleteExperience).toHaveBeenCalledWith(_id);
});

it('matches snapshot', () => {
  const testProps = Object.assign({}, props, { experience: [] });
  const component = mount(<Experience {...testProps} />);

  expect(toJSON(component)).toMatchSnapshot();
});
