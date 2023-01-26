/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData} from '../../../../modules/modals';

import {getAliasAction} from "../../../../actions/aliases";
import submitForm from "../../../../helpers/forms/forms";
import {NotificationManager} from "react-notifications";

import SellAliasForm from './form';
import ModalBody from '../../../components/modals/modal-body';

class SellAlias extends React.Component {
    constructor(props) {
        super(props);

        this.handleFormSubmit = this.handleFormSubmit.bind(this);

        this.state = {
            activeTab: 0,
            activeForm: 0, 
            advancedState: false,

            // submitting
            passphraseStatus: false,
            recipientStatus: false,
            amountStatus: false,
            feeStatus: false,
        };

    }

    componentDidMount = () => {
        this.getAlias();
    };

    getAlias = async () => {
        const alias = await this.props.getAliasAction({alias: this.props.modalData});

        if (alias) {
            this.setState({
                alias
            });
        }
    };

    async handleFormSubmit(values) {
        
        switch (this.state.activeForm) {
            case 0: 
                values = {...this.state.sellToSpeciffic};
                break;

            case 1: 
                values = {...this.state.sellToAll};
                break;
            
            default : return; 
        }

        values = {
            ...values,
            aliasName: this.state.alias.aliasName,
        };

        this.props.processForm(values, 'sellAlias', 'Alias has been listed!', () => {
            this.props.setBodyModalParamsAction(null, {});
            NotificationManager.success('Alias has been listed!', null, 5000);
        });
    }

    onFocus = (activeForm) => {
        this.setState({
            activeForm
        })
    }

    handleSellAlias = ({values}, field) => {
        this.setState({
            [field]: values
        });
    }

    render() {
        return (
            <ModalBody
                modalTitle={'Sell Alias'}
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                submitButtonName={'Sell Alias'}
                isDisableSecretPhrase
                closeModal={this.props.closeModal}
                isAdvanced={true}
                isAdvancedWhite
            >
                <SellAliasForm
                    handleSellAlias={this.handleSellAlias} 
                    onFocus={this.onFocus}
                    alias={this.state.alias}
                    closeModal={this.props.closeModal} 
                    handleFormSubmit={this.handleFormSubmit} 
                />
            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    getAliasAction: (requestParams) => dispatch(getAliasAction(requestParams)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SellAlias);
