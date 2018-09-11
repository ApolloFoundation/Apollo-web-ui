import React from 'react';
import classNames from "classnames";
import {connect} from 'react-redux';
import AccountRS from '../../components/account-rs';
import {Form, Text, TextArea, Checkbox} from 'react-form';
import {getBlockAction} from "../../../actions/blocks";

const mapDispatchToProps = dispatch => ({
    getBlockAction: (reqParams) => dispatch(getBlockAction(reqParams)),
});

class AdvancedSettings extends React.Component {
    constructor(props) {
        super(props)
    }

    state = {
        activeTab: 0,
        block: null
    };

    handleFormSubmit = (values) => {
        Object.keys(values).map((el) => {
            this.props.setValue(el, values[el]);
        });
    };

    handleTabChange = (tab) => {
        this.setState({
            ...this.props,
            activeTab: tab
        })
    };

    componentDidMount = () => {
        this.getBlock();
    };

    getBlock = async (reqParams) => {
        const block = await this.props.getBlockAction(reqParams);
        if (block) {
            this.setState({
                block: block
            })
        }
    };

    render () {
        return (
            <Form
                onSubmit={(values) => this.handleFormSubmit(values)}
                render={({
                             submitForm,setValue
                         }) => (
                    <form
                        onChange={submitForm}
                        className={classNames({
                            'form-tabulator': true,
                            'active': this.props.advancedState,
                            'white': this.props.white
                        })}
                    >
                        <div className="form-tab-nav-box form-tab-icons">
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
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Referenced transaction hash
                                    </label>
                                    <div className="col-sm-9 mb-0 no-left-padding">
                                        <Text
                                            className="form-control"
                                            field="referencedHash"
                                            placeholder="Referenced transaction full hash"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-9 offset-md-3">
                                        <div className="form-check custom-checkbox mb-15">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      field="doNotBroadcast"/>
                                            <label className="form-check-label custom-control-label">
                                                Do not broadcast
                                            </label>
                                        </div>
                                        <div className="form-check custom-checkbox">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      field="addNote"/>
                                            <label className="form-check-label custom-control-label">
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
                                    <label className="col-sm-3 col-form-label">Finish height</label>
                                    <div className="col-sm-9 input-group input-group-sm mb-0 no-left-padding">
                                        {
                                            this.state.block &&
                                            <Text
                                                type="number"
                                                className="form-control"
                                                field="finishHeight"
                                                defaultValue={this.state.block.height}
                                                placeholder="Finish height"
                                                aria-describedby="finishHeightText"/>
                                        }

                                        <div className="input-group-append">
                                            {
                                                this.state.block &&
                                                <span className="input-group-text" id="finishHeightText">{this.state.block.height}</span>
                                            }
                                        </div>
                                    </div>
                                    <div className="col-sm-12 form-sub-title block align-right align-margin-top">
                                        2018/06/19 09:32 am
                                    </div>
                                </div>
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Referenced transaction hash
                                    </label>
                                    <div className="col-sm-9 mb-0 no-left-padding">
                                        <Text
                                            className="form-control"
                                            field="referencedHash"
                                            placeholder="Referenced transaction full hash"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-9 offset-md-3">
                                        <div className="form-check custom-checkbox mb-15">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      field="doNotBroadcast"/>
                                            <label className="form-check-label custom-control-label" >
                                                Do not broadcast
                                            </label>
                                        </div>
                                        <div className="form-check custom-checkbox">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      field="addNote"/>
                                            <label className="form-check-label custom-control-label">
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
                                    <label className="col-sm-3 col-form-label">
                                        Number of accounts
                                    </label>
                                    <div className="col-sm-9 mb-0 no-left-padding">
                                        <Text
                                            type="number"
                                            className="form-control"
                                            field="numberAccounts"
                                            placeholder="Number of accounts"/>
                                    </div>
                                </div>
                                <div className="form-group row form-group-grey">
                                    <label className="col-sm-3 col-form-label">Finish height</label>
                                    <div className="col-sm-9 input-group input-group-sm mb-0 no-left-padding">
                                        <Text
                                            type="number"
                                            className="form-control"
                                            field="finishHeight"
                                            placeholder="Finish height"
                                            aria-describedby="finishHeightText"/>
                                        <div className="input-group-append">
                                            {
                                                this.state.block &&
                                                <span className="input-group-text">{this.state.block.height}</span>
                                            }
                                        </div>
                                    </div>
                                    <div className="col-sm-12 form-sub-title block align-right align-margin-top">
                                        2018/06/19 09:32 am
                                    </div>
                                </div>
                                <div className="input-group-app form-group mb-15 display-block inline user">
                                    <div className="row form-group-grey">
                                        <label className="col-sm-3 col-form-label">
                                            Accounts (whitelist)
                                        </label>
                                        <div className="col-sm-9 no-left-padding">
                                            <div className="iconned-input-field">
                                                <AccountRS
                                                    value={''}
                                                    field={'account'}
                                                    setValue={setValue}
                                                />
                                            </div>
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
                                    <label className="col-sm-3 col-form-label">
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
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Referenced transaction hash
                                    </label>
                                    <div className="col-sm-9 mb-0 no-left-padding">
                                        <Text
                                            className="form-control"
                                            field="referencedHash"
                                            placeholder="Referenced transaction full hash"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-9 offset-md-3">
                                        <div className="form-check custom-checkbox mb-15">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      field="doNotBroadcast"/>
                                            <label className="form-check-label custom-control-label">
                                                Do not broadcast
                                            </label>
                                        </div>
                                        <div className="form-check custom-checkbox">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      field="addNote"/>
                                            <label className="form-check-label custom-control-label">
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
                                    <label className="col-sm-3 col-form-label">
                                        Amount
                                    </label>
                                    <div className="col-sm-9 input-group input-group-text-transparent input-group-sm mb-0 no-left-padding">
                                        <Text
                                            type="text"
                                            className="form-control"
                                            field="account"
                                            placeholder="Account"
                                            aria-describedby="amountText"/>
                                        <div className="input-group-append">
                                            <span className="input-group-text">APL</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row form-group-grey">
                                    <label className="col-sm-3 col-form-label">Finish height</label>
                                    <div className="col-sm-9 input-group input-group-sm mb-0 no-left-padding">
                                        <Text
                                            type="number"
                                            className="form-control"
                                            field="finishHeight"
                                            placeholder="Finish height"
                                            aria-describedby="finishHeightText"/>
                                        <div className="input-group-append">
                                            {
                                                this.state.block &&
                                                <span className="input-group-text" id="finishHeightText">{this.state.block.height}</span>
                                            }
                                        </div>
                                    </div>
                                    <div className="col-sm-12 form-sub-title block align-right align-margin-top">
                                        2018/06/19 09:32 am
                                    </div>
                                </div>
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">Accounts (whitelist)</label>
                                    <div className="col-sm-9 input-group input-group-sm mb-0 no-left-padding">
                                        <Text
                                            type="text"
                                            className="form-control"
                                            field="account"
                                            placeholder="Account"
                                            aria-describedby="accountIcon"/>
                                        <div className="input-group-append">
                                            <span className="input-group-text input-group-icon">
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
                                    <label className="col-sm-3 col-form-label">
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
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Referenced transaction hash
                                    </label>
                                    <div className="col-sm-9 mb-0 no-left-padding">
                                        <Text
                                            className="form-control"
                                            field="referencedHash"
                                            placeholder="Referenced transaction full hash"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-9 offset-md-3">
                                        <div className="form-check custom-checkbox mb-15">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      field="doNotBroadcast"/>
                                            <label className="form-check-label custom-control-label">
                                                Do not broadcast
                                            </label>
                                        </div>
                                        <div className="form-check custom-checkbox">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      field="addNote"/>
                                            <label className="form-check-label custom-control-label">
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
                                    <label className="col-sm-3 col-form-label">
                                        Asset quantity
                                    </label>
                                    <div className="col-sm-9 input-group input-group-text-transparent input-group-sm mb-0 no-left-padding">
                                        <Text
                                            type="text"
                                            className="form-control"
                                            field="quantity"
                                            placeholder="Asset quantity"
                                            aria-describedby="quantityText" />
                                        <div className="input-group-append">
                                            {
                                                this.state.block &&
                                                <span className="input-group-text" >{this.state.block.height}</span>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row form-group-grey">
                                    <label className="col-sm-3 col-form-label">Finish height</label>
                                    <div className="col-sm-9 input-group input-group-sm mb-0 no-left-padding">
                                        <Text
                                            type="number"
                                            className="form-control"
                                            field="finishHeight"
                                            placeholder="Finish height"
                                            aria-describedby="finishHeightText"/>
                                        <div className="input-group-append">
                                            {
                                                this.state.block &&
                                                <span className="input-group-text">{this.state.block.height}</span>
                                            }
                                        </div>
                                    </div>
                                    <div className="col-sm-12 form-sub-title block align-right align-margin-top">
                                        2018/06/19 09:32 am
                                    </div>
                                </div>
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Asset
                                    </label>
                                    <div className="col-sm-9 mb-0 no-left-padding">
                                        <Text
                                            type="text"
                                            className="form-control"
                                            field="asset"
                                            placeholder="AssetID"/>
                                    </div>
                                </div>
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">Accounts (whitelist)</label>
                                    <div className="col-sm-9 input-group input-group-sm mb-0 no-left-padding">
                                        <Text
                                            type="text"
                                            className="form-control"
                                            field="account"
                                            placeholder="Account"
                                            aria-describedby="accountIcon"/>
                                        <div className="input-group-append">
                                            <span className="input-group-text input-group-icon">
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
                                    <label className="col-sm-3 col-form-label">
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
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Referenced transaction hash
                                    </label>
                                    <div className="col-sm-9 mb-0 no-left-padding">
                                        <Text
                                            className="form-control"
                                            field="referencedHash"
                                            placeholder="Referenced transaction full hash"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-9 offset-md-3">
                                        <div className="form-check custom-checkbox mb-15">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      field="doNotBroadcast"/>
                                            <label className="form-check-label custom-control-label">
                                                Do not broadcast
                                            </label>
                                        </div>
                                        <div className="form-check custom-checkbox">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      field="addNote"/>
                                            <label className="form-check-label custom-control-label">
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
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Currency units
                                    </label>
                                    <div className="col-sm-9 input-group input-group-text-transparent input-group-sm mb-0 no-left-padding">
                                        <Text
                                            type="text"
                                            className="form-control"
                                            field="units"
                                            placeholder="Currency units"
                                            aria-describedby="unitsText"/>
                                        <div className="input-group-append">
                                            <span className="input-group-text">Units</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row form-group-grey">
                                    <label className="col-sm-3 col-form-label">Finish height</label>
                                    <div className="col-sm-9 input-group input-group-sm mb-0 no-left-padding">
                                        <Text
                                            type="number"
                                            className="form-control"
                                            field="finishHeight"
                                            placeholder="Finish height"
                                            aria-describedby="finishHeightText"/>
                                        <div className="input-group-append">
                                            {
                                                this.state.block &&
                                                <span className="input-group-text" id="finishHeightText">{this.state.block.height}</span>
                                            }
                                        </div>
                                    </div>
                                    <div className="col-sm-12 form-sub-title block align-right align-margin-top">
                                        2018/06/19 09:32 am
                                    </div>
                                </div>
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Currency
                                    </label>
                                    <div className="col-sm-9 input-group input-group-double input-group-sm mb-0 no-left-padding">
                                        <Text
                                            type="text"
                                            className="form-control"
                                            field="currency"
                                            placeholder="Code"/>
                                        <div className="input-group-append">
                                            <Text
                                                type="text"
                                                className="form-control input-group-text"
                                                field="ID"
                                                placeholder="ID: - "/>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">Accounts (whitelist)</label>
                                    <div className="col-sm-9 input-group input-group-sm mb-0 no-left-padding">
                                        <Text
                                            type="text"
                                            className="form-control"
                                            field="account"
                                            placeholder="Account"
                                            aria-describedby="accountIcon" />
                                        <div className="input-group-append">
                                            <span className="input-group-text input-group-icon" >
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
                                    <label className="col-sm-3 col-form-label">
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
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Referenced transaction hash
                                    </label>
                                    <div className="col-sm-9 mb-0 no-left-padding">
                                        <Text
                                            className="form-control"
                                            field="referencedHash"
                                            placeholder="Referenced transaction full hash"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-9 offset-md-3">
                                        <div className="form-check custom-checkbox mb-15">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      field="doNotBroadcast"/>
                                            <label className="form-check-label custom-control-label">
                                                Do not broadcast
                                            </label>
                                        </div>
                                        <div className="form-check custom-checkbox">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      field="addNote"/>
                                            <label className="form-check-label custom-control-label">
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
                                "active": this.state.activeTab === 6
                            })}
                        >
                            <div className="form-tab">
                                <div className="form-group row form-group-grey">
                                    <label className="col-sm-3 col-form-label">Finish height</label>
                                    <div className="col-sm-9 input-group input-group-sm mb-0 no-left-padding">
                                        <Text
                                            type="number"
                                            className="form-control"
                                            field="finishHeight"
                                            placeholder="Finish height"
                                            aria-describedby="finishHeightText"/>
                                        <div className="input-group-append">
                                        </div>
                                            {
                                                this.state.block &&
                                                <span className="input-group-text" id="finishHeightText">{this.state.block.height}</span>
                                            }
                                    </div>
                                    <div className="col-sm-12 form-sub-title block align-right align-margin-top">
                                        2018/06/19 09:32 am
                                    </div>
                                </div>
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Approved by transaction hash
                                    </label>
                                    <div className="col-sm-9 mb-0 no-left-padding">
                                        <Text
                                            className="form-control"
                                            field="approveHash"
                                            placeholder="Full hash of transaction"/>
                                    </div>
                                </div>
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Referenced transaction hash
                                    </label>
                                    <div className="col-sm-9 mb-0 no-left-padding">
                                        <Text
                                            className="form-control"
                                            field="referencedHash"
                                            placeholder="Referenced transaction full hash"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-9 offset-md-3">
                                        <div className="form-check custom-checkbox mb-15">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      field="doNotBroadcast"/>
                                            <label className="form-check-label custom-control-label">
                                                Do not broadcast
                                            </label>
                                        </div>
                                        <div className="form-check custom-checkbox">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      field="addNote"/>
                                            <label className="form-check-label custom-control-label">
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
                                "active": this.state.activeTab === 7
                            })}
                        >
                            <div className="form-tab">
                                <div className="form-group row form-group-grey">
                                    <label className="col-sm-3 col-form-label">Finish height</label>
                                    <div className="col-sm-9 input-group input-group-sm mb-0 no-left-padding">
                                        <Text
                                            type="number"
                                            className="form-control"
                                            field="finishHeight"
                                            placeholder="Finish height"
                                            aria-describedby="finishHeightText"/>
                                        <div className="input-group-append">
                                            {
                                                this.state.block &&
                                                <span className="input-group-text" id="finishHeightText">{this.state.block.height}</span>
                                            }
                                        </div>
                                    </div>
                                    <div className="col-sm-12 form-sub-title block align-right align-margin-top">
                                        2018/06/19 09:32 am
                                    </div>
                                </div>
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Approved by hash secret
                                    </label>
                                    <div className="col-sm-9 mb-0 no-left-padding">
                                        <Text
                                            className="form-control"
                                            field="hashSecret"
                                            placeholder="Hash of secret"/>
                                    </div>
                                </div>
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Hash algorithm
                                    </label>
                                    <div className="col-sm-9 mb-0 no-left-padding">
                                        <div className="form-group-select">
                                            <select className="form-control">
                                                <option selected>SHA256</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Referenced transaction hash
                                    </label>
                                    <div className="col-sm-9 mb-0 no-left-padding">
                                        <Text
                                            className="form-control"
                                            field="referencedHash"
                                            placeholder="Referenced transaction full hash"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-9 offset-md-3">
                                        <div className="form-check custom-checkbox mb-15">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      field="doNotBroadcast"/>
                                            <label className="form-check-label custom-control-label">
                                                Do not broadcast
                                            </label>
                                        </div>
                                        <div className="form-check custom-checkbox">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      field="addNote"/>
                                            <label className="form-check-label custom-control-label">
                                                Add note to self?
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            />

        );
    }
}

export default connect(null, mapDispatchToProps)(AdvancedSettings);