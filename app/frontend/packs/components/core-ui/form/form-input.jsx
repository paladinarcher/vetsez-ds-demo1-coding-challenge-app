import React, {useState} from 'react';
import FormFieldError from '../messages/form-field-error';

function FormInput({type, name, label, isRequired, onChange, onBlur, formErrors} = {}) {
    const [inputValue, setInputValue] = useState('');

    function handleInputChange(event){
        setInputValue(event.target.value);

        if(onChange) {
            onChange(event);
        }
    }

    function handleInputBlur(event){
        if(onBlur) {
            onBlur(event);
        }
    }

    return (
        <div className={formErrors[name] ? "usa-input-error" : null}>
            <label id={name +"-label"} className="usa-input-error-label" htmlFor={name}>{label}</label>
            <FormFieldError fieldname={name} error_messages={formErrors[name]}/>

            <input id={name} name={name} value={inputValue} type={type} autoComplete="off"
                   aria-required={isRequired} aria-labelledby={name +"-label"} aria-describedby={name +"-label"}
                   aria-invalid={!!formErrors[name]} className={formErrors[name] ? "invalid" : null}
                   onChange={handleInputChange} onBlur={handleInputBlur} />
        </div>
    )
}

export default FormInput;
