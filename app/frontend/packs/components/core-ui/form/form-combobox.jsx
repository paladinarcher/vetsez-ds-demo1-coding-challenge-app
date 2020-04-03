import React, {useState} from 'react';

function FormCombobox({name, label, options, autoselect, onChange, onBlur, inputStateFromParent, selectedStateFromParent} = {}) {
    /******
    /*  Options parameter should be in form of object array ('value' and 'label' are required, can be the same or different)
    /*  
    /*  Example 1: options = [{'value':'sameOne', 'label':'sameOne'}, {'value':'sameTwo', 'label':'sameTwo'}]
    /*  Example 2: options = [{'value':'diffValue1', 'label':'diffLabel1'}, {'value':'diffValue2', 'label':'diffLabel2'}]
    *******/

    if(!name || !options || !Array.isArray(options)) {
        console.warn('All required props not given to this component');
        return null;       
    }

    const [inputValue, setInputValue] = useState(inputStateFromParent || "");   // Value shown in the textbox, (optionally) can be different from actual value
    const [selectedValue, setSelectedValue] = useState(selectedStateFromParent || inputStateFromParent || ""); // Actual value in form, stored in hidden input
    const [showList, setShowList] = useState(false);
    const [listOptions, setListOptions] = useState(options);
    const [optionSelected, setOptionSelected] = useState(null);

    function handleInputChange(event){
        setInputValue(event.target.value);
        setSelectedValue(event.target.value);

        // Show list on input entry
        setShowList(true);
        setListOptions(getListOptions());

        if(autoselect) {
            setOptionSelected(0);
        }

        if(onChange) {
            onChange(event);
        }
    }

    function handleInputBlur(event){
        if(autoselect) {
            chooseSelectedOption();
        }
        if(onBlur) {
            onBlur(event);
        }
    }
    
    function handleInputKeyPress(event) {
        if(event.keyCode === 13) {  // Enter Key
            chooseSelectedOption();
        } else if(event.keyCode === 38) { // Up Key
            setShowList(true);

            // Set option to previous in list, if at beginning of list (or no option selected) set to last option
            if(optionSelected && optionSelected > 0) {
                setOptionSelected(optionSelected-1);
            } else {
                setOptionSelected(listOptions.length-1);
            }           
        } else if(event.keyCode === 40) { // Down Key
            setShowList(true);

            // Set option to next in list, if at end of list (or no option selected) set to first option
            if(optionSelected && optionSelected < listOptions.length-1) {
                setOptionSelected(optionSelected+1)
            } else {
                setOptionSelected(0);
            } 
        }
    }

    function handleListOptionClick(event) {
        console.info()
        setOptionSelected(event.target.getAttribute("data-option-index"));
    }

    function getListOptions() {
        let thisListOptions = new Array();

        options.map((option) => { 
            if(option.value.indexOf(inputValue) !== -1 || option.label.indexOf(inputValue) !== -1) {
                thisListOptions.push(option);
            }
        });

        return thisListOptions;
    }

    function chooseSelectedOption() {
        if(optionSelected) {
            setInputValue(document.getElementById(name + '-option-' + optionSelected).getAttribute('data-option-label'));
            setSelectedValue(document.getElementById(name + '-option-' + optionSelected).getAttribute('data-option-value'));
        }        

        // Hide and reset list
        setShowList(false);
        setOptionSelected(null);
    }

    return ( 
        <div className="combobox-container">
            <label id={name+'-input-label'} htmlFor={name}>{label}</label>
            <input id={name+'-input'} type="text" value={inputValue} role="combobox" autoCapitalize="none" autoComplete="off" aria-autocomplete="list" aria-expanded={showList} 
                aria-owns={name + '-options'} aria-activedescendant={name + '-option-' + optionSelected} onChange={handleInputChange} 
                onBlur={handleInputBlur} onKeyUp={handleInputKeyPress} />
            <input id={name} type="hidden" value={selectedValue} />

            <ul id={name + '-options'} role="listbox" aria-hidden={!showList} className={showList ? null : "hidden"}>
                { listOptions.map((option, index) => { 
                    return(
                        <li id={name + '-option-' + index} key={index} role="option" className={optionSelected === index ? "selected" : null} onClick={handleListOptionClick} data-option-index={index} data-option-value={option.value} data-option-label={option.label} aria-selected={optionSelected === index} tabIndex="-1">
                            {option.label}
                        </li>
                    )
                })}
            </ul>
            <div id={name + '-number-of-options'} aria-live="polite" role="status" className="hidden">{listOptions.length} options available.</div>        
        </div>
    )
}

export default FormCombobox;