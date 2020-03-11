import React, {useState} from 'react';

function FormRadio({name, radioButtons, radioLabel, onChange, formFields} = {}) {
    if (!name || !formFields || !radioButtons) {
        console.warn('All required props not given to this component');
        return null;
    } 

    const [inputValue, setInputValue] = useState(formFields[name]);

    function handleInputChange(event){
        setInputValue(event.target.value);

        if(onChange) {
            onChange(event);
        }
    }

    return (
        <fieldset className="fieldset-input">
            <legend className="legend-label">{radioLabel}</legend>

            { radioButtons.map((radio, index) => { return (
                <div className="form-radio-buttons" key={index}>
                    <div className="radio-button">
                        <input type="radio" id={radio.id} name={name} checked={formFields[name] === radio.id} onChange={handleInputChange} />
                        <label id={radio.id + "-label"} htmlFor={radio.id}>{radio.label}</label>
                    </div>
                </div>
            )})}                     
        </fieldset>
    )
}

export default FormRadio;
