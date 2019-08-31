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
            facilities: [],
            appointment_types: [],
            validated: false,
            tableData: [],
        };
    }

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
                                    <Form.Label id="FacilityLabel">Select Facility</Form.Label>
                                    <Form.Control as="select" name='selection' required>
                                        {this.state.facilities}
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        Medical Facility is required.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                                <Form.Row>
                                <Form.Group as={Col} controlId="selectApptType">
                                    <Form.Label id="AppointmentLabel">Appointment Type</Form.Label>
                                    <Form.Control as="select" name='selection' required>
                                        {this.state.appointment_types}
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
        let ret = [<option key={0} value=''>Choose a Facility...</option>];
        for (const item of data) {
            ret.push(<option key={item.id} value={item.id}>{item.location}</option>);
        }
        return ret;
    };

    loadAppointmentTypes = (data) => {
        let ret = [<option key={0} value=''>Choose Appointment Type...</option>];
        for (const item of data) {
            ret.push(<option key={item.id} value={item.id}>{item.type_of_appointment}</option>);
        }
        return ret;
    };
/*

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
*/

    componentDidMount() {
        // retrieve the drop down items
        const self = this;
        axios.get(gon.routes.get_facilities_path)
            .then(function (response) {
                const facs = response.data;
                self.setState({...self.state, facilities: self.loadFacilities(facs)});
            })
            .catch(function (error) {
                if (!gon.testing) {
                    console.log("error", error);
                    alert("there was an error loading the selection listing! " + error.message() );
                }
            });

        axios.get(gon.routes.get_appointment_types_path)
            .then(function (response) {
                const appts = response.data;
                self.setState({...self.state, appointment_types: self.loadAppointmentTypes(appts)});
            })
            .catch(function (error) {
                if (!gon.testing) {
                    console.log("error", error);
                    alert("there was an error loading the selection listing! " + error.message() );
                }
            });
    }
}

export default SchedAppt
