import React from 'react';

function AlertWarning({message}) {
    if (!message) {
        return null;
    }        

    return (
        <div class="usa-alert usa-alert-warning" role="alert" aria-live="assertive">
            <div class="usa-alert-body">
                <h3 class="usa-alert-heading">Warning</h3>
                <p>{message}</p>
            </div>
        </div>
    );
}

export default AlertWarning;
