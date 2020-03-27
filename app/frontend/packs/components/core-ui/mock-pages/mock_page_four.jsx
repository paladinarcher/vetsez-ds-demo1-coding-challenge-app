import React, { useState } from 'react';
import DropDownPanel from '@department-of-veterans-affairs/formation-react/DropDownPanel'
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox'
import Breadcrumbs from '@department-of-veterans-affairs/formation-react/Breadcrumbs';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator'

// yarn add @department-of-veterans-affairs/formation-react
// yarn add react-scroll
// import CollapsiblePanel from '@department-of-veterans-affairs/formation-react/CollapsiblePanel'

function MockPageFour() {
    const [ddpOpen, setDdpOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const toggleLoading = () => {
        setLoading(!loading);
    };

    return (
        <div className="usa-grid">
            <div className="usa-width-whole">
                <div style={{ backgroundColor: '#112e51' }}>
                    <DropDownPanel
                        buttonText='Helpdesk'
                        cssClass='va-dropdown'
                        isOpen={ddpOpen}
                        contents='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ullamcorper at eros eu suscipit. Ut imperdiet libero et luctus pretium.'
                        clickHandler={() => setDdpOpen(!ddpOpen)}>
                        <div>
                            <a onClick={() => console.log("clicked!!")}>clicker-oo</a><br/>
                            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ullamcorper at eros eu suscipit. Ut imperdiet libero et luctus pretium.'
                        </div>
                    </DropDownPanel>
                </div>
                <br/>
                <button onClick={toggleLoading}>{(loading ? 'hide' : 'show') + ' loading...'}</button>
                {/* todo note: site-c-reactcomp__rendered appears to be unnecessary */}
                <div className={loading ? 'show':'hide' + " site-c-reactcomp__rendered"}>
                    <LoadingIndicator
                        message='Loading your application...'
                        setFocus={false}
                    />
                </div>


                <h1>Breadcrumb</h1>
                <h3>Issue with image in breadcrumb due to app.css styles</h3>
                <h5> (removing the styles messes up the footer)</h5>
                <Breadcrumbs>
                    {[
                        <a href="#" key="1">Home</a>,
                        <a href="#" key="2">Level One</a>,
                        <a href="#" key="3">Level Two</a>
                    ]}
                </Breadcrumbs>

                <h4>HTML Breadcrumb</h4>
                <nav aria-label="Breadcrumb" aria-live="polite" className="va-nav-breadcrumbs" id="va-breadcrumbs-107">
                    <ul className="row va-nav-breadcrumbs-list columns" id="va-breadcrumbs-list-108">
                        <li><a href="#">Home</a></li>
                        <li><a href="#">Level One</a></li>
                        <li><a href="#" aria-current="page">Level Two</a></li>
                    </ul>
                </nav>
                <div className="usa-width-one-whole">
                    <AlertBox
                        headline='Informational alert'
                        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam id felis pulvinar ligula ultricies sollicitudin eget nec dui. Cras augue velit, pellentesque sit amet nisl ut, tristique suscipit sem. Cras sollicitudin auctor mattis."
                        status="info"
                        isVisible/>
                    <AlertBox
                        headline="Dismissable alert"
                        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam id felis pulvinar ligula ultricies sollicitudin eget nec dui. Cras augue velit, pellentesque sit amet nisl ut, tristique suscipit sem. Cras sollicitudin auctor mattis."
                        status="info"
                        isVisible
                        onCloseAlert={() => {}}/>
                    <AlertBox
                        headline="Hidden alert"
                        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam id felis pulvinar ligula ultricies sollicitudin eget nec dui. Cras augue velit, pellentesque sit amet nisl ut, tristique suscipit sem. Cras sollicitudin auctor mattis."
                        status="info"
                        isVisible={loading}/>
                    <AlertBox
                        content={<p>Content without heading.</p>}
                        status="info"/>
                    <AlertBox
                        headline="Informational backgroundOnly alert"
                        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam id felis pulvinar ligula ultricies sollicitudin eget nec dui. Cras augue velit, pellentesque sit amet nisl ut, tristique suscipit sem. Cras sollicitudin auctor mattis."
                        status="info"
                        backgroundOnly />
                </div>
{/* todo does not work
                <div>
                    <CollapsiblePanel
                        panelName="Collapsible Panel">
                        <div>This panel defaults to closed.</div>
                    </CollapsiblePanel>

                    <CollapsiblePanel
                        panelName="Collapsible Panel" startOpen>
                        <div>This panel defaults to open.</div>
                    </CollapsiblePanel>
                </div>
*/}

            </div>
        </div>
    )
}

export default MockPageFour;
