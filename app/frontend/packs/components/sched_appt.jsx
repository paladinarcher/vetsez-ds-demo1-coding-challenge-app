import React from 'react';
import axios from '../utils/axios'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

class SchedAppt extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            military: false,
            facilities: [
                {id: 100, name: 'Atlanta'}
            ],
            validated: false,
            tableData: [],
        };
    }

    // email_change = (event) => {
    //     const military_val = event.target.value;
    //     const patt = new RegExp('^\\S+@\\S*\\.mil$');
    //     const isValidMil = patt.test(military_val);
    //     this.setState({...this.state, military: isValidMil});
    // };

    post_form = () => {
        let self = this;
        const f = document.querySelector('[id="myForm"]');
        const isValid = f.checkValidity();

        // extra validation
        if (isValid) {
            let data = {};
            for (const element of f.elements) {
                if (element.type !== 'button' && element.name !== undefined) {
                    data[element.name] = element.value;
                }
            }
            //
            // axios.post(gon.routes.post_form_path, data)
            //     .then(function (response) {
            //         alert(response.data.message);
            //         f.reset();
            //         self.setState({...self.state, validated: false});
            //     })
            //     .catch(function (error) {
            //         console.log(error);
            //         alert("Error Saving Concepts. Exception is: " + error);
            //     });
        } else {
            this.setState({...this.state, validated: true});
        }
    };

    render() {
        return (
            <div style={{padding: '15px'}}>
                <Card style={{width: '80%'}}>
                    <Card.Body>
                        <Card.Title>Schedule Appointment</Card.Title>
                        <Form id="myForm" noValidate validated={this.state.validated}>
                            <Form.Row>
                                <Form.Group as={Col} controlId="selectFacility">
                                    <Form.Label>Select Facility</Form.Label>
                                    <Form.Control as="select" name='selection' required>
                                        <option key="0" value="">Choose a Medical Facility...</option>
                                        <option key="100" value="100">Atlanta</option>
                                        <option key="101" value="101">New York</option>
                                        <option key="102" value="102">Phoenix</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        Medical Facility is required.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} controlId="selectApptType">
                                    <Form.Label>Appointment Type</Form.Label>
                                    <Form.Control as="select" name='selection' required>
                                        <option key="0" value="">Choose an Appt Type...</option>
                                        <option key="100" value="100">one</option>
                                        <option key="101" value="101">two</option>
                                        <option key="102" value="102">three</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        Appointment Type is required.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Button variant="primary" onClick={this.post_form}>
                                Submit
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
                <br/>
            </div>
        )
    }

    loadFacilities = (data) => {
        const facilities = [];
        facilities.push({id: 100, name: 'Atlanta'});
        facilities.push({id: 100, name: 'Atlanta'});
        facilities.push({id: 101, name: 'New York'});
        facilities.push({id: 102, name: 'Phoenix'});

        let ret = [<option key={0} value=''>Choose a Medical Facility...</option>];
        for (const item of facilities) {
            ret.push(<option key={item.id} value={item.id}>{item.name}</option>);
        }

        // this.setState({...self.state, facilities: facilities});
    };

    componentDidMount() {
        this.loadFacilities();
    }

    // componentDidMount() {
    //     // retrieve the drop down items
    //     const self = this;
    //     axios.get(gon.routes.get_facilities_path)
    //         .then(function (response) {
    //             self.setState({...self.state, facilities: self.loadSelection(response.data)});
    //         })
    //         .catch(function (error) {
    //             console.log("error", error);
    //             alert("there was an error loading the selection listing! " + error.message() );
    //         });
    // }
}

export default SchedAppt
