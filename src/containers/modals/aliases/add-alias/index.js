/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction} from '../../../../modules/modals';

import submitForm from "../../../../helpers/forms/forms";
import {NotificationManager} from "react-notifications";

import ModalBody from '../../../components/modals/modal-body';
import AddAliasForm from './form';

class AddAlias extends React.Component {
    handleFormSubmit = async (values) => {
        this.setState({
            isPending: true
        })
        const res = await this.props.submitForm( values, 'setAlias');
        if (res && res.errorCode) {
            this.setState({
                isPending: false
            })
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            this.props.setBodyModalParamsAction(null, {});

            NotificationManager.success('Product has been listed!', null, 5000);
        }
    }

    render() {
        return (
            <ModalBody
                loadForm={this.loadForm}
                modalTitle={'Add Alias'}
                isAdvanced={true}
                isFee
                closeModal={this.props.closeModal}
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                submitButtonName={'Add Alias'}
            >
                <AddAliasForm />
            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
	modalsHistory: state.modals.modalsHistory,
});

const mapDispatchToProps = dispatch => ({
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddAlias);
