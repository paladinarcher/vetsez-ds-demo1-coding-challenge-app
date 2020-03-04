import React, { useState } from 'react';
import Button from '../buttons/button';
import DataTable from '../table/data-table';

function MockPageThree() {
    // Testing
    const mockDataArrayOne = [
        {'firstname':'old test one', 'lastname':'a test person', 'location':'Los Angeles, CA'},
        {'firstname':'old test two', 'lastname':'d new test person', 'location':'New York, NY'},
        {'firstname':'old test three', 'lastname':'b test person', 'location':'Houston, TX'},
        {'firstname':'old test four', 'lastname':'c new test person', 'location':'Atlanta, GA'},
        {'firstname':'old test five', 'lastname':'e test person', 'location':'Phoenix, AZ'}
    ];

    const [displayTable, setDisplayTable] = useState(true);
    const [tableData, setTableData] = useState(mockDataArrayOne);

    const tableColumns = [
        {'name':'First Name', 'key':'firstname'},
        {'name':'Last Name', 'key':'lastname'},
        {'name':'Location', 'key':'location'},
    ];

    function toggleTableDisplay() {
        if(displayTable) {
            setDisplayTable(false);
        } else {
            setDisplayTable(true);
        }
    }
    
    return (
        <div className="usa-grid">
            <div className="usa-width-whole">
                <Button id="toggleDisplayTable" type="secondary" text={displayTable ? "Hide Table" : "Show Table"} action={toggleTableDisplay} />
                { displayTable ? 
                    <DataTable data={tableData} columns={tableColumns} caption="Data Table One" pagination={true} />
                : null }
            </div>
        </div>
    )
}

export default MockPageThree;
