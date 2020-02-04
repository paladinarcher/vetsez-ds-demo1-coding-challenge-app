import React, {useState, useEffect} from "react";
import * as yup from "yup";
import axios from '../utils/axios'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import divWithClassName from "react-bootstrap/es/utils/divWithClassName";


const schemaSurvey = yup.object().shape({
    healthcare: yup
        .boolean(),
    education: yup
        .boolean(),
    housing: yup
        .boolean(),
    cemetary: yup
        .boolean(),
});

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

function Recommendation() {
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
            last_name: yup
                .string()
                .required()
                .min(3),
        });
    }

    let stepTransitions = {"authenticate": "confirmation", "confirmation": "survey", "survey": "authenticate"};
    const [step, setStep] = useState("authenticate");
    const [authFields, setAuthFields] = useState({
        email: "",
        comment: "",
        cars: "",
        first_name: "",
        last_name: "",
        password: "",
        confirm_password: "",
    });

    const [authErrors, setAuthErrors] = useState({
        // email: null,
        // first_name: null,
        // last_name: null,
        // password: null,
        // confirm_password: null
    });

    const [surveyOneFields, setSurveyOneFields] = useState({
        healthcare: false,
        education: false,
        housing: false,
        cemetary: false
    });

    React.useEffect(() => {
        console.log("password effect");

        function isValidPasswords() {
            let pw = authFields.password;
            let cp = authFields.confirm_password;
            return (pw === cp);
        }

        setAuthErrors({...authErrors, confirm_password: (isValidPasswords() ? null : ["Passwords must match"])});
    }, [authFields.password, authFields.confirm_password]);

    React.useEffect(() => {
        console.log("called every render");
    });

    React.useEffect(() => {
        console.log("call once component loads");
        return () => console.log("component unmount");
    }, []);

    function authenticateIsValid() {
        let authFieldsValid = true;
        for (const property in authFields) {
            authFieldsValid = authFieldsValid && (authFields[property] !== "");
        }
        let authErrorsValid = true;
        for (const property in authErrors) {
            authErrorsValid = authErrorsValid && !authErrors[property];
        }
        return authErrorsValid && authFieldsValid;
    };

    function handleAuthInputChange(event) {
        const {target} = event;
        const {name} = target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        setAuthFields({...authFields, [name]: value});
        validateAuthFields(name, value);
    }

    function handleSurveyOneInputChange(event) {
        const {target} = event;
        const {name} = target;
        setSurveyOneFields({...surveyOneFields, [name]: target.checked});
    }

    function handleAuthBlur(event) {
        const {target} = event;
        const {name, value} = target;
        validateAuthFields(name, value);
    }

    function validateAuthFields(name, value) {
        if (name === 'password' || name === 'confirm_password') {
            if (value === '') {
                setAuthErrors({...authErrors, [name]: ["this is a required field"]});
            } else {
                if (authErrors[name] && (authErrors[name][0] === "this is a required field")) {
                    setAuthErrors({...authErrors, [name]: null});
                }
            }
            return;
        }
        yup
            .reach(schemaAuthenticate(), name)
            .validate(value)
            .then(valid => {
                setAuthErrors({...authErrors, [name]: null});
            })
            .catch(e => {
                setAuthErrors({...authErrors, [name]: e.errors});
            });
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (authenticateIsValid()) {
            console.table(authFields);
            let s = step;
            console.log("current step is ", s);
            setStep(stepTransitions[s]);
            // axios.post(gon.routes.post_form_path, fields)
            //     .then(function (response) {
            //         alert(response.data.message);
            //         f.reset();
            //         self.setState({...self.state, validated: false});
            //     })
            //     .catch(function (error) {
            //         console.log(error);
            //     });

        } else {
            alert("Form is not valid");
        }
    }

    function authenticate() {
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
                                <div className={authErrors["first_name"] ? "usa-input-error" : ""}>
                                    <label className="usa-input-error-label" htmlFor="first_name">First Name</label>
                                    <Errors fieldname="first_name" error_messages={authErrors["first_name"]}/>
                                    <input
                                        id="first_name"
                                        name="first_name"
                                        type="text"
                                        aria-describedby="first_name-error-message"
                                        className={authErrors["first_name"] ? "invalid" : ""}
                                        value={authFields.first_name}
                                        onChange={handleAuthInputChange}
                                        onBlur={handleAuthBlur}
                                        autoFocus
                                    />
                                </div>
                                <div className={authErrors["comment"] ? "usa-input-error" : ""}>
                                    <label className="usa-input-error-label" htmlFor="comment">Comment</label>
                                    <Errors fieldname="comment" error_messages={authErrors["comment"]}/>
                                    <textarea
                                        id="comment"
                                        name="comment"
                                        aria-describedby="comment-error-message"
                                        className={authErrors["comment"] ? "invalid" : ""}
                                        rows="2"
                                        cols="2"
                                        value={authFields.comment}
                                        onChange={handleAuthInputChange}
                                        onBlur={handleAuthBlur}
                                    />
                                </div>
                                <div className={authErrors["cars"] ? "usa-input-error" : ""}>
                                    <label className="usa-input-error-label" htmlFor="cars">Cars</label>
                                    <Errors fieldname="cars" error_messages={authErrors["cars"]}/>
                                    <select
                                        id="cars"
                                        name="cars"
                                        aria-describedby="cars-error-message"
                                        className={authErrors["cars"] ? "invalid" : ""}
                                        value={authFields.cars}
                                        required
                                        onChange={handleAuthInputChange}
                                        onBlur={handleAuthBlur}
                                    >
                                        <option value="">Select a car</option>
                                        <option value="volvo">Volvo</option>
                                        <option value="saab">Saab</option>
                                        <option value="fiat">Fiat</option>
                                        <option value="audi">Audi</option>
                                    </select>
                                </div>
                                <hr/>
                                <div><pre>{JSON.stringify(authFields, null, 2)}</pre></div>
                                <div><pre>{JSON.stringify(authErrors, null, 2)}</pre></div>
                                <hr/>
                                <label htmlFor="last_name">Last Name</label>
                                <input
                                    className={authErrors["last_name"] ? "invalid" : ""}
                                    type="string"
                                    name="last_name"
                                    value={authFields.last_name}
                                    onChange={handleAuthInputChange}
                                    onBlur={handleAuthBlur}
                                />
                                <Errors error_messages={authErrors["last_name"]}/>
                                <label htmlFor="email">Email</label>
                                <input
                                    className={authErrors["email"] ? "invalid" : ""}
                                    type="email"
                                    name="email"
                                    value={authFields.email}
                                    onChange={handleAuthInputChange}
                                    onBlur={handleAuthBlur}
                                />
                                <Errors error_messages={authErrors["email"]}/><br/>
                                <label htmlFor="email">Password</label>
                                <input
                                    className={authErrors["password"] ? "invalid" : ""}
                                    type="password"
                                    name="password"
                                    value={authFields.password}
                                    onChange={handleAuthInputChange}
                                    onBlur={handleAuthBlur}
                                />
                                <Errors error_messages={authErrors["password"]}/><br/>
                                <label htmlFor="email">Re-enter Password</label>
                                <input
                                    className={authErrors["confirm_password"] ? "invalid" : ""}
                                    type="password"
                                    name="confirm_password"
                                    value={authFields.confirm_password}
                                    onChange={handleAuthInputChange}
                                    onBlur={handleAuthBlur}
                                />
                                <Errors error_messages={authErrors["confirm_password"]}/><br/>
                                <button type="submit" onClick={handleSubmit} disabled={!authenticateIsValid()}>
                                    Register User
                                </button>
                            </form>

                        </Card.Body>
                    </Card>
                </div>
                {/*<div><pre>{JSON.stringify(authFields, null, 2)}</pre></div>*/}
                {/*<div><pre>{JSON.stringify(authErrors, null, 2)}</pre></div>*/}
            </div>
    );
    }

    function handleNext() {
        setStep(stepTransitions[step]);
    }

    function confirmation() {
        return (
        <div className="Recommendation">
        <div style={{padding: '3px'}}>
        <Card>
        <Card.Body>
        <Card.Title>Success Message</Card.Title>
        <h3>Let's go Next!</h3>
        <button onClick={handleNext}>Begin</button>

        </Card.Body>
        </Card>
        </div>
        </div>
        )

    }

    function survey() {
        return (
        <div className="Recommendation">
        <div style={{padding: '3px'}}>
        <Card>
        <Card.Body>
        <Card.Title>Survey</Card.Title>
        <form>
        <h5>What Services are you interested in?</h5>
        <h6>(select all that apply)</h6>
        <label>
        <input
        type="checkbox"
        name="healthcare"
        checked={surveyOneFields.healthcare}
        onChange={handleSurveyOneInputChange}
        />
        <span>&nbsp;Healthcare</span>
        </label>
        <label>
        <input
        type="checkbox"
        name="education"
        checked={surveyOneFields.education}
        onChange={handleSurveyOneInputChange}
        />
        <span>&nbsp;Education</span>
        </label>
        <label>
        <input
        type="checkbox"
        name="housing"
        checked={surveyOneFields.housing}
        onChange={handleSurveyOneInputChange}
        />
        <span>&nbsp;Housing</span>
        </label>
        <label>
        <input
        type="checkbox"
        name="cemetary"
        checked={surveyOneFields.cemetary}
        onChange={handleSurveyOneInputChange}
        />
        <span>&nbsp;Cemetary</span>
        </label>
        <button type="submit">
        Get Results
        </button>
        </form>

        </Card.Body>
        </Card>
        </div>
        {/*<div><pre>{JSON.stringify(surveyOneFields, null, 2)}</pre></div>*/}
        {/*<div><pre>{JSON.stringify(authErrors, null, 2)}</pre></div>*/}
        </div>
        );
    }

    function renderStep() {
        if (step === "authenticate") {
        return authenticate();
    } else if (step === "confirmation") {
        return confirmation();
    } else if (step === "survey") {
        return survey();
    }
    }

    return (
    renderStep()
    );
    }

    export default Recommendation;
