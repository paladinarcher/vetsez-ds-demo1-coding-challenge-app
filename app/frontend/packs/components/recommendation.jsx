import React, { useState } from "react";
import * as yup from "yup";
import axios from '../utils/axios'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

const schema = yup.object().shape({
    email: yup
        .string()
        .email()
        .required(),
    first_name: yup
        .string()
        .min(3)
        .required(),
    last_name: yup
        .string()
        .min(3)
        .required(),
    password: yup
        .string()
        .required(),
    confirm_password: yup
        .string()
        .required()
});

function Errors({ errors }) {
    if (!errors) return null;

    return (
        <ul className="errors">
            {errors.map((error, i) => (
                <li key={i}>{error}</li>
            ))}
        </ul>
    );
}

function Recommendation() {
    const [step, setStep] = useState(1);
    const [fields, setFields] = useState({
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        confirm_password: "",
    });

    const [errors, setErrors] = useState({
        email: null,
        first_name: null,
        last_name: null,
        password: "",
        confirm_password: ""
    });

    const formIsValid =
        fields.email !== "" &&
        fields.first_name !== "" &&
        fields.last_name !== "" &&
        fields.password !== "" &&
        fields.confirm_password !== "" &&
        !errors.email &&
        !errors.first_name &&
        !errors.last_name &&
        !errors.password &&
        !errors.confirm_password
    ;

    function handleInputChange(event) {
        const {target} = event;
        const {name} = target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        validateField(name, value);
        setFields({...fields, [name]: value});
    }

    function handleBlur(event) {
        const {target} = event;
        const {name, value} = target;
        validateField(name, value);
    }

    function validateField(name, value) {
        yup
            .reach(schema, name)
            .validate(value)
            .then(valid => {
                setErrors({...errors, [name]: null});
            })
            .catch(e => {
                setErrors({...errors, [name]: e.errors});
            });
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (formIsValid) {
            console.table(fields);
            let s = step;
            console.log("current step is ", s);
            if (s+1 <= 2) {
                setStep(s + 1);
            }
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

    function step1() {
        return (
            <div className="Recommendation" >
                <div style={{padding: '3px'}}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Welcome</Card.Title>
                            <form>
                                <label htmlFor="first_name">First Name</label>
                                <input
                                    className={errors["first_name"] ? "invalid" : ""}
                                    type="string"
                                    name="first_name"
                                    value={fields.first_name}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    autoFocus
                                />
                                <Errors errors={errors["first_name"]} />
                                <label htmlFor="last_name">Last Name</label>
                                <input
                                    className={errors["last_name"] ? "invalid" : ""}
                                    type="string"
                                    name="last_name"
                                    value={fields.last_name}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                />
                                <Errors errors={errors["last_name"]} />
                                <label htmlFor="email">Email</label>
                                <input
                                    className={errors["email"] ? "invalid" : ""}
                                    type="email"
                                    name="email"
                                    value={fields.email}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                />
                                <Errors errors={errors["email"]} /><br/>
                                <label htmlFor="email">Password</label>
                                <input
                                    className={errors["password"] ? "invalid" : ""}
                                    type="password"
                                    name="password"
                                    value={fields.password}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                />
                                <Errors errors={errors["password"]} /><br/>
                                <label htmlFor="email">Re-enter Password</label>
                                <input
                                    className={errors["confirm_password"] ? "invalid" : ""}
                                    type="password"
                                    name="confirm_password"
                                    value={fields.confirm_password}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                />
                                <Errors errors={errors["confirm_password"]} /><br/>
                                <button type="submit" onClick={handleSubmit} disabled={!formIsValid}>
                                    Register User
                                </button>
                            </form>

                        </Card.Body>
                    </Card>
                </div>
                {/*<div><pre>{JSON.stringify(fields, null, 2)}</pre></div>*/}
                {/*<div><pre>{JSON.stringify(errors, null, 2)}</pre></div>*/}
            </div>
        );
    }

    function handleNext() {
        console.log("s is ", s);
        let s = step;
        setStep(s + 1);
    }

    function step2() {
        return (
            <div className="Recommendation" >
                <div style={{padding: '3px'}}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Success Message</Card.Title>
                            <h3>Let's go Next!</h3>
                            <button onClick={handleNext}>Next</button>

                        </Card.Body>
                    </Card>
                </div>
            </div>
        )

    }
    function step3() {
        return (
            <div className="Recommendation" >
                <div style={{padding: '3px'}}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Survey</Card.Title>
                            <h3>What Services are you interested in?</h3>
                            <h5>(select all that apply)</h5>
                            <form>
                                <button type="submit">
                                    Get Results
                                </button>
                            </form>

                        </Card.Body>
                    </Card>
                </div>
                {/*<div><pre>{JSON.stringify(fields, null, 2)}</pre></div>*/}
                {/*<div><pre>{JSON.stringify(errors, null, 2)}</pre></div>*/}
            </div>
        );
    }

    function renderStep() {
        if (step === 1) {
            return step1();
        } else if (step === 2) {
            return step2();
        }
        else if (step ===3) {
            return step3();
        }
    }

    return (
        renderStep()
    );
}

export default Recommendation;
