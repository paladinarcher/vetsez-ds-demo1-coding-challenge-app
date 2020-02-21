import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import Signup from "./components/Signup";
import RecEngine from "./components/rec_engine";

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        <Router>
            <Switch>
                <Route exact path={gon.routes.welcome_path} component={Welcome}/>
                <Route exact path={gon.routes.login_path} component={Login}/>
                <Route exact path={gon.routes.signup_path} component={Signup}/>
                <Route exact path={gon.routes.rec_engine_path} component={RecEngine}/>
            </Switch>
        </Router>
        ,
        document.getElementById('app'),
    );
});
