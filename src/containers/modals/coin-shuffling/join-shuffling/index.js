/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {
    setBodyModalParamsAction, 
} from '../../../../modules/modals';
import {handleFormSubmit} from './handleFormSubmit';
import {NotificationManager} from "react-notifications";

// Form components

import ModalBody from '../../../components/modals/modal-body';
import JoinShufflingForm from './form';

class JoinShuffling extends React.Component {
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

    handleFormSubmit = (values) => handleFormSubmit.call(this.props, values);

    componentDidMount = () => {
        NotificationManager.warning('Your secret phrase will be sent to the server!', 'Warning', 30000);
        NotificationManager.warning('Use a strong recipient secret phrase and do not forget it !', 'Warning', 30000);
        NotificationManager.info('After creating or joining a shuffling, you must keep your node online and your shuffler running, leaving enough funds in your account to cover the shuffling fees, until the shuffling completes! If you don\'t and miss your turn, you will be fined.', 'Attention', 30000);
    };

    render() {
        return (
            <ModalBody
                loadForm={this.loadForm}
                modalTitle={'Start shuffling'}
                isAdvanced
                isFee
                closeModal={this.props.closeModal}
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                submitButtonName={'Start shuffling'}
            >
                <JoinShufflingForm />
            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    modalsHistory: state.modals.modalsHistory,
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    handleFormSubmit: (values) => dispatch(handleFormSubmit(values))
});


export default connect(mapStateToProps, mapDispatchToProps)(JoinShuffling);
