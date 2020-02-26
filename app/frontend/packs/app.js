import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import RecEngine from "./components/rec_engine";
import Account from "./components/account";
import {gonRoute} from "./utils/gon_helper";

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        <Router>
            <Switch>
                <Route exact path={gonRoute('rec_engine_path')} component={RecEngine}/>
                <Route exact path={gonRoute('account_path')} component={Account}/>
            </Switch>
        </Router>
        ,
        document.getElementById('app'),
    );
});
