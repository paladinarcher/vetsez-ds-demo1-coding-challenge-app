import React from 'react'
import GH from "../utils/gon_helper";

const Header = () => {
    return (
        <div className="header-container">
            <header>
                <div className="logo" aria-label="VA Logo">
                    <a href="https://www.va.gov" title="Go to VA.gov">
                        <img style={{verticalAlign: 'middle'}} src={GH.getImagePath('va-logo-white.png')} alt="VA Header Image"/>
                        <img src={GH.getImagePath('desktop-hd-line-2.png')} alt="line1"/>
                    </a>
                </div>
                <div style={{float: 'right', display: 'inline'}}>{gon.user}</div>

                <br/>

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
                    <a href="https://www.va.gov" title="Go to VA.gov">
                        <img src={GH.getImagePath('va-logo-white.png')} alt="VA Footer Image"/>
                        <img src={GH.getImagePath('desktop-hd-line-2.png')} alt="line2"/>
                    </a>
                </div>
                <nav role="navigation" aria-label="External Links Navigation">
                    <ul>
                        <li><a href="https://www.section508.va.gov" title="Accessibility">Accessibility</a></li>
                        <li><a href="https://www.va.gov/orm/NOFEAR_Select.asp" title="No FEAR Act Data">No FEAR Act Data</a></li>
                        <li><a href="https://www.va.gov/oig/" title="Office of Inspector General">Office of Inspector General</a></li>
                        <li><a href="https://www.va.gov/opa/Plain_Language.asp" title="Plain Language">Plain Language</a></li>
                        <li><a href="https://www.va.gov/privacy-policy/" title="Privacy, Policies &amp; Legal information">Privacy, Policies &amp; Legal information</a></li>
                        <li><a href="https://www.va.gov/privacy/" title="VA Privacy Service">VA Privacy Service</a></li>
                        <li><a href="https://www.va.gov/foia/" title="Freedom of Information Act (FOIA)">Freedom of Information Act (FOIA)</a></li>
                        <li><a href="https://www.usa.gov/" title="USA.gov">USA.gov</a></li>
                        <li><a href="https://www.va.gov/scorecard/" title="VA.gov scorecard">VA.gov scorecard</a></li>
                        <li><a href="https://www.va.gov/veterans-portrait-project/" title="Veterans Portrait Project">Veterans Portrait Project</a></li>
                    </ul>
                </nav>
            </footer>
        </div>
    )
};

export {Header, Main, Footer}
