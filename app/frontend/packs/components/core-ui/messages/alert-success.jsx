import React from 'react';

function AlertSuccess({message}) {
    if (!message) {
        return null;
    }        

    return (
        <div className="usa-alert usa-alert-success" role="alert" aria-live="assertive">
            <div className="usa-alert-body">
                <h3 className="usa-alert-heading">Success!</h3>
                <p>{message}</p>
            </div>
        </div>
    );
}

export default AlertSuccess;
