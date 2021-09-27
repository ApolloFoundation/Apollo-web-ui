/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {handleFormSubmit} from './handleFormSubmit';
import ModalBody from '../../../components/modals/modal-body';
import ComposeMessageForm from './form';


class ComposeMessage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 0,
            advancedState: false,

            // submitting
            passphraseStatus: false,
            recipientStatus: false,
            amountStatus: false,
            feeStatus: false
        }

    }

    handleFormSubmit = (values) => handleFormSubmit.call(this.props, values)

    render() {
        return (
            <ModalBody
                modalTitle={'Send message'}
                isAdvanced
                isFee
                closeModal={this.props.closeModal}
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                submitButtonName={'Send message'}
            >
                <ComposeMessageForm />
            </ModalBody>
        );
    }
}


const mapStateToProps = state => ({
	modalData: state.modals.modalData,
	modalsHistory: state.modals.modalsHistory
});


export default connect(mapStateToProps)(ComposeMessage);
