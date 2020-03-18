import React from 'react';

import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import { DataTable } from '../../../../app/frontend/packs/components/core-ui';

const mockTableData = [{'mockFirstName':'mock one', 'mockLastName':'a mock person'},{'mockFirstName':'mock two', 'mockLastName':'b mock person'},{'mockFirstName':'mock three', 'mockLastName':'c mock person'},{'mockFirstName':'mock four', 'mockLastName':'d mock person'},{'mockFirstName':'mock five', 'mockLastName':'same mock person'},{'mockFirstName':'mock six', 'mockLastName':'same mock person'}];
const mockTableColumns = [{'name':'Mock First Name', 'key':'mockFirstName'}, {'name':'Mock Last Name', 'key':'mockLastName'}];

test('data table component with no props should render nothing', () => {
    const wrapper = shallow(<DataTable />);
    expect(wrapper.find('table').exists()).toBe(false);
    expect(wrapper.find('div').exists()).toBe(false);
    expect(wrapper.find('a').exists()).toBe(false);
    expect(wrapper.find('caption').exists()).toBe(false);
});

test('data table component with no props should render nothing', () => {
    expect(DataTable()).toBe(null)
});

test('data table component with data and column props should render a table', () => {
    const wrapper = shallow(<DataTable data={mockTableData} columns={mockTableColumns} />);
    expect(wrapper.find('table').exists()).toBe(true);
    expect(wrapper.find('div').exists()).toBe(false);
    expect(wrapper.find('a').exists()).toBe(false);
    expect(wrapper.find('caption').exists()).toBe(false);

    expect(wrapper.find('table').find('tr').length).toBe(7);
    expect(wrapper.find('table').find('tr').at(0).find('th').length).toBe(2);
    expect(wrapper.find('table').find('tr').at(1).find('td').length).toBe(2);

    expect(wrapper.find('table').find('tr').at(0).find('th').at(0).text()).toBe('Mock First Name');
    expect(wrapper.find('table').find('tr').at(0).find('th').at(1).text()).toBe('Mock Last Name');
    

    // Test Column Sort      
    expect(wrapper.find('table').find('tr').at(1).find('td').at(0).text()).toBe('mock one');
    expect(wrapper.find('table').find('tr').at(1).find('td').at(1).text()).toBe('a mock person');

    expect(wrapper.find('table').find('tr').at(2).find('td').at(0).text()).toBe('mock two');
    expect(wrapper.find('table').find('tr').at(2).find('td').at(1).text()).toBe('b mock person');

    expect(wrapper.find('table').find('tr').at(3).find('td').at(0).text()).toBe('mock three');
    expect(wrapper.find('table').find('tr').at(3).find('td').at(1).text()).toBe('c mock person');

    expect(wrapper.find('table').find('tr').at(4).find('td').at(0).text()).toBe('mock four');
    expect(wrapper.find('table').find('tr').at(4).find('td').at(1).text()).toBe('d mock person');

    expect(wrapper.find('table').find('tr').at(5).find('td').at(0).text()).toBe('mock five');
    expect(wrapper.find('table').find('tr').at(5).find('td').at(1).text()).toBe('same mock person');

    expect(wrapper.find('table').find('tr').at(6).find('td').at(0).text()).toBe('mock six');
    expect(wrapper.find('table').find('tr').at(6).find('td').at(1).text()).toBe('same mock person');

    // Click First Column
    wrapper.find('table').find('tr').at(0).find('th').at(0).simulate('click');

    // Test Column Sort     
    expect(wrapper.find('table').find('tr').at(1).find('td').at(0).text()).toBe('mock five');
    expect(wrapper.find('table').find('tr').at(1).find('td').at(1).text()).toBe('same mock person');

    expect(wrapper.find('table').find('tr').at(2).find('td').at(0).text()).toBe('mock four');
    expect(wrapper.find('table').find('tr').at(2).find('td').at(1).text()).toBe('d mock person');

    expect(wrapper.find('table').find('tr').at(3).find('td').at(0).text()).toBe('mock one');
    expect(wrapper.find('table').find('tr').at(3).find('td').at(1).text()).toBe('a mock person');

    expect(wrapper.find('table').find('tr').at(4).find('td').at(0).text()).toBe('mock six');
    expect(wrapper.find('table').find('tr').at(4).find('td').at(1).text()).toBe('same mock person');

    expect(wrapper.find('table').find('tr').at(5).find('td').at(0).text()).toBe('mock three');
    expect(wrapper.find('table').find('tr').at(5).find('td').at(1).text()).toBe('c mock person');

    expect(wrapper.find('table').find('tr').at(6).find('td').at(0).text()).toBe('mock two');
    expect(wrapper.find('table').find('tr').at(6).find('td').at(1).text()).toBe('b mock person');

    // Click Second Column
    wrapper.find('table').find('tr').at(0).find('th').at(1).simulate('click');

    // Test Column Sort   
    expect(wrapper.find('table').find('tr').at(1).find('td').at(0).text()).toBe('mock one');
    expect(wrapper.find('table').find('tr').at(1).find('td').at(1).text()).toBe('a mock person');

    expect(wrapper.find('table').find('tr').at(2).find('td').at(0).text()).toBe('mock two');
    expect(wrapper.find('table').find('tr').at(2).find('td').at(1).text()).toBe('b mock person');

    expect(wrapper.find('table').find('tr').at(3).find('td').at(0).text()).toBe('mock three');
    expect(wrapper.find('table').find('tr').at(3).find('td').at(1).text()).toBe('c mock person');

    expect(wrapper.find('table').find('tr').at(4).find('td').at(0).text()).toBe('mock four');
    expect(wrapper.find('table').find('tr').at(4).find('td').at(1).text()).toBe('d mock person');

    expect(wrapper.find('table').find('tr').at(5).find('td').at(0).text()).toBe('mock five');
    expect(wrapper.find('table').find('tr').at(5).find('td').at(1).text()).toBe('same mock person');
    
    expect(wrapper.find('table').find('tr').at(6).find('td').at(0).text()).toBe('mock six');
    expect(wrapper.find('table').find('tr').at(6).find('td').at(1).text()).toBe('same mock person');
});

test('data table component with data and column and caption props should render a table with a caption', () => {
    const wrapper = shallow(<DataTable data={mockTableData} columns={mockTableColumns} caption="Mock Table Caption" />);
    expect(wrapper.find('table').exists()).toBe(true);
    expect(wrapper.find('div').exists()).toBe(false);
    expect(wrapper.find('a').exists()).toBe(false);
    expect(wrapper.find('caption').exists()).toBe(true);

    expect(wrapper.find('caption').text()).toBe("Mock Table Caption");
});

test('data table component with data and column and pagination props should render a table with pagination', () => {
    const wrapper = shallow(<DataTable data={mockTableData} columns={mockTableColumns} pagination={true} paginationRowsPerPage={2} />);
    expect(wrapper.find('table').exists()).toBe(true);
    expect(wrapper.find('div').exists()).toBe(true);
    expect(wrapper.find('a').exists()).toBe(true);
    expect(wrapper.find('caption').exists()).toBe(false);

    expect(wrapper.find('table').find('tr').length).toBe(3);
    expect(wrapper.find('table').find('tr').at(0).find('th').length).toBe(2);
    expect(wrapper.find('table').find('tr').at(1).find('td').length).toBe(2);

    expect(wrapper.find('table').find('tr').at(0).find('th').at(0).text()).toBe('Mock First Name');
    expect(wrapper.find('table').find('tr').at(0).find('th').at(1).text()).toBe('Mock Last Name');
    
    // Pagination HTML
    expect(wrapper.find('div').length).toBe(2);
    expect(wrapper.find('span').length).toBe(2);
    expect(wrapper.find('a').length).toBe(5);

    expect(wrapper.find('a').at(0).text()).toBe('Previous');
    expect(wrapper.find('a').at(1).text()).toBe('1');
    expect(wrapper.find('a').at(2).text()).toBe('2');
    expect(wrapper.find('a').at(3).text()).toBe('3');
    expect(wrapper.find('a').at(4).text()).toBe('Next');

    // Test Pagination     
    expect(wrapper.find('table').find('tr').at(1).find('td').at(0).text()).toBe('mock one');
    expect(wrapper.find('table').find('tr').at(1).find('td').at(1).text()).toBe('a mock person');

    expect(wrapper.find('table').find('tr').at(2).find('td').at(0).text()).toBe('mock two');
    expect(wrapper.find('table').find('tr').at(2).find('td').at(1).text()).toBe('b mock person');

    // Click Next
    wrapper.find('a').at(4).simulate('click');

    // Test Pagination     
    expect(wrapper.find('table').find('tr').at(1).find('td').at(0).text()).toBe('mock three');
    expect(wrapper.find('table').find('tr').at(1).find('td').at(1).text()).toBe('c mock person');

    expect(wrapper.find('table').find('tr').at(2).find('td').at(0).text()).toBe('mock four');
    expect(wrapper.find('table').find('tr').at(2).find('td').at(1).text()).toBe('d mock person');

    // Click Previous
    wrapper.find('a').at(0).simulate('click');

    // Test Pagination     
    expect(wrapper.find('table').find('tr').at(1).find('td').at(0).text()).toBe('mock one');
    expect(wrapper.find('table').find('tr').at(1).find('td').at(1).text()).toBe('a mock person');

    expect(wrapper.find('table').find('tr').at(2).find('td').at(0).text()).toBe('mock two');
    expect(wrapper.find('table').find('tr').at(2).find('td').at(1).text()).toBe('b mock person');

    // Click Page Number
    wrapper.find('a').at(3).simulate('click');

    // Test Pagination  
    expect(wrapper.find('table').find('tr').at(1).find('td').at(0).text()).toBe('mock five');
    expect(wrapper.find('table').find('tr').at(1).find('td').at(1).text()).toBe('same mock person');
       
    expect(wrapper.find('table').find('tr').at(2).find('td').at(0).text()).toBe('mock six');
    expect(wrapper.find('table').find('tr').at(2).find('td').at(1).text()).toBe('same mock person');

    // Click Page Number
    wrapper.find('a').at(1).simulate('click');

    // Test Pagination     
    expect(wrapper.find('table').find('tr').at(1).find('td').at(0).text()).toBe('mock one');
    expect(wrapper.find('table').find('tr').at(1).find('td').at(1).text()).toBe('a mock person');

    expect(wrapper.find('table').find('tr').at(2).find('td').at(0).text()).toBe('mock two');
    expect(wrapper.find('table').find('tr').at(2).find('td').at(1).text()).toBe('b mock person');

    // Click Page Number
    wrapper.find('a').at(2).simulate('click');

    expect(wrapper.find('table').find('tr').at(1).find('td').at(0).text()).toBe('mock three');
    expect(wrapper.find('table').find('tr').at(1).find('td').at(1).text()).toBe('c mock person');

    expect(wrapper.find('table').find('tr').at(2).find('td').at(0).text()).toBe('mock four');
    expect(wrapper.find('table').find('tr').at(2).find('td').at(1).text()).toBe('d mock person');
});

