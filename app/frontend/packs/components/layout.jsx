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
                        <li><a href="http://www.va.gov/about_va/" target="_blank" title="Information about the Department of Veterans Affairs">About VA</a></li>
                        <li><a href="http://vaww.section508.va.gov/" target="_blank" title="Section 508 Accessibility">Accessibility</a></li>
                        <li><a href="http://vista.med.va.gov/disclaimer.htm" target="_blank" title="Web Disclaimer">Disclaimer</a></li>
                        <li><a href="http://vaww.va.gov/landing_employee.htm" target="_blank" title="Resources for VA employees">Employee Resources</a></li>
                        <li><a href="http://vaww.va.gov/directory/" target="_blank" title="Find a Veterans Affairs facility">Find a Facility</a></li>
                        <li><a href="https://www.va.gov/privacy/" target="_blank" title="Privacy policy for the VA Intranet">Intranet Privacy Policy</a></li>
                        <li><a href="http://vaww.nca.va.gov/" target="_blank" title="Intranet site for National Cemetery Administration">NCA Intranet Home</a></li>
                        <li><a href="https://vaww.va.gov/OHRM/EmployeeRelations/grievance_appeals/" target="_blank" title="No Fear Act information">No Fear Act</a></li>
                        <li><a href="http://vaww.va.gov/landing_organizations.htm" target="_blank" title="Department of Veterans Affairs Organizations">Organizations</a></li>
                        <li><a href="http://vista.med.va.gov/termsofuse.htm" target="_blank" title="Terms of Use">Terms of Use</a></li>
                        <li><a href="http://vaww.va.gov/" target="_blank" title="Veterans Affairs Intranet Home Page">VA Intranet Home</a></li>
                    </ul>
                </nav>
            </footer>
        </div>
    )
};

export {Header, Main, Footer}