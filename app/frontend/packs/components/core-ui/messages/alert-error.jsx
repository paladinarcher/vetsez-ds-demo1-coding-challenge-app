import React from 'react';

function AlertError({message}) {
    if (!message) {
        return null;
    }        

    return (
        <div class="usa-alert usa-alert-error" role="alert" aria-live="assertive">
            <div class="usa-alert-body">
                <h3 class="usa-alert-heading">Error</h3>
                <p>{message}</p>
            </div>
        </div>
    );
}

export default AlertError;
