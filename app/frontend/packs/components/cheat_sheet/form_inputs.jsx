import React, {useState, useEffect} from "react";
import * as yup from "yup";
import axios from '../../utils/axios'

function Errors({fieldname, error_messages}) {
    if (!error_messages) return null;

    return (
        <div>
            {error_messages.map((error, i) => (
                <span key={i} role="alert" id={fieldname + "-error-message"}
                      className="usa-input-error-message">{error}</span>
            ))}
        </div>
    );
}

function FormInputs() {
    function formYupSchema() {
        return yup.object().shape({
            email: yup
                .string()
                .email()
                .required(),
            first_name: yup
                .string()
                .required()
                .min(3),
            last_name: yup
                .string()
                .required()
                .min(3),
            comment: yup
                .string()
                .required()
                .min(3),
            cars: yup
                .string()
                .required("you need to pick at least one car"),
            color: yup
                .string()
                .required(),
        });
    }
    const [formFields, setFormFields] = useState({
        email: "",
        comment: "",
        cars: [],
        first_name: "",
        last_name: "",
        password: "",
        confirm_password: "",
        color: "color_green",
        care_options: {health: false, insurance: false},
    });

    const [formErrors, setFormErrors] = useState({});

    React.useEffect(() => {
        function isValidPasswords() {
            let pw = formFields.password;
            let cp = formFields.confirm_password;
            return (pw === cp);
        }

        setFormErrors({...formErrors, confirm_password: (isValidPasswords() ? null : ["Passwords must match"])});
    }, [formFields.password, formFields.confirm_password]);

    /*
        React.useEffect(() => {
            console.log("called every render");
        });

        React.useEffect(() => {
            console.log("call once component loads");
            return () => console.log("component unmount");
        }, []);
    */

    function formIsValid() {
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

    function handleMultiSelect(event) {
        const {target} = event;
        const {name} = target;
        const selections = Array.apply(null, target.options).filter(option => option.selected).map(option => option.value);
        setFormFields({...formFields, [name]: selections});
        validateFormFields(name, selections);
    }

    function handleCheckboxGroupChange(stateGroup, event) {
        let {target} = event;
        let {name} = target;
        let cbxState = formFields[stateGroup];
        cbxState[name] = target.checked;
        setFormFields({...formFields, cbxState});
    }

    function handleInputChange(event) {
        const {target} = event;
        const {name} = target;
        let value = target.type === "checkbox" ? target.checked : target.value;

        if (target.type === 'radio') {
            value = target.checked ? target.id : '';
        }

        setFormFields({...formFields, [name]: value});

        if (target.type === 'checkbox' || target.type === 'radio') {
            return;
        }

        validateFormFields(name, value);
    }

    function handleBlur(event) {
        const {target} = event;
        const {name, value} = target;
        validateFormFields(name, value);
    }

    function validateFormFields(name, value) {
        if (name === 'password' || name === 'confirm_password') {
            if (value === '') {
                setFormErrors({...formErrors, [name]: ["this is a required field"]});
            } else {
                if (formErrors[name] && (formErrors[name][0] === "this is a required field")) {
                    setFormErrors({...formErrors, [name]: null});
                }
            }
            return;
        }
        yup
            .reach(formYupSchema(), name)
            .validate(value)
            .then(valid => {
                setFormErrors({...formErrors, [name]: null});
            })
            .catch(e => {
                setFormErrors({...formErrors, [name]: e.errors});
            });
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (formIsValid()) {
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

    function isRadioSelected(field, id) {
        return formFields[field] === id;
    }

    function renderForm() {
        return (
            <div style={{'borderStyle': 'solid', 'borderWidth': 'thin'}}>
                <h1 className="usa-heading">Header 1</h1>
                <h2 className="usa-heading">Header 2</h2>
                <h3 className="usa-heading">Header 3</h3>
                <h4 className="usa-heading">Header 4</h4>
                <h5 className="usa-heading">Header 5</h5>
                <div className="va-h-ruled--stars"></div>
                <div className="usa-grid">
                    <h2 className="usa-heading">Grid Sizes</h2>
                </div>
                <div className="usa-grid vads-u-background-color--gold-lightest">
                    <div className="usa-width-one-whole">1/1</div>
                </div>
                <div className="usa-grid">
                    <div className="usa-width-one-half">1/2</div>
                    <div className="usa-width-one-half">1/2</div>
                </div>
                <div className="usa-grid vads-u-background-color--cool-blue-light">
                    <div className="usa-width-one-third vads-u-background-color--primary-alt-dark">1/3</div>
                    <div className="usa-width-one-third vads-u-background-color--primary-alt-darker">1/3</div>
                    <div className="usa-width-one-third vads-u-background-color--primary-alt-dark">1/3</div>
                </div>
                <form className="usa-form">
                        <div className={formErrors["first_name"] ? "usa-input-error" : ""}>
                            <label className="usa-input-error-label" htmlFor="first_name">First Name</label>
                            <Errors fieldname="first_name" error_messages={formErrors["first_name"]}/>
                            <input
                                id="first_name"
                                name="first_name"
                                type="text"
                                aria-describedby="first_name-error-message"
                                className={formErrors["first_name"] ? "invalid" : ""}
                                value={formFields.first_name}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                autoFocus
                            />
                        </div>
                        <div className={formErrors["last_name"] ? "usa-input-error" : ""}>
                            <label className="usa-input-error-label" htmlFor="last_name">Last Name</label>
                            <Errors fieldname="last_name" error_messages={formErrors["last_name"]}/>
                            <input
                                id="last_name"
                                name="last_name"
                                type="text"
                                aria-describedby="last_name-error-message"
                                className={formErrors["last_name"] ? "invalid" : ""}
                                value={formFields.last_name}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                            />
                        </div>
                        <div className={formErrors["email"] ? "usa-input-error" : ""}>
                            <label className="usa-input-error-label" htmlFor="email">E-mail</label>
                            <Errors fieldname="email" error_messages={formErrors["email"]}/>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                aria-describedby="email-error-message"
                                className={formErrors["email"] ? "invalid" : ""}
                                value={formFields.email}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                            />
                        </div>
                        <div className={formErrors["comment"] ? "usa-input-error" : ""}>
                            <label className="usa-input-error-label" htmlFor="comment">Comment</label>
                            <Errors fieldname="comment" error_messages={formErrors["comment"]}/>
                            <textarea
                                id="comment"
                                name="comment"
                                aria-describedby="comment-error-message"
                                className={formErrors["comment"] ? "invalid" : ""}
                                value={formFields.comment}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                            />
                        </div>
                        <div className={formErrors["password"] ? "usa-input-error" : ""}>
                            <label className="usa-input-error-label" htmlFor="password">Password</label>
                            <Errors error_messages={formErrors["password"]}/><br/>
                            <input
                                className={formErrors["password"] ? "invalid" : ""}
                                type="password"
                                name="password"
                                value={formFields.password}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                            />
                        </div>
                        <div className={formErrors["confirm_password"] ? "usa-input-error" : ""}>
                            <label className="usa-input-error-label" htmlFor="confirm_password">Re-enter Password</label>
                            <Errors error_messages={formErrors["confirm_password"]}/><br/>
                            <input
                                className={formErrors["confirm_password"] ? "invalid" : ""}
                                type="password"
                                name="confirm_password"
                                value={formFields.confirm_password}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                            />
                        </div>
                        <div className={formErrors["cars"] ? "usa-input-error" : ""}>
                            <label className="usa-input-error-label" htmlFor="cars">Cars</label>
                            <Errors fieldname="cars" error_messages={formErrors["cars"]}/>
                            <select  style={{height: '100px'}}
                                id="cars"
                                name="cars"
                                aria-describedby="cars-error-message"
                                className={formErrors["cars"] ? "usa-select invalid" : "usa-select"}
                                value={formFields.cars}
                                required
                                multiple
                                onChange={handleMultiSelect}
                                onBlur={handleBlur}
                            >
                                <option value="subaru">Subaru</option>
                                <option value="volvo">Volvo</option>
                                <option value="saab">Saab</option>
                                <option value="fiat">Fiat</option>
                                <option value="audi">Audi</option>
                            </select>
                        </div>
                        <fieldset className="fieldset-input">
                            <legend className="legend-label">Favorite Color</legend>
                            <div className="form-radio-buttons">
                                <div className="radio-button">
                                    <input type="radio" id="color_red" name="color" checked={isRadioSelected('color', 'color_red')} onChange={handleInputChange}/>
                                    <label id="color_red-label" htmlFor="color_red">Red</label>
                                </div>
                            </div>
                            <div className="form-radio-buttons">
                                <div className="radio-button">
                                    <input type="radio" id="color_green" name="color" checked={isRadioSelected('color', 'color_green')} onChange={handleInputChange}/>
                                    <label id="color_green-label" htmlFor="color_green">Green</label>
                                </div>
                            </div>
                            <div className="form-radio-buttons">
                                <div className="radio-button">
                                    <input type="radio" id="color_blue" name="color" checked={isRadioSelected('color', 'color_blue')} onChange={handleInputChange}/>
                                    <label id="color_blue-label" htmlFor="color_blue">Blue</label>
                                </div>
                            </div>
                        </fieldset>
                        <fieldset className="fieldset-input">
                            <legend className="legend-label">Care Options</legend>
                            <div className="form-expanding-group" >
                                <div className="form-checkbox-buttons">
                                    <input type="checkbox" id="careOption_health" name="health" checked={formFields.care_options.health}
                                           onChange={(event) => handleCheckboxGroupChange('care_options', event)}/>
                                    <label name="careOption_health-label" htmlFor="careOption_health">Healthcare</label>
                                </div>
                            </div>
                            <div className="form-expanding-group" >
                                <div className="form-checkbox-buttons">
                                    <input type="checkbox" id="careOption_insurance" name="insurance" checked={formFields.care_options.insurance}
                                           onChange={(event) => handleCheckboxGroupChange('care_options', event)}/>
                                    <label name="careOption_insurance-label" htmlFor="careOption_insurance">Insurance</label>
                                </div>
                            </div>
                        </fieldset>

                        <button type="submit" className="usa-button usa-button-active" onClick={handleSubmit} disabled={!formIsValid()}>
                            Register User
                        </button>
                    </form>
                <div><pre>{JSON.stringify(formFields, null, 2)}</pre></div>
                {/*<div><pre>{JSON.stringify(formErrors, null, 2)}</pre></div>*/}
            </div>
        );
    }

    return (
        renderForm()
    );
}

export default FormInputs;
