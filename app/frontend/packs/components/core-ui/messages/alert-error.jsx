import React from 'react';

function AlertError({message}) {
    if (!message) {
        console.warn('All required props not given to this component');
        return null;
    }        

    return (
        <div className="usa-alert usa-alert-error" role="alert" aria-live="assertive">
            <div className="usa-alert-body">
                <h3 className="usa-alert-heading">Error</h3>
                <p>{message}</p>
            </div>
        </div>
    );
}

export default AlertError;
