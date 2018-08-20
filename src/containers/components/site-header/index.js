import React from "react";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './SiteHeader.css';
import {setPageEvents} from '../../../modules/account';
import classNames from 'classnames';
import {setMopalType, setBodyModalType, setBodyModalParamsAction} from "../../../modules/modals";
import {logOutAction} from "../../../actions/login";
import {Form, Text} from 'react-form';
import PrivateTransactions from "../../modals/private-transaction";

import {setModalData} from "../../../modules/modals";
import {getAccountInfoAction} from "../../../actions/account";
import {getTransactionAction} from "../../../actions/transactions";
import {getBlockAction} from "../../../actions/blocks";

class SiteHeader extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searching: false
        };

        this.setSearchStateToActive   = this.setSearchStateToActive.bind(this);
        this.resetSearchStateToActive = this.resetSearchStateToActive.bind(this);
        this.searchInterval;
    }

    setSearchStateToActive() {
        clearInterval(this.searchInterval);
        this.setState({
            ...this.state,
            searching: true
        });
    }

    resetSearchStateToActive() {
        this.searchInterval = setTimeout(() => {
            this.setState({
                ...this.state,
                searching: false
            });
        }, 4000);
    }

    setBodyModalType(bodyModalType) {
        if (this.props.bodyModalType) {
            // this.props.setBodyModalType(null);

        } else {
            this.props.setBodyModalType(bodyModalType);
        }
    }

    handleSearchind = async (values) => {
        const transaction = await this.props.getTransactionAction({transaction: values.value});
        const block = await this.props.getBlockAction({block: values.value});
        const account = await this.props.getAccountInfoAction({account: values.value});

        if (transaction) {
            this.props.setBodyModalParamsAction('INFO_TRANSACTION', transaction)
        }

        if (block) {
            this.props.setBodyModalParamsAction('INFO_BLOCK', block)
        }

        if (account) {
            this.props.setModalData(account.account);
            this.props.setBodyModalParamsAction('INFO_ACCOUNT', account.account)
        }
    };

    render() {
        return (
            <div className="page-header">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="page-title-box">
                                <div className="page-title-box">
                                    <h1 className="title">{this.props.pageTitle}</h1>
                                    {
                                        this.props.showPrivateTransactions &&
                                        !this.props.children &&
                                        <a
                                            className="btn primary" onClick={this.props.setMopalType.bind(this, 'PrivateTransactions')}
                                        >
                                            Show private transactions
                                        </a>
                                    }
                                    {
                                        this.props.children &&
                                        this.props.children
                                    }
                                    {
                                        this.props.dashboardPage &&
                                        <div
                                            onClick={this.setBodyModalType.bind(this, 'FORGING_BODY_MODAL')}
                                            className={classNames({
                                                "btn" : true,
                                                "icon-button" : true,
                                                "filters" : true,
                                                "primary" : true,
                                                "transparent" : true,
                                                "open-settings" : true
                                            })}
                                        >
                                            <i className="zmdi zmdi-chevron-down" />
                                            <div className={classNames({
                                                "settings-bar": true,
                                                "active": this.props.bodyModalType === "FORGING_BODY_MODAL",
                                                "no-padding": true
                                            })}>
                                                <div className="form-group">
                                                    <div className="form-body">
                                                        <div className="input-section">
                                                            <div className="image-button">
                                                                <i className="zmdi zmdi-account" />
                                                                <label>Connected</label>
                                                            </div>
                                                            <a
                                                                to="/messenger"
                                                                className="image-button"
                                                            >
                                                                <i className="zmdi zmdi-comments" />
                                                                <label>Not forging</label>
                                                            </a>
                                                            <a
                                                                to="/messenger"
                                                                className="image-button"
                                                            >
                                                                <i className="zmdi" />
                                                                <label>Height: 666</label>
                                                            </a>
                                                            <a
                                                                onClick={() => this.props.setBodyModalParamsAction('ACCOUNT_DETAILS')}
                                                                className="image-button"
                                                            >
                                                                <i className="zmdi" />
                                                                <label>Apollo: 777</label>
                                                            </a>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    }
                                    <div className="breadcrumbs">
                                        <a>Apollo Wallet /</a>
                                        <strong>
                                            <a>{this.props.pageTitle}</a>
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className={classNames({
                                "user-search-box" : true,
                                "searching" : this.state.searching
                            })}>
                                {/*TODO : fix site header search animation*/}
                                <div
                                    className={classNames({
                                        'search-bar' : true,
                                    })}
                                >
                                    <Form
                                        onSubmit={values => this.handleSearchind(values)}
                                        render={({ submitForm, values, addValue, removeValue }) => (
                                            <form onSubmit={submitForm}>
                                                <Text
                                                    field={'value'}
                                                    onMouseOut={this.resetSearchStateToActive}
                                                    onMouseDown={this.setSearchStateToActive}
                                                    onMouseOver={this.setSearchStateToActive}
                                                    className={"searching-window"}
                                                    type="text"
                                                    placeholder="Enter Transaction/Account/Block ID"
                                                />
                                            </form>
                                        )}
                                    />


                                    <div className="user-account-actions">
                                        <a
                                            className="user-account-rs"
                                        >
                                            { this.props.accountRS }
                                        </a>
                                        <a
                                            className="user-account-action"
                                            onClick={this.props.setMopalType.bind(this, 'SEND_APOLLO')}
                                        >
                                            <i className="zmdi zmdi-balance-wallet" />
                                        </a>
                                        <button
                                            className="user-account-action"
                                            onClick={this.setBodyModalType.bind(this, 'SETTINGS_BODY_MODAL')}
                                        >
                                            <i className="zmdi zmdi-settings" />
                                            <div className={classNames({
                                                "settings-bar": true,
                                                "active": this.props.bodyModalType === 'SETTINGS_BODY_MODAL'
                                            })}>
                                                <div className="options-col">
                                                    <ul>
                                                        <li><Link className="option" to="/blocks">Blocks</Link></li>
                                                        <li><Link className="option" to="/peers">Peers</Link></li>
                                                        <li><Link className="option" to="/generators">Generators</Link></li>
                                                        <li><Link className="option" to="/scheduled-transactions">Scheduled transactions</Link></li>
                                                        <li><Link className="option" to="/monitors">monitors</Link></li>
                                                    </ul>
                                                </div>
                                                <div className="options-col">
                                                    <ul>
                                                        <li><a onClick={() => this.props.setBodyModalParamsAction('TOKEN_GENERATION_VALIDATION')} className="option">Generate token</a></li>
                                                        <li><a onClick={() => this.props.setBodyModalParamsAction('GENERATE_HALLMARK')} className="option">Generate hallmark</a></li>
                                                        <li><a onClick={() => this.props.setBodyModalParamsAction('CALCULATE_CACHE')} className="option">Calculate hash</a></li>
                                                        <li><a onClick={() => this.props.setBodyModalParamsAction('TRANSACTIONS_OPERATIONS')} className="option">Transaction operations</a></li>
                                                    </ul>

                                                </div>
                                                <div className="options-col">
                                                    <ul>
                                                        <li><a className="option">Refresh search index</a></li>
                                                        <li><a href="https://apollowallet.org/test" className="option">API console</a></li>
                                                        <li><a href="https://apollowallet.org/dbshell" className="option">Database shell</a></li>
                                                    </ul>
                                                </div>
                                                <div className="options-col">
                                                    <ul>
                                                        <li><Link to="/plugins" className="option">Plugins</Link></li>
                                                        <li><Link to="/settings" className="option">Account settings</Link></li>
                                                        <li><a onClick={() => this.props.setBodyModalParamsAction('DEVICE_SETTINGS')} className="option">Device settings</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </button>
                                        <a
                                            onClick={() =>  this.props.setMopalType('GENERAL_INFO')}
                                            className="user-account-action"
                                        >
                                            <i className="zmdi zmdi-help" />
                                        </a>
                                        <a className="user-account-action search-button" onClick={this.setSearchStateToActive}>
                                            <i className="zmdi zmdi-search" />
                                        </a>
                                    </div>
                                </div>
                                <div
                                    onClick={this.setBodyModalType.bind(this, 'ACCOUNT_BODY_MODAL')}
                                    className="user-box"
                                >
                                    <div
                                        className="user-name"
                                    >
                                        <i className="zmdi zmdi-chevron-down" />
                                        <a>{ this.props.name }</a>

                                    </div>
                                    <div className="user-avatar" />
                                    <div className={classNames({
                                        "settings-bar": true,
                                        "active": this.props.bodyModalType === 'ACCOUNT_BODY_MODAL',
                                        "no-padding": true
                                    })}>
                                        <div className="form-group">
                                            <div className="form-title">
                                                <p>Current account</p>
                                            </div>
                                            <div className="form-sub-title">
                                                Not verified profile
                                            </div>
                                            <div className="form-body">
                                                <div className="input-section">
                                                    <div className="row">
                                                        <div className="col-xc-12 col-md-6">
                                                            <a
                                                                className="btn static blue block"
                                                            >
                                                                Set account info
                                                            </a>
                                                        </div>
                                                        <div className="col-xc-12 col-md-6">
                                                            <a
                                                                className="btn static block"
                                                            >
                                                                Switch account
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="input-section">
                                                    <a
                                                        style={{
                                                            display: 'block'
                                                        }}
                                                        onClick={() => this.props.setBodyModalParamsAction('INFO_ACCOUNT', this.props.account)}
                                                        className="image-button"
                                                    >
                                                        <i className="zmdi zmdi-account" />
                                                        <label>Details</label>
                                                    </a>
                                                    <Link
                                                        to="/messenger"
                                                        className="image-button"
                                                    >
                                                        <i className="zmdi zmdi-comments" />
                                                        <label>Messages</label>
                                                    </Link>

                                                </div>
                                                <div className="input-section">
                                                    <Link
                                                        to="/settings"
                                                        className="image-button"
                                                    >
                                                        <i className="zmdi zmdi-settings" />
                                                        <label>Settings</label>
                                                    </Link>

                                                </div>
                                                <div className="input-section">
                                                    <div
                                                        onClick={() => logOutAction('simpleLogOut')}
                                                        className="image-button">
                                                        <i className="zmdi zmdi-power" />
                                                        <label>Logout</label>
                                                    </div>
                                                    <div className="image-button">
                                                        <i className="zmdi zmdi-power" />
                                                        <label>Logout and stop forging</label>
                                                    </div>
                                                    <div className="image-button">
                                                        <i className="zmdi zmdi-close-circle" />
                                                        <label>Logout and clear user data</label>
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
            </div>
        );
    }
}

const mapStateToProps = state => ({
    account: state.account.account,
    accountRS: state.account.accountRS,
    name: state.account.name,
    moalTtype: state.modals.modalType,
    bodyModalType: state.modals.bodyModalType
});

const mapDispatchToProps = dispatch => ({
    setPageEvents : (prevent) => dispatch(setPageEvents(prevent)),
    setMopalType : (prevent) => dispatch(setMopalType(prevent)),
    setBodyModalType : (prevent) => dispatch(setBodyModalType(prevent)),
    getAccountInfoAction : (reqParams) => dispatch(getAccountInfoAction(reqParams)),
    getTransactionAction : (reqParams) => dispatch(getTransactionAction(reqParams)),
    getBlockAction : (reqParams) => dispatch(getBlockAction(reqParams)),
    setModalData : (reqParams) => dispatch(setModalData(reqParams)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data))
});


export default connect(mapStateToProps, mapDispatchToProps)(SiteHeader);