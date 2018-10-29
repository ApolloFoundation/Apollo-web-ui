/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import classNames from "classnames";
import {connect} from 'react-redux';
import AccountRS from '../../components/account-rs';
import InputForm from '../../components/input-form';
import CustomSelect from '../../components/select';
import {Form, Text, TextArea, Checkbox} from 'react-form';
import {getBlockAction} from "../../../actions/blocks";
import {getCurrencyAction} from "../../../actions/currencies";

const minBalanceType = [
    { value: '0', label: 'No min balance necessary' },
    { value: '1', label: 'Account Balance' },
    { value: '2', label: 'Asset Balance' },
    { value: '3', label: 'Currency Balance' }
];
const hashAlgorithm = [
    { value: '2', label: 'SHA256' },
    { value: '6', label: 'RIPEMD160' },
    { value: '62', label: 'RIPEMD160_SHA256' }
];

const mapDispatchToProps = dispatch => ({
    getBlockAction: (reqParams) => dispatch(getBlockAction(reqParams)),
    getCurrencyAction: (requestParams) => dispatch(getCurrencyAction(requestParams))
});

class AdvancedSettings extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        activeTab: 0,
        currency: '-',
        block: null,
        accounts: {
            5: [
                ''
            ],
            2: [
                ''
            ],
            3: [
                ''
            ],
            4: [
                ''
            ]
        }
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

    getCurrency = async (reqParams) => {
        const result = await this.props.getCurrencyAction(reqParams);

        if (result) {
            this.setState({ currency: result.currency });
        } else {
            this.setState({ currency: '-' });
        }
    };

    handleNotBroadcast = (value) => {
        if (value === false) {
            this.props.setValue('doNotSign', false);
        }
    };

    handleAddNote = (value) => {
        if (value === false) {
            this.props.setValue('note_to_self', '');
        }
    };

    addAccount = (tabIndex) => {
        this.setState({
            accounts: {
                ...this.state.accounts,
                [tabIndex] : [...this.state.accounts[tabIndex], '']
            }
        })
    };

    setListValue = (i, j, setValue) => {
        return (value) => {

            let list = this.state.accounts[i];

            list[j] = value;

            this.setState({
                accounts: {
                    ...this.state.accounts,
                    [i]: list
                }
            }, () => {
                if (setValue) {
                    setValue('phasingWhitelisted', list)
                }
            })
        }
    };

    render () {
        const setValue = this.props.setValue;
        return (
                    <div
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
                                    <div className="col-sm-9 mb-0">
                                        <InputForm
                                            field="referencedTransactionFullHash"
                                            placeholder="Referenced transaction full hash"
                                            setValue={setValue}/>
                                    </div>
                                </div>
                                <div className="row form-group-grey">
                                    <div className="col-md-9 offset-md-3">
                                        <div className="form-check custom-checkbox mb-15">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      onChange={this.handleNotBroadcast}
                                                      field="doNotBroadcast"/>
                                            <label className="form-check-label custom-control-label">
                                                Do not broadcast
                                            </label>
                                        </div>
                                        {this.props.getFormState().values.doNotBroadcast &&
                                            <div className="form-check custom-checkbox mb-15">
                                                <Checkbox className="form-check-input custom-control-input"
                                                          type="checkbox"
                                                          field="doNotSign"/>
                                                <label className="form-check-label custom-control-label">
                                                    Do not sign
                                                </label>
                                            </div>
                                        }
                                        <div className="form-check custom-checkbox mb-15">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      onChange={this.handleAddNote}
                                                      field="add_note_to_self"/>
                                            <label className="form-check-label custom-control-label">
                                                Add note to self?
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                {this.props.getFormState().values.add_note_to_self &&
                                    <div className="form-group row form-group-grey mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Note to self
                                        </label>
                                        <div className="col-sm-9 mb-0">
                                            <TextArea className="form-control" field="note_to_self" cols="30" rows="3"/>
                                        </div>
                                        <div className="col-sm-9 offset-sm-3 form-sub-title align-margin-top">
                                            This note is encrypted
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                        <div
                            className={classNames({
                                "tab-body": true,
                                "active": this.state.activeTab === 1
                            })}
                        >
                            <div className="form-tab">
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">Finish height</label>
                                    <div className="col-sm-9 input-group input-group-sm mb-0">
                                        {
                                            this.state.block &&
                                            <InputForm
                                                type="number"
                                                field="phasingFinishHeight"
                                                defaultValue={this.state.block.height}
                                                placeholder="Finish height"
                                                setValue={setValue}/>
                                        }

                                        <div className="input-group-append">
                                            {
                                                this.state.block &&
                                                <span className="input-group-text">{this.state.block.height}</span>
                                            }
                                        </div>
                                    </div>
                                    {/*<div className="col-sm-12 form-sub-title block align-right align-margin-top">
                                        2018/06/19 09:32 am
                                    </div>*/}
                                </div>
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Referenced transaction hash
                                    </label>
                                    <div className="col-sm-9 mb-0">
                                        <InputForm
                                            field="referencedTransactionFullHash"
                                            placeholder="Referenced transaction full hash"
                                            minLength={64}
                                            setValue={setValue}/>
                                    </div>
                                </div>
                                <div className="row form-group-grey">
                                    <div className="col-md-9 offset-md-3">
                                        <div className="form-check custom-checkbox mb-15">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      onChange={this.handleNotBroadcast}
                                                      field="doNotBroadcast"/>
                                            <label className="form-check-label custom-control-label">
                                                Do not broadcast
                                            </label>
                                        </div>
                                        {this.props.getFormState().values.doNotBroadcast &&
                                        <div className="form-check custom-checkbox mb-15">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      field="doNotSign"/>
                                            <label className="form-check-label custom-control-label">
                                                Do not sign
                                            </label>
                                        </div>
                                        }
                                        <div className="form-check custom-checkbox mb-15">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      field="add_note_to_self"/>
                                            <label className="form-check-label custom-control-label">
                                                Add note to self?
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                {this.props.getFormState().values.add_note_to_self &&
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Note to self
                                    </label>
                                    <div className="col-sm-9 mb-0">
                                        <TextArea className="form-control" field="note_to_self" cols="30" rows="3"/>
                                    </div>
                                    <div className="col-sm-9 offset-sm-3 form-sub-title align-margin-top">
                                        This note is encrypted
                                    </div>
                                </div>
                                }
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
                                    <div className="col-sm-9 mb-0">
                                        <InputForm
                                            type="number"
                                            field="phasingQuorum"
                                            placeholder="Number of accounts"
                                            setValue={setValue}/>
                                    </div>
                                </div>
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">Finish height</label>
                                    <div className="col-sm-9 input-group input-group-sm mb-0">
                                        {
                                            this.state.block &&
                                            <InputForm
                                                type="number"
                                                field="phasingFinishHeight"
                                                defaultValue={this.state.block.height}
                                                placeholder="Finish height"
                                                setValue={setValue}/>
                                        }
                                        <div className="input-group-append">
                                            {
                                                this.state.block &&
                                                <span className="input-group-text">{this.state.block.height}</span>
                                            }
                                        </div>
                                    </div>
                                    {/*<div className="col-sm-12 form-sub-title block align-right align-margin-top">
                                        2018/06/19 09:32 am
                                    </div>*/}
                                </div>
                                {
                                    this.state.accounts[2] &&
                                    this.state.accounts[2].map((el, index) => {
                                        return (
                                            <div className="input-group-app form-group mb-15 display-block inline user">
                                                <div className="row form-group-grey">
                                                    <label className="col-sm-3 col-form-label">
                                                        Accounts (whitelist)
                                                    </label>
                                                    <div className="col-sm-9">
                                                        <div className="iconned-input-field">
                                                            <AccountRS
                                                                value={''}
                                                                field={'phasingWhitelisted'}
                                                                setValue={setValue}
                                                                exportAccountList={this.setListValue(2, index)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                                <div className="form-group-grey row mb-15">
                                    <div className="col-sm-9 offset-sm-3">
                                        <a
                                            onClick={() => this.addAccount(2)}
                                            className="no-margin btn static blue"
                                        >
                                            Add account
                                        </a>
                                    </div>
                                </div>
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Min balance type
                                    </label>
                                    <div className="col-sm-9 mb-0">
                                        <div className="form-group-select">
                                            <CustomSelect
                                                className="form-control"
                                                field={'phasingMinBalanceModel'}
                                                defaultValue={minBalanceType[0]}
                                                setValue={setValue}
                                                options={minBalanceType}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Referenced transaction hash
                                    </label>
                                    <div className="col-sm-9 mb-0">
                                        <InputForm
                                            field="referencedTransactionFullHash"
                                            placeholder="Referenced transaction full hash"
                                            minLength={64}
                                            setValue={setValue}/>
                                    </div>
                                </div>
                                <div className="row form-group-grey">
                                    <div className="col-md-9 offset-md-3">
                                        <div className="form-check custom-checkbox mb-15">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      onChange={this.handleNotBroadcast}
                                                      field="doNotBroadcast"/>
                                            <label className="form-check-label custom-control-label">
                                                Do not broadcast
                                            </label>
                                        </div>
                                        {this.props.getFormState().values.doNotBroadcast &&
                                        <div className="form-check custom-checkbox mb-15">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      field="doNotSign"/>
                                            <label className="form-check-label custom-control-label">
                                                Do not sign
                                            </label>
                                        </div>
                                        }
                                        <div className="form-check custom-checkbox mb-15">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      field="add_note_to_self"/>
                                            <label className="form-check-label custom-control-label">
                                                Add note to self?
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                {this.props.getFormState().values.add_note_to_self &&
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Note to self
                                    </label>
                                    <div className="col-sm-9 mb-0">
                                        <TextArea className="form-control" field="note_to_self" cols="30" rows="3"/>
                                    </div>
                                    <div className="col-sm-9 offset-sm-3 form-sub-title align-margin-top">
                                        This note is encrypted
                                    </div>
                                </div>
                                }
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
                                    <div
                                        className="col-sm-9 input-group input-group-text-transparent input-group-sm mb-0">
                                        <InputForm
                                            type="number"
                                            field="phasingQuorumAPL"
                                            placeholder="Amount"
                                            setValue={setValue}/>
                                        <div className="input-group-append">
                                            <span className="input-group-text">APL</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">Finish height</label>
                                    <div className="col-sm-9 input-group input-group-sm mb-0">
                                        {
                                            this.state.block &&
                                            <InputForm
                                                type="number"
                                                field="phasingFinishHeight"
                                                defaultValue={this.state.block.height}
                                                placeholder="Finish height"
                                                setValue={setValue}/>
                                        }
                                        <div className="input-group-append">
                                            {
                                                this.state.block &&
                                                <span className="input-group-text">{this.state.block.height}</span>
                                            }
                                        </div>
                                    </div>
                                    {/*<div className="col-sm-12 form-sub-title block align-right align-margin-top">
                                        2018/06/19 09:32 am
                                    </div>*/}
                                </div>
                                {
                                    this.state.accounts[3] &&
                                    this.state.accounts[3].map((el, index) => {
                                        return (
                                            <div className="input-group-app form-group mb-15 display-block inline user">
                                                <div className="row form-group-grey">
                                                    <label className="col-sm-3 col-form-label">
                                                        Accounts (whitelist)
                                                    </label>
                                                    <div className="col-sm-9">
                                                        <div className="iconned-input-field">
                                                            <AccountRS
                                                                value={''}
                                                                field={'phasingWhitelisted'}
                                                                setValue={setValue}
                                                                exportAccountList={this.setListValue(3, index, this.props.setValue)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                                <div className="form-group-grey row mb-15">
                                    <div className="col-sm-9 offset-sm-3">
                                        <a
                                            onClick={() => this.addAccount(3)}
                                            className="no-margin btn static blue"
                                        >
                                            Add account
                                        </a>
                                    </div>
                                </div>
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Min balance type
                                    </label>
                                    <div className="col-sm-9 mb-0">
                                        <div className="form-group-select">
                                            <CustomSelect
                                                className="form-control"
                                                field={'phasingMinBalanceModel'}
                                                defaultValue={minBalanceType[0]}
                                                setValue={setValue}
                                                options={minBalanceType}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Referenced transaction hash
                                    </label>
                                    <div className="col-sm-9 mb-0">
                                        <InputForm
                                            field="referencedTransactionFullHash"
                                            placeholder="Referenced transaction full hash"
                                            minLength={64}
                                            setValue={setValue}/>
                                    </div>
                                </div>
                                <div className="row form-group-grey">
                                    <div className="col-md-9 offset-md-3">
                                        <div className="form-check custom-checkbox mb-15">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      onChange={this.handleNotBroadcast}
                                                      field="doNotBroadcast"/>
                                            <label className="form-check-label custom-control-label">
                                                Do not broadcast
                                            </label>
                                        </div>
                                        {this.props.getFormState().values.doNotBroadcast &&
                                        <div className="form-check custom-checkbox mb-15">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      field="doNotSign"/>
                                            <label className="form-check-label custom-control-label">
                                                Do not sign
                                            </label>
                                        </div>
                                        }
                                        <div className="form-check custom-checkbox mb-15">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      field="add_note_to_self"/>
                                            <label className="form-check-label custom-control-label">
                                                Add note to self?
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                {this.props.getFormState().values.add_note_to_self &&
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Note to self
                                    </label>
                                    <div className="col-sm-9 mb-0">
                                        <TextArea className="form-control" field="note_to_self" cols="30" rows="3"/>
                                    </div>
                                    <div className="col-sm-9 offset-sm-3 form-sub-title align-margin-top">
                                        This note is encrypted
                                    </div>
                                </div>
                                }
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
                                    <div
                                        className="col-sm-9 input-group input-group-text-transparent input-group-sm mb-0">
                                        <InputForm
                                            field="phasingQuorumATUf"
                                            placeholder="Asset quantity"
                                            setValue={setValue}/>
                                        <div className="input-group-append">
                                            {
                                                this.state.block &&
                                                <span className="input-group-text">{this.state.block.height}</span>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">Finish height</label>
                                    <div className="col-sm-9 input-group input-group-sm mb-0">
                                        {
                                            this.state.block &&
                                            <InputForm
                                                type="number"
                                                field="phasingFinishHeight"
                                                defaultValue={this.state.block.height}
                                                placeholder="Finish height"
                                                setValue={setValue}/>
                                        }
                                        <div className="input-group-append">
                                            {
                                                this.state.block &&
                                                <span className="input-group-text">{this.state.block.height}</span>
                                            }
                                        </div>
                                    </div>
                                    {/*<div className="col-sm-12 form-sub-title block align-right align-margin-top">
                                        2018/06/19 09:32 am
                                    </div>*/}
                                </div>
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Asset
                                    </label>
                                    <div className="col-sm-9 mb-0">
                                        <InputForm
                                            field="phasingHolding"
                                            placeholder="AssetID"
                                            setValue={setValue}/>
                                    </div>
                                </div>
                                {
                                    this.state.accounts[4] &&
                                    this.state.accounts[4].map((el, index) => {
                                        return (
                                            <div className="input-group-app form-group mb-15 display-block inline user">
                                                <div className="row form-group-grey">
                                                    <label className="col-sm-3 col-form-label">
                                                        Accounts (whitelist)
                                                    </label>
                                                    <div className="col-sm-9">
                                                        <div className="iconned-input-field">
                                                            <AccountRS
                                                                value={''}
                                                                field={'phasingWhitelisted'}
                                                                setValue={setValue}
                                                                exportAccountList={this.setListValue(4, index)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                                <div className="form-group-grey row mb-15">
                                    <div className="col-sm-9 offset-sm-3">
                                        <a
                                            onClick={() => this.addAccount(4)}
                                            className="no-margin btn static blue"
                                        >
                                            Add account
                                        </a>
                                    </div>
                                </div>
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Min balance type
                                    </label>
                                    <div className="col-sm-9 mb-0">
                                        <div className="form-group-select">
                                            <CustomSelect
                                                className="form-control"
                                                field={'phasingMinBalanceModel'}
                                                defaultValue={minBalanceType[0]}
                                                setValue={setValue}
                                                options={minBalanceType}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Referenced transaction hash
                                    </label>
                                    <div className="col-sm-9 mb-0">
                                        <InputForm
                                            field="referencedTransactionFullHash"
                                            placeholder="Referenced transaction full hash"
                                            minLength={64}
                                            setValue={setValue}/>
                                    </div>
                                </div>
                                <div className="row form-group-grey">
                                    <div className="col-md-9 offset-md-3">
                                        <div className="form-check custom-checkbox mb-15">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      onChange={this.handleNotBroadcast}
                                                      field="doNotBroadcast"/>
                                            <label className="form-check-label custom-control-label">
                                                Do not broadcast
                                            </label>
                                        </div>
                                        {this.props.getFormState().values.doNotBroadcast &&
                                        <div className="form-check custom-checkbox mb-15">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      field="doNotSign"/>
                                            <label className="form-check-label custom-control-label">
                                                Do not sign
                                            </label>
                                        </div>
                                        }
                                        <div className="form-check custom-checkbox mb-15">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      field="add_note_to_self"/>
                                            <label className="form-check-label custom-control-label">
                                                Add note to self?
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                {this.props.getFormState().values.add_note_to_self &&
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Note to self
                                    </label>
                                    <div className="col-sm-9 mb-0">
                                        <TextArea className="form-control" field="note_to_self" cols="30" rows="3"/>
                                    </div>
                                    <div className="col-sm-9 offset-sm-3 form-sub-title align-margin-top">
                                        This note is encrypted
                                    </div>
                                </div>
                                }
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
                                    <div
                                        className="col-sm-9 input-group input-group-text-transparent input-group-sm mb-0">
                                        <InputForm
                                            field="phasingQuorumATUf"
                                            placeholder="Currency units"
                                            setValue={setValue}/>
                                        <div className="input-group-append">
                                            <span className="input-group-text">Units</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">Finish height</label>
                                    <div className="col-sm-9 input-group input-group-sm mb-0">
                                        {
                                            this.state.block &&
                                            <InputForm
                                                type="number"
                                                field="phasingFinishHeight"
                                                defaultValue={this.state.block.height}
                                                placeholder="Finish height"
                                                setValue={setValue}/>
                                        }
                                        <div className="input-group-append">
                                            {
                                                this.state.block &&
                                                <span className="input-group-text">{this.state.block.height}</span>
                                            }
                                        </div>
                                    </div>
                                    {/*<div className="col-sm-12 form-sub-title block align-right align-margin-top">
                                        2018/06/19 09:32 am
                                    </div>*/}
                                </div>
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Currency
                                    </label>
                                    <div className="col-sm-9 input-group input-group-double input-group-text-transparent input-group-sm mb-0">
                                        <InputForm
                                            field="phasingHoldingCurrencyCode"
                                            placeholder="Code"
                                            onChange={(code) => this.getCurrency({code})}
                                            setValue={setValue}/>
                                        <div className="input-group-append">
                                            <span className="input-group-text">ID: {this.state.currency}</span>
                                        </div>
                                    </div>
                                </div>
                                {
                                    this.state.accounts[5] &&
                                    this.state.accounts[5].map((el, index) => {
                                        return (
                                            <div className="input-group-app form-group mb-15 display-block inline user">
                                                <div className="row form-group-grey">
                                                    <label className="col-sm-3 col-form-label">
                                                        Accounts (whitelist)
                                                    </label>
                                                    <div className="col-sm-9">
                                                        <div className="iconned-input-field">
                                                            <AccountRS
                                                                value={''}
                                                                field={'phasingWhitelisted'}
                                                                setValue={setValue}
                                                                exportAccountList={this.setListValue(5, index)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                                <div className="form-group-grey row mb-15">
                                    <div className="col-sm-9 offset-sm-3">
                                        <a
                                            onClick={() => this.addAccount(5)}
                                            className="no-margin btn static blue"
                                        >
                                            Add account
                                        </a>
                                    </div>
                                </div>
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Min balance type
                                    </label>
                                    <div className="col-sm-9 mb-0">
                                        <div className="form-group-select">
                                            <CustomSelect
                                                className="form-control"
                                                field={'phasingMinBalanceModel'}
                                                defaultValue={minBalanceType[0]}
                                                setValue={setValue}
                                                options={minBalanceType}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Referenced transaction hash
                                    </label>
                                    <div className="col-sm-9 mb-0">
                                        <InputForm
                                            field="referencedTransactionFullHash"
                                            placeholder="Referenced transaction full hash"
                                            minLength={64}
                                            setValue={setValue}/>
                                    </div>
                                </div>
                                <div className="row form-group-grey">
                                    <div className="col-md-9 offset-md-3">
                                        <div className="form-check custom-checkbox mb-15">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      onChange={this.handleNotBroadcast}
                                                      field="doNotBroadcast"/>
                                            <label className="form-check-label custom-control-label">
                                                Do not broadcast
                                            </label>
                                        </div>
                                        {this.props.getFormState().values.doNotBroadcast &&
                                        <div className="form-check custom-checkbox mb-15">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      field="doNotSign"/>
                                            <label className="form-check-label custom-control-label">
                                                Do not sign
                                            </label>
                                        </div>
                                        }
                                        <div className="form-check custom-checkbox mb-15">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      field="add_note_to_self"/>
                                            <label className="form-check-label custom-control-label">
                                                Add note to self?
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                {this.props.getFormState().values.add_note_to_self &&
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Note to self
                                    </label>
                                    <div className="col-sm-9 mb-0">
                                        <TextArea className="form-control" field="note_to_self" cols="30" rows="3"/>
                                    </div>
                                    <div className="col-sm-9 offset-sm-3 form-sub-title align-margin-top">
                                        This note is encrypted
                                    </div>
                                </div>
                                }
                            </div>
                        </div>
                        <div
                            className={classNames({
                                "tab-body": true,
                                "active": this.state.activeTab === 6
                            })}
                        >
                            <div className="form-tab">
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">Finish height</label>
                                    <div className="col-sm-9 input-group input-group-sm mb-0">
                                        {
                                            this.state.block &&
                                            <InputForm
                                                type="number"
                                                field="phasingFinishHeight"
                                                defaultValue={this.state.block.height}
                                                placeholder="Finish height"
                                                setValue={setValue}/>
                                        }
                                        <div className="input-group-append">
                                        </div>
                                        {
                                            this.state.block &&
                                            <span className="input-group-text">{this.state.block.height}</span>
                                        }
                                    </div>
                                    {/*<div className="col-sm-12 form-sub-title block align-right align-margin-top">
                                        2018/06/19 09:32 am
                                    </div>*/}
                                </div>
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Approved by transaction hash
                                    </label>
                                    <div className="col-sm-9 mb-0">
                                        <InputForm
                                            field="phasingLinkedFullHash"
                                            placeholder="Full hash of transaction"
                                            setValue={setValue}/>
                                    </div>
                                </div>
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Referenced transaction hash
                                    </label>
                                    <div className="col-sm-9 mb-0">
                                        <InputForm
                                            field="referencedTransactionFullHash"
                                            placeholder="Referenced transaction full hash"
                                            minLength={64}
                                            setValue={setValue}/>
                                    </div>
                                </div>
                                <div className="row form-group-grey">
                                    <div className="col-md-9 offset-md-3">
                                        <div className="form-check custom-checkbox mb-15">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      onChange={this.handleNotBroadcast}
                                                      field="doNotBroadcast"/>
                                            <label className="form-check-label custom-control-label">
                                                Do not broadcast
                                            </label>
                                        </div>
                                        {this.props.getFormState().values.doNotBroadcast &&
                                        <div className="form-check custom-checkbox mb-15">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      field="doNotSign"/>
                                            <label className="form-check-label custom-control-label">
                                                Do not sign
                                            </label>
                                        </div>
                                        }
                                        <div className="form-check custom-checkbox mb-15">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      field="add_note_to_self"/>
                                            <label className="form-check-label custom-control-label">
                                                Add note to self?
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                {this.props.getFormState().values.add_note_to_self &&
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Note to self
                                    </label>
                                    <div className="col-sm-9 mb-0">
                                        <TextArea className="form-control" field="note_to_self" cols="30" rows="3"/>
                                    </div>
                                    <div className="col-sm-9 offset-sm-3 form-sub-title align-margin-top">
                                        This note is encrypted
                                    </div>
                                </div>
                                }
                            </div>
                        </div>
                        <div
                            className={classNames({
                                "tab-body": true,
                                "active": this.state.activeTab === 7
                            })}
                        >
                            <div className="form-tab">
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">Finish height</label>
                                    <div className="col-sm-9 input-group input-group-sm mb-0">
                                        {
                                            this.state.block &&
                                            <InputForm
                                                type="number"
                                                field="phasingFinishHeight"
                                                defaultValue={this.state.block.height}
                                                placeholder="Finish height"
                                                setValue={setValue}/>
                                        }
                                        <div className="input-group-append">
                                            {
                                                this.state.block &&
                                                <span className="input-group-text">{this.state.block.height}</span>
                                            }
                                        </div>
                                    </div>
                                    {/*<div className="col-sm-12 form-sub-title block align-right align-margin-top">
                                        2018/06/19 09:32 am
                                    </div>*/}
                                </div>
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Approved by hash secret
                                    </label>
                                    <div className="col-sm-9 mb-0">
                                        <InputForm
                                            field="phasingHashedSecret"
                                            placeholder="Hash of secret"
                                            setValue={setValue}/>
                                    </div>
                                </div>
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Hash algorithm
                                    </label>
                                    <div className="col-sm-9 mb-0">
                                        <div className="form-group-select">
                                            <CustomSelect
                                                className="form-control"
                                                field={'phasingHashedSecretAlgorithm'}
                                                defaultValue={hashAlgorithm[0]}
                                                setValue={setValue}
                                                options={hashAlgorithm}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Referenced transaction hash
                                    </label>
                                    <div className="col-sm-9 mb-0">
                                        <InputForm
                                            field="referencedTransactionFullHash"
                                            placeholder="Referenced transaction full hash"
                                            minLength={64}
                                            setValue={setValue}/>
                                    </div>
                                </div>
                                <div className="row form-group-grey">
                                    <div className="col-md-9 offset-md-3">
                                        <div className="form-check custom-checkbox mb-15">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      onChange={this.handleNotBroadcast}
                                                      field="doNotBroadcast"/>
                                            <label className="form-check-label custom-control-label">
                                                Do not broadcast
                                            </label>
                                        </div>
                                        {this.props.getFormState().values.doNotBroadcast &&
                                        <div className="form-check custom-checkbox mb-15">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      field="doNotSign"/>
                                            <label className="form-check-label custom-control-label">
                                                Do not sign
                                            </label>
                                        </div>
                                        }
                                        <div className="form-check custom-checkbox mb-15">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      field="add_note_to_self"/>
                                            <label className="form-check-label custom-control-label">
                                                Add note to self?
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                {this.props.getFormState().values.add_note_to_self &&
                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Note to self
                                    </label>
                                    <div className="col-sm-9 mb-0">
                                        <TextArea className="form-control" field="note_to_self" cols="30" rows="3"/>
                                    </div>
                                    <div className="col-sm-9 offset-sm-3 form-sub-title align-margin-top">
                                        This note is encrypted
                                    </div>
                                </div>
                                }
                            </div>
                        </div>
                    </div>

        );
    }
}

export default connect(null, mapDispatchToProps)(AdvancedSettings);