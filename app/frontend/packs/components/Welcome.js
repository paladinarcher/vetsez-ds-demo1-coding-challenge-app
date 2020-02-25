import React from 'react'
import axios from '../utils/axios'
import {gonRoute} from '../utils/gon_helper';

class Welcome extends React.Component {
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
                        <h1 className="usa-heading">Welcome!</h1>
                    </div>
                </div>
                <div className="usa-grid">
                    <div className="usa-width-whole">
                        <p>some info - interesting?</p>
                    </div>
                </div>
                <div className="usa-grid">
                    <div className="usa-width-whole">
                        <a href={gonRoute('rec_engine_path')} className='usa-button-primary'>Recommendation Engine</a>&nbsp;|&nbsp;
                    </div>
                </div>
            </div>
        );
    }
}

export default Welcome
