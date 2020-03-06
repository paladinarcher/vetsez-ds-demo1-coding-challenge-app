import React from 'react'
import ReactDOM from 'react-dom'
import axios from './utils/axios'
import {gonRoute} from './utils/gon_helper';
import {Header, Header2, Main, Footer, Footer2} from "./components/layout";
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox'
import Recommendation from './components/recommendation'
import RecEngine from './components/rec_engine'
import FormInputs from './components/cheat_sheet/form_inputs'

// fix for IE11 allowing us to use axios/fetch for ajax calls
import {promise, polyfill} from 'es6-promise';

polyfill();

export default class Application extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            card: 'rec_engine'
        };
    }

    testAxios() {
        axios.get(gonRoute('fetch_time_path'))
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
            'recommendation': <Recommendation/>,
            'rec_engine': <RecEngine/>,
            'forminputs': <FormInputs/>,
            'welcome': <div>
                <button type="button" className="usa-button">Button</button>
                <div className="va-h-ruled--stars"></div>
                <div className="usa-width-one-whole">
                    <AlertBox
                        headline='Informational alert'
                        content="YAY!!!!!!!"
                        status="info"
                        isVisible/></div></div>
            ,
        };
        return (
            <div className="vads-u-font-family--sans" style={{padding: '20px'}}>
                <Header/>
                <Main>
                    {cards[this.state.card]}
                </Main>
                <Footer/>
            </div>
        );
    }
}

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<Application/>, document.getElementById('app'));
});
