import React from 'react'
import {gonRoute, gonImgPath} from "../utils/gon_helper";
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'

const Header2 = () => {
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="#home">Home</Nav.Link>
                    <Nav.Link href="#link">Link</Nav.Link>
                    <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                        <NavDropdown.Divider/>
                        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                {/*<Form inline>*/}
                {/*    <FormControl type="text" placeholder="Search" className="mr-sm-2" />*/}
                {/*    <Button variant="outline-success">Search</Button>*/}
                {/*</Form>*/}
            </Navbar.Collapse>
        </Navbar>
    )
};
const Header = () => {
    return (
        <div className="header-container">
            <header>
                <div className="logo" aria-label="VA Logo">
                    <a href="https://www.va.gov" title="Go to VA.gov">
                        <img style={{verticalAlign: 'middle'}} src={gonImgPath('va-logo-white.png')} alt="VA Header Image"/>
                    </a>
                </div>
                {/*<div style={{float: 'right', display: 'inline'}}>{gon.user}</div>*/}
                {/*<div style={{width: '100%'}}><img style={{width: '100%'}} src={GH.getImagePath('desktop-hd-line-2.png')} alt="line2"/></div>*/}
                {/*<div>menus</div>*/}
            </header>
        </div>
    )
};

const Main = (props) => {
    return (
        <div style={{minHeight: '400px', width: '90%', margin: '0 auto', paddingTop: '10px'}}>
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
                        <img src={gonImgPath('va-logo-white.png')} alt="VA Footer Image"/>
                    </a>
                </div>
                <div>
                    <nav role="navigation" aria-label="External Links Navigation">
                        <ul>
                            <li><a href="https://www.section508.va.gov" title="Accessibility" className={'link'}>Accessibility</a></li>
                            <li><a href="https://www.va.gov/orm/NOFEAR_Select.asp" title="No FEAR Act Data" className={'link'}>No FEAR Act Data</a></li>
                            <li><a href="https://www.va.gov/opa/Plain_Language.asp" title="Plain Language" className={'link'}>Plain Language</a></li>
                            <li><a href="https://www.va.gov/oig/" title="Office of Inspector General" className={'link'}>Office of Inspector General</a></li>
                            <li><a href="https://www.usa.gov/" title="USA.gov" className={'link'}>USA.gov</a></li>
                            <li><a href="https://www.va.gov/privacy-policy/" title="Privacy, Policies &amp; Legal information" className={'link'}>Privacy, Policies &amp; Legal information</a></li>
                            <li><a href="https://www.va.gov/foia/" title="Freedom of Information Act (FOIA)" className={'link'}>Freedom of Information Act (FOIA)</a></li>
                            <li><a href="https://www.va.gov/privacy/" title="VA Privacy Service" className={'link'}>VA Privacy Service</a></li>
                            <li><a href="https://www.va.gov/scorecard/" title="VA.gov scorecard" className={'link'}>VA.gov scorecard</a></li>
                            <li><a href="https://www.va.gov/veterans-portrait-project/" title="Veterans Portrait Project" className={'link'}>Veterans Portrait Project</a></li>
                        </ul>
                    </nav>
                </div>
            </footer>
        </div>
    )
};

const Footer2 = () => {
    return (
        <footer>
            <div className="footer-containera">
                <div className="usa-grid">
                    <div className="usa-width-one-fourth">
                        <div className="logo" aria-label="VA Logo">
                            <a href="https://www.va.gov" title="Go to VA.gov">
                                <img src={gonImgPath('va-logo-white.png')} alt="VA Footer Image"/>
                            </a>
                        </div>
                    </div>
                    <div className="usa-width-three-fourths">
                        <div className="usa-grid">
                            <div className="usa-width-one-fourth">
                                <a href="https://www.section508.va.gov" title="Accessibility">Accessibility</a>
                            </div>
                            <div className="usa-width-one-fourth">
                                <a href="https://www.va.gov/orm/NOFEAR_Select.asp" title="No FEAR Act Data">No FEAR Act Data</a>
                            </div>
                            <div className="usa-width-one-fourth">
                                <a href="https://www.va.gov/oig/" title="Office of Inspector General">Office of Inspector General</a>
                            </div>
                            <div className="usa-width-one-fourth">
                                <a href="https://www.va.gov/opa/Plain_Language.asp" title="Plain Language">Plain Language</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
};

export {Header, Header2, Main, Footer, Footer2}
