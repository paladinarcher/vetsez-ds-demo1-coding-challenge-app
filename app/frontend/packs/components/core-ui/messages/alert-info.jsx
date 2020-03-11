import React from 'react';

function AlertInfo({message}) {
    if (!message) {
        console.warn('All required props not given to this component');
        return null;
    }        

    return (
        <div className="usa-alert usa-alert-info" role="alert" aria-live="polite">
            <div className="usa-alert-body">
                <h3 className="usa-alert-heading">Message</h3>
                <p>{message}</p>
            </div>
        </div>
    );
}

export default AlertInfo;
