import React from 'react';

import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import { Button } from '../../../../app/frontend/packs/components/core-ui';

const mockFunction = jest.fn();

test('button component should make a button', () => {
    const wrapper = shallow(<Button />);
    expect(wrapper.find('button').exists()).toBe(true);
    expect(wrapper.find('button').hasClass('usa-button')).toEqual(true);
});

test('button component with no props should make a button', () => {
    const wrapper = shallow(Button());
    expect(wrapper.find('button').exists()).toBe(true);
    expect(wrapper.find('button').hasClass('usa-button')).toEqual(true);
});

test('button component should make a button with given text', () => {
    const wrapper = shallow(<Button id="testButton" action={mockFunction} text="Test Button" type="button" />);
    expect(wrapper.find('button').exists()).toBe(true);
    expect(wrapper.find('button').text()).toBe('Test Button');
    expect(wrapper.find('button').hasClass('usa-button')).toEqual(true);

    expect(mockFunction.mock.calls.length).toBe(0);
    wrapper.find('button').simulate('click');
    expect(mockFunction.mock.calls.length).toBe(1);
    mockFunction.mockClear();
});

test('button component should make a primary button with given text', () => {
    const wrapper = shallow(<Button id="testButton" action={mockFunction} text="Test Primary Button" type="primary" />);
    expect(wrapper.find('button').exists()).toBe(true);
    expect(wrapper.find('button').text()).toBe('Test Primary Button');
    expect(wrapper.find('button').hasClass('usa-button-primary')).toEqual(true);
    expect(wrapper.find('button').hasClass('va-button-primary')).toEqual(true);

    expect(mockFunction.mock.calls.length).toBe(0);
    wrapper.find('button').simulate('click');
    expect(mockFunction.mock.calls.length).toBe(1);
    mockFunction.mockClear();
});

test('button component should make a secondary button with given text', () => {
    const wrapper = shallow(<Button id="testButton" action={mockFunction} text="Test Secondary Button" type="secondary" />);
    expect(wrapper.find('button').exists()).toBe(true);
    expect(wrapper.find('button').text()).toBe('Test Secondary Button');
    expect(wrapper.find('button').hasClass('usa-button')).toEqual(true);
    expect(wrapper.find('button').hasClass('usa-button-secondary')).toEqual(true);

    expect(mockFunction.mock.calls.length).toBe(0);
    wrapper.find('button').simulate('click');
    expect(mockFunction.mock.calls.length).toBe(1);
    mockFunction.mockClear();
});
