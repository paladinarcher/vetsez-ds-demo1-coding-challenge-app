import React from 'react';

import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import { Modal } from '../../../../app/frontend/packs/components/core-ui';

test('modal component with no props should render nothing', () => {
    const wrapper = shallow(<Modal />);
    expect(wrapper.find('div').exists()).toBe(false);
    expect(wrapper.find('h3').exists()).toBe(false);
    expect(wrapper.find('button').exists()).toBe(false);
    expect(wrapper.find('span').exists()).toBe(false);
});
test('modal component with no props should render nothing', () => {
    const wrapper = Modal();
    expect(wrapper).toBe(null);
});
test('modal component with props should render the button to show modal and the modal html', () => {
    const wrapper = shallow(<Modal id="mockModal" buttonText="Show Mock Modal" modalTitle="Mock Modal Title"><p>This is a mock modal paragraph</p></Modal>);
    expect(wrapper.find('div').length).toBe(4);
    
    expect(wrapper.find('div').at(0).hasClass('va-flex')).toBe(true);
    //expect(wrapper.find('div').at(1).prop('data-show')).toBe('#modal-mockModal');
    expect(wrapper.find('div').at(0).find('button').length).toBe(1);
    expect(wrapper.find('div').at(0).find('button').find('span').at(0).text()).toBe('Show Mock Modal');

    expect(wrapper.find('div').at(1).prop('id')).toBe('#modal-mockModal');
    expect(wrapper.find('div').at(1).prop('role')).toBe('alertdialog');
    expect(wrapper.find('div').at(1).hasClass('va-overlay')).toBe(true);
    expect(wrapper.find('div').at(1).hasClass('va-modal')).toBe(true);
    expect(wrapper.find('div').at(1).hasClass('va-modal-large')).toBe(true);

    expect(wrapper.find('div').at(1).find('h3').text()).toBe('Mock Modal Title');
    expect(wrapper.find('div').at(1).find('button').exists()).toBe(true);

    // Check the child got rendered
    expect(wrapper.find('div').at(3).find('p').length).toBe(1);
    expect(wrapper.find('div').at(3).find('p').text()).toBe('This is a mock modal paragraph');
});
test('modal component with props should open and close the modal with buttons', () => {
    const wrapper = shallow(<Modal id="mockModal" buttonText="Show Mock Modal" modalTitle="Mock Modal Title"><p>This is a mock modal paragraph</p></Modal>);
    expect(wrapper.find('div').length).toBe(4);

    // Modal is hidden
    expect(wrapper.find('div').at(1).hasClass('va-overlay')).toBe(true);
    expect(wrapper.find('div').at(1).hasClass('va-modal')).toBe(true);
    expect(wrapper.find('div').at(1).hasClass('va-modal-large')).toBe(true);

    // Open modal button
    expect(wrapper.find('div').at(0).find('button').length).toBe(1);
    wrapper.find('div').at(0).find('button').simulate('click');

    // Modal is displayed
    expect(wrapper.find('div').at(1).hasClass('va-overlay')).toBe(false);
    expect(wrapper.find('div').at(1).hasClass('va-modal')).toBe(true);
    expect(wrapper.find('div').at(1).hasClass('va-modal-large')).toBe(true);
 
    // Close Modal button
    expect(wrapper.find('div').at(1).find('button').exists()).toBe(true);
    wrapper.find('div').at(1).find('button').simulate('click');

    // Modal is hidden again
    expect(wrapper.find('div').at(1).hasClass('va-overlay')).toBe(true);
    expect(wrapper.find('div').at(1).hasClass('va-modal')).toBe(true);
    expect(wrapper.find('div').at(1).hasClass('va-modal-large')).toBe(true);
});