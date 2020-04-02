import React, { useState } from 'react';
import { DataTable, Modal } from '../../core-ui';

function MockPageThree() {
    // Testing
    const mockDataArrayOne = [
        {'firstname':'old test one', 'lastname':'a test person', 'location':'Los Angeles, CA'},
        {'firstname':'old test two', 'lastname':'d new test person', 'location':'New York, NY'},
        {'firstname':'old test three', 'lastname':'b test person', 'location':'Houston, TX'},
        {'firstname':'old test four', 'lastname':'c new test person', 'location':'Atlanta, GA'},
        {'firstname':'old test five', 'lastname':'e test person', 'location':'Phoenix, AZ'}
    ];

    const [tableData, setTableData] = useState(mockDataArrayOne);

    const tableColumns = [
        {'name':'First Name', 'key':'firstname'},
        {'name':'Last Name', 'key':'lastname'},
        {'name':'Location', 'key':'location'},
    ];
    
    return (
        <div className="usa-grid">
            <div className="usa-width-whole">
                <Modal id="mockmodal" buttonText="Show Modal" modalTitle="This is a modal" >
                    <p>This is paragraph on in the modal.</p>
                    <p>This is another paragraph.</p>
                </Modal>
                <DataTable data={tableData} columns={tableColumns} caption="Data Table One" pagination={true} />
            </div>
        </div>
    )
}

export default MockPageThree;
