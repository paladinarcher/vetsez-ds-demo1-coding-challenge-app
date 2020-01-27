import React from 'react';
import ReactDOM from 'react-dom';
import axios from '../utils/axios'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

class SchedAppt extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appt_times: [],
            facilities: [],
            appointment_types: [],
            doctors: this.loadDoctorSelections([]),
            validated: false,
            tableData: [],
            formdata: {}
        };
    }

    handleInputChange = (event) => {
        let s = this.state;
        s.formdata[event.target.id] = event.target.value;
        this.setState(s);
    };

    is_valid_appt_date = () => {
        if (this.state.formdata['appt_date'] !== undefined) {
            console.log(this.state.formdata['appt_date']);
            let now = new Date();
            now.setHours(0, 0, 0, 0);
            now = Date.UTC(now.getFullYear(), now.getMonth() + 1, now.getDate());
            let a = this.state.formdata['appt_date'].split("-");
            let appt_date = Date.UTC(a[0], a[1], a[2]);
            return (now <= appt_date);
        }
    };

    loadTimes = (start_hr, end_hr) => {
        if (start_hr >= end_hr) {
            alert("Invalid load times arguments passed. The start_hr must be greater than the end_hr.")
        }

        let hour = start_hr;
        let t = '';
        let ret = [<option key={0} value=''>Select an Appointment Time...</option>];

        do {
            if (hour < 10) {
                t = '0' + hour;
            } else {
                t = hour;
            }
            ret.push(<option key={t + ':00'} value={t + ':00'}>{t + ':00'}</option>);
            ret.push(<option key={t + ':30'} value={t + ':30'}>{t + ':30'}</option>);
            hour++;
            start_hr++;
        }
        while (start_hr <= end_hr);
        this.setState({...this.state, appt_times: ret});
    };

    checkLoadDoctorsOnchange = (event) => {
        const f = event.target.id === 'facility_id' ? event.target.value : this.state.formdata.facility_id;
        const a = event.target.id === 'appointment_type_id' ? event.target.value : this.state.formdata.appointment_type_id;

        if (f && f.length > 0 && a && a.length > 0) {
            this.loadDoctors(f, a);
        } else {
            this.loadDoctors('not', 'yet');
        }
    };

    post_form = () => {
        let self = this;
        const f = document.querySelector('[id="myForm"]');
        const isValid = f.checkValidity();

        // extra validation
        if (isValid) {
            if (! self.is_valid_appt_date()) {
                alert("Please enter a date that is greater than or equal to today's date.");
                var s = self.state;
                s.formdata.appt_date = '';
                ReactDOM.findDOMNode(self.appt_date).focus();
                self.setState(s);
                return false;
            }

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
            <div style={{padding: '3px'}} onChange={this.handleInputChange}>
                <Card>
                    <Card.Body>
                        <Card.Title>Schedule Appointment</Card.Title>
                        <Form id="myForm" noValidate validated={this.state.validated}>
                            <Form.Row>
                                <Form.Group as={Col} controlId="facility_id">
                                    <Form.Label id="FacilityLabel">Select Facility</Form.Label>
                                    <Form.Control as="select" name='selection' required onChange={this.checkLoadDoctorsOnchange}>
                                        {this.state.facilities}
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        Medical Facility is required.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId="appointment_type_id">
                                    <Form.Label id="AppointmentLabel">Appointment Type</Form.Label>
                                    <Form.Control as="select" name='selection' required onChange={this.checkLoadDoctorsOnchange}>
                                        {this.state.appointment_types}
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        Appointment Type is required.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId="doctor">
                                    <Form.Label id="DoctorLabel">Doctor</Form.Label>
                                    <Form.Control as="select" name='selection' required>
                                        {this.state.doctors}
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        Select a doctor.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId="reason">
                                    <Form.Label id="ReasonLabel">Reason for Appointment</Form.Label>
                                    <Form.Control as="textarea" rows="3" maxLength="800" name='reason' required />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter the reason for the appointment.
                                    </Form.Control.Feedback>
                               </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId="appt_date">
                                    <Form.Label id="ApptDateLabel">Preferred Appointment Date</Form.Label>
                                    <Form.Control ref={(c)=>this.appt_date=c} type="date" placeholder="Appointment Date" name='appt_date' required value={this.state.formdata.appt_date}/>
                                    <Form.Control.Feedback type="invalid">
                                        Please enter the preferred appointment date.
                                    </Form.Control.Feedback>
                               </Form.Group>
                                <Form.Group as={Col} controlId="appt_time">
                                    <Form.Label id="ApptTimeLabel">Appointment Time</Form.Label>
                                    <Form.Control as="select" name='selection' required>
                                        {this.state.appt_times}
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        Please enter the appointment time.
                                    </Form.Control.Feedback>
                               </Form.Group>
                            </Form.Row>
                            <Button variant="primary" onClick={this.post_form}>
                                Find Appointment
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
                <br/>
                {/*<p>{JSON.stringify(this.state.formdata)}</p>*/}
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

    loadDoctorSelections = (data) => {
        let ret = [<option key={0} value=''>Choose a Doctor...</option>];
        for (const item of data) {
            ret.push(<option key={item.id} value={item.id}>{item.name}</option>);
        }
        return ret;
    };

    loadDoctors = (facility, apptType) => {
        const data = {facility_id: facility, appointment_type_id: apptType};
        const self = this;

        axios.get(gon.routes.get_doctors_path, {params: data})
            .then(function (response) {
                console.log("response.data", response.data);
                self.setState({...self.state, doctors: self.loadDoctorSelections(response.data)});
            })
            .catch(function (error) {
                console.log(error);
                alert("Error Saving Concepts. Exception is: " + error);
            });
    };

    componentDidMount() {
        this.loadTimes(8,18);
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
