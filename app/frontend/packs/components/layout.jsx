import React from 'react'
import GH from "../utils/gon_helper";

const Header = () => {
    return (
        <div className="header-container">
            <header>
                <div className="logo" aria-label="VA Logo">
                    <img style={{verticalAlign: 'middle'}} src={GH.getImagePath('va-logo-white.png')} alt="VA Header Image"/>
                </div>
                <div style={{float: 'right', display: 'inline'}}>{gon.user}</div>
                <br/>
                <hr/>
            </header>
        </div>
    )
};

const Main = (props) => {
    return (
        <div style={{minHeight: '500px', width: '85%', margin: '0 auto', paddingTop: '10px'}}>
            {props.children}
        </div>
    )
};

const Footer = () => {
    return (
        <div className="footer-container">
            <footer>
                <div className="logo" aria-label="VA Logo">
                    <img src={GH.getImagePath('va-logo-white.png')} alt="VA Footer Image"/>
                </div>
                <nav role="navigation" aria-label="External Links Navigation">
                    <ul>
                        <li><a href="https://www.va.gov/homeless/" target="_blank" title="Homeless Veterans">Homeless Veterans</a></li>
                        <li><a href="https://www.va.gov/womenvet/" target="_blank" title="Woman Veterans">Woman Veterans</a></li>
                        <li><a href="https://www.va.gov/centerforminorityveterans/" target="_blank" title="Minority Veterans">Minority Veterans</a></li>
                        <li><a href="https://www.ptsd.va.gov" target="_blank" title="PTSD">PTSD</a></li>
                        <li><a href="https://www.mentalhealth.va.gov" target="_blank" title="Mental Health">Mental Health</a></li>
                        <li><a href="https://www.va.gov/adaptivesports/" target="_blank" title="Adaptive sports and special events">Adaptive sports and special events</a></li>
                        <li><a href="https://www.nrd.gov" target="_blank" title="National Resource Directory">National Resource Directory</a></li>
                        <li><a href="https://www.va.gov/vaforms/" target="_blank" title="Find a VA Form">Find a VA Form</a></li>
                        <li><a href="https://www.mobile.va.gov/appstore/" target="_blank" title="Get VA Mobile Apps">Get VA Mobile Apps</a></li>
                        <li><a href="https://www.va.gov/jobs/" target="_blank" title="Careers at VA">Careers at VA</a></li>
                        <li><a href="https://www.va.gov/landing2_business.htm" target="_blank" title="Doing business with VA">Doing business with VA</a></li>
                    </ul>
                </nav>
            </footer>
        </div>
    )
};

export {Header, Main, Footer}
