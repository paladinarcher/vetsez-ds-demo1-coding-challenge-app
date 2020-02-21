import React, {useState, useEffect} from "react";
import axios from '../utils/axios'
import * as yup from "yup";

function Errors({fieldname, error_messages}) {
    if (!error_messages) return null;

    return (
        <div>
            {error_messages.map((error, i) => (
                <span key={i} role="alert" id={fieldname + "-error-message"} className="usa-input-error-message">{error}</span>
            ))}
        </div>
    );
}

function RecEngine() {
    const step1Schema = yup.object().shape({
        first_name: yup
            .string()
            .required(),
        last_name: yup
            .string()
            .required(),
        email: yup
            .string()
            .email()
            .required(),
    });

    const stepTransitions = {
        step1: {
            render: step1,
            next: ['step2'],
            fields: {first_name: "", last_name: "", email: "", password: "", confirm_password: "", terms: false},
            schema: step1Schema,
            customValidation: [
                {fields: ['password', 'confirm_password'], fn: validatePwds},
                {fields: ['terms'], fn: validateTerms}
            ]
         },
        step2: {
            render: step2,
            fields: {color: "color_green", care_options: {health: false, insurance: false}},
            prev: ['step1'],
            next: {step: 'step3', label: 'Begin', onNextFunc: gregger},
            customValidation: [
                {fields: ['care_options'], fn: validateSelections}
            ]

        },
        step3: {
            render: step3,
            prev: ['step2'],
            finish: [finish, 'Submit for recommendation']},
    };

    // specifies the current step displayed
    const [step, setStep] = useState("step1");
    // stores drop down options
    const [cars, setCars] = useState([]);
    // lifecycle state - storing component mounted so that use effect custom validation functions do not set errors prior to component mount
    const [componentMounted, setComponentMounted] = useState(false);

    // main form field and errors
    const initStepFormFieldState = function() {
        let initState = {};
        Object.keys(stepTransitions).forEach(function (step) {
            const fields = stepTransitions[step].fields;
            initState = {...initState, ...fields};
        });
        return initState;
    };
    const initStepFormErrorState = function() {
        let initState = {};
        Object.keys(stepTransitions).forEach(function (step) {
            initState = {...initState, [step]: {}};
        });
        return initState;
    };
    const [formFields, setFormFields] = useState(initStepFormFieldState());
    const [formErrors, setFormErrors] = useState(initStepFormErrorState());

    //custom validation for passwords onChange
    React.useEffect(() => {
        validatePwds();
    }, [formFields.password, formFields.confirm_password]);

    // onComponentMount
    React.useEffect(() => {
        setComponentMounted(true);

        // load the select dropdown options
        setCars(loadCarsOptions());
    }, []);

    function loadCarsOptions() {
        const options = [
            {value: '', label: 'Select a Car'},
            {value: 'subaru', label: 'Subaru'},
            {value: 'volvo', label: 'Volvo'},
            {value: 'saab', label: 'Saab'},
            {value: 'fiat', label: 'Fiat'},
            {value: 'audi', label: 'Audi'},
            {value: 'porsche', label: 'Porsche'},
        ];

        let data = [];

        for (const opt of options) {
            data.push(<option key={opt.value + '_key'} value={opt.value}>{opt.label}</option>);
        }
        return data;
    }

    React.useEffect(() => {
        validateTerms();
    }, [formFields.terms]);

    function validateTerms() {
        let valid = true;
        if (componentMounted) {
            valid = formFields['terms'];
            let stepErr = formErrors[step];
            stepErr['terms'] = (valid ? null : ["Must accept terms."]);
            setFormErrors({...formErrors, [step]: stepErr});
        }
        return valid;
    }

    function validatePwds() {
        let valid = true;
        if (componentMounted) {
            const pw = formFields.password;
            const cp = formFields.confirm_password;
            let stepErr = formErrors[step];

            if (pw === cp) {
                if (pw.length === 0) {
                    stepErr['password'] = ["this is a required field"];
                    stepErr['confirm_password'] = ["this is a required field"];
                    setFormErrors({...formErrors, [step]: stepErr});
                    valid = false;
                } else {
                    stepErr['password'] = null;
                    stepErr['confirm_password'] = null;
                    setFormErrors({...formErrors, [step]: stepErr});
                }
            } else {
                if (pw.length > 0) {
                    stepErr['password'] = null;
                } else {
                    stepErr['password'] = ['this is a required field yo!'];
                }
                stepErr['confirm_password'] = ['passwords must match'];
                setFormErrors({...formErrors, [step]: stepErr});
                valid = false;
            }
        }
        return valid;
    }

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

    function handleBlur(event) {
        const {target} = event;
        const {name, value} = target;
        validateFormField(name, value);
    }

    function gregger() {
        console.log("only continue if health is chosen!", formFields['care_options']);

        return (formFields['care_options']['health'] === true);
    }

    // fired onNext step to ensure all fields are touched and validated prior to moving to the next step
    function validateFormFields() {
        const fields = stepTransitions[step].fields;
        let valid = true;

        Object.keys(fields).forEach(function (field) {
            const value = formFields[field];
            if (!validateFormField(field, value)) {
                valid = false;
            }
        });

        return valid;
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

    // called on submit of the form todo do we need this?
    function isFormValid() {
        let formFieldsValid = true;
        for (const property in formFields) {
            formFieldsValid = formFieldsValid && (formFields[property] !== "");
        }
        let formErrorsValid = true;
        for (const property in formErrors) {
            formErrorsValid = formErrorsValid && !formErrors[property];
        }
        return formErrorsValid && formFieldsValid;
    }

    const renderCheckBoxGroup = function({field, name, label} = {}) {
        const splatProps = arguments[1] ? arguments[1] : null;

        //todo render an error ?!
        function handleCheckboxGroupChange(event) {
            let {target} = event;
            let {name, checked} = target;
            let cbxState = formFields[field];
            cbxState[name] = checked;
            setFormFields({...formFields, [field]: cbxState});
            validateFormField(field, checked)
        }

        //render the checkbox
        return (
            <div className="form-expanding-group">
                <div className="form-checkbox-buttons">
                    <input id={field + '-' + name}
                           name={name} checked={formFields[field][name]}
                           type="checkbox"
                           onChange={handleCheckboxGroupChange}
                           {...splatProps}
                    />
                    <label id={field + '-' + name + "-label"} htmlFor={field + '-' + name}>{label}</label>
                </div>
            </div>
        )
    };

    const renderCheckBox = function({name, label} = {}) {
        const splatProps = arguments[1] ? arguments[1] : null;
        const stepErrors = formErrors[step];

        return (
            <div className={stepErrors[name] ? "usa-input-error" : null}>
                <div className="form-expanding-group" >
                    <div className="form-checkbox-buttons">
                        <input id={name}
                           name={name}
                           checked={formFields[name]}
                           type="checkbox"
                           onChange={handleInputChange}
                           onBlur={handleBlur}
                           {...splatProps}
                        />
                        <label id={'cbx-' + name + "-label"} htmlFor={name}>{label}</label>
                        <Errors fieldname={name} error_messages={stepErrors[name]}/>
                    </div>
                </div>
            </div>
        )
    };

    const renderRadioBtn = function({id, name, label} = {}) {
        const splatProps = arguments[1] ? arguments[1] : null;

        return (
            <div className="form-radio-buttons">
                <div className="radio-button">
                    <input type="radio" id={id} name={name} checked={formFields[name] === id} onChange={handleInputChange} {...splatProps}/>
                    <label id={id + "-label"} htmlFor={id}>{label}</label>
                </div>
            </div>
        )
    };

    const renderTextArea = function({name, label} = {}) {
        const splatProps = arguments[1] ? arguments[1] : null;
        const stepErrors = formErrors[step];

        return (
            <div className={stepErrors[name] ? "usa-input-error" : null}>
                <label className="usa-input-error-label" htmlFor={name}>{label}</label>
                <Errors fieldname={name} error_messages={stepErrors[name]}/>
                <textarea
                    id={name}
                    name={name}
                    aria-describedby={name +"-error-message"}
                    className={stepErrors[name] ? "invalid" : null}
                    value={formFields[name]}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    {...splatProps}
                />
            </div>
        )
    };

    const renderTextInput = function({name, label, type = 'text'} = {}) {
        const splatProps = arguments[1] ? arguments[1] : null;
        const stepErrors = formErrors[step];

        return (
            <div className={stepErrors[name] ? "usa-input-error" : null}>
                <label className="usa-input-error-label" htmlFor={name}>{label}</label>
                <Errors fieldname={name} error_messages={stepErrors[name]}/>
                <input
                    id={name}
                    name={name}
                    type={type}
                    aria-describedby={name +"-error-message"}
                    className={stepErrors[name] ? "invalid" : null}
                    value={formFields[name]}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    {...splatProps}
                />
            </div>
        )
    };

    const renderSelect = function({name, label, options} = {}) {
        const splatProps = arguments[1] ? arguments[1] : null;
        const stepErrors = formErrors[step];

        return (
            <div className={stepErrors[name] ? "usa-input-error" : ""}>
                <label className="usa-input-error-label" htmlFor={name}>{name}</label>
                <Errors fieldname={name} error_messages={stepErrors[name]}/>
                <select
                    id={name}
                    name={name}
                    aria-describedby={name+"-error-message"}
                    className={stepErrors[name] ? "usa-select invalid" : "usa-select"}
                    value={formFields[name]}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    {...splatProps}
                >
                    {options}
                </select>
            </div>
        )
    };

    const renderSelectMulti = function({name, label, options} = {}) {
        const splatProps = arguments[1] ? arguments[1] : null;
        const stepErrors = formErrors[step];

        function handleMultiSelect(event) {
            const {target} = event;
            const {name} = target;
            const selections = Array.apply(null, target.options).filter(option => option.selected).map(option => option.value);
            setFormFields({...formFields, [name]: selections});
            validateFormField(name, selections);
        }

        return (
            <div className={stepErrors[name] ? "usa-input-error" : ""}>
                <label className="usa-input-error-label" htmlFor={name}>{name}</label>
                <Errors fieldname={name} error_messages={stepErrors[name]}/>
                <select style={{height: '150px'}}
                    id={name}
                    name={name}
                    aria-describedby={name+"-error-message"}
                    className={stepErrors[name] ? "usa-select invalid" : "usa-select"}
                    value={formFields[name]}
                    onChange={handleMultiSelect}
                    onBlur={handleBlur}
                    multiple
                    {...splatProps}
                >
                    {options}
                </select>
            </div>
        )
    };

    const renderStepButtons = function() {
        const {prev, next, finish} = stepTransitions[step];
        const prevBtn = prev ? <button onClick={prevStep}>{prev[1] ? prev[1] : 'Previous'}</button> : '';
        let nextBtn = '';
        // const nextBtn = next ? <button className="usa-button usa-button-active" onClick={nextStep}>{next[1] ? next[1] : 'Next'}</button> : '';

        if (next && Array.isArray(next)) {
            console.log("we have a next array!!!", next);
            nextBtn = <button className="usa-button usa-button-active" onClick={nextStep}>{next[1] ? next[1] : 'Next'}</button>;
        } else {
            console.log("next object", next);
            nextBtn = next ? <button className="usa-button usa-button-active" onClick={nextStep}>{next.label ? next.label : 'Next'}</button> : '';
        }
        const finishBtn = finish ? <button className="usa-button usa-button-active" onClick={finish[0]}>{finish[1] ? finish[1] : 'Finish'}</button> : '';

        return (
            <div>
                <div className="usa-grid">
                    <div className="usa-width-whole">
                        {prevBtn}
                        {nextBtn}
                        {finishBtn}
                    </div>
                </div>
            </div>
        )

    };

    function prevStep() {
        let prevStep = null;
        
        if (stepTransitions[step]['prev'].step) {
            prevStep = stepTransitions[step]['prev'].step;
        } else {
            prevStep = stepTransitions[step].prev[0];
        }
        setStep(prevStep);
    }

    function nextStep() {
        const isStepValid = validateFormFields();
        if (isStepValid) {
            let nextStep = null;

            if (stepTransitions[step]['next'].step) {
                nextStep = stepTransitions[step]['next'].step;
            } else {
                nextStep = stepTransitions[step].next[0];
            }

            if (stepTransitions[step]['next'].onNextFunc) {
                if (!stepTransitions[step]['next'].onNextFunc()) {
                    console.log("next func returned false - not moving on!");
                    return;
                }
            }

            setStep(nextStep)
        } else {
            console.log("step is not valid - staying put!");
        }
    }

    function step1() {
        return (
            <div>
                <div className="usa-grid">
                    <div className="usa-width-whole">
                        <h1 className="usa-heading">Create an account</h1>
                    </div>
                </div>
                <div className="usa-grid">
                    <div className="usa-width-one-half">
                        {/*{renderSelect({name: "greg", label:"Cars", options: cars}, {autoFocus: true})}*/}
                        {/*{renderSelectMulti({name: "carz", label:"Cars", options: cars}, {autoFocus: true})}*/}
                        {/*{renderTextArea({name: "greg", label: "Comment"}, {onKeyPress: function() {console.log("key press");}})}*/}
                        {/*{renderTextInput({name: "first_name", label: "First Name"}, {autoFocus: true, onClick: function() {console.log('clicked first name');}})}*/}
                        {renderTextInput({name: "first_name", label: "First Name"}, {autoFocus: true})}
                    </div>
                    <div className="usa-width-one-half">
                        {renderTextInput({name:"last_name", label:"Last Name"})}
                    </div>
                </div>
                <div className="usa-grid">
                    <div className="usa-width-whole">
                        {renderTextInput({name:"email", label:"E-Mail", type:'email'})}
                    </div>
                </div>
                <div className="usa-grid">
                    <div className="usa-width-whole">
                        {renderTextInput({name:'password', label:'Password', type:'password'})}
                    </div>
                </div>
                <div className="usa-grid">
                    <div className="usa-width-whole">
                        {renderTextInput({name:'confirm_password', label:'Confirm Password', type:'password'})}
                    </div>
                </div>
                <div className="usa-grid">
                    <div className="usa-width-whole">
                        {renderCheckBox({name:'terms', label:'Accept Terms'})}
                    </div>
                </div>
            </div>
        )
    }

    function validateSelections() {
        const selections = Object.values(formFields['care_options']);
        let stepErr = formErrors[step];
        let valid = false;

        for (const selection of selections) {
            if (selection) {
                valid = true;
                break;
            }
        }

        const msg = valid ? null : 'Please select at least one survey item.';
        setFormErrors({...formErrors, [step]: {['care_options']: [msg]}});
        return valid;
    }

    function step2() {
        return (
            <div>
                <div className="usa-grid">
                    <div className="usa-width-whole">
                        <h1>Registration Success!</h1>
                        <p>Welcome <b>{formFields.first_name}&nbsp;{formFields.last_name}</b>. Your account has been created and a confirmation e-mail has been sent to <b>{formFields.email}</b>.</p>
                        <p>We will be presenting you with a series of survey questions on subsequent pages.</p>
                        <h3>Let's go Next!</h3>
                        <fieldset>
                            <legend>Favorite Color</legend>
                            {renderRadioBtn({label: "Yellow", id: 'color_yellow', name: 'color'}, {autoFocus: true, onClick: function() {alert('clicking it')}})}
                            {renderRadioBtn({label: "Red", id: 'color_red', name: 'color'})}
                            {renderRadioBtn({label: "Green", id: 'color_green', name: 'color'})}
                            {renderRadioBtn({label: "Blue", id: 'color_blue', name: 'color'})}
                        </fieldset>
                        <fieldset>
                            <legend>Care Options</legend>
                            <Errors fieldname='care_options' error_messages={formErrors[step]['care_options']}/>
                            {renderCheckBoxGroup({field: 'care_options', name: 'health', label: 'Healthcare'})}
                            {renderCheckBoxGroup({field: 'care_options', name: 'insurance', label: 'Insurance'})}
                        </fieldset>

                    </div>
                </div>
            </div>
        )
    }

    function step3() {
        return (
            <div>
                <div className="usa-grid">
                    <div className="usa-width-whole">
                        <h1>Survey</h1>
                        <h5>What Services are you interested in?</h5>
                        <h6>(select all that apply)</h6>

                    </div>
                </div>
            </div>
        )
    }

    function handleSubmit(event) {
        event.preventDefault();//do we need this?
        if (isFormValid()) {
            axios.post(gon.routes.form_inputs_path, formFields)
                .then(function (response) {
                    alert(JSON.stringify(response));
                    f.reset();
                    self.setState({...self.state, validated: false});
                })
                .catch(function (error) {
                    console.log(error);
                });

        } else {
            alert("Form is not valid");
        }
    }

    function finish() {
        alert("calling finish!!!");
    }

    // recEngine render
    return (
        <div>
            {stepTransitions[step].render()}
            {renderStepButtons()}
            {/*<div><pre>{JSON.stringify(formFields, null, 2)}</pre></div>*/}
            {/*<div><pre>{JSON.stringify(formErrors, null, 2)}</pre></div>*/}

        </div>
    )
}

export default RecEngine;
