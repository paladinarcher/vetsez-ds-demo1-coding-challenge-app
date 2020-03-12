import React from 'react';
import axios from '../utils/axios'
import {gonRoute} from '../utils/gon_helper';

class Account extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.testAxios();
    }

    testAxios() {
        axios.post(gonRoute('fetch_time_path'))
            .then(function (response) {
                console.log("this is an axios response with", response.data.current_time);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    render() {
        return (
            <div>
                <div className="usa-grid">
                    <div className="usa-width-whole">
                        <h1 className="usa-heading">Account Details</h1>
                    </div>
                </div>
                <div className="usa-grid">
                    <div className="usa-width-whole">
                        <p>some info - interesting?</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Account
