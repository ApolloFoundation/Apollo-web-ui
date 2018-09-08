import React from 'react';
import classNames from "classnames";
import {Text} from 'react-form';


class AdvancedSettings extends React.Component {
    constructor(props) {
        super(props)
    }

    state = {
        activeTab: 0,
    };

    handleTabChange = (tab) => {
        this.setState({
            ...this.props,
            activeTab: tab
        })
    }

    render () {
        return (
            <div
                className={classNames({
                    'form-tabulator': true,
                    'active': this.props.advancedState,
                    'white': this.props.white
                })}
            >
                <div className="form-tab-nav-box">
                    <a
                        onClick={this.handleTabChange.bind(this, 0)}
                        className={classNames({
                            'form-tab': true,
                            'active' : this.state.activeTab === 0
                        })}
                    >
                        <i className={'zmdi zmdi-close-circle'} />
                    </a>
                    <a
                        onClick={this.handleTabChange.bind(this, 1)}
                        className={classNames({
                            'form-tab': true,
                            'active' : this.state.activeTab === 1
                        })}
                    >
                        <i className={'zmdi zmdi-spinner'} />
                    </a>

                    <a
                        onClick={this.handleTabChange.bind(this, 2)}
                        className={classNames({
                            'form-tab': true,
                            'active' : this.state.activeTab === 2
                        })}
                    >
                        <i className={'zmdi zmdi-accounts-alt'} />
                    </a>
                    <a
                        onClick={this.handleTabChange.bind(this, 3)}
                        className={classNames({
                            'form-tab': true,
                            'active' : this.state.activeTab === 3
                        })}
                    >
                        <i className={'zmdi zmdi-money-box'} />
                    </a>
                    <a
                        onClick={this.handleTabChange.bind(this, 4)}
                        className={classNames({
                            'form-tab': true,
                            'active' : this.state.activeTab === 4
                        })}
                    >
                        <i className={'zmdi zmdi-chart'} />
                    </a>
                    <a
                        onClick={this.handleTabChange.bind(this, 5)}
                        className={classNames({
                            'form-tab': true,
                            'active' : this.state.activeTab === 5
                        })}
                    >
                        <i className={'zmdi zmdi-balance'} />
                    </a>
                    <a
                        onClick={this.handleTabChange.bind(this, 6)}
                        className={classNames({
                            'form-tab': true,
                            'active' : this.state.activeTab === 6
                        })}
                    >
                        <i className={'zmdi zmdi-thumb-up'} />
                    </a>
                    <a
                        onClick={this.handleTabChange.bind(this, 7)}
                        className={classNames({
                            'form-tab': true,
                            'active' : this.state.activeTab === 7
                        })}
                    >
                        <i className={'zmdi zmdi-help'} />
                    </a>

                </div>
                <div className="tab-body">
                    <div className="form-tab">
                        <div className="input-group-app block">
                            <div className="row">
                                <div className="col-md-3">
                                    <label>Referenced transaction hash</label>
                                </div>
                                <div className="col-md-9">
                                    <input type="text" />
                                </div>
                                <div className="col-md-3">

                                </div>
                                <div className="col-md-9">
                                    <div className="form-sub-actions">
                                        <div className="form-group-app no-padding-bottom">
                                            <div className="input-group-app align-middle display-block offset-bottom">
                                                <input type="checkbox"/>
                                                <label>Do not broadcast</label>
                                            </div>
                                            <div className="input-group-app align-middle display-block offset-bottom">
                                                <input type="checkbox"/>
                                                <label>Add note to self?</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className={classNames({
                        "tab-body": true,
                        "active": this.state.activeTab === 0
                    })}
                >
                    <div className="form-tab">
                        <p className="mb-3">
                            Process without approval
                        </p>
                        <div className="form-group row form-group-grey">
                            <label htmlFor="referencedHash" className="col-sm-3 col-form-label">
                                Referenced transaction hash
                            </label>
                            <div className="col-sm-9 mb-0 no-left-padding">
                                <input type="text" 
                                       className="form-control form-control-sm" id="referencedHash"
                                       placeholder="Referenced transaction full hash"/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-9 offset-md-3">
                                <div className="form-check custom-checkbox mb-2">
                                    <input className="form-check-input custom-control-input" type="checkbox" value="" id="doNotBroadcast"/>
                                    <label className="form-check-label custom-control-label" htmlFor="doNotBroadcast">
                                        Do not broadcast
                                    </label>
                                </div>
                                <div className="form-check custom-checkbox">
                                    <input className="form-check-input custom-control-input" type="checkbox" value="" id="addNote"/>
                                    <label className="form-check-label custom-control-label" htmlFor="addNote">
                                        Add note to self?
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className={classNames({
                        "tab-body": true,
                        "active": this.state.activeTab === 1
                    })}
                >
                    <div className="form-tab">
                        <div className="form-group row form-group-grey">
                            <label htmlFor="finishHeight" className="col-sm-3 col-form-label">Finish height</label>
                            <div className="col-sm-9 input-group input-group-sm mb-0 no-left-padding">
                                <input type="number"
                                       className="form-control" id="finishHeight"
                                       placeholder="Finish height"
                                       aria-describedby="finishHeightText" />
                                <div className="input-group-append">
                                    <span className="input-group-text" id="finishHeightText">146,631</span>
                                </div>
                            </div>
                            <div className="col-sm-12 form-sub-title block align-right align-margin-top">
                                2018/06/19 09:32 am
                            </div>
                        </div>
                        <div className="form-group row form-group-grey">
                            <label htmlFor="referencedHash" className="col-sm-3 col-form-label">
                                Referenced transaction hash
                            </label>
                            <div className="col-sm-9 mb-0 no-left-padding">
                                <input type="text" 
                                       className="form-control form-control-sm" id="referencedHash"
                                       placeholder="Referenced transaction full hash"/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-9 offset-md-3">
                                <div className="form-check custom-checkbox mb-2">
                                    <input className="form-check-input custom-control-input" type="checkbox" value="" id="doNotBroadcast"/>
                                        <label className="form-check-label custom-control-label" htmlFor="doNotBroadcast">
                                            Do not broadcast
                                        </label>
                                </div>
                                <div className="form-check custom-checkbox">
                                    <input className="form-check-input custom-control-input" type="checkbox" value="" id="addNote"/>
                                    <label className="form-check-label custom-control-label" htmlFor="addNote">
                                        Add note to self?
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className={classNames({
                        "tab-body": true,
                        "active": this.state.activeTab === 2
                    })}
                >
                    <div className="form-tab">
                        <div className="form-group row form-group-grey mb-15">
                            <label htmlFor="numberAccounts" className="col-sm-3 col-form-label">
                                Number of accounts
                            </label>
                            <div className="col-sm-9 mb-0 no-left-padding">
                                <input type="number" 
                                       className="form-control form-control-sm" id="numberAccounts"
                                       placeholder="Number of accounts"/>
                            </div>
                        </div>
                        <div className="form-group row form-group-grey">
                            <label htmlFor="finishHeight" className="col-sm-3 col-form-label">Finish height</label>
                            <div className="col-sm-9 input-group input-group-sm mb-0 no-left-padding">
                                <input type="number"
                                       className="form-control" id="finishHeight"
                                       placeholder="Finish height"
                                       aria-describedby="finishHeightText" />
                                <div className="input-group-append">
                                    <span className="input-group-text" id="finishHeightText">146,631</span>
                                </div>
                            </div>
                            <div className="col-sm-12 form-sub-title block align-right align-margin-top">
                                2018/06/19 09:32 am
                            </div>
                        </div>
                        <div className="form-group row form-group-grey mb-15">
                            <label htmlFor="account" className="col-sm-3 col-form-label">Accounts (whitelist)</label>
                            <div className="col-sm-9 input-group input-group-sm mb-0 no-left-padding">
                                <input type="text"
                                       className="form-control" id="account"
                                       placeholder="Account"
                                       aria-describedby="accountIcon" />
                                <div className="input-group-append">
                                    <span className="input-group-text input-group-icon" id="accountIcon">
                                        <i className="zmdi zmdi-account" />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="form-group-grey row mb-15">
                            <div className="col-sm-9 offset-sm-3 no-left-padding">
                                <a className="no-margin btn static blue">
                                    Add account
                                </a>
                            </div>
                        </div>
                        <div className="form-group row form-group-grey mb-15">
                            <label htmlFor="numberAccounts" className="col-sm-3 col-form-label">
                                Min balance type
                            </label>
                            <div className="col-sm-9 mb-0 no-left-padding">
                                <div className="form-group-select">
                                    <select className="form-control">
                                        <option selected>No min balance necessary</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="form-group row form-group-grey">
                            <label htmlFor="referencedHash" className="col-sm-3 col-form-label">
                                Referenced transaction hash
                            </label>
                            <div className="col-sm-9 mb-0 no-left-padding">
                                <input type="text" 
                                       className="form-control form-control-sm" id="referencedHash"
                                       placeholder="Referenced transaction full hash"/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-9 offset-md-3">
                                <div className="form-check custom-checkbox mb-2">
                                    <input className="form-check-input custom-control-input" type="checkbox" value="" id="doNotBroadcast"/>
                                    <label className="form-check-label custom-control-label" htmlFor="doNotBroadcast">
                                        Do not broadcast
                                    </label>
                                </div>
                                <div className="form-check custom-checkbox">
                                    <input className="form-check-input custom-control-input" type="checkbox" value="" id="addNote"/>
                                    <label className="form-check-label custom-control-label" htmlFor="addNote">
                                        Add note to self?
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className={classNames({
                        "tab-body": true,
                        "active": this.state.activeTab === 3
                    })}
                >
                    <div className="form-tab">
                        <div className="form-group row form-group-grey mb-15">
                            <label htmlFor="amount" className="col-sm-3 col-form-label">
                                Amount
                            </label>
                            <div className="col-sm-9 input-group input-group-text-transparent input-group-sm mb-0 no-left-padding">
                                <input type="text"
                                       className="form-control" id="amount"
                                       placeholder="Amount"
                                       aria-describedby="amountText" />
                                <div className="input-group-append">
                                    <span className="input-group-text" id="amountText">APL</span>
                                </div>
                            </div>
                        </div>
                        <div className="form-group row form-group-grey">
                            <label htmlFor="finishHeight" className="col-sm-3 col-form-label">Finish height</label>
                            <div className="col-sm-9 input-group input-group-sm mb-0 no-left-padding">
                                <input type="number"
                                       className="form-control" id="finishHeight"
                                       placeholder="Finish height"
                                       aria-describedby="finishHeightText" />
                                <div className="input-group-append">
                                    <span className="input-group-text" id="finishHeightText">146,631</span>
                                </div>
                            </div>
                            <div className="col-sm-12 form-sub-title block align-right align-margin-top">
                                2018/06/19 09:32 am
                            </div>
                        </div>
                        <div className="form-group row form-group-grey mb-15">
                            <label htmlFor="account" className="col-sm-3 col-form-label">Accounts (whitelist)</label>
                            <div className="col-sm-9 input-group input-group-sm mb-0 no-left-padding">
                                <input type="text"
                                       className="form-control" id="account"
                                       placeholder="Account"
                                       aria-describedby="accountIcon" />
                                <div className="input-group-append">
                                    <span className="input-group-text input-group-icon" id="accountIcon">
                                        <i className="zmdi zmdi-account" />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="form-group-grey row mb-15">
                            <div className="col-sm-9 offset-sm-3 no-left-padding">
                                <a className="no-margin btn static blue">
                                    Add account
                                </a>
                            </div>
                        </div>
                        <div className="form-group row form-group-grey mb-15">
                            <label htmlFor="numberAccounts" className="col-sm-3 col-form-label">
                                Min balance type
                            </label>
                            <div className="col-sm-9 mb-0 no-left-padding">
                                <div className="form-group-select">
                                    <select className="form-control">
                                        <option selected>No min balance necessary</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="form-group row form-group-grey">
                            <label htmlFor="referencedHash" className="col-sm-3 col-form-label">
                                Referenced transaction hash
                            </label>
                            <div className="col-sm-9 mb-0 no-left-padding">
                                <input type="text" 
                                       className="form-control form-control-sm" id="referencedHash"
                                       placeholder="Referenced transaction full hash"/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-9 offset-md-3">
                                <div className="form-check custom-checkbox mb-2">
                                    <input className="form-check-input custom-control-input" type="checkbox" value="" id="doNotBroadcast"/>
                                    <label className="form-check-label custom-control-label" htmlFor="doNotBroadcast">
                                        Do not broadcast
                                    </label>
                                </div>
                                <div className="form-check custom-checkbox">
                                    <input className="form-check-input custom-control-input" type="checkbox" value="" id="addNote"/>
                                    <label className="form-check-label custom-control-label" htmlFor="addNote">
                                        Add note to self?
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className={classNames({
                        "tab-body": true,
                        "active": this.state.activeTab === 4
                    })}
                >
                    <div className="form-tab">
                        <div className="form-group row form-group-grey mb-15">
                            <label htmlFor="quantity" className="col-sm-3 col-form-label">
                                Asset quantity
                            </label>
                            <div className="col-sm-9 input-group input-group-text-transparent input-group-sm mb-0 no-left-padding">
                                <input type="text"
                                       className="form-control" id="quantity"
                                       placeholder="Asset quantity"
                                       aria-describedby="quantityText" />
                                <div className="input-group-append">
                                    <span className="input-group-text" id="quantityText">Quantity</span>
                                </div>
                            </div>
                        </div>
                        <div className="form-group row form-group-grey">
                            <label htmlFor="finishHeight" className="col-sm-3 col-form-label">Finish height</label>
                            <div className="col-sm-9 input-group input-group-sm mb-0 no-left-padding">
                                <input type="number"
                                       className="form-control" id="finishHeight"
                                       placeholder="Finish height"
                                       aria-describedby="finishHeightText" />
                                <div className="input-group-append">
                                    <span className="input-group-text" id="finishHeightText">146,631</span>
                                </div>
                            </div>
                            <div className="col-sm-12 form-sub-title block align-right align-margin-top">
                                2018/06/19 09:32 am
                            </div>
                        </div>
                        <div className="form-group row form-group-grey mb-15">
                            <label htmlFor="asset" className="col-sm-3 col-form-label">
                                Asset
                            </label>
                            <div className="col-sm-9 mb-0 no-left-padding">
                                <input type="text"
                                       className="form-control form-control-sm" id="asset"
                                       placeholder="AssetID"/>
                            </div>
                        </div>
                        <div className="form-group row form-group-grey mb-15">
                            <label htmlFor="account" className="col-sm-3 col-form-label">Accounts (whitelist)</label>
                            <div className="col-sm-9 input-group input-group-sm mb-0 no-left-padding">
                                <input type="text"
                                       className="form-control" id="account"
                                       placeholder="Account"
                                       aria-describedby="accountIcon" />
                                <div className="input-group-append">
                                    <span className="input-group-text input-group-icon" id="accountIcon">
                                        <i className="zmdi zmdi-account" />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="form-group-grey row mb-15">
                            <div className="col-sm-9 offset-sm-3 no-left-padding">
                                <a className="no-margin btn static blue">
                                    Add account
                                </a>
                            </div>
                        </div>
                        <div className="form-group row form-group-grey mb-15">
                            <label htmlFor="numberAccounts" className="col-sm-3 col-form-label">
                                Min balance type
                            </label>
                            <div className="col-sm-9 mb-0 no-left-padding">
                                <div className="form-group-select">
                                    <select className="form-control">
                                        <option selected>No min balance necessary</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="form-group row form-group-grey">
                            <label htmlFor="referencedHash" className="col-sm-3 col-form-label">
                                Referenced transaction hash
                            </label>
                            <div className="col-sm-9 mb-0 no-left-padding">
                                <input type="text" 
                                       className="form-control form-control-sm" id="referencedHash"
                                       placeholder="Referenced transaction full hash"/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-9 offset-md-3">
                                <div className="form-check custom-checkbox mb-2">
                                    <input className="form-check-input custom-control-input" type="checkbox" value="" id="doNotBroadcast"/>
                                    <label className="form-check-label custom-control-label" htmlFor="doNotBroadcast">
                                        Do not broadcast
                                    </label>
                                </div>
                                <div className="form-check custom-checkbox">
                                    <input className="form-check-input custom-control-input" type="checkbox" value="" id="addNote"/>
                                    <label className="form-check-label custom-control-label" htmlFor="addNote">
                                        Add note to self?
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className={classNames({
                        "tab-body": true,
                        "active": this.state.activeTab === 5
                    })}
                >
                    <div className="form-tab">
                        <div className="input-group-app block offset-bottom">
                            <div className="row">
                                <div className="col-md-3">
                                    <label>Currency units </label>
                                </div>
                                <div className="col-md-9">
                                    <input type="text" />
                                </div>
                            </div>
                        </div>
                        <div className="input-group-app block offset-bottom">
                            <div className="row">
                                <div className="col-md-3">
                                    <label>Finish height</label>
                                </div>
                                <div className="col-md-9">
                                    <div className="input-wrapper">

                                        <input type="text" />
                                        <div className="form-sub-title align-right align-margin-top">
                                            2018/06/19 09:32 am
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="input-group-app block offset-bottom">
                            <div className="row">
                                <div className="col-md-3">
                                    <label>Currency</label>
                                </div>
                                <div className="col-md-9">
                                    <input type="text" />
                                </div>
                            </div>
                        </div>
                        <div className="input-group-app block offset-bottom">
                            <div className="row">
                                <div className="col-md-3">
                                    <label>Accounts (whitelist)</label>
                                </div>
                                <div className="col-md-9">
                                    <div className="input-wrapper">

                                        <input type="text" />
                                        <div className="form-sub-actions">
                                            <div className="form-group-app no-padding-bottom">
                                                <div
                                                    className="input-group-app align-middle display-block offset-bottom offset-top"
                                                >
                                                    <a
                                                        className="no-margin btn static blue"
                                                    >
                                                        Add account
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="input-group-app block offset-bottom">
                            <div className="row">
                                <div className="col-md-3">
                                    <label>Min balance type</label>
                                </div>
                                <div className="col-md-9">
                                    <input type="text" />
                                </div>
                            </div>
                        </div>
                        <div className="input-group-app block offset-bottom">
                            <div className="row">
                                <div className="col-md-3">
                                    <label>Referenced transaction hash</label>
                                </div>
                                <div className="col-md-9">
                                    <div className="input-wrapper">

                                        <input type="text" />
                                        <div className="form-sub-actions">
                                            <div className="form-group-app no-padding-bottom">
                                                <div className="input-group-app align-middle display-block offset-bottom offset-top">
                                                    <input type="checkbox"/>
                                                    <label>Do not broadcast</label>
                                                </div>
                                                <div className="input-group-app align-middle display-block offset-bottom">
                                                    <input type="checkbox"/>
                                                    <label>Add note to self?</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className={classNames({
                        "tab-body": true,
                        "active": this.state.activeTab === 6
                    })}
                >
                    <div className="form-tab">
                        <div className="input-group-app block offset-bottom">
                            <div className="row">
                                <div className="col-md-3">
                                    <label>Finish height</label>
                                </div>
                                <div className="col-md-9">
                                    <div className="input-wrapper">

                                        <input type="text" />
                                        <div className="form-sub-title align-right align-margin-top">
                                            2018/06/19 09:32 am
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="input-group-app block offset-bottom">
                            <div className="row">
                                <div className="col-md-3">
                                    <label>Approved by transaction hash</label>
                                </div>
                                <div className="col-md-9">
                                    <input type="text" />
                                </div>
                            </div>
                        </div>
                        <div className="input-group-app block offset-bottom">
                            <div className="row">
                                <div className="col-md-3">
                                    <label>Referenced transaction hash</label>
                                </div>
                                <div className="col-md-9">
                                    <div className="input-wrapper">

                                        <input type="text" />
                                        <div className="form-sub-actions">
                                            <div className="form-group-app no-padding-bottom">
                                                <div className="input-group-app align-middle display-block offset-bottom offset-top">
                                                    <input type="checkbox"/>
                                                    <label>Do not broadcast</label>
                                                </div>
                                                <div className="input-group-app align-middle display-block offset-bottom">
                                                    <input type="checkbox"/>
                                                    <label>Add note to self?</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className={classNames({
                        "tab-body": true,
                        "active": this.state.activeTab === 7
                    })}
                >
                    <div className="form-tab">
                        <div className="input-group-app block offset-bottom">
                            <div className="row">
                                <div className="col-md-3">
                                    <label>Finish height</label>
                                </div>
                                <div className="col-md-9">
                                    <div className="input-wrapper">

                                        <input type="text" />
                                        <div className="form-sub-title align-right align-margin-top">
                                            2018/06/19 09:32 am
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="input-group-app block offset-bottom">
                            <div className="row">
                                <div className="col-md-3">
                                    <label>Approved by hashed secret</label>
                                </div>
                                <div className="col-md-9">
                                    <input type="text" />
                                </div>
                            </div>
                        </div>
                        <div className="input-group-app block offset-bottom">
                            <div className="row">
                                <div className="col-md-3">
                                    <label>Hash algorithm</label>
                                </div>
                                <div className="col-md-9">
                                    <input type="text" />
                                </div>
                            </div>
                        </div>
                        <div className="input-group-app block offset-bottom">
                            <div className="row">
                                <div className="col-md-3">
                                    <label>Referenced transaction hash</label>
                                </div>
                                <div className="col-md-9">
                                    <div className="input-wrapper">

                                        <input type="text" />
                                        <div className="form-sub-actions">
                                            <div className="form-group-app no-padding-bottom">
                                                <div className="input-group-app align-middle display-block offset-bottom offset-top">
                                                    <input type="checkbox"/>
                                                    <label>Do not broadcast</label>
                                                </div>
                                                <div className="input-group-app align-middle display-block offset-bottom">
                                                    <input type="checkbox"/>
                                                    <label>Add note to self?</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AdvancedSettings;