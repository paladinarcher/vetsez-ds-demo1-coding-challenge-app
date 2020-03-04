import React from 'react';

function FormFieldError({fieldname, error_messages}) {
    if (!error_messages) {
        return null;
    }        

    return (
        <div>
            {error_messages.map((error, i) => (
                <span key={i} role="alert" id={fieldname + "-error-message"} className="usa-input-error-message">{error}</span>
            ))}
        </div>
    );
}

export default FormFieldError;
