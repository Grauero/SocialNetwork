import React from 'react';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';

import CommentFeed from '../../../src/components/post/CommentFeed';

const props = {
  comments: [
    { _id: '1', comment: 'comment1' },
    { _id: '2', comment: 'comment2' }
  ],
  postId: 'postId'
};
const component = shallow(<CommentFeed {...props} />);

it('matches snapshot for 2 comments', () => {
  expect(toJSON(component)).toMatchSnapshot();
});
