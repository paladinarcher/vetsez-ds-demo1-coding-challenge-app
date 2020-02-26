import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import RecEngine from "./components/rec_engine";
import Account from "./components/account";
import AwaitingApproval from "./components/awaiting_approval";
import {gonRoute} from "./utils/gon_helper";

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        <Router>
            <Switch>
                <Route exact path={gonRoute('rec_engine_path')} component={RecEngine}/>
                <Route exact path={gonRoute('account_path')} component={Account}/>
                <Route exact path={gonRoute('awaiting_approval_path')} component={AwaitingApproval}/>
            </Switch>
        </Router>
        ,
        document.getElementById('app'),
    );
});
