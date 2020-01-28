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
    question1: yup
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
    const [fields, setFields] = useState({
        email: "",
        first_name: "",
        last_name: "",
    });
    const [step, setStep] = useState(1);

    const [errors, setErrors] = useState({
        email: null,
        first_name: null,
        last_name: null
    });

    const formIsValid =
        fields.email !== "" &&
        fields.first_name !== "" &&
        fields.last_name !== "" &&
        !errors.email &&
        !errors.first_name &&
        !errors.last_name;

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
                            <Card.Title>Register User</Card.Title>
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
    function step2() {
        return (
            <div className="Recommendation" >
                <div style={{padding: '3px'}}>
                    <Card>
                        <Card.Body>
                            <Card.Title>User Survey</Card.Title>
                            <p>User: {fields.first_name}</p>
                            <p>Email: {fields.email}</p>
                            <form>
                                <label htmlFor="question1">Question 1: What is your name?</label>
                                <input
                                    className={errors["question1"] ? "invalid" : ""}
                                    type="string"
                                    name="question1"
                                    value={fields.question1}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    autoFocus
                                />
                                <Errors errors={errors["question1"]} />
                                <button type="submit" onClick={handleSubmit} disabled={!formIsValid}>
                                    Submit Survey
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
        } else {
            return step2();
        }
    }

    return (
        renderStep()
    );
}

export default Recommendation;
