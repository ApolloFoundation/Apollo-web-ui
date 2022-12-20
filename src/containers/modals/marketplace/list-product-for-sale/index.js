/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import submitForm from "../../../../helpers/forms/forms";

import {handleFormSubmit} from "./handleFormSubmit";

import ModalBody from '../../../components/modals/modal-body';
import ListProductForSaleFrom from './form';
// TODO update
class ListProductForSale extends React.Component {
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
            prePreviewImage: null
        }
    }

    handleFormSubmit = (values) => handleFormSubmit.call(this.props, values);

    render() {
        return (
            <ModalBody
                loadForm={this.loadForm}
                modalTitle={'List Product For Sale'}
                isAdvanced
                isFee
                closeModal={this.props.closeModal}
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                submitButtonName={'List Product'}
            >
                <ListProductForSaleFrom ticker={this.props.ticker} />
            </ModalBody>

        );
    }
}


const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    ticker: state.account.ticker,
    publicKey: state.account.publicKey,
});

const mapDispatchToProps = dispatch => ({
    handleFormSubmit : (values) => dispatch(handleFormSubmit(values)),
    submitForm : (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ListProductForSale);
