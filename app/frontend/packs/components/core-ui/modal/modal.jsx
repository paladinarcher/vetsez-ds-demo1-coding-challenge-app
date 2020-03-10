import React, { useState } from 'react';

function Modal({id, buttonText, modalTitle, children} = {}) {
    const [displayModal, setDisplayModal] = useState(false);

    function openModal() {
        setDisplayModal(true);
    }

    function closeModal() {
        setDisplayModal(false);
    }

    return (
        <React.Fragment>
            <div className="va-flex">
                <button data-show={"#modal-" + id} className="va-overlay-trigger" onClick={openModal}>
                    <span className="va-flex">
                        <span className="vcl"></span>
                        {buttonText}
                    </span>
                </button>
            </div>
            <div id={"#modal-" + id} className={displayModal ? "va-modal va-modal-large" : "va-overlay va-modal va-modal-large"} role="alertdialog">
                <div className="va-modal-inner">
                    <div className="va-modal-body">
                        <h3>{modalTitle}</h3>
                        <button className="va-modal-close va-overlay-close" type="button" aria-label="Close this modal" onClick={closeModal}>
                            <i className="fas fa-times-circle va-overlay-close" aria-hidden="true"> </i>
                        </button>
                        {children}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default Modal;