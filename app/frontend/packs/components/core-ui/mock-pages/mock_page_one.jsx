import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';

import { FormInput, FormRadio } from '../form';
import Button from '../buttons/button';

function MockPageOne() {
    const [step, setStep] = useState(1);
    const [formFields, setFormFields] = useState({'benefit':'benefit1', 'firstname':'', 'lastname':'', 'email':''});
    const [formErrors, setFormErrors] = useState({'benefit':null, 'firstname':null, 'lastname':null, 'email':null});

    const mockFormSchema = yup.object().shape({
        firstname: yup.string().required(),
        lastname: yup.string().required(),
        email: yup.string().email().required(),
    });

    const formRadioButtons = [
        {id:"benefit1", label:"Post 9/11 GI Bill (Chapter 33)"},
        {id:"benefit2", label:"Mongtomery GI Bill (MGIB-AD, Chapter 30"},
        {id:"benefit3", label:"Mongtomery GI Bill (MGIB-SR, Chapter 1606)"},
        {id:"benefit4", label:"Post-Vietnam Era Veterans' Educational Assistance Program (VEAP, Chapter 32)"} 
    ];

    const history = useHistory();
    
    function handleInputChange(event) {
        const {target} = event;
        const {name, id, type} = target;
    
        if (type === 'checkbox' || type === 'radio') {
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

    function previousFormStep() {
        setStep(step-1);
    }
    function nextFormStep() {
        let isStepValid = true;
        let requiredStepFields = [];
        let formStepFields = [];

        if(step === 1) {
            requiredStepFields = [];
            formStepFields = ['benefit'];
        } else if (step === 2) {
            requiredStepFields = ['firstname', 'lastname', 'email'];
            formStepFields = ['firstname', 'lastname', 'email'];
        }

        // Check for any required form fields that are blank because yup validation is asychornous
        const thisFormErrors = {...formErrors};

        for(let i=0; i<requiredStepFields.length; i++) {
            if(formFields[requiredStepFields[i]] === "") {
                isStepValid = false;
                thisFormErrors[requiredStepFields[i]] = ["This field is required"];
            }
        }  
             
        setFormErrors(thisFormErrors);

        // Check state for existing form errors from user input
        for(let i=0; i<formStepFields.length; i++) {
            if(formErrors[formStepFields[i]]) {
                isStepValid = false;
            }
        }

        if(isStepValid) {
            setStep(step+1);
        } else {
            console.info('Form not yet valid');
        }
    }
    function gotoHomePage() {
        history.push('/account');
    }

    return (
        <div className="usa-grid">
            <div className="usa-width-whole">
                <h1 className="usa-heading">Mock Benefits Form</h1>
                <div className="progress-bar-segmented" role="progressbar" aria-valuenow={step} aria-valuemin="1" aria-valuemax="3" tabIndex="0">
                    <div className="progress-segment progress-segment-complete"></div>
                    { step >= 2 ? <div className="progress-segment progress-segment-complete"></div> : <div className="progress-segment"></div> }
                    { step == 3 ? <div className="progress-segment progress-segment-complete"></div> : <div className="progress-segment"></div> }
                </div>

                { step == 1 ?
                <React.Fragment>
                    <h3 className="usa-heading">1 of 3 - Benefit</h3>
                    <p>Because you chose to apply for your Post-9/11 benefit, you have to relinquish (give up) 1 other benefit you may be eligible for.</p>
                    <p>Your decision is irrevocable (you can’t change your mind).</p>  

                    <FormRadio name="benefit" radioButtons={formRadioButtons} radioLabel="Select the benefit that is the best match for you" 
                        onChange={handleInputChange} formFields={formFields} />

                </React.Fragment> : null }

                { step == 2 ?
                    <React.Fragment>
                        <h3 className="usa-heading">2 of 3 - Profile Information</h3>
                        <p>Please fill in your name and email address.</p>

                        <FormInput type="text" name="firstname" label="First Name" isRequired={true} onChange={handleInputChange} 
                            onBlur={handleInputBlur} formErrors={formErrors} /> 
                        <FormInput type="text" name="lastname" label="Last Name" isRequired={true} onChange={handleInputChange} 
                            onBlur={handleInputBlur} formErrors={formErrors} />  
                        <FormInput type="text" name="email" label="Email" isRequired={true} onChange={handleInputChange} 
                            onBlur={handleInputBlur} formErrors={formErrors} />    

                    </React.Fragment> 
                : null }

                { step == 3 ?
                <React.Fragment>
                    <h3 className="usa-heading">3 of 3 - Done</h3>
                    <p>Congratulations your form is complete!</p>                    
                </React.Fragment> : null }

                <div className="step-buttons">
                    { step >= 1 && step < 3 ? 
                        <React.Fragment>
                            { step > 1 ? 
                                <Button id="prevStep" text="Previous" action={previousFormStep} />
                            : null }

                            <Button id="nextStep" text="Next" action={nextFormStep} />
                        </React.Fragment>                 
                    :
                        <Button id="stepsDone"text="Done" action={gotoHomePage} />
                    }
                </div>          
            </div>
        </div>
    )
}

export default MockPageOne;
