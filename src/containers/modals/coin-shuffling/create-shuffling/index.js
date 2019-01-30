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

// Form components

import ModalBody from '../../../components/modals/modal-body';
import CreateShufflngForm from './form';

const holdingTypeData = [
    { value: 0, label: 'Apollo' },
    { value: 1, label: 'Asset' },
    { value: 2, label: 'Currency' },
];

class CreateShuffling extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 0,
            advancedState: false,

            // submitting
            passphraseStatus: false,
            recipientStatus: false,
            amountStatus: false,
            feeStatus: false,
        }

    }

    handleFormSubmit = (values) => this.props.handleFormSubmit(values);

    render() {
        return (
            <ModalBody
                loadForm={this.loadForm}
                modalTitle={'Create shuffling'}
                isAdvanced
                isFee
                closeModal={this.props.closeModal}
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                submitButtonName={'Create shuffling'}
            >
                <CreateShufflngForm />
            </ModalBody>

        );
    }
}

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    handleFormSubmit: (values) => dispatch(handleFormSubmit(values))
});

export default connect(null, mapDispatchToProps)(CreateShuffling);
