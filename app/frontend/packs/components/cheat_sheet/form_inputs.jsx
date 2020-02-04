import React, {useState, useEffect} from "react";
import * as yup from "yup";
import axios from '../../utils/axios'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'


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
    function schemaAuthenticate() {
        return yup.object().shape({
            email: yup
                .string()
                .email()
                .required(),
            first_name: yup
                .string()
                .required()
                .min(3),
            comment: yup
                .string()
                .required()
                .min(3),
            cars: yup
                .string()
                .required(),
        });
    }
    const [formFields, setFormFields] = useState({
        email: "",
        comment: "",
        cars: "",
        first_name: "",
        password: "",
        confirm_password: "",
    });

    const [formErrors, setFormErrors] = useState({});


    React.useEffect(() => {
        console.log("password effect");

        function isValidPasswords() {
            let pw = formFields.password;
            let cp = formFields.confirm_password;
            return (pw === cp);
        }

        setFormErrors({...formErrors, confirm_password: (isValidPasswords() ? null : ["Passwords must match"])});
    }, [formFields.password, formFields.confirm_password]);

    React.useEffect(() => {
        console.log("called every render");
    });

    React.useEffect(() => {
        console.log("call once component loads");
        return () => console.log("component unmount");
    }, []);

    function authenticateIsValid() {
        let authFieldsValid = true;
        for (const property in formFields) {
            authFieldsValid = authFieldsValid && (formFields[property] !== "");
        }
        let authErrorsValid = true;
        for (const property in formErrors) {
            authErrorsValid = authErrorsValid && !formErrors[property];
        }
        return authErrorsValid && authFieldsValid;
    };

    function handleAuthInputChange(event) {
        const {target} = event;
        const {name} = target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        setFormFields({...formFields, [name]: value});
        validateAuthFields(name, value);
    }

    function handleAuthBlur(event) {
        const {target} = event;
        const {name, value} = target;
        validateAuthFields(name, value);
    }

    function validateAuthFields(name, value) {
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
            .reach(schemaAuthenticate(), name)
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
        if (authenticateIsValid()) {
            console.table(formFields);
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

    function renderForm() {
        return (
            <div className="Recommendation">
                <div style={{padding: '3px'}}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Welcome</Card.Title>
                            <form>
                                {/*
                                <div className="usa-input-error">
                                    <label className="usa-input-error-label" htmlFor="errorable-text-input-6">Label</label>
                                    <span className="usa-input-error-message" role="alert" id="errorable-text-input-6-error-message" style={{display: 'block'}}>
                                        <span className="sr-only">Error</span> Error message</span>
                                    <input aria-describedby="errorable-text-input-6-error-message" id="errorable-text-input-6" placeholder="Placeholder" name="Name" type="text" value=""/>
                                 </div>
*/}
                                {/*add aria information for 508 */}
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
                                        onChange={handleAuthInputChange}
                                        onBlur={handleAuthBlur}
                                        autoFocus
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
                                    onChange={handleAuthInputChange}
                                    onBlur={handleAuthBlur}
                                    autoFocus
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
                                        rows="2"
                                        cols="2"
                                        value={formFields.comment}
                                        onChange={handleAuthInputChange}
                                        onBlur={handleAuthBlur}
                                    />
                                </div>
                                <div className={formErrors["cars"] ? "usa-input-error" : ""}>
                                    <label className="usa-input-error-label" htmlFor="cars">Cars</label>
                                    <Errors fieldname="cars" error_messages={formErrors["cars"]}/>
                                    <select
                                        id="cars"
                                        name="cars"
                                        aria-describedby="cars-error-message"
                                        className={formErrors["cars"] ? "invalid" : ""}
                                        value={formFields.cars}
                                        required
                                        onChange={handleAuthInputChange}
                                        onBlur={handleAuthBlur}
                                    >
                                        <option value="">Select a car</option>
                                        <option value="subaru">Subaru</option>
                                        <option value="volvo">Volvo</option>
                                        <option value="saab">Saab</option>
                                        <option value="fiat">Fiat</option>
                                        <option value="audi">Audi</option>
                                    </select>
                                </div>
                                <hr/>
                                <div>
                                    <pre>{JSON.stringify(formFields, null, 2)}</pre>
                                </div>
                                <div>
                                    <pre>{JSON.stringify(formErrors, null, 2)}</pre>
                                </div>
                                <hr/>
                                <div className={formErrors["password"] ? "usa-input-error" : ""}>
                                <label className="usa-input-error-label" htmlFor="password">Password</label>
                                    <Errors error_messages={formErrors["password"]}/><br/>
                                    <input
                                    className={formErrors["password"] ? "invalid" : ""}
                                    type="password"
                                    name="password"
                                    value={formFields.password}
                                    onChange={handleAuthInputChange}
                                    onBlur={handleAuthBlur}
                                />
                                </div>
                                <div className={formErrors["confirm_password"] ? "usa-input-error" : ""}>
                                <label className="usa-input-error-label" htmlFor="email">Re-enter Password</label>
                                <Errors error_messages={formErrors["confirm_password"]}/><br/>
                                <input
                                    className={formErrors["confirm_password"] ? "invalid" : ""}
                                    type="password"
                                    name="confirm_password"
                                    value={formFields.confirm_password}
                                    onChange={handleAuthInputChange}
                                    onBlur={handleAuthBlur}
                                />
                                </div>
                                <button type="submit" className="usa-button usa-button-active" onClick={handleSubmit} disabled={!authenticateIsValid()}>
                                    Register User
                                </button>
                            </form>

                        </Card.Body>
                    </Card>
                </div>
                {/*<div><pre>{JSON.stringify(formFields, null, 2)}</pre></div>*/}
                {/*<div><pre>{JSON.stringify(formErrors, null, 2)}</pre></div>*/}
            </div>
        );
    }

    return (
        renderForm()
    );
}

export default FormInputs;
