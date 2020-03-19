import React, {useState} from 'react';
import FormFieldError from '../messages/form-field-error';

function FormSelect({name, label, isRequired, onChange, onBlur, defaultOptionLabel, formErrors, formFields, optionsJsonString} = {}) {
    const [inputValue, setInputValue] = useState(formFields[name]);

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

    // this function expects an array of options with key and label properties
    // example: [{key: 'CA' label: 'California'},...]
    function handleLoadOptions(data, defaultOptionLabel) {
        let ret = [];
        if (defaultOptionLabel.length > 0) {
            ret.push([<option key='none' value=''>{defaultOptionLabel}</option>])
        }
        for (const option of data) {
            ret.push(<option key={option.key} value={option.key}>{option.label}</option>);
        }
        return ret;
    }

    return (
        <div className={formErrors[name] ? "usa-input-error" : null}>
            <label id={name +"-label"} className="usa-input-error-label" htmlFor={name}>{label}</label>
            <FormFieldError fieldname={name} error_messages={formErrors[name]}/>

            <select id={name} name={name} autoComplete="off" value={formFields[name]}
                    aria-required={isRequired} aria-labelledby={name +"-label"} aria-describedby={name +"-label"}
                    aria-invalid={!!formErrors[name]} className={formErrors[name] ? "usa-select invalid" : 'usa-select'}
                    onChange={handleInputChange} onBlur={handleInputBlur}>
                {handleLoadOptions(optionsJsonString, defaultOptionLabel)}
            </select>
        </div>
    )
}

export default FormSelect;
