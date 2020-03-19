import React from 'react';

import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import { FormInput } from '../../../../app/frontend/packs/components/core-ui';

const mockOnChangeFunction = jest.fn();
const mockOnBlurFunction = jest.fn();
const mockEvent = {target: {name: "mocktextinput", value: "test"}};

const setState = jest.fn();
jest.spyOn(React, 'useState').mockImplementation(init => [init, setState]);

test('form input component with no props should make an input element and a label element', () => {
    const wrapper = shallow(<FormInput />);
    expect(wrapper.find('label').exists()).toBe(true);
    expect(wrapper.find('input').exists()).toBe(true);
    expect(wrapper.find('input').prop('aria-required')).toBe(false);

    wrapper.find('input').simulate('change', mockEvent);
    expect(mockOnChangeFunction.mock.calls.length).toBe(0);

    wrapper.find('input').simulate('blur', mockEvent);
    expect(mockOnBlurFunction.mock.calls.length).toBe(0);

    mockOnChangeFunction.mockClear();
    mockOnBlurFunction.mockClear();
});

test('form input component with no props should make an input element and a label element', () => {
    const wrapper = mount(FormInput()); 
    expect(wrapper.find('label').exists()).toBe(true);
    expect(wrapper.find('input').exists()).toBe(true);
    expect(wrapper.find('input').prop('aria-required')).toBe(false);

    wrapper.find('input').simulate('change', mockEvent);
    expect(mockOnChangeFunction.mock.calls.length).toBe(0);

    wrapper.find('input').simulate('blur', mockEvent);
    expect(mockOnBlurFunction.mock.calls.length).toBe(0);

    mockOnChangeFunction.mockClear();
    mockOnBlurFunction.mockClear();
});

test('form input component should make a input element with given type, name, label and aria calls', () => {
    const wrapper = shallow(<FormInput type="text" name="mocktextinput" label="Mock Text Input" isRequired={true} />);
    expect(wrapper.find('label').exists()).toBe(true);
    expect(wrapper.find('label').text()).toBe('Mock Text Input');
    expect(wrapper.find('input').exists()).toBe(true);
    expect(wrapper.find('input').prop('type')).toBe('text');
    expect(wrapper.find('input').prop('name')).toBe('mocktextinput');
    expect(wrapper.find('input').prop('id')).toBe('mocktextinput');
    expect(wrapper.find('input').prop('aria-required')).toBe(true);
});

test('form input component should call onchange and onblur', () => {
    const wrapper = shallow(<FormInput type="text" name="mocktextinput" label="Mock Text Input" onChange={mockOnChangeFunction} onBlur={mockOnBlurFunction} />);
    expect(wrapper.find('label').exists()).toBe(true);
    expect(wrapper.find('label').text()).toBe('Mock Text Input');
    expect(wrapper.find('input').exists()).toBe(true);
    expect(wrapper.find('input').prop('type')).toBe('text');
    expect(wrapper.find('input').prop('name')).toBe('mocktextinput');
    expect(wrapper.find('input').prop('id')).toBe('mocktextinput');

    wrapper.find('input').simulate('change', mockEvent);
    expect(mockOnChangeFunction.mock.calls.length).toBe(1);

    wrapper.find('input').simulate('blur', mockEvent);
    expect(mockOnBlurFunction.mock.calls.length).toBe(1);

    mockOnChangeFunction.mockClear();
    mockOnBlurFunction.mockClear();
});

test('form input component should show error when given', () => {
    const wrapper = mount(<FormInput type="number" name="mocknumberinput" label="Mock Number Input" formErrors={{'mocknumberinput':['Mock Error Text'], 'mocktextinput':null}} />);
    expect(wrapper.find('label').exists()).toBe(true);
    expect(wrapper.find('label').text()).toBe('Mock Number Input');
    expect(wrapper.find('input').exists()).toBe(true);
    expect(wrapper.find('input').prop('type')).toBe('number');
    expect(wrapper.find('input').prop('name')).toBe('mocknumberinput');
    expect(wrapper.find('input').prop('id')).toBe('mocknumberinput');

    expect(wrapper.find('span.usa-input-error-message').exists()).toBe(true);
    expect(wrapper.find('span.usa-input-error-message').text()).toBe('Mock Error Text');
});

test('form input component should not show error if there is none', () => {
    const wrapper = mount(<FormInput type="number" name="mocknumberinput" label="Mock Number Input" formErrors={{'mocknumberinput':null, 'mocktextinput':null}} />);
    expect(wrapper.find('label').exists()).toBe(true);
    expect(wrapper.find('label').text()).toBe('Mock Number Input');
    expect(wrapper.find('input').exists()).toBe(true);
    expect(wrapper.find('input').prop('type')).toBe('number');
    expect(wrapper.find('input').prop('name')).toBe('mocknumberinput');
    expect(wrapper.find('input').prop('id')).toBe('mocknumberinput');

    expect(wrapper.find('span.usa-input-error-message').exists()).toBe(false);
});

