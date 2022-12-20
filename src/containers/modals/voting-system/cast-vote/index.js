/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData, saveSendModalState, openPrevModal} from '../../../../modules/modals';
import InputForm from '../../../components/input-form';
import AdvancedSettings from '../../../components/advanced-transaction-settings';
import {Form, Text, Number, Checkbox} from 'react-form';
import submitForm from "../../../../helpers/forms/forms";
import {getBlockAction} from "../../../../actions/blocks";
import {NotificationManager} from "react-notifications";
import {getpollAction} from "../../../../actions/polls";
import { v4 as uuidv4 } from 'uuid';
import crypto from "../../../../helpers/crypto/crypto";

import {getAssetAction} from "../../../../actions/assets";
import {getCurrencyAction} from "../../../../actions/currencies";

import ModalBody from '../../../components/modals/modal-body';
import CastVoteForm   from './form';
import $ from 'jquery';
// TODO update
class CastPoll extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 0,
            advancedState: false,
            rangeValue: 10,

            // submitting
            passphraseStatus: false,
            recipientStatus: false,
            amountStatus: false,
            feeStatus: false,

            answers: [''],
            voteOptions: []
        };
    }

    componentDidMount() {
        this.getPoll();
    }

    getPoll =  async () => {
        const poll = await this.props.getpollAction({
            poll: this.props.modalData
        });

        if (poll && !poll.errorCode) {
            let votes = {};

            Object.values(poll.options).forEach((el, index) => {
                if (index > 9) {
                    votes['vote' + index] = el;
                } else {
                    votes['vote0' + index] = el;
                }
            });

            this.setState({
                poll,
                votes
            }, () => {
                this.getAsset();
                this.getCurrency();
            });
        }
    };

    getAsset = async () => {
        const asset = await this.props.getAssetAction({asset: this.state.poll.holding});

        if (asset && !asset.errorCode) {
            this.setState({
                asset
            })
        }
    }

    getCurrency = async () => {
        const currency = await this.props.getCurrencyAction({currency: this.state.poll.holding});

        if (currency && !currency.errorCode) {
            this.setState({
                asset: currency
            })
        }
    }

    handleFormSubmit = async(values) => {
        if (!this.state.isPending) {
            this.setState({isPending: true});
            let votes = values.voteOptions;

            if (this.state.poll.maxRangeValue > 1) {
                votes = values.voteOptions;
                delete values.voteOptions;

            } else {
                const voteVals = Object.keys(values).filter((el) => {
                    return el.includes('vote')
                });

                voteVals.map(vote => {
                    values[vote] = values[vote] === true ? 1 : -128;
                });
            }


            values = {
                poll: this.state.poll.poll,
                ...values,
                ...votes,
            };

            const res = await this.props.submitForm(values, 'castVote');
            if (res.errorCode) {
                this.setState({
                    isPending: false
                });
                NotificationManager.error(res.errorDescription, 'Error', 5000)
            } else {
                this.props.setBodyModalParamsAction(null, {});

                NotificationManager.success('Your vote has been cast!', null, 5000);
            }
        }
    };

    handleAnswerChange = (e, index) => {
        const newAnwer = e.target.value;

        let answers = this.state.answers;

        answers[index] = newAnwer;

        this.setState({
            answers
        })
    };

    render() {
        const {asset, currency, poll, votes} = this.state;

        const assetHint    = asset    ? `This vote is based on the balance of asset: ${asset.asset}. If you do not have enough of this asset, your vote will not be counted.` : null;
        const currencyHint = currency ? `This vote is based on the balance of asset: ${currency.currency}. If you do not have enough of this currency, your vote will not be counted.` : null;

        return (
            <ModalBody
                loadForm={this.loadForm}
                modalTitle={'Cast vote'}
                closeModal={this.props.closeModal}
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                submitButtonName={'Cast vote'}

                isFee
                nameModel={this.props.nameModal}
            >
                <CastVoteForm
                    assetHint={assetHint}
                    currencyHint={currencyHint}
                    poll={poll}
                    votes={votes}
                />
            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
	modalsHistory: state.modals.modalsHistory
});

const mapDispatchToProps = dispatch => ({
    getAssetAction: (reqParams) => dispatch(getAssetAction(reqParams)),
    getCurrencyAction: (reqParams) => dispatch(getCurrencyAction(reqParams)),
    getBlockAction: (data) => dispatch(getBlockAction(data)),
    setModalData: (data) => dispatch(setModalData(data)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    getpollAction: (reqParams) => dispatch(getpollAction(reqParams)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
	saveSendModalState: (Params) => dispatch(saveSendModalState(Params)),
	openPrevModal: () => dispatch(openPrevModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CastPoll);
