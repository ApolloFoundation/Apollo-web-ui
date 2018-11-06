/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from "react";
import {connect} from 'react-redux';
import {Link, NavLink} from 'react-router-dom';
import './SiteHeader.css';
import {setPageEvents} from '../../../modules/account';
import classNames from 'classnames';
import {setModalType, setBodyModalType, setBodyModalParamsAction} from "../../../modules/modals";
import {logOutAction} from "../../../actions/login";
import {Form, Text} from 'react-form';
import PrivateTransactions from "../../modals/private-transaction";
import {switchAccountAction} from "../../../actions/account";
import {setForging} from '../../../actions/login';
import store from '../../../store';
import {setModalData} from "../../../modules/modals";
import {getAccountInfoAction} from "../../../actions/account";
import {getTransactionAction} from "../../../actions/transactions";
import {getBlockAction} from "../../../actions/blocks";
import {getForging} from "../../../actions/login"
import crypto from '../../../helpers/crypto/crypto';
import $ from 'jquery';

import {
    Accordion,
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody,
} from 'react-accessible-accordion';

// Demo styles, see 'Styles' section below for some notes on use.
import 'react-accessible-accordion/dist/fancy-example.css';
import {NotificationManager} from "react-notifications";
import uuid from "uuid";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import accountSettings from "../../../modules/accountSettings";

