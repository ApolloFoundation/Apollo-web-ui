import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData} from '../../../../modules/modals';
import classNames from 'classnames';

import { Form, Text } from 'react-form';
import InfoBox from '../../../components/info-box';
import {NotificationManager} from "react-notifications";
import {getAliasAction} from "../../../../actions/aliases";
import submitForm from "../../../../helpers/forms/forms";
import AdvancedSettings from '../../../components/advanced-transaction-settings'

class DeleteAlias extends React.Component {
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
            priceATM: 0,
            aliasName: this.state.alias.aliasName
        };

        const res = await this.props.submitForm(null, null, values, 'deleteAlias');
        if (res.errorCode) {
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            this.props.setBodyModalParamsAction(null, {});
            NotificationManager.success('Product has been listed!', null, 5000);
        }

        // this.props.sendTransaction(values);
        // this.props.setBodyModalParamsAction(null, {});
        // this.props.setAlert('success', 'Transaction has been submitted!');
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
                                        <p>Delete Alias</p>
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
                                    <div className="input-group-app offset-top display-block">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <label htmlFor="feeATM" className="col-form-label">
                                                    Fee&nbsp;
                                                    <span
                                                        onClick={async () => {
                                                            setValue("feeATM", 1);
                                                        }
                                                        }
                                                        style={{paddingRight: 0}}
                                                        className="calculate-fee"
                                                    >
                                                        Calculate
                                                    </span>
                                                </label>
                                            </div>
                                            <div className="col-md-9">
                                                <Text field="feeATM" placeholder="Amount" type={'number'}/>
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
                                        <button
                                            type="submit"
                                            name={'closeModal'}
                                            className="btn btn-right blue round round-bottom-right round-top-left"
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
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteAlias);
