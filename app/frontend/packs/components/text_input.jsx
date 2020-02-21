import React from "react";

function handleInputChange(formFields, event) {
    const {target} = event;
    const {name, id, type} = target;

    if (type === 'checkbox' || type === 'radio') {
        setFormFields({...formFields, [name]: type === 'radio' ? id : target.checked});
    } else {
        setFormFields({...formFields, [name]: target.value});
        // validateFormField(name, target.value);
    }
}

function handleBlur(event) {
    const {target} = event;
    const {name, value} = target;
    // validateFormField(name, value);
}

// fired onChange and onBlur of an input field
function validateFormField(name, value) {
    const {customValidation} = stepTransitions[step];
    let valid = true;

    try {
        let stepErrors = formErrors[step];
        yup
            .reach(stepTransitions[step].schema, name)
            .validate(value)
            .then(valid => {
                stepErrors[name] = null;
                setFormErrors({...formErrors, [step]: stepErrors});
            })
            .catch(e => {
                stepErrors[name] = e.errors;
                setFormErrors({...formErrors, [step]: stepErrors});
                valid = false;
            });
    }
    catch(err) {
        if (customValidation) {
            customValidation.forEach(function (item) {
                if (item.fields.includes(name)) {
                    valid = item.fn(name, value);
                }
            });
        }
    }
    return valid;
}

function Error({fieldname, error_messages}) {
    if (!error_messages) return null;

    return (
        <div>
            {error_messages.map((error, i) => (
                <span key={i} role="alert" id={fieldname + "-error-message"} className="usa-input-error-message">{error}</span>
            ))}
        </div>
    );
}

const greg = function({formFields, formErrors, name, label, type = 'text'} = {}) {
    console.log("formFields", formFields);
    console.log("formErrors", formErrors);
    const splatProps = arguments[1] ? arguments[1] : null;
    const stepErrors = formErrors;
    return (
        <div className={stepErrors[name] ? "usa-input-error" : null}>
            <label className="usa-input-error-label" htmlFor={name}>{label}</label>
            <Error fieldname={name} error_messages={stepErrors[name]}/>
            <input
                id={name}
                name={name}
                type={type}
                aria-describedby={name +"-error-message"}
                className={stepErrors[name] ? "invalid" : null}
                value={formFields[name]}
                onChange={(event) => handleInputChange(formFields, event)}
                onBlur={handleBlur}
                {...splatProps}
            />
        </div>
    )
};
// onChange={(event) => handleCheckboxGroupChange('care_options', event)}/>
export default greg;

