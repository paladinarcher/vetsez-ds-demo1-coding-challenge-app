import React from 'react';

function Button({type, action, text, id} = {}) {
    let classname="usa-button";

    if(type === "primary") {
        classname="usa-button-primary va-button-primary";
    } else if(type === "secondary") {
        classname="usa-button usa-button-secondary";
    }

    return (
        <button id={id} className={classname} onClick={action}>{text}</button>
    )
}

export default Button;
