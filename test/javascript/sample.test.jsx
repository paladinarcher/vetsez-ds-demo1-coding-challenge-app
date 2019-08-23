import React from 'react';
import ReactDOM from 'react-dom';

import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import Comment from '../../app/frontend/packs/components/comment';

beforeAll(() => {
    global.gon = {};
    gon['routes'] = {};
    gon.routes['add_comment_path'] = '';
});

test('Comment label exists and text', () => {
    console.log("in test...");
    const wrapper = shallow(<Comment />);
    console.log("wrapper", wrapper.debug());
    expect(wrapper.find('#lblComment').exists()).toBe(false);
    expect(wrapper.find('#lblComment').text()).toBe('Add a Comment');
});
