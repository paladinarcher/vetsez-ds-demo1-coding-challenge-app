import React from 'react';

import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import { AlertError } from '../../../../app/frontend/packs/components/core-ui';

test('alert component with no props should render nothing', () => {
    const wrapper = shallow(<AlertError />);
    expect(wrapper.find('div').exists()).toBe(false);
    expect(wrapper.find('h3').exists()).toBe(false);
    expect(wrapper.find('p').exists()).toBe(false);
});
test('alert component with props should render the alert message and aria calls', () => {
    const wrapper = shallow(<AlertError message="Mock Alert Error Message" />);
    expect(wrapper.find('div').length).toBe(2);
    expect(wrapper.find('h3').exists()).toBe(true);
    expect(wrapper.find('p').exists()).toBe(true);

    expect(wrapper.find('div').at(0).prop('role')).toBe('alert');
    expect(wrapper.find('div').at(0).prop('aria-live')).toBe('assertive');
    expect(wrapper.find('div').at(0).hasClass('usa-alert')).toEqual(true);
    expect(wrapper.find('div').at(0).hasClass('usa-alert-error')).toEqual(true);

    expect(wrapper.find('h3').text()).toBe('Error');
    expect(wrapper.find('p').text()).toBe('Mock Alert Error Message');
});
