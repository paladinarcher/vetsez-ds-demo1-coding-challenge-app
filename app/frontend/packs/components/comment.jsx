import React from 'react';
import GH from '../utils/gon_helper';
import axios from '../utils/axios'

class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: '',
            comments: []
        };
        // this.handleChangeField = this.handleChangeField.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
        // this.resetComments = this.resetComments.bind(this);
    }

    handleChangeField = (key, event) => {
        this.setState({
            [key]: event.target.value,
        });
    };

    handleSubmit = () => {
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


    resetComments = () => {
        let that = this;
        axios.get(GH.getRoute("list_comments_path"))
            .then(function (response) {
                that.setState({comment: '', comments: response.data})
            });
    }

    componentDidMount() {
        this.resetComments();
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
            </div>
        )
    }
}

export default Comment
