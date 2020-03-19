import React from 'react';

import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import { FormRadio } from '../../../../app/frontend/packs/components/core-ui';

const mockOnChangeFunction = jest.fn();
const mockEvent = {target: {name: "", value: ""}};

const mockRadioButtons = [
    {id:"mockone", label:"Mock Radio One"},
    {id:"mocktwo", label:"Mock Radio Two"},
    {id:"mockthree", label:"Mock Radio Three"}
];
const mockFormFields = {'testradio':'mockone'};

test('form radio component with no props should render nothing', () => {
    const wrapper = shallow(<FormRadio />);
    expect(wrapper.find('fieldset').exists()).toBe(false);
    expect(wrapper.find('legend').exists()).toBe(false);
    expect(wrapper.find('div').exists()).toBe(false);
    expect(wrapper.find('input').exists()).toBe(false);
    expect(wrapper.find('label').exists()).toBe(false);
});

test('form radio component with no props should render nothing', () => {
    expect(FormRadio()).toBe(null);
});

test('form radio component with no radio button list should render nothing', () => {
    const wrapper = shallow(<FormRadio name="testradio" radioLabel="Mock Radio Buttons" formFields={mockFormFields} />);
    expect(wrapper.find('fieldset').exists()).toBe(false);
    expect(wrapper.find('legend').exists()).toBe(false);
    expect(wrapper.find('div').exists()).toBe(false);
    expect(wrapper.find('input').exists()).toBe(false);
    expect(wrapper.find('label').exists()).toBe(false);
});

test('form radio component with props should render radio buttons and labels', () => {
    const wrapper = shallow(<FormRadio name="testradio" radioButtons={mockRadioButtons} radioLabel="Mock Radio Buttons" formFields={mockFormFields} />);
    expect(wrapper.find('fieldset').exists()).toBe(true);
    expect(wrapper.find('legend').exists()).toBe(true);
    expect(wrapper.find('div').length).toBe(6);
    expect(wrapper.find('input').length).toBe(3);
    expect(wrapper.find('label').length).toBe(3);

    expect(wrapper.find('legend').text()).toBe("Mock Radio Buttons");
    expect(wrapper.find('label').at(0).text()).toBe("Mock Radio One");
    expect(wrapper.find('label').at(1).text()).toBe("Mock Radio Two");
    expect(wrapper.find('label').at(2).text()).toBe("Mock Radio Three");

    expect(wrapper.find('input').at(0).prop('type')).toBe('radio');
    expect(wrapper.find('input').at(0).prop('name')).toBe('testradio');
    expect(wrapper.find('input').at(0).prop('id')).toBe('mockone');
    expect(wrapper.find('input').at(0).prop('checked')).toBe(true);

    expect(wrapper.find('input').at(1).prop('type')).toBe('radio');
    expect(wrapper.find('input').at(1).prop('name')).toBe('testradio');
    expect(wrapper.find('input').at(1).prop('id')).toBe('mocktwo');
    expect(wrapper.find('input').at(1).prop('checked')).toBe(false);

    expect(wrapper.find('input').at(2).prop('type')).toBe('radio');
    expect(wrapper.find('input').at(2).prop('name')).toBe('testradio');
    expect(wrapper.find('input').at(2).prop('id')).toBe('mockthree');
    expect(wrapper.find('input').at(2).prop('checked')).toBe(false);

    wrapper.find('input#mocktwo').simulate('change', mockEvent);
    expect(mockOnChangeFunction.mock.calls.length).toBe(0);
    mockOnChangeFunction.mockClear();
});

test('form radio component component should call onchange', () => {
    const wrapper = shallow(<FormRadio name="testradio" radioButtons={mockRadioButtons} radioLabel="Mock Radio Buttons" onChange={mockOnChangeFunction} formFields={mockFormFields} />);
    expect(wrapper.find('fieldset').exists()).toBe(true);
    expect(wrapper.find('legend').exists()).toBe(true);
    expect(wrapper.find('div').length).toBe(6);
    expect(wrapper.find('input').length).toBe(3);
    expect(wrapper.find('label').length).toBe(3);

    wrapper.find('input#mocktwo').simulate('change', mockEvent);
    expect(mockOnChangeFunction.mock.calls.length).toBe(1);
    mockOnChangeFunction.mockClear();
});