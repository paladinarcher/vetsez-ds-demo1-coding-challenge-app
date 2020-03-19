import React from 'react';

import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import { AlertWarning } from '../../../../app/frontend/packs/components/core-ui';

test('alert component with no props should render nothing', () => {
    const wrapper = shallow(<AlertWarning />);
    expect(wrapper.find('div').exists()).toBe(false);
    expect(wrapper.find('h3').exists()).toBe(false);
    expect(wrapper.find('p').exists()).toBe(false);
});
test('alert component with props should render the alert message and aria calls', () => {
    const wrapper = shallow(<AlertWarning message="Mock Alert Warning Message" />);
    expect(wrapper.find('div').length).toBe(2);
    expect(wrapper.find('h3').exists()).toBe(true);
    expect(wrapper.find('p').exists()).toBe(true);

    expect(wrapper.find('div').at(0).prop('role')).toBe('alert');
    expect(wrapper.find('div').at(0).prop('aria-live')).toBe('assertive');
    expect(wrapper.find('div').at(0).hasClass('usa-alert')).toEqual(true);
    expect(wrapper.find('div').at(0).hasClass('usa-alert-warning')).toEqual(true);

    expect(wrapper.find('h3').text()).toBe('Warning');
    expect(wrapper.find('p').text()).toBe('Mock Alert Warning Message');
});