class SiteHeader extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searching: false,
            menuShow: false,
            isContacts: false,
            showTitleForginMenu: false,
            contacts: JSON.parse(localStorage.getItem('APLContacts')),
        };

        this.setSearchStateToActive = this.setSearchStateToActive.bind(this);
        this.resetSearchStateToActive = this.resetSearchStateToActive.bind(this);
        this.showMenu = this.showMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.showHideTitleForginMenu = this.showHideTitleForginMenu.bind(this);
        this.setBodyModalType = this.setBodyModalType.bind(this);
    }

    showMenu() {
        this.setState({menuShow: !this.state.menuShow});
    }

    closeMenu() {
        this.setState({menuShow: false});
    }

    showHideTitleForginMenu() {
        this.setState({showTitleForginMenu: !this.state.showTitleForginMenu});
    }

    getNavLinkClass = (path) => {
        return path.some(i => window.location.pathname === i) ? 'active' : '';
    };

    setSearchStateToActive = (form) => {
        clearInterval(this.searchInterval);
        if (!this.state.searching) {

            this.setState({searching: true});

        } else {
            if (form.value) this.handleSearchind(form);
        }
    };

    resetSearchStateToActive() {
        this.searchInterval = setTimeout(() => {
            this.setState({searching: false});
        }, 4000);
    }

    componentWillReceiveProps(newState) {
        this.setState({forgingStatus: newState.forgingStatus});
        this.getBlock()
    }

    componentDidMount() {
        this.getBlock();
        this.getForging();
    }

    getForging = async () => {
        const forgingStatus = await this.props.getForging();

        if (forgingStatus) {
            this.setState({forgingStatus: forgingStatus});
        }
    };

    setBodyModalType(bodyModalType, e) {
        const selector = document.querySelector(`.${bodyModalType}`);
        if (bodyModalType && bodyModalType !== this.state.bodyModalType) {
            this.setState({bodyModalType: bodyModalType});
        }

        if (selector &&
            Object.values(e.target.classList).indexOf('stop') !== -1 &&
            Object.values(selector.classList).indexOf('active') !== -1 ) {
            this.setState({bodyModalType: null});
        }
    }

    handleSearchind = async (values) => {
        if (!this.state.isSearching) {
            this.setState({
                isSearching: true
            });

            const transaction = this.props.getTransactionAction({transaction: values.value});
            const block = this.props.getBlockAction({block: values.value});
            const account = this.props.getAccountInfoAction({account: values.value});
            this.props.setBodyModalParamsAction(null);

            Promise.all([transaction, block, account])
                .then((data) => {
                    const transaction = data[0];
                    const block       = data[1];
                    const account     = data[2];

                    const modals = ['INFO_TRANSACTION', 'INFO_BLOCK', 'INFO_ACCOUNT'];

                    const result = [transaction, block, account].find((el, index) => {
                        if (el) {
                            if (index < 2) {
                                this.props.setBodyModalParamsAction(modals[index], el);
                                return el
                            } else {
                                if (el.account) {
                                    this.props.setBodyModalParamsAction(modals[index], el.account);
                                    return el
                                }
                            }
                        }
                    });

                    if (!result) {
                        NotificationManager.error('Invalid search properties.', null, 5000);
                    }

                    this.setState({
                        isSearching: false
                    })

                });
        }
    };

    getBlock = async () => {
        const block = await this.props.getBlockAction();

        if (block) {
            this.setState({block: block})
        }
    };

    setForgingWith2FA = (action) => {
        return {
            getStatus: action,
            confirmStatus: (res) => {
                this.setState({forgingStatus: res});
            }
        }
    }

    setForging = async (action) => {
        const forging = await this.props.setForging({requestType: action.requestType});

        if (forging) {

            if (forging.errorCode === 3) {
                this.props.setBodyModalParamsAction('CONFIRM_2FA_FORGING', this.setForgingWith2FA(action.requestType))
            } else {
                const forgingStatus = await this.props.getForging();


                if (forgingStatus) {
                    this.setState({forgingStatus: forgingStatus});
                }
            }
        }
    };

    handleModal = (e) => {
        const parents = e.target.closest('.settings-bar') || null;
        const btn = e.target.closest('.icon-button') || null;
        const userAvatar = e.target.closest('.user-avatar') || null;
        const name = e.target.closest('.name') || null;

        if (this.state.bodyModalType && !parents && !btn && !name && !userAvatar) {
            this.setState({bodyModalType: null})
        }

        const search = e.target.closest('.user-search-box') || null;
        if (this.state.searching && !search) {
            this.setState({searching: false})
        }
    };

    render() {
        return (
            <div>
                <div
                    style={{
                        backgroundColor: this.props.settings.header !== '#F5F5F5' ? this.props.settings.header : '#F5F5F5'
                    }}
                    className="page-header"
                    onMouseDown={this.handleModal}
                >
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="page-title-box">
                                    <div className="page-title-box transactions-title">
                                        <h1 className="title">{this.props.pageTitle}</h1>
                                        {
                                            this.props.children &&
                                            this.props.children
                                        }
                                        {
                                            this.props.dashboardPage &&
                                            <React.Fragment>
                                                <div className={classNames({
                                                    "general": true,
                                                    "open-settings": true
                                                })}>
                                                    <div
                                                        onClick={(e) => this.setBodyModalType('FORGING_BODY_MODAL', e)}
                                                        className={classNames({
                                                            "underscore": true,
                                                            "btn": true,
                                                            "stop": true,
                                                            "icon-button": true,
                                                            "filters": true,
                                                            "FORGING_BODY_MODAL": true,
                                                            "active": this.state.bodyModalType === "FORGING_BODY_MODAL",
                                                            "revert-content": this.state.bodyModalType === "FORGING_BODY_MODAL",
                                                            "primary": true,
                                                            "transparent": true,
                                                        })}
                                                    >
                                                        <i className="to-revert stop zmdi zmdi-chevron-down"/>
                                                    </div>
                                                    <div className={classNames({
                                                        "settings-bar": true,
                                                        "active": this.state.bodyModalType === "FORGING_BODY_MODAL",
                                                        "no-padding": true
                                                    })}>
                                                        <div className="form-group-app">
                                                            <div className="form-body">
                                                                <div className="input-section">

                                                                    <div className="image-button success">
                                                                        <i className="zmdi zmdi-check-circle"/>
                                                                        <label>Connected</label>
                                                                    </div>

                                                                    {
                                                                        this.state.forgingStatus &&
                                                                        this.state.forgingStatus.errorCode === 5 &&
                                                                        <a
                                                                            onClick={() => this.setForging({requestType: 'startForging'})}
                                                                            className="image-button  danger"
                                                                        >
                                                                            <i className="zmdi zmdi-close-circle"/>
                                                                            <label>Not forging</label>
                                                                        </a>
                                                                    }
                                                                    {
                                                                        this.state.forgingStatus &&
                                                                        !this.state.forgingStatus.errorCode &&
                                                                        <a
                                                                            onClick={() => this.setForging({requestType: 'stopForging'})}
                                                                            className="image-button  success"
                                                                        >
                                                                            <i className="zmdi zmdi-check-circle"/>
                                                                            <label>Forging</label>
                                                                        </a>
                                                                    }
                                                                    {
                                                                        this.state.forgingStatus &&
                                                                        this.state.forgingStatus.errorCode === 8 &&
                                                                        <a
                                                                            onClick={() => this.props.setBodyModalParamsAction('ENTER_SECRET_PHRASE', null)}
                                                                            className="image-button danger"
                                                                        >
                                                                            <i className="zmdi zmdi-help"/>
                                                                            <label>Unknown forging status</label>
                                                                        </a>
                                                                    }
                                                                    {
                                                                        this.state.forgingStatus &&
                                                                        this.state.forgingStatus.errorCode === 4 &&
                                                                        <a
                                                                            onClick={() => this.props.setBodyModalParamsAction('ENTER_SECRET_PHRASE', null)}
                                                                            className="image-button danger"
                                                                        >
                                                                            <i className="zmdi zmdi-help"/>
                                                                            <label>Unknown forging status</label>
                                                                        </a>
                                                                    }
                                                                    {
                                                                        this.state.forgingStatus &&
                                                                        this.state.forgingStatus.errorCode === 3 &&
                                                                        <a
                                                                            onClick={() => this.props.setBodyModalParamsAction('ENTER_SECRET_PHRASE', null)}
                                                                            className="image-button danger"
                                                                        >
                                                                            <i className="zmdi zmdi-help"/>
                                                                            <label>Unknown forging status</label>
                                                                        </a>
                                                                    }
                                                                    {
                                                                        this.state.forgingStatus &&
                                                                        this.state.forgingStatus.errorCode === 2 &&
                                                                        <a
                                                                            onClick={() => this.props.setBodyModalParamsAction('ENTER_SECRET_PHRASE', null)}
                                                                            className="image-button danger"
                                                                        >
                                                                            <i className="zmdi zmdi-help"/>
                                                                            <label>Unknown forging status</label>
                                                                        </a>
                                                                    }
                                                                    {
                                                                        this.state.forgingStatus &&
                                                                        this.state.forgingStatus.errorCode === 1 &&
                                                                        <a
                                                                            onClick={() => this.props.setBodyModalParamsAction('ENTER_SECRET_PHRASE', null)}
                                                                            className="image-button danger"
                                                                        >
                                                                            <i className="zmdi zmdi-help"/>
                                                                            <label>Unknown forging status</label>
                                                                        </a>
                                                                    }


                                                                    <a className="mb-2">
                                                                        {
                                                                            this.state.block &&
                                                                            <label>Height: {this.state.block.height}</label>
                                                                        }
                                                                    </a>
                                                                    <p>
                                                                        {
                                                                            this.props.forgedBalanceATM &&
                                                                            <label>Forged balance: {(this.props.forgedBalanceATM / 100000000).toLocaleString('en')}&nbsp;APL</label>
                                                                        }
                                                                    </p>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </React.Fragment>
                                        }

                                        <div className="breadcrumbs">
                                            <a>Apollo Wallet /</a>&nbsp;
                                            <strong>
                                                <a>{this.props.pageTitle}</a>
                                            </strong>
                                        </div>
                                        <div
                                            className={`form-group-app mobile-form-group-app ${this.state.showTitleForginMenu ? "show" : ""}`}>
                                            <div className="form-body">
                                                <div className="input-section">
                                                    <div className="image-button success">
                                                        <i className="zmdi zmdi-check-circle"/>
                                                        <label>Connected</label>
                                                    </div>
                                                    <a
                                                        to="/messenger"
                                                        className="image-button  danger"
                                                    >
                                                        <i className="zmdi zmdi-close-circle"/>
                                                        <label>Not forging</label>
                                                    </a>
                                                    <a
                                                        to="/messenger"
                                                        className="image-button"
                                                    >
                                                        <i className="zmdi"/>
                                                        {
                                                            this.state.block &&
                                                            <label>Height: {this.state.block.height}</label>
                                                        }
                                                    </a>
                                                    <a
                                                        onClick={() => this.props.setBodyModalParamsAction('ACCOUNT_DETAILS')}
                                                        className="image-button"
                                                    >
                                                        <i className="zmdi"/>
                                                        {
                                                            this.props.forgedBalanceATM &&
                                                            <label>Apollo: {(this.props.forgedBalanceATM / 100000000).toLocaleString('en')}</label>
                                                        }
                                                    </a>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className={classNames({
                                    "user-search-box": true,
                                    "searching": this.state.searching
                                })}>
                                    {/*TODO : fix site header search animation*/}
                                    <a className="logo" href={"/"}><img src="./apollo-logo.svg"/></a>
                                    <div className={`burger-mobile ${this.state.menuShow ? "menu-open" : ""}`}
                                         onClick={this.showMenu}>
                                        <div className="line"/>
                                    </div>
                                    <div className={`mobile-nav ${this.state.menuShow ? "show" : ""}`}>
                                        <Accordion>
                                            <AccordionItem>
                                                <div className={`mobile-nav-item`}>
                                                    <AccordionItemTitle
                                                        className={`text ${this.getNavLinkClass(["/dashboard",
                                                            "/ledger",
                                                            "/account-properties",
                                                            "/transactions",
                                                            "/approval-request"])
                                                            }`}>
                                                        <i className="zmdi zmdi-view-dashboard"/>
                                                        Dashboard
                                                        <span className="arrow"/>
                                                    </AccordionItemTitle>

                                                    <AccordionItemBody>
                                                        <div className="item-dropdown">
                                                            <NavLink exact={true} activeClassName="active"
                                                                     to="/dashboard">Dashboard</NavLink>
                                                            <NavLink exact={true} activeClassName="active" to="/ledger">Account
                                                                ledger</NavLink>
                                                            <NavLink exact={true} activeClassName="active"
                                                                     to="/account-properties">Account
                                                                properties</NavLink>
                                                            <NavLink exact={true} activeClassName="active"
                                                                     to="/transactions">My
                                                                transactions</NavLink>
                                                            <NavLink exact={true} activeClassName="active"
                                                                     to="/approval-request">Approval
                                                                requests</NavLink>
                                                        </div>
                                                    </AccordionItemBody>
                                                </div>

                                            </AccordionItem>
                                            <AccordionItem>
                                                <div className={"mobile-nav-item"}>
                                                    <AccordionItemTitle
                                                        className={`text ${this.getNavLinkClass(["/trade-history",
                                                            "/transfer-history",
                                                            "/delete-history",
                                                            "/my-assets",
                                                            "/open-orders",
                                                            "approval-request"])}`}>
                                                        <i className="zmdi zmdi-case"/>Asset system<span
                                                        className="arrow"/>
                                                    </AccordionItemTitle>
                                                    <AccordionItemBody>
                                                        <div className="item-dropdown">
                                                            <NavLink exact={true} activeClassName="active"
                                                                     to="/trade-history">Trade history</NavLink>
                                                            <NavLink exact={true} activeClassName="active"
                                                                     to="/transfer-history">Transfer history</NavLink>
                                                            <NavLink exact={true} activeClassName="active"
                                                                     to="/delete-history">Delete history</NavLink>
                                                            <NavLink exact={true} activeClassName="active" to="/my-assets">My
                                                                assets</NavLink>
                                                            <NavLink exact={true} activeClassName="active"
                                                                     to="/open-orders">Open orders</NavLink>
                                                            <NavLink exact={true} activeClassName="active"
                                                                     to="approval-request">Approval request</NavLink>

                                                            <a onClick={this.props.setModalType.bind(this, 'ISSUE_ASSET')}>Issue
                                                                assets</a>

                                                        </div>
                                                    </AccordionItemBody>
                                                </div>

                                            </AccordionItem>
                                            <AccordionItem>
                                                <div className={"mobile-nav-item"}>
                                                    <AccordionItemTitle
                                                        className={`text ${this.getNavLinkClass(["/currencies",
                                                            "/my-shuffling",
                                                            "/transfer-history-currency",
                                                            "/exchange-history-currency"])}`}>
                                                        <i className="zmdi zmdi-money"/>Currency system<span
                                                        className="arrow"/>
                                                    </AccordionItemTitle>
                                                    <AccordionItemBody>
                                                        <div className="item-dropdown">
                                                            <NavLink to="/currencies">Currencies</NavLink>
                                                            <NavLink to="/my-shuffling">Exchange history</NavLink>
                                                            <NavLink to="/transfer-history-currency">Transfer
                                                                history</NavLink>
                                                            <NavLink to="/exchange-history-currency">Approval
                                                                requests</NavLink>

                                                            <a onClick={this.props.setModalType.bind(this, 'ISSUE_CURRENCIES')}>Issue
                                                                Currencies</a>

                                                        </div>
                                                    </AccordionItemBody>
                                                </div>

                                            </AccordionItem>
                                            <AccordionItem>
                                                <div className={"mobile-nav-item"}>
                                                    <AccordionItemTitle
                                                        className={`text ${this.getNavLinkClass(["/active-polls",
                                                            "/followed-polls",
                                                            "/my-votes",
                                                            "/my-polls"])}`}>
                                                        <i className="zmdi zmdi-star"/>Voting system
                                                        <span className="arrow"/>
                                                    </AccordionItemTitle>
                                                    <AccordionItemBody>
                                                        <div className="item-dropdown">
                                                            <NavLink to="/active-polls">Active polls</NavLink>
                                                            <NavLink to="/followed-polls">Followed polls</NavLink>
                                                            <NavLink to="/my-votes">My votes</NavLink>
                                                            <NavLink to="/my-polls">My polls</NavLink>

                                                            <a onClick={this.props.setModalType.bind(this, 'ISSUE_POLL')}>Create
                                                                poll</a>

                                                        </div>
                                                    </AccordionItemBody>
                                                </div>

                                            </AccordionItem>
                                            <AccordionItem>
                                                <div className={"mobile-nav-item"}>
                                                    <AccordionItemTitle
                                                        className={`text ${this.getNavLinkClass(["/data-storage"])}`}>
                                                        <i className="zmdi zmdi-dns"/>Data storage<span className="arrow"/>
                                                    </AccordionItemTitle>
                                                    <AccordionItemBody>
                                                        <div className="item-dropdown">
                                                            <NavLink to="/data-storage">Search</NavLink>

                                                            <a onClick={this.props.setModalType.bind(this, 'ISSUE_FILE_UPLOAD')}>File
                                                                upload</a>

                                                        </div>
                                                    </AccordionItemBody>
                                                </div>

                                            </AccordionItem>
                                            <AccordionItem>
                                                <div className={"mobile-nav-item"}>
                                                    <AccordionItemTitle
                                                        className={`text ${this.getNavLinkClass(["/my-products-for-sale",
                                                            "/my-pending-orders",
                                                            "/my-completed-orders"])}`}>
                                                        <i className="zmdi zmdi-label"/>Marketplace<span className="arrow"/>
                                                    </AccordionItemTitle>
                                                    <AccordionItemBody>
                                                        <div className="item-dropdown">
                                                            <a>Purchased Products</a>
                                                            <NavLink to="/my-products-for-sale">My products for
                                                                sales</NavLink>
                                                            <NavLink to="/my-pending-orders">My pending orders</NavLink>
                                                            <NavLink to="/my-completed-orders">My completed orders</NavLink>
                                                            <a
                                                                onClick={this.props.setModalType.bind(this, 'LIST_PRODUCT_FOR_SALE')}>List
                                                                product for sale</a>
                                                        </div>
                                                    </AccordionItemBody>
                                                </div>

                                            </AccordionItem>
                                            <AccordionItem>
                                                <div className={"mobile-nav-item"}>
                                                    <AccordionItemTitle
                                                        className={`text ${this.getNavLinkClass(["/active-shuffling",
                                                            "/finished-shuffling",
                                                            "/my-shuffling"])}`}>
                                                        <i className="zmdi zmdi-circle-o"/>Coin shuffling
                                                        <span className="arrow"/>
                                                    </AccordionItemTitle>
                                                    <AccordionItemBody>
                                                        <div className="item-dropdown">
                                                            <NavLink to="/active-shuffling">Active shuffling</NavLink>
                                                            <NavLink to="/finished-shuffling">Finished shuffling</NavLink>
                                                            <NavLink to="/my-shuffling">My shuffling</NavLink>

                                                            <a onClick={this.props.setModalType.bind(this, 'ISSUE_CREATE_SHUFFLING')}>Create
                                                                shuffling</a>

                                                        </div>
                                                    </AccordionItemBody>
                                                </div>

                                            </AccordionItem>
                                            <AccordionItem>
                                                <div className={"mobile-nav-item"}>
                                                    <AccordionItemTitle
                                                        className={`text ${this.getNavLinkClass(["/messenger"])}`}>
                                                        <i className="zmdi zmdi-comments"/>Messages<span className="arrow"/>
                                                    </AccordionItemTitle>
                                                    <AccordionItemBody>
                                                        <div className="item-dropdown">
                                                            <NavLink exact={true} activeClassName="active"
                                                                     to="/messenger">Chat</NavLink>
                                                        </div>
                                                    </AccordionItemBody>
                                                </div>

                                            </AccordionItem>
                                        </Accordion>

                                        <NavLink exact={true} activeClassName="active" to="/aliases"
                                                 className={"mobile-nav-item"}>
                                            <p className="text">Aliases <i className="zmdi zmdi-accounts"/></p>
                                        </NavLink>
                                        <div className="btn-block">
                                            <div className="close-menu-btn" onClick={this.closeMenu}>
                                                Close
                                            </div>
                                        </div>

                                    </div>
                                    <div
                                        className={classNames({
                                            'search-bar': true,
                                        })}
                                    >

                                        <Form
                                            onSubmit={values => this.handleSearchind(values)}
                                            render={({submitForm, getFormState}) => (
                                                <form onSubmit={submitForm}>
                                                    <Text
                                                        field={'value'}
                                                        onMouseOut={this.resetSearchStateToActive}
                                                        onMouseDown={this.setSearchStateToActive}
                                                        onMouseOver={this.setSearchStateToActive}
                                                        className={"searching-window"}
                                                        type="text"
                                                        placeholder="Enter Transaction/Account ID/Block ID"
                                                    />


                                                    <div className="user-account-actions">
                                                        <CopyToClipboard
                                                            text={this.props.accountRS}
                                                            onCopy={() => {
                                                                NotificationManager.success('The account has been copied to clipboard.')
                                                            }}
                                                        >
                                                            <a
                                                                className="user-account-rs"
                                                            >
                                                                {this.props.accountRS}
                                                            </a>
                                                        </CopyToClipboard>

                                                        <a
                                                            className="user-account-action"
                                                            onClick={this.props.setModalType.bind(this, 'SEND_APOLLO')}
                                                        >
                                                            <i className="zmdi zmdi-balance-wallet"/>
                                                        </a>
                                                        <div className={classNames({
                                                            "settings": true,
                                                            "open-settings": true,
                                                            "user-account-action": true
                                                        })}>
                                                            <div
                                                                onClick={(e) => this.setBodyModalType('SETTINGS_BODY_MODAL', e)}
                                                                style={{height: 32}}
                                                                className={classNames({
                                                                    "underscore": true,
                                                                    "btn": true,
                                                                    "stop": true,
                                                                    "icon-button": true,
                                                                    "filters": true,
                                                                    "SETTINGS_BODY_MODAL": true,
                                                                    "active": this.state.bodyModalType === "SETTINGS_BODY_MODAL",
                                                                    "primary": true,
                                                                    "transparent": true,
                                                                })}
                                                            >
                                                                <i className="zmdi stop zmdi-settings"/>
                                                            </div>
                                                            <div className={classNames({
                                                                "settings-bar": true,
                                                                "settings-menu": true,
                                                                "active": this.state.bodyModalType=== 'SETTINGS_BODY_MODAL'
                                                            })}>
                                                                <div className="options-col">
                                                                    <ul>
                                                                        <li><Link onClick={() => this.setState({bodyModalType: null})} className="option" to="/blocks">Blocks</Link></li>
                                                                        <li><Link onClick={() => this.setState({bodyModalType: null})} className="option" to="/peers">Peers</Link></li>
                                                                        <li><Link onClick={() => this.setState({bodyModalType: null})} className="option" to="/generators">Generators</Link></li>
                                                                    </ul>
                                                                </div>
                                                                <div className="options-col">
                                                                    <ul>
                                                                        <li><a
                                                                            onClick={() => {
                                                                                this.setState({bodyModalType: null});
                                                                                return this.props.setBodyModalParamsAction('TOKEN_GENERATION_VALIDATION');
                                                                            }}
                                                                            className="option">Generate token</a></li>
                                                                        {/*<li><a*/}
                                                                            {/*onClick={() => {*/}
                                                                                {/*this.setState({bodyModalType: null});*/}
                                                                                {/*return this.props.setBodyModalParamsAction('GENERATE_HALLMARK');*/}
                                                                            {/*}}*/}
                                                                            {/*className="option">Generate hallmark</a></li>*/}
                                                                        <li><a
                                                                            onClick={() => {
                                                                                this.setState({bodyModalType: null});
                                                                                return this.props.setBodyModalParamsAction('CALCULATE_CACHE');
                                                                            }}
                                                                            className="option">Calculate hash</a></li>
                                                                        {<li><a
                                                                        onClick={() => {
                                                                            this.props.setBodyModalType(null);
                                                                            return this.props.setBodyModalParamsAction('TRANSACTIONS_OPERATIONS');
                                                                        }}
                                                                        className="option">Transaction operations</a></li>}
                                                                    </ul>

                                                                </div>
                                                                <div className="options-col">
                                                                    <ul>
                                                                        <li>
                                                                            <a
                                                                                onClick={() => {
                                                                                    this.setState({bodyModalType: null});
                                                                                    return this.props.setBodyModalParamsAction('DEVICE_SETTINGS');
                                                                                }}
                                                                                className="option"
                                                                            >
                                                                                Device settings
                                                                            </a>

                                                                        </li>
                                                                        <li>
                                                                            <Link
                                                                                to="/settings"
                                                                                className="option"
                                                                            >
                                                                                Settings
                                                                            </Link>
                                                                        </li>
                                                                        <li>
                                                                            <a
                                                                                onClick={() => {
                                                                                    this.setState({bodyModalType: null});
                                                                                    return this.props.setBodyModalParamsAction('EXPORT_KEY_SEED');
                                                                                }}
                                                                                className="option"
                                                                            >
                                                                                Export Secret Key
                                                                            </a>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <a
                                                            onClick={() => this.props.setModalType('GENERAL_INFO')}
                                                            className="user-account-action user-account-action--help"
                                                        >
                                                            <i className="zmdi zmdi-help"/>
                                                        </a>
                                                        <a
                                                            className="user-account-action search-button"
                                                            onClick={() => this.setSearchStateToActive(getFormState().values)}
                                                        >
                                                            <i className="zmdi zmdi-search"/>
                                                        </a>
                                                    </div>
                                                </form>
                                            )}
                                        />

                                    </div>
                                    <div className="user-box stop"
                                         onClick={(e) => this.setBodyModalType('ACCOUNT_BODY_MODAL', e)}
                                    >
                                        <div className="user-name">
                                            <a
                                                style={{
                                                    height: 25,
                                                    width: 25,
                                                    margin: "0 15px 0 0"
                                                }}
                                                className={classNames({
                                                    "underscore": true,
                                                    "account": true,
                                                    "btn": true,
                                                    "stop": true,
                                                    "icon-button": true,
                                                    "filters": true,
                                                    "ACCOUNT_BODY_MODAL": true,
                                                    "primary": true,
                                                    "active": this.state.bodyModalType=== "ACCOUNT_BODY_MODAL",
                                                    "revert-content ": this.state.bodyModalType=== "ACCOUNT_BODY_MODAL",
                                                    "transparent": true,
                                                    "open-settings": true,
                                                    "icon-button ": true,
                                                    "user-account-action": true
                                                })}
                                            >
                                                <i className="to-revert stop zmdi zmdi-chevron-down"/>
                                            </a>
                                            <a className={"name stop"}>{this.props.name}</a>

                                        </div>
                                        <div className="user-avatar stop">
                                            <i className="zmdi stop zmdi-account"></i>
                                        </div>
                                        <div
                                            className={classNames({
                                                "settings-bar": true,
                                                "active": this.state.bodyModalType=== 'ACCOUNT_BODY_MODAL',
                                                "no-padding": true,
                                                "account-body-modal": true
                                            })}>
                                            <div className="form-group-app">
                                                <div className="form-title">
                                                    <p>Current account</p>
                                                </div>
                                                {
                                                    !this.props.publicKey &&
                                                    <div className="form-sub-title">
                                                        Not verified profile
                                                        <CopyToClipboard
                                                            text={this.props.accountRS}
                                                            onCopy={() => {
                                                                NotificationManager.success('The account has been copied to clipboard.')
                                                            }}
                                                        >
                                                            <a
                                                                className="user-account-rs blue-text"
                                                            >
                                                                {this.props.accountRS}
                                                            </a>
                                                        </CopyToClipboard>
                                                    </div>
                                                }
                                                {
                                                    this.props.publicKey &&
                                                    <div className="form-sub-title">
                                                        Verified profile
                                                        <CopyToClipboard
                                                            text={this.props.accountRS}
                                                            onCopy={() => {
                                                                NotificationManager.success('The account has been copied to clipboard.')
                                                            }}
                                                        >
                                                            <a
                                                                className="user-account-rs blue-text"
                                                            >
                                                                {this.props.accountRS}
                                                            </a>
                                                        </CopyToClipboard>
                                                    </div>
                                                }
                                                <div className="form-body">
                                                    <div className="input-section">
                                                        <div className="row" style={{position: 'relative'}}>
                                                            <div className="col-xc-12 col-md-6">
                                                                <a
                                                                    onClick={() => this.props.setBodyModalParamsAction('SET_ACCOUNT_INFO', {})}
                                                                    className="btn static blue block"
                                                                >
                                                                    Set account info
                                                                </a>
                                                            </div>
                                                            <div className="col-xc-12 col-md-6">
                                                                <a
                                                                    onClick={() => {

                                                                        if (this.state.contacts && this.state.contacts.length) {
                                                                            this.setState({isContacts: !this.state.isContacts})
                                                                        } else {
                                                                            NotificationManager.info('You have an empty contacts list.', null, 5000)
                                                                        }
                                                                    }
                                                                    }
                                                                    className="btn static block"
                                                                >
                                                                    Switch account
                                                                </a>
                                                            </div>
                                                            <div
                                                                className={classNames({
                                                                    'contacts-list': true,
                                                                    'active': this.state.isContacts
                                                                })}
                                                                style={{
                                                                    padding: 0,
                                                                    margin: 5
                                                                }}
                                                            >
                                                                <ul>
                                                                    {
                                                                        this.state.contacts &&
                                                                        this.state.contacts.length &&
                                                                        this.state.contacts.map((el, index) => {
                                                                            return (
                                                                                <li key={uuid()}>
                                                                                    <a
                                                                                        onClick={() => this.props.switchAccountAction(el.accountRS)}
                                                                                    >
                                                                                        {el.name}
                                                                                    </a>
                                                                                </li>
                                                                            )
                                                                        })
                                                                    }
                                                                </ul>
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
                                                            <i className="zmdi zmdi-account"/>
                                                            <label style={{cursor: 'pointer'}}>Details</label>
                                                        </a>
                                                        <Link
                                                            to="/messenger"
                                                            className="image-button"
                                                        >
                                                            <i className="zmdi zmdi-comments"/>
                                                            <label style={{cursor: 'pointer'}}>Messages</label>
                                                        </Link>

                                                    </div>
                                                    <div className="input-section">
                                                        <Link
                                                            to="/settings"
                                                            className="image-button"
                                                        >
                                                            <i className="zmdi zmdi-settings"/>
                                                            <label style={{cursor: 'pointer'}}>Settings</label>
                                                        </Link>
                                                    </div>
                                                    <div className="input-section">
                                                        <div
                                                            onClick={() => logOutAction('simpleLogOut')}
                                                            className="image-button">
                                                            <i className="zmdi zmdi-power"/>
                                                            <label style={{cursor: 'pointer'}}>Logout</label>
                                                        </div>
                                                        <div
                                                            onClick={() => logOutAction('logOutStopForging')}
                                                            className="image-button"
                                                        >
                                                            <i className="zmdi zmdi-pause-circle"/>
                                                            <label style={{cursor: 'pointer'}}>Logout and stop
                                                                forging</label>
                                                        </div>
                                                        <div
                                                            onClick={() => logOutAction('logoutClearUserData')}
                                                            className="image-button"
                                                        >
                                                            <i className="zmdi zmdi-close-circle"/>
                                                            <label style={{cursor: 'pointer'}}>Logout and clear user
                                                                data</label>
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
                <div className={`overflow-menu ${!this.state.bodyModalType && 'hidden'}`}
                     onClick={() => this.setState({bodyModalType: null})}/>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    account: state.account.account,
    accountRS: state.account.accountRS,
    name: state.account.name,
    forgingStatus: state.account.forgingStatus,
    publicKey: state.account.publicKey,
    forgedBalanceATM: state.account.forgedBalanceATM,
    moalTtype: state.modals.modalType,
    modalData: state.modals.modalData,
    bodyModalType: state.modals.bodyModalType,
    secretPhrase: state.account.passPhrase,
    settings: state.accountSettings
});

const mapDispatchToProps = dispatch => ({
    setPageEvents: (prevent) => dispatch(setPageEvents(prevent)),
    setModalType: (prevent) => dispatch(setModalType(prevent)),
    setBodyModalType: (prevent) => dispatch(setBodyModalType(prevent)),
    getAccountInfoAction: (reqParams) => dispatch(getAccountInfoAction(reqParams)),
    setForging: (reqParams) => dispatch(setForging(reqParams)),
    validatePassphrse: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
    getTransactionAction: (reqParams) => dispatch(getTransactionAction(reqParams)),
    getBlockAction: (reqParams) => dispatch(getBlockAction(reqParams)),
    setModalData: (reqParams) => dispatch(setModalData(reqParams)),
    getForging: (reqParams) => dispatch(getForging(reqParams)),
    switchAccountAction: (requestParams) => dispatch(switchAccountAction(requestParams)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data))
});


export default connect(mapStateToProps, mapDispatchToProps)(SiteHeader);