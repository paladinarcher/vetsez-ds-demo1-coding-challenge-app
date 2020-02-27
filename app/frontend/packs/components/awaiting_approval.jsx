import React from 'react';

class AwaitingApproval extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="usa-grid">
                    <div className="usa-width-whole">
                        <h1 className="usa-heading">Awaiting Approval</h1>
                    </div>
                </div>
                <div className="usa-grid">
                    <div className="usa-width-whole">
                        <p>Your login request has been submitted and upon approval you will be allowed to access the accounts page</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default AwaitingApproval
