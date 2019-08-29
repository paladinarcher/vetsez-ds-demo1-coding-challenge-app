import React from 'react';
import GH from '../utils/gon_helper';
import axios from '../utils/axios'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

class UForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            military: false,
            options: [],
            validated: false,
        };
    }

    email_change = (event) => {
        const military_val = event.target.value;
        const patt = new RegExp('^\\S+@\\S*\\.mil$');
        const isValidMil = patt.test(military_val);
        this.setState({...this.state, military: isValidMil});
    };

    post_form = () => {
        let self = this;
        const f = document.querySelector('[id="myForm"]');
        const isValid = f.checkValidity();

        // extra validation
        if (isValid) {
            let comment = f.elements['comment'];
            const patt = new RegExp('^The\\s.*$');
            const startsWithThe = patt.test(comment.value);

            if (!startsWithThe) {
                alert("Needs to start with The");
                this.setState({...this.state, validated: true});
            } else {
                let data = {};
                for (const element of f.elements) {
                    if (element.type !== 'button' && element.name !== undefined) {
                        data[element.name] = element.value;
                    }
                }

                axios.post(gon.routes.post_form_path, data)
                    .then(function (response) {
                        alert(response.data.message);
                        f.reset();
                        self.setState({...self.state, validated: false});
                    })
                    .catch(function (error) {
                        console.log(error);
                        alert("Error Saving Concepts. Exception is: " + error);
                    });
            }

        } else {
            this.setState({...this.state, validated: true});
        }
    };

    military_input = () => {
        return (
            <Form.Group as={Col} controlId="mil">
                <Form.Label>Branch</Form.Label>
                <Form.Control type="text" placeholder="Enter the branch" name="branch" readOnly={!this.state.military} required={this.state.military}/>
                <Form.Control.Feedback type="invalid">
                    Branch is required for .mil email addresses.
                </Form.Control.Feedback>
            </Form.Group>
        )
    };

    render() {
        //remove form input if axios
        return (
            <div style={{padding: '15px'}}>
                <Card style={{width: '80%'}}>
                    <Card.Body>
                        <Card.Title>Uncontrolled Card Form</Card.Title>
                        {/*<Card.Text>*/}
                        {/*    Please select the facility...*/}
                        {/*</Card.Text>*/}
                        <Form id="myForm" noValidate validated={this.state.validated}>
                            {/*<input type="hidden" name="authenticity_token" value={document.querySelector('[name="csrf-token"]').content}/>*/}
                            <Form.Row>
                                <Form.Group as={Col} controlId="first_name">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter First Name" name="first_name" required/>
                                    <Form.Control.Feedback type="invalid">
                                        First Name is required.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} controlId="last_name">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter Last Name" name="last_name" required/>
                                    <Form.Control.Feedback type="invalid">
                                        Last Name is required.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId="email">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email" placeholder="name@example.com" name="email" required onChange={this.email_change}/>
                                    <Form.Text className="text-muted">
                                        We'll never share your email with anyone else.
                                    </Form.Text>
                                    <Form.Control.Feedback type="invalid">
                                        Invalid email address.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                {this.military_input()}
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId="appointment_date">
                                    <Form.Label>Appointment Date</Form.Label>
                                    <Form.Control type="date" placeholder="Select the Appt Date" name="appointment_date" required/>
                                    <Form.Control.Feedback type="invalid">
                                        Appoinment date is missing or is invalid.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} controlId="selection">
                                    <Form.Label>Selection</Form.Label>
                                    <Form.Control as="select" name='selection' required>
                                        {this.state.options}
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        Selection is required.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>

                            <Form.Group controlId="comment">
                                <Form.Label>Comment</Form.Label>
                                <Form.Control as="textarea" rows="3" name="comment" required/>
                                <Form.Control.Feedback type="invalid">
                                    Must start with 'The'.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Button variant="primary" onClick={this.post_form}>
                                Submit
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        )
    }

    loadSelection = (data) => {
        let ret = [<option key={0} value=''>Choose...</option>];
        for (const item of data) {
            ret.push(<option key={item.id} value={item.id}>{item.label}</option>);
        }
        return ret;
    };

    componentDidMount() {
        // retrieve the drop down items
        const self = this;
        axios.get(gon.routes.get_selections_path)
            .then(function (response) {
                self.setState({...self.state, options: self.loadSelection(response.data)});
            })
            .catch(function (error) {
                console.log("error", error);
                alert("there was an error loading the selection listing! " + error.message() );
            });
    }
}

export default UForm
