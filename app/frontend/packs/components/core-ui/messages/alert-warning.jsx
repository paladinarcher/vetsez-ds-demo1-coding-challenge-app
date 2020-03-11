import React from 'react';

function AlertWarning({message}) {
    if (!message) {
        console.warn('All required props not given to this component');
        return null;
    }        

    return (
        <div className="usa-alert usa-alert-warning" role="alert" aria-live="assertive">
            <div className="usa-alert-body">
                <h3 className="usa-alert-heading">Warning</h3>
                <p>{message}</p>
            </div>
        </div>
    );
}

export default AlertWarning;
