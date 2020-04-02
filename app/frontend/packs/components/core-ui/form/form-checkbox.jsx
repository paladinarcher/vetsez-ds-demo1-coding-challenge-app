import React from 'react';

function FormCheckbox({name, label, checked, onChange, onBlur, isRequired} = {}) {
    const [checkboxValue, setCheckboxValue] = React.useState(checked ? true : false);

    function handleCheckboxChange(event){
        setCheckboxValue(event.target.checked);

        if(onChange) {
            onChange(event);
        }
    }

    function handleCheckboxBlur(event){
        if(onBlur) {
            onBlur(event);
        }
    }

    return (
        <React.Fragment>
            <div className="form-expanding-group">
                <div className="form-checkbox-buttons">
                    <input id={name} name={name} type="checkbox" checked={checkboxValue} aria-required={isRequired || false} 
                        aria-labelledby={name +"-label"} onChange={handleCheckboxChange} onBlur={handleCheckboxBlur} />
                    <label name={name + "-label"} htmlFor={name}>{label}</label>
                </div>
            </div>
        </React.Fragment>
    )
}

export default FormCheckbox;






