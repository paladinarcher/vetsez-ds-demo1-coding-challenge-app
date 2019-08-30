import React from 'react'
import ReactDOM from 'react-dom'
import axios from './utils/axios'
import GH from './utils/gon_helper';
import Comment from "./components/comment";
import SchedAppt from "./components/sched_appt";
// import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

// fix for IE11 allowing us to use axios/fetch for ajax calls
import {promise, polyfill} from 'es6-promise';

polyfill();

export default class Application extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            card: 'welcome'
        };
    }

    testAxios() {
        axios.get(GH.getRoute('fetch_time_path'))
            .then(function (response) {
                console.log("this is an axios response with", response.data.time);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    swapCard = (event) => {
        this.setState({card: event.target.name});
    };

    render() {
        const cards = {
            'welcome': <div>Welcome!</div>,
            'schedAppt': <SchedAppt/>,
        };
        return (
            <div>
                <img src={GH.getImagePath('media/images/va-header-70.png')} alt="VA Header Image" name='welcome' onClick={this.swapCard}/>
                <button onClick={this.swapCard} name='schedAppt'>Schedule Appointment</button>
                <div style={{float: 'right'}}>user: {this.props.username}</div>
                <h1>Hi {this.props.username}, Welcome!</h1>
                <h3>Please use the selectors below to find a facility near you</h3>
                <h3>and select your preferred appointment type regarding your visit</h3>
                {/*<button onClick={this.swapCard} name='uform'>Uncontrolled Form</button>*/}
                <br/>
                {cards[this.state.card]}
            </div>
        );
    }
}

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<Application username="John Smith"/>, document.getElementById('app'));
});
