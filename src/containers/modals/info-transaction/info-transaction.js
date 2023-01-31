/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {getTransactionAction} from "actions/transactions";
import InfoTransactionTable from "./info-transoction-table"
import {getAccountInfoAction} from "actions/account";
import TabulationBody from 'containers/components/tabulator/tabuator-body';
import TabContaier from 'containers/components/tabulator/tab-container';
import ModalBody from "containers/components/modals/modal-body";
import ContentLoader from "containers/components/content-loader";
import InfoBox from "containers/components/info-box";
import {getCurrencyAction} from "actions/currencies";
import {
    getAccountRsSelector,
    getConstantsSelector,
    getDecimalsSelector,
    getModalDataSelector,
    getModalTypeSelector
} from 'selectors';
import { ActionTab } from './Tabs/Action';
import { TransactionDetails } from './Tabs/TransactionDetails';
import { PhasingDetails } from './Tabs/PhasingDetails';

// TODO add code splitting
class InfoLedgerTransaction extends React.Component {
    state = {
        isPending: true,
        transaction: null,
        transactionId: null,
        currency: null,
    };

    processTransaction = async () => {
        let currency = null;
        const transaction = await this.props.getTransactionAction({transaction: this.state.transactionId});
        if (transaction && transaction.attachment.currency) {
            currency = await this.props.getCurrencyAction({currency: transaction.attachment.currency});
        }
        this.setState({
            transaction,
            isPending: false,
            currency,
        });
    };

    static getDerivedStateFromProps(props, state) {
        if (props.modalData
            && Object.keys(props.modalData).length > 0
            && (!state.transactionId || props.modalData !== state.modalData)
            && props.modalType === 'INFO_TRANSACTION'
        ) {
            if (props.modalData && !props.modalData.errorCode) {
                const isDataObject = props.modalData instanceof Object;
                return {
                    modalData: props.modalData,
                    transaction: isDataObject ? props.modalData : null,
                    transactionId: isDataObject ? props.modalData.transaction : props.modalData,
                    isPending: !isDataObject,
                };
            }
        }
        return null;
    };

    getCurrency = async () => {
        let currency = null;
        if (this.state.transaction && this.state.transaction.attachment.currency) {
            currency = await this.props.getCurrencyAction({
                currency: this.state.transaction.attachment.currency
            });
        }
        this.setState({
            currency,
        });
    }

    componentDidMount() {
        if (this.state.transactionId && !(this.state.transaction instanceof Object)) {
            this.processTransaction();
        }
        this.getCurrency();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.transactionId && prevState.transactionId !== this.state.transactionId) {
            this.processTransaction();
        }
        if (this.state.transaction && this.state.transaction.phased && this.state.transaction !== prevState.transaction) {
            this.getWhiteListOfTransaction();
        }
    };

    getWhiteListOfTransaction = () => {
        if (this.state.transaction && this.state.transaction.attachment.phasingWhitelist) {
            const whitelist = this.state.transaction.attachment.phasingWhitelist.map((el) => {
                return this.props.getAccountInfoAction({
                    account: el
                })
            });

            Promise.all(whitelist)
                .then((data) => {
                    this.setState({
                        whitelist: data
                    })
                })
        }
    };

    render() {
        const {transaction, transactionId} = this.state;

        const parsedSignatures = (transaction && transaction.signature) && (typeof transaction.signature === "string" ? [transaction.signature] : transaction.signature.signatures.map(i => i.signature));
        
        const recipientRS = transaction
        && (this.props.accountRS === transaction.recipientRS ? transaction.senderRS : transaction.recipientRS);

          return (
            <ModalBody
                modalTitle={`Transaction ${transactionId || ''} Info`}
                closeModal={this.props.closeModal}
                isDisableFormFooter
                isDisableSecretPhrase
                isWide
            >
                {!this.state.isPending ? (
                    transaction && this.props.constants.transactionTypes && this.props.constants.transactionTypes[transaction.type] ? (
                      <TabulationBody>
                        <TabContaier sectionName={'Info'}>
                          <div className="transaction-table no-min-height transparent">
                            <InfoTransactionTable transaction={transaction} constants={this.props.constants}/>
                          </div>
                        </TabContaier>

                            <TabContaier sectionName='Actions'>
                                <ActionTab
                                    recipientRS={recipientRS}
                                    transaction={this.state.transaction}
                                    currency={this.state.currency}
                                />
                            </TabContaier>

                            <TabContaier sectionName='Transactions Details'>
                                <TransactionDetails
                                    transaction={this.state.transaction}
                                    decimals={this.props.decimals}
                                    parsedSignatures={parsedSignatures}
                                />
                            </TabContaier>
                                <TabContaier sectionName='Phasing Details'>
                                    <PhasingDetails
                                        transaction={this.state.transaction}
                                        whitelist={this.state.whitelist}
                                    />
                                </TabContaier>
                        </TabulationBody>
                    ) : (
                        <InfoBox default>
                            Transaction not found
                        </InfoBox>
                    )
                ) : (
                    <ContentLoader/>
                )}
            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    accountRS: getAccountRsSelector(state),
    decimals: getDecimalsSelector(state),
    modalType: getModalTypeSelector(state),
    modalData: getModalDataSelector(state),
    constants: getConstantsSelector(state),
});

const mapDispatchToProps = {
    getTransactionAction,
    getAccountInfoAction,
    getCurrencyAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(InfoLedgerTransaction);
