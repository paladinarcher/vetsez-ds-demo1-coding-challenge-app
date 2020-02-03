import React from 'react'
import ReactDOM from 'react-dom'
import axios from './utils/axios'
import GH from './utils/gon_helper';
import {Header, Header2, Main, Footer} from "./components/layout";
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox'
//import "@department-of-veterans-affairs/formation/dist/formation.min.css"; //cris
//import "@department-of-veterans-affairs/formation/dist/formation.min.css"; //cris
//import '@department-of-veterans-affairs/formation/sass/core.scss'
//;import "@department-of-veterans-affairs/formation/sass/site/m-vet-nav"; //cris

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
            <div style={{padding: '20px'}}>
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
