import React from 'react';
import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';

import { Education } from '../../../src/components/dashboard/Education';

const _id = 'testId';
const props = {
  education: [{ _id }],
  deleteEducation: jest.fn()
};

const component = mount(<Education {...props} />);

it('deletes selected education by pressing button', () => {
  const deleteButton = component.find('button');
  deleteButton.simulate('click');

  expect(props.deleteEducation).toHaveBeenCalled();
  expect(props.deleteEducation).toHaveBeenCalledTimes(1);
  expect(props.deleteEducation).toHaveBeenCalledWith(_id);
});

it('matches snapshot', () => {
  const testProps = Object.assign({}, props, { education: [] });
  const component = mount(<Education {...testProps} />);

  expect(toJSON(component)).toMatchSnapshot();
});
