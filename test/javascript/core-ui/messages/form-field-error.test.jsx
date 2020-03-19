import React from 'react';

import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import { FormFieldError } from '../../../../app/frontend/packs/components/core-ui';

test('error component with no props should render nothing', () => {
    const wrapper = shallow(<FormFieldError />);
    expect(wrapper.find('div').exists()).toBe(false);
    expect(wrapper.find('span').exists()).toBe(false);
});

test('error component with message should render error message', () => {
    const wrapper = shallow(<FormFieldError fieldName="mockfield" error_messages={['mock error message 1']} />);
    expect(wrapper.find('div').length).toBe(1);
    expect(wrapper.find('span').length).toBe(1);

    expect(wrapper.find('span').prop('role')).toBe('alert');
    expect(wrapper.find('span').text()).toBe('mock error message 1');
});

test('error component with multiple messages should render multiple error messages', () => {
    const wrapper = shallow(<FormFieldError fieldName="mockfield" error_messages={['mock error message 1', 'another mock error message']} />);
    expect(wrapper.find('div').length).toBe(1);
    expect(wrapper.find('span').length).toBe(2);

    expect(wrapper.find('span').at(0).prop('role')).toBe('alert');
    expect(wrapper.find('span').at(0).text()).toBe('mock error message 1');
    expect(wrapper.find('span').at(1).prop('role')).toBe('alert');
    expect(wrapper.find('span').at(1).text()).toBe('another mock error message');
});