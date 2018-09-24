import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData} from '../../../../modules/modals';

import { Form, Text } from 'react-form';
import {getAliasAction} from "../../../../actions/aliases";
import submitForm from "../../../../helpers/forms/forms";
import {NotificationManager} from "react-notifications";
import CustomSelect from '../../../components/select';
import AccountRS from '../../../components/account-rs';
import AdvancedSettings from '../../../components/advanced-transaction-settings';
import InputForm from '../../../components/input-form';
import {calculateFeeAction} from "../../../../actions/forms";

const aliasTypeData = [
    { value: 'uri',     label: 'URI' },
    { value: 'account', label: 'Account' },
    { value: 'general', label: 'Other' },
];

class CancelSell extends React.Component {
    constructor(props) {
        super(props);

        this.handleFormSubmit = this.handleFormSubmit.bind(this);

        this.state = {
            activeTab: 0,
            advancedState: false,

            // submitting
            passphraseStatus: false,
            recipientStatus: false,
            amountStatus: false,
            feeStatus: false
        };

        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleAdvancedState = this.handleAdvancedState.bind(this);
    }

    componentDidMount = () => {
        this.getAlias();
    };

    async handleFormSubmit(values) {

        values = {
            ...values,
            recipient: this.state.alias.accountRS,
            aliasName: this.state.alias.aliasName,
            priceATM:  0,

        };

        this.props.submitForm(null, null, values, 'sellAlias')
            .done((data) => {
                if (!data.errorCode) {
                    this.props.submitForm(null, null, {
                        transactionBytes: data.transactionBytes,
                        prunableAttachmentJSON: JSON.stringify({...(data.transactionJSON.attachment), priceNQT: 0, uri: undefined, "version.AliasSell":1})

                    }, 'broadcastTransaction')
                        .done((data) => {
                            if (data.errorCode) {
                                NotificationManager.error(data.errorDescription, 'Error', 5000)
                            } else {
                                this.props.setBodyModalParamsAction(null, {});

                                NotificationManager.success('Alias sell has been canceled!', null, 5000);
                            }
                        });
                } else {
                    NotificationManager.error(data.errorDescription, 'Error', 5000)
                }

            });

    }

    getAlias = async () => {
        const alias = await this.props.getAliasAction({alias: this.props.modalData});

        if (alias) {
            this.setState({
                alias
            });
        }
    };

    handleTabChange(tab) {
        this.setState({
            ...this.props,
            activeTab: tab
        })
    }

    handleAdvancedState() {
        if (this.state.advancedState) {
            this.setState({
                ...this.props,
                advancedState: false
            })
        } else {
            this.setState({
                ...this.props,
                advancedState: true
            })
        }
    }

    handleChange = (value) => {
        this.setState({
            inputType: value
        })
    };

    render() {
        return (
            <div className="modal-box">
                <Form
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({
                                 submitForm, setValue, values, getFormState
                             }) => (
                                <form className="modal-form" onSubmit={submitForm}>
                                    {
                                        this.state.alias &&
                                        <div className="form-group-app">
                                            <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                            <div className="form-title">
                                                <p>Cancel Alias Sale</p>
                                            </div>
                                            <div className="input-group-app offset-top display-block">
                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <label>Alias</label>
                                                    </div>
                                                    <div className="col-md-9">
                                                        <p>{this.state.alias.aliasName}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group row form-group-white mb-15">
                                                <label className="col-sm-3 col-form-label">
                                                    Fee
                                                    <span
                                                        onClick={async () => {
                                                            setValue("feeAPL", 1);
                                                        }}
                                                        style={{paddingRight: 0}}
                                                        className="calculate-fee"
                                                    >Calculate</span>
                                                </label>
                                                <div className="col-sm-9 input-group input-group-text-transparent input-group-sm">
                                                    <InputForm
                                                        field="feeAPL"
                                                        placeholder="Minimum fee"
                                                        type={"float"}
                                                        setValue={setValue}/>
                                                    <div className="input-group-append">
                                                        <span className="input-group-text">Apollo</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="input-group-app offset-top display-block">
                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <label>Passphrase</label>
                                                    </div>
                                                    <div className="col-md-9">
                                                        <Text field="secretPhrase" placeholder="secretPhrase"  type={'password'}/>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="btn-box align-buttons-inside absolute right-conner align-right">
                                                <a
                                                    onClick={() => this.props.closeModal()}
                                                    className="btn round round-top-left"
                                                >
                                                    Cancel
                                                </a>
                                                <button
                                                    type="submit"
                                                    name={'closeModal'}
                                                    className="btn btn-right blue round round-bottom-right"
                                                >
                                                    Delete alias
                                                </button>
                                            </div>
                                            <div className="btn-box align-buttons-inside absolute left-conner">
                                                <a
                                                    onClick={this.handleAdvancedState}
                                                    className="btn btn-right round round-bottom-left round-top-right absolute"
                                                    style={{left : 0, right: 'auto'}}
                                                >
                                                    {this.state.advancedState ? "Basic" : "Advanced"}
                                                </a>
                                            </div>
                                            <AdvancedSettings
                                                setValue={setValue}
                                                getFormState={getFormState}
                                                values={values}
                                                advancedState={this.state.advancedState}
                                            />
                                        </div>
                                    }
                                </form>
                            )}
                        >

                </Form>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (modal, btn, data, requestType) => dispatch(submitForm.submitForm(modal, btn, data, requestType)),
    getAliasAction: (requestParams) => dispatch(getAliasAction(requestParams)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    calculateFeeAction: (requestParams) => dispatch(calculateFeeAction(requestParams))
});

export default connect(mapStateToProps, mapDispatchToProps)(CancelSell);
