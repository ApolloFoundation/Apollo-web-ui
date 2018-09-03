import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData} from '../../../../modules/modals';
import classNames from 'classnames';

import { Form, Text } from 'react-form';
import InfoBox from '../../../components/info-box';
import {getAliasAction} from "../../../../actions/aliases";
import submitForm from "../../../../helpers/forms/forms";
import {NotificationManager} from "react-notifications";

class SellAlias extends React.Component {
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
            feeStatus: false,
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
            aliasName: this.state.alias.aliasName,

        };

        this.props.submitForm(null, null, values, 'sellAlias')
            .done((res) => {
                if (res.errorCode) {
                    NotificationManager.error(res.errorDescription, 'Error', 5000)
                } else {
                    this.props.setBodyModalParamsAction(null, {});

                    NotificationManager.success('Product has been listed!', null, 5000);
                }
            })

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

    handleTab = (e, index) => {
        e.preventDefault();

        this.setState({
            ...this.props,
            activeTab: index
        })
    };

    render() {
        return (
            <div className="modal-box">
                <div className="modal-form">
                    {
                        this.state.alias &&
                        <div className="form-group">
                            <div className="form-title">
                                <p>Sell alias</p>
                            </div>
                            <div
                                // style={{margin: '55px -35px -35px -35px'}}
                                className="form-tabulator active"
                            >
                                <div className="form-tab-nav-box justify-left">
                                    <a onClick={(e) => this.handleTab(e, 0)} className={classNames({
                                        "form-tab": true,
                                        "active": this.state.activeTab === 0
                                    })}>
                                        <p>Sell alias to Specific Account</p>
                                    </a>
                                    <a onClick={(e) => this.handleTab(e, 1)} className={classNames({
                                        "form-tab": true,
                                        "active": this.state.activeTab === 1
                                    })}>
                                        <p>Sell to Anyone</p>
                                    </a>
                                </div>
                                <Form
                                    onSubmit={(values) => this.handleFormSubmit(values)}
                                    render={({
                                                 submitForm, setValue
                                             }) => (
                                        <form
                                            onSubmit={submitForm}
                                            className={classNames({
                                                "tab-body": true,
                                                "active": this.state.activeTab === 0
                                            })}>
                                            <div className="input-group offset-top display-block">
                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <label>Alias</label>
                                                    </div>
                                                    <div className="col-md  -9">
                                                        <p>{this.state.alias.aliasName}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="input-group offset-top display-block">
                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <label>Recipient</label>
                                                    </div>
                                                    <div className="col-md-9">
                                                        <Text defaultValue={this.state.alias.accountRS} field="recipient" placeholder="Amount" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="input-group offset-top display-block">
                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <label>Price</label>
                                                    </div>
                                                    <div className="col-md-9">
                                                        <Text field="priceAPL" placeholder="Amount" type={'number'}/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="input-group offset-top display-block">
                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <label>Fee</label>
                                                    </div>
                                                    <div className="col-md-9">
                                                        <Text field="feeATM" placeholder="Amount" type={'number'}/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="input-group offset-top display-block">
                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <label>Passphrase</label>
                                                    </div>
                                                    <div className="col-md-9">
                                                        <Text field="secretPhrase" placeholder="secretPhrase" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="btn-box align-buttons-inside absolute right-conner">
                                                <a
                                                    className="btn btn-left round round-bottom-left round-top-right"
                                                    // onClick={() => this.props.setBodyModalParamsAction('CREATE_USER')}
                                                >
                                                    Create account
                                                </a>
                                                <button
                                                    type="submit"
                                                    name={'closeModal'}
                                                    className="btn btn-right blue round round-bottom-right round-top-left"
                                                >
                                                    Enter
                                                </button>

                                            </div>
                                        </form>
                                    )}
                                />
                                <Form
                                    onSubmit={(values) => this.handleFormSubmit(values)}
                                    render={({
                                                 submitForm
                                             }) => (
                                        <form
                                            onSubmit={submitForm}
                                            className={classNames({
                                                "tab-body": true,
                                                "active": this.state.activeTab === 1
                                            })}>
                                            <div className="input-group offset-top display-block">
                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <label>Alias</label>
                                                    </div>
                                                    <div className="col-md  -9">
                                                        <p>{this.state.alias.aliasName}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="input-group offset-top display-block">
                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <label>Price</label>
                                                    </div>
                                                    <div className="col-md-9">
                                                        <Text field="priceAPL" placeholder="Amount" type={'number'}/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="input-group offset-top display-block">
                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <label>Fee</label>
                                                    </div>
                                                    <div className="col-md-9">
                                                        <Text field="feeATM" placeholder="Amount" type={'number'}/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="input-group offset-top display-block">
                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <label>Passphrase</label>
                                                    </div>
                                                    <div className="col-md-9">
                                                        <Text field="secretPhrase" placeholder="secretPhrase" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="btn-box align-buttons-inside absolute right-conner">
                                                <a
                                                    className="btn btn-left round round-bottom-left round-top-right"
                                                    // onClick={() => this.props.setBodyModalParamsAction('CREATE_USER')}
                                                >
                                                    Create account
                                                </a>
                                                <button
                                                    type="submit"
                                                    name={'closeModal'}
                                                    className="btn btn-right blue round round-bottom-right round-top-left"
                                                >
                                                    Enter
                                                </button>

                                            </div>
                                        </form>
                                    )}
                                />
                            </div>
                        </div>
                    }
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(SellAlias);
