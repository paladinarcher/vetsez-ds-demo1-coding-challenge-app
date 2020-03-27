import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import RecEngine from "./components/rec_engine";
import {MockPageOne, MockPageTwo, MockPageThree, MockPageFour} from "./components/core-ui/mock-pages/index"
import {gonRoute} from "./utils/gon_helper";

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        <Router>
            <Switch>
                <Route exact path={gonRoute('mock1_path')} component={MockPageOne}/>
                <Route exact path={gonRoute('mock2_path')} component={MockPageTwo}/>
                <Route exact path={gonRoute('mock3_path')} component={MockPageThree}/>
                <Route exact path={gonRoute('mock4_path')} component={MockPageFour}/>
                <Route exact path={gonRoute('rec_engine_path')} component={RecEngine}/>
            </Switch>
        </Router>
        ,
        document.getElementById('app'),
    );
});
