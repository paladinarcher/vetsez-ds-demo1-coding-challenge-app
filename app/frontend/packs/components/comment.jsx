import React from 'react';
import GH from '../utils/gon_helper';
import axios from '../utils/axios'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: '',
            military: false,
            comments: []
        };
        this.handleChangeField = this.handleChangeField.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.resetComments = this.resetComments.bind(this);
    }

    handleChangeField(key, event) {
        this.setState({
            [key]: event.target.value,
        });
    }

    handleSubmit() {
        const {comment} = this.state;
        let that = this;
        axios.post(GH.getRoute("add_comment_path"), {comment: comment})
            .then(function (response) {
                if (response.data.success) {
                    that.resetComments();
                } else {
                    console.log("error saving comment");
                }
            })
    }

    email_change = (event) => {
        const military_val = event.target.value;
        const patt = new RegExp('^\\S+@\\S*\\.mil$');
        const isValidMil = patt.test(military_val);
        this.setState({...this.state, military: isValidMil});
    };

    post_form = (event) => {
        event.preventDefault();
        // extra validation
        let ta = event.currentTarget.elements['ta'];
        const patt = new RegExp('^The\\s.*$');
        const startsWithThe = patt.test(ta.value);

        if (!startsWithThe) {
            alert("Needs to start with The");
        } else {
            event.currentTarget.submit();
        }
    };

    military_input = () => {
        return (
            <Form.Group as={Col} controlId="mil">
                <Form.Label>Branch</Form.Label>
                <Form.Control type="text" placeholder="Enter the branch" name="branch" readOnly={!this.state.military} required={this.state.military}/>
            </Form.Group>
        )
    }

    render() {
        const {comment, comments} = this.state;
        const listItems = comments.map((c) =>
            <li key={c.id}>{c.comment}</li>
        );
        return (
            <div style={{padding: '15px'}}>
                <div>
                    <label id='lblComment'>Add a Comment</label><br/>
                    <input
                        onChange={(ev) => this.handleChangeField('comment', ev)}
                        value={comment}
                        placeholder="Enter a new comment"
                    />
                    <button onClick={this.handleSubmit}>Submit</button>
                </div>
                <div>
                    <h1>Last 5 Comments</h1>
                    <ul>
                        {listItems}
                    </ul>
                </div>
                <br/>
                <Card style={{width: '80%'}}>
                    <Card.Body>
                        <Card.Title>Card Form</Card.Title>
                        <Card.Text>
                            Please select the facility...
                        </Card.Text>
                        <Form onSubmit={this.post_form} action={gon.routes.uncontrolled_form_path} method="post">
                            <input type="hidden" name="authenticity_token" value={document.querySelector('[name="csrf-token"]').content}/>
                            <Form.Row>
                                <Form.Group as={Col} controlId="fname">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter First Name" name="fname"/>
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} controlId="lname">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter Last Name" name="lname"/>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId="email">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email" placeholder="name@example.com" name="email" required onChange={this.email_change}/>
                                    <Form.Text className="text-muted">
                                        We'll never share your email with anyone else.
                                    </Form.Text>
                                </Form.Group>
                                {this.military_input()}
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId="appt.date">
                                    <Form.Label>Appointment Date</Form.Label>
                                    <Form.Control type="date" placeholder="Select the Appt Date" name="apptDate" required/>
                                </Form.Group>
                                <Form.Group as={Col} controlId="exampleForm.ControlSelect1">
                                    <Form.Label>Example select</Form.Label>
                                    <Form.Control as="select" name='selection' required>
                                        <option value=''>Choose...</option>
                                        <option value='one'>1</option>
                                        <option value='two'>2</option>
                                        <option value='three'>3</option>
                                        <option value='four'>4</option>
                                        <option value='five'>5</option>
                                    </Form.Control>
                                </Form.Group>
                            </Form.Row>

                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Example textarea</Form.Label>
                                <Form.Control as="textarea" rows="3" name="ta" required/>
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        )
    }

    resetComments() {
        let that = this;
        axios.get(GH.getRoute("list_comments_path"))
            .then(function (response) {
                that.setState({comment: '', comments: response.data})
            });

    }

    componentDidMount() {
        this.resetComments();
    }
}

export default Comment
