/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {NotificationManager} from 'react-notifications';
import {setBodyModalParamsAction} from '../../../../modules/modals';
import {getAliasAction} from '../../../../actions/aliases/';

import submitForm           from "../../../../helpers/forms/forms";

import TextualInputComponent from '../../../components/form-components/textual-input';
import NumericInputComponent from '../../../components/form-components/numeric-input';
import ModalBody             from '../../../components/modals/modal-body';
import ModalFooter           from '../../../components/modal-footer';

class GetAlias extends React.Component {

    state = {
        aliasInfo : {
            aliasName : null,
            priceATM : null
        }
    };

    handleFormSubmit = (values) => {
        console.log(values)
    }

    render() {

        const {priceATM, aliasName} = this.props.modalData;

        return (
            <ModalBody
                modalTitle={'Buy Alias'}
                isAdvanced={true}
                isFee
                closeModal={this.props.closeModal}
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                submitButtonName={'Buy Alias'}
            >
                <TextualInputComponent 
                    label={'Alias'}

                    disabled={true}
                    defaultValue={aliasName}
                    field="aliasName"
                    placeholder="Alias"
                    type={"text"}
                />
                <NumericInputComponent
                    label={'Price'}

                    countLabel={'APL'}
                    disabled={true}
                    defaultValue={priceATM}
                    field="amountAPL"
                    placeholder="Amount"
                    type={"float"}
                />           
            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    account: state.account.account,
    publicKey: state.account.publicKey
});

const mapDispatchToProps = dispatch => ({
    getAliasAction: (requestParams) => dispatch(getAliasAction(requestParams)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GetAlias);
