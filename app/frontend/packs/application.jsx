import React, {useState} from 'react'
import ReactDOM from 'react-dom'
import axios from './utils/axios'
import GH from './utils/gon_helper';
import Comment from "./components/comment";
import UForm from "./components/uform";

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
            'comments': <Comment/>,
            'uform': <UForm/>
        };
        this.testAxios();
        return (
            <div>
                <img src={GH.getImagePath('media/images/va-header-70.png')} alt="VA Header Image" name='welcome' onClick={this.swapCard}/>
                <button onClick={this.swapCard} name='comments'>Comments</button>
                <button onClick={this.swapCard} name='uform'>Uncontrolled Form</button>
                <br/>
                {cards[this.state.card]}
            </div>
        );
    }
}

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<Application/>, document.getElementById('app'));
});
