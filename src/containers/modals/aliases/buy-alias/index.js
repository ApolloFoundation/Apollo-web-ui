/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React     from 'react';
import {connect} from 'react-redux';
import {NotificationManager} from "react-notifications";
import {ONE_APL} from '../../../../constants';
import {setBodyModalParamsAction} from '../../../../modules/modals';
import {buyAliasAction} from '../../../../actions/aliases';
import TextualInputComponent from '../../../components/form-components/textual-input';
import ModalBody             from '../../../components/modals/modal-body';

class GetAlias extends React.Component {

    handleFormSubmit = async (values) => {
        const {alias, aliasName, secretPhrase, priceATM, feeATM} = values;
        let isError = false;
        if (!feeATM) {
            NotificationManager.error('Enter fee!', null, 5000);
            isError = true;
        }

        if (!secretPhrase) {
            NotificationManager.error('Enter secretPhrase!', null, 5000);
            isError = true;
        }

        if (isError) return

        const boughtAlias = {
            alias,
            aliasName,
            secretPhrase,
            amountATM: priceATM,
            feeATM: feeATM,
        }

        this.props.processForm(boughtAlias, 'buyAlias', 'Alias has been bought!', () => {
            this.props.setBodyModalParamsAction(null, {});
            NotificationManager.success('Alias has been bought!', null, 5000);
        });
    }

    render() {
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
                    field="aliasName"
                    placeholder="Alias"
                    type={"text"}
                />
                <TextualInputComponent
                    label={'Price'}
                    countLabel={'APL'}
                    disabled={true}
                    field="priceATM"
                    placeholder="Amount"
                    type={"float"}
                />
            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    buyAliasAction: (data) => dispatch(buyAliasAction(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GetAlias);
