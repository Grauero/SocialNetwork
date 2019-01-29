import React from 'react';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';

import PostFeed from '../../../src/components/posts/PostFeed';

const props = {
  posts: [{ _id: '1', post: 'post1' }, { _id: '2', post: 'post2' }]
};
const component = shallow(<PostFeed {...props} />);

it('matches snapshot for 2 posts', () => {
  expect(toJSON(component)).toMatchSnapshot();
});
