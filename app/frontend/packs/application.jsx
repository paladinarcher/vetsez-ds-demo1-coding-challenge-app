// fix for IE11 allowing us to use axios/fetch for ajax calls
import { promise, polyfill } from 'es6-promise'; polyfill();

import React from 'react'
import ReactDOM from 'react-dom'
import axios from './utils/axios'
import GH from './utils/gon_helper';
import Comment from "./components/comment";

const Application = props => {
    testAxios();
    return (
        <div>
            <img src={GH.getImagePath('media/images/va-header-70.png')} alt="VA Header Image" />
            <br/>
            <Comment/>
        </div>
    )
}

function testAxios() {
    axios.get(GH.getRoute('fetch_time_path'))
        .then(function (response) {
            console.log("this is an axios response with",response.data.time);
        })
        .catch(function (error) {
            console.log(error);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<Application />, document.getElementById('app'));
});
