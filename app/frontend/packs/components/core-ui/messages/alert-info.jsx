import React from 'react';

function AlertInfo({message}) {
    if (!message) {
        return null;
    }        

    return (
        <div class="usa-alert usa-alert-info" role="alert" aria-live="polite">
            <div class="usa-alert-body">
                <h3 class="usa-alert-heading">Message</h3>
                <p>{message}</p>
            </div>
        </div>
    );
}

export default AlertInfo;
