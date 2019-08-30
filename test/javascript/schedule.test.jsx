import React from 'react';
import ReactDOM from 'react-dom';

import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import SchedAppt from '../../app/frontend/packs/components/sched_appt';

beforeAll(() => {
    global.gon = {};
    gon['routes'] = {};
    gon.routes['gon.routes.get_appointment_types_path'] = '';
    gon.routes['gon.routes.get_appointment_types_path'] = '';
    gon.testing = true;
});

test('select facility label exists and text', () => {
    console.log("in test select facility label...");
    const wrapper = shallow(<SchedAppt />);
    //console.log("wrapper", wrapper.debug());
    expect(wrapper.find('#FacilityLabel').exists()).toBe(true);
    expect(wrapper.find('#FacilityLabel').text()).toBe('Select Facility');
});

test('appointment type label exists and text', () => {
    console.log("in test appointment type label...");
    const wrapper = shallow(<SchedAppt />);
    //console.log("wrapper", wrapper.debug());
    expect(wrapper.find('#AppointmentLabel').exists()).toBe(true);
    expect(wrapper.find('#AppointmentLabel').text()).toBe('Appointment Type');
});