test('data table component with data and column and pagination props should render a table with pagination and default rows per page', () => {
    const wrapper = shallow(<DataTable data={mockTableData} columns={mockTableColumns} pagination={true} />);
    expect(wrapper.find('table').exists()).toBe(true);
    expect(wrapper.find('div').exists()).toBe(true);
    expect(wrapper.find('a').exists()).toBe(true);
    expect(wrapper.find('caption').exists()).toBe(false);

    expect(wrapper.find('table').find('tr').length).toBe(6);
    expect(wrapper.find('table').find('tr').at(0).find('th').length).toBe(2);
    expect(wrapper.find('table').find('tr').at(1).find('td').length).toBe(2);

    expect(wrapper.find('table').find('tr').at(0).find('th').at(0).text()).toBe('Mock First Name');
    expect(wrapper.find('table').find('tr').at(0).find('th').at(1).text()).toBe('Mock Last Name');    

    // Pagination HTML
    expect(wrapper.find('div').length).toBe(2);
    expect(wrapper.find('span').length).toBe(2);
    expect(wrapper.find('a').length).toBe(4);

    expect(wrapper.find('a').at(0).text()).toBe('Previous');
    expect(wrapper.find('a').at(1).text()).toBe('1');
    expect(wrapper.find('a').at(2).text()).toBe('2');
    expect(wrapper.find('a').at(3).text()).toBe('Next');

    // Test Pagination     
    expect(wrapper.find('table').find('tr').at(1).find('td').at(0).text()).toBe('mock one');
    expect(wrapper.find('table').find('tr').at(1).find('td').at(1).text()).toBe('a mock person');

    expect(wrapper.find('table').find('tr').at(2).find('td').at(0).text()).toBe('mock two');
    expect(wrapper.find('table').find('tr').at(2).find('td').at(1).text()).toBe('b mock person');

    expect(wrapper.find('table').find('tr').at(3).find('td').at(0).text()).toBe('mock three');
    expect(wrapper.find('table').find('tr').at(3).find('td').at(1).text()).toBe('c mock person');

    expect(wrapper.find('table').find('tr').at(4).find('td').at(0).text()).toBe('mock four');
    expect(wrapper.find('table').find('tr').at(4).find('td').at(1).text()).toBe('d mock person');

    expect(wrapper.find('table').find('tr').at(5).find('td').at(0).text()).toBe('mock five');
    expect(wrapper.find('table').find('tr').at(5).find('td').at(1).text()).toBe('same mock person');

    // Click Next
    wrapper.find('a').at(3).simulate('click');

    // Test Pagination     
    expect(wrapper.find('table').find('tr').at(1).find('td').at(0).text()).toBe('mock six');
    expect(wrapper.find('table').find('tr').at(1).find('td').at(1).text()).toBe('same mock person');

    // Click Previous
    wrapper.find('a').at(0).simulate('click');

    // Test Pagination     
    expect(wrapper.find('table').find('tr').at(1).find('td').at(0).text()).toBe('mock one');
    expect(wrapper.find('table').find('tr').at(1).find('td').at(1).text()).toBe('a mock person');

    expect(wrapper.find('table').find('tr').at(2).find('td').at(0).text()).toBe('mock two');
    expect(wrapper.find('table').find('tr').at(2).find('td').at(1).text()).toBe('b mock person');

    expect(wrapper.find('table').find('tr').at(3).find('td').at(0).text()).toBe('mock three');
    expect(wrapper.find('table').find('tr').at(3).find('td').at(1).text()).toBe('c mock person');

    expect(wrapper.find('table').find('tr').at(4).find('td').at(0).text()).toBe('mock four');
    expect(wrapper.find('table').find('tr').at(4).find('td').at(1).text()).toBe('d mock person');

    expect(wrapper.find('table').find('tr').at(5).find('td').at(0).text()).toBe('mock five');
    expect(wrapper.find('table').find('tr').at(5).find('td').at(1).text()).toBe('same mock person');

    // Click Page Number
    wrapper.find('a').at(2).simulate('click');

    // Test Pagination     
    expect(wrapper.find('table').find('tr').at(1).find('td').at(0).text()).toBe('mock six');
    expect(wrapper.find('table').find('tr').at(1).find('td').at(1).text()).toBe('same mock person');

     // Already on last page, clicking next should do nothing
     wrapper.find('a').at(3).simulate('click');
     expect(wrapper.find('table').find('tr').at(1).find('td').at(0).text()).toBe('mock six');
     expect(wrapper.find('table').find('tr').at(1).find('td').at(1).text()).toBe('same mock person');

    // Click Page Number
    wrapper.find('a').at(1).simulate('click');

    // Test Pagination     
    expect(wrapper.find('table').find('tr').at(1).find('td').at(0).text()).toBe('mock one');
    expect(wrapper.find('table').find('tr').at(1).find('td').at(1).text()).toBe('a mock person');

    expect(wrapper.find('table').find('tr').at(2).find('td').at(0).text()).toBe('mock two');
    expect(wrapper.find('table').find('tr').at(2).find('td').at(1).text()).toBe('b mock person');

    expect(wrapper.find('table').find('tr').at(3).find('td').at(0).text()).toBe('mock three');
    expect(wrapper.find('table').find('tr').at(3).find('td').at(1).text()).toBe('c mock person');

    expect(wrapper.find('table').find('tr').at(4).find('td').at(0).text()).toBe('mock four');
    expect(wrapper.find('table').find('tr').at(4).find('td').at(1).text()).toBe('d mock person');

    expect(wrapper.find('table').find('tr').at(5).find('td').at(0).text()).toBe('mock five');
    expect(wrapper.find('table').find('tr').at(5).find('td').at(1).text()).toBe('same mock person');

    // Already on first page, clicking previous should do nothing
    wrapper.find('a').at(0).simulate('click');

    expect(wrapper.find('table').find('tr').at(1).find('td').at(0).text()).toBe('mock one');
    expect(wrapper.find('table').find('tr').at(1).find('td').at(1).text()).toBe('a mock person');

    expect(wrapper.find('table').find('tr').at(2).find('td').at(0).text()).toBe('mock two');
    expect(wrapper.find('table').find('tr').at(2).find('td').at(1).text()).toBe('b mock person');

    expect(wrapper.find('table').find('tr').at(3).find('td').at(0).text()).toBe('mock three');
    expect(wrapper.find('table').find('tr').at(3).find('td').at(1).text()).toBe('c mock person');

    expect(wrapper.find('table').find('tr').at(4).find('td').at(0).text()).toBe('mock four');
    expect(wrapper.find('table').find('tr').at(4).find('td').at(1).text()).toBe('d mock person');

    expect(wrapper.find('table').find('tr').at(5).find('td').at(0).text()).toBe('mock five');
    expect(wrapper.find('table').find('tr').at(5).find('td').at(1).text()).toBe('same mock person');
});