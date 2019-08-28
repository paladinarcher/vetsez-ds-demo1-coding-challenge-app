import React from 'react';
import GH from '../utils/gon_helper';
import axios from '../utils/axios'
import Form from 'react-bootstrap/Form'
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

    handleSubmit(){
        const { comment } = this.state;
        let that = this;
        axios.post(GH.getRoute("add_comment_path"), { comment: comment})
            .then(function(response) {
                if (response.data.success) {
                    that.resetComments();
                } else {
                    console.log("error saving comment");
                }
            })
    }

    email_change = (event) => {
        console.log("email change", event.target.value);
        const military_val = event.target.value;
        const patt = new RegExp('^\\S+@\\S*\\.mil$');
        const isValidMil = patt.test(military_val);
        this.setState({...this.state, military: isValidMil});
        console.log("match is ", isValidMil);
        // this.setState({...this.state, military: military_val});
        // console.log("email change called", event.currentTarget.elements);

        };

    greg = (event) => {
        event.preventDefault();
        console.log("greg called", event.currentTarget.elements);
        console.log("email value is ", event.currentTarget.elements['email-kma'].value);
        console.log("first name is ", event.currentTarget.elements['fname'].value);
        const token = document.querySelector('[name="csrf-token"]').content;
        alert("token izzzz "+ JSON.stringify(token));
        event.currentTarget.submit();
    };

    military_input = () => {
        console.log("military is ", this.state.military);
        return (
            <Form.Group controlId="exampleForm.ControlInput3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" placeholder="Enter Last Name" name="lname" readOnly={this.state.military} default={'hello'}/>
            </Form.Group>
        )
    }

    render() {
        const { comment, comments} = this.state;
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
                <Card style={{ width: '80%' }}>
                    <Card.Body>
                        <Card.Title>Card Form</Card.Title>
                        <Card.Text>
                            Please select the facility...
                        </Card.Text>
                        <Form onSubmit={this.greg} action={gon.routes.greg_path} method="post">
                            <input type="hidden" name="authenticity_token" value={document.querySelector('[name="csrf-token"]').content}/>
                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="name@example.com" name="email-kma" required onChange={this.email_change} />
                                <Form.Text className="text-muted">
                                    We'll never share your email with anyone else.
                                </Form.Text>
                            </Form.Group>
                            {this.military_input()}
                            <Form.Group controlId="exampleForm.ControlInput2">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control type="date" placeholder="Enter First Name" name="fname"/>
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
            .then(function(response) {
                that.setState({comment: '', comments: response.data})
            });

    }
    componentDidMount() {
        this.resetComments();
    }
}

export default Comment
