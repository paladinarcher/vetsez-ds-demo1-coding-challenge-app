import React, { useState } from 'react';
import * as yup from 'yup';

import { AlertSuccess, Button, FormCheckbox, FormInput, FormRadio, StatesInput } from '../../core-ui';

function MockPageTwo() {
    const [displaySuccess, setDisplaySuccess] = useState(false);

    const [formFields, setFormFields] = useState({'benefit':'benefit1', 'firstname':'', 'lastname':'', 'email':'', 'patientConsent':false});
    const [formErrors, setFormErrors] = useState({'benefit':null, 'firstname':null, 'lastname':null, 'email':null});

    const mockFormSchema = yup.object().shape({
        firstname: yup.string().required(),
        lastname: yup.string().required(),
        email: yup.string().email().required(),
        patientConsent: yup.boolean().required()
    });

    const formRadioButtons = [
        {id:"benefit1", label:"Post 9/11 GI Bill (Chapter 33)"},
        {id:"benefit2", label:"Mongtomery GI Bill (MGIB-AD, Chapter 30)"},
        {id:"benefit3", label:"Mongtomery GI Bill (MGIB-SR, Chapter 1606)"},
        {id:"benefit4", label:"Post-Vietnam Era Veterans' Educational Assistance Program (VEAP, Chapter 32)"} 
    ];
    
    function handleInputChange(event) {
        const {target} = event;
        const {name, id, type} = target;
    
        if (type === 'radio' || type === 'checkbox') {
            setFormFields({...formFields, [name]: type === 'radio' ? id : target.checked});
        } else {
            setFormFields({...formFields, [name]: target.value});
            validateFormField(name, target.value);
        }
    }
    
    function handleInputBlur(event) {
        validateFormField(event.target.name, event.target.value);
    }
    
    function validateFormField(name, value) {
        // Note: This is asynchronous
        try {
            yup.reach(mockFormSchema, name).validate(value).then(() => {
                setFormErrors({...formErrors, [name]: null});
            }).catch(e => {
                setFormErrors({...formErrors, [name]: e.errors});
            });
        } catch(err) {
            console.info('No validation rules for this input: ' + name);
        }
    }    

    function validateForm() {
        let isFormValid = true;
        let requiredFormFields = ['firstname', 'lastname', 'email'];

        // Check for any required form fields that are blank because yup validation is asychornous
        const thisFormErrors = {...formErrors};

        for(let i=0; i<requiredFormFields.length; i++) {
            if(formFields[requiredFormFields[i]] === "") {
                isFormValid = false;
                thisFormErrors[requiredFormFields[i]] = ["This field is required"];
            }
        }  
             
        setFormErrors(thisFormErrors);

        // Check state for existing form errors from user input
        Object.keys(formFields).forEach(function(field) {
            if(formErrors[field]) {
                isFormValid = false;
            }
        });

        return isFormValid;
    }

    function doSubmitForm() {
        let validForm = validateForm();

        if(validForm) {
            setDisplaySuccess(true);
        } else {
            setDisplaySuccess(false);
        }
    }

    return (
        <div className="usa-grid">
            <div className="usa-width-whole">
                <h1 className="usa-heading">Mock Benefits Form</h1>
                { displaySuccess ? 
                    <AlertSuccess message="You have completed this form." />
                : 
                    <React.Fragment>
                        <FormInput type="text" name="firstname" label="First Name" isRequired={true} onChange={handleInputChange} 
                            onBlur={handleInputBlur} formErrors={formErrors} />
                        <FormInput type="text" name="lastname" label="Last Name" isRequired={true} onChange={handleInputChange} 
                            onBlur={handleInputBlur} formErrors={formErrors} />
                        <FormInput type="text" name="email" label="Email" isRequired={true} onChange={handleInputChange} 
                            onBlur={handleInputBlur} formErrors={formErrors} />
        
                        <p>Because you chose to apply for your Post-9/11 benefit, you have to relinquish (give up) 1 other benefit you may be eligible for.<br/>Your decision is irrevocable (you can’t change your mind).</p>  

                        <FormRadio name="benefit" radioButtons={formRadioButtons} radioLabel="Select the benefit that is the best match for you" 
                            onChange={handleInputChange} />

                        <FormCheckbox name="patientConsent" label="I consent to the use of the information in this form for benefits administration" 
                            isRequired={true} onChange={handleInputChange} />

                        <Button id="submitForm" type="primary" text="Submit" action={doSubmitForm} />
                    </React.Fragment>
                }            
            </div>
        </div>
    )
}

export default MockPageTwo;
