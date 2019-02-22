/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {Route, Switch, Redirect, withRouter} from 'react-router-dom';
import classNames from 'classnames';
import {isLoggedIn, getConstantsAction} from '../../actions/login';
import {setPageEvents, loadConstants} from '../../modules/account' ;
import {setBodyModalType} from '../../modules/modals' ;
import PageLoader from '../components/page-loader/page-loader';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import ReactHintFactory from 'react-hint';

// components
import SideBar from '../components/sidebar';
import ModalWindow from '../modals';
import AlertBox from '../components/alert-box';
import BlocksDownloader from '../components/blocks-downloader';
import {getSavedAccountSettingsAction, saveAccountSettingsAction} from "../../modules/accountSettings";

// pages components
import Login from "../account/login";

import './App.scss';

import {getUpdateStatus} from '../../actions/login/index'
import urlHelper from "../../helpers/util/urlParser";
import {startBlockPullingAction} from '../../actions/blocks'
import './window';
import {setBodyModalParamsAction} from "../../modules/modals";
import asyncComponent from '../components/page-loader/page-loader';
import UnknownPage from '../account/404'
import {loginWithShareMessage} from "../../actions/account";


const ReactHint = ReactHintFactory(React)

class App extends React.Component {

    shareMessage = false;

    componentDidMount() {
        const {
                getSavedAccountSettings,
                isLoggedIn,
                getConstantsAction
            } = this.props;

        getSavedAccountSettings();
        this.checkUrl();
        // this.props.startBlockPullingAction();
        getUpdateStatus();
        if (!this.shareMessage) {
            isLoggedIn(this.props.history);
        }
        getConstantsAction();
        this.handleModal = this.handleModal.bind(this);
        this.setState({
            isMounted: true
        })


        // Hints settings
        window.ReactHint = ReactHint;

        const onDeviceReady = () => {
            document.addEventListener("backbutton", (e) => {
                e.preventDefault();
                e.stopPropagation();

                const   {
                            setBodyModalParamsAction, 
                            modalType, 
                            history: {
                                push, 
                                location: 
                                {
                                    pathname
                                }
                            }
                        } = this.props;

                if (modalType && modalType !== 'CREATE_USER') {
                    setBodyModalParamsAction()
                    return;
                }

                if (pathname && pathname !== '/login' && pathname !== '/') {
                    push('/dashboard');
                    return;
                }

            }, false );
        }
        document.addEventListener("deviceready", onDeviceReady, false);
    }

    state = {
        isMounted: false
    };

    componentWillReceiveProps(newState) {
        this.setState({...newState});
    }

    handleModal = (e) => {
        const parents = e.target.closest('.settings-bar') || null;

        if (!parents) {
            if (this) {

                if (this.state.bodyModalType) {
                    this.props.setBodyModalType(null);
                }
            }
        }
    };

    checkUrl = () => {
        const params = urlHelper.parseUrl();
        if (params.isShareMessage) {
            this.shareMessage = true;
            const account = params.account;
            const transaction = params.transaction;
            this.props.loginWithShareMessage(account, transaction);
        }
    };

    onRenderContent = (target, content) => {
        let {catId} = target.dataset
        catId = JSON.parse(catId);
        console.log(catId)
 
        if (catId && catId.infoContent) {
            return  <div className="custom-hint__content">
                        <div
                            className="phased-transaction"
                        >
                            <div className="phasing-box__phasing-description p-3">
                                {catId.infoContent}
                            </div>
                        </div>
                    </div>

        } else {
            return  <div className="custom-hint__content">
                    <div
                        className="phased-transaction"
                    >
                        <div className="phasing-box__phasing-description">
                            <table>
                                <tbody>
                                {
                                    catId &&
                                    <React.Fragment>
                                        <tr>
                                            <td>Accounts: </td>
                                            <td>{catId.quorum}</td>

                                        </tr>
                                        <tr>
                                            <td>Votes: </td>
                                            <td>{catId.result}</td>
                                        </tr>
                                        <tr>
                                            <td>Percentage: </td>
                                            <td>
                                                {
                                                    (catId.result / catId.quorum) * 100
                                                } %
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Finish Height</td>
                                            <td>{catId.finishHeight}</td>
                                        </tr>
                                        <tr>
                                            <td>Approved: </td>
                                            <td>
                                                {
                                                    catId.approved ? 'Yes' : 'No'
                                                }
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
        }
        
    }

    routers = () => (
        <Switch>
            <Route exact path="/dashboard"                           component={asyncComponent(() => import('../account/dashboard'))}/>
            <Route exact path="/"                                    component={asyncComponent(() => import('../account/dashboard'))}/>
            <Route exact path="/transactions"                        component={asyncComponent(() => import('../account/transactions'))}/>
            <Route exact path="/ledger"                              component={asyncComponent(() => import('../account/ledger'))}/>
            <Route exact path="/blocks"                              component={asyncComponent(() => import('../account/blocks'))}/>
            <Route exact path="/followed-polls/:poll"                component={asyncComponent(() => import('../account/followed-polls'))}/>
            <Route exact path="/followed-polls"                      component={asyncComponent(() => import('../account/followed-polls'))}/>
            <Route exact path="/my-votes"                            component={asyncComponent(() => import('../account/my-votes'))}/>
            <Route exact path="/my-polls"                            component={asyncComponent(() => import('../account/my-polls'))}/>
            <Route exact path="/messenger"                           component={asyncComponent(() => import('../account/messenger'))}/>
            <Route exact path="/messenger/:chat"                     component={asyncComponent(() => import('../account/messenger'))}/>
            <Route exact path="/recent-listing"                      component={asyncComponent(() => import('../account/marketplace/recent-listing'))}/>
            <Route exact path="/currencies"                          component={asyncComponent(() => import('../account/currencies'))}/>
            <Route exact path="/marketplace/"                        component={asyncComponent(() => import('../account/marketplace'))}/>
            <Route exact path="/my-products-for-sale"                component={asyncComponent(() => import('../account/my-products-for-sale'))}/>
            <Route exact path="/my-pending-orders"                   component={asyncComponent(() => import('../account/my-panding-orders'))}/>
            <Route exact path="/my-completed-orders"                 component={asyncComponent(() => import('../account/my-completed-orders'))}/>
            <Route exact path="/marketplace/:tag"                    component={asyncComponent(() => import('../account/marketplace'))}/>
            <Route exact path="/active-polls"                        component={asyncComponent(() => import('../account/active-polls'))}/>
            <Route exact path="/active-shuffling"                    component={asyncComponent(() => import('../account/active-shufflings'))}/>
            <Route exact path="/exchange-booth/:currency"            component={asyncComponent(() => import('../account/exchange-booth'))}/>
            <Route exact path="/my-shuffling"                        component={asyncComponent(() => import('../account/my-currencies'))}/>
            <Route exact path="/account-properties"                  component={asyncComponent(() => import('../account/account-properties'))}/>
            <Route exact path="/approval-request"                    component={asyncComponent(() => import('../account/approval-request'))}/>
            <Route exact path="/approval-request-assets"             component={asyncComponent(() => import('../account/approval-request-assets'))}/>
            <Route exact path="/asset-exchange/:asset"               component={asyncComponent(() => import('../account/asset-exchange'))}/>
            <Route exact path="/asset-exchange"                      component={asyncComponent(() => import('../account/asset-exchange'))}/>
            <Route exact path="/aliases"                             component={asyncComponent(() => import('../account/aliases'))}/>
            <Route exact path="/delete-history"                      component={asyncComponent(() => import('../account/delete-history'))}/>
            <Route exact path="/funding-monitors"                    component={asyncComponent(() => import('../account/funding-monitors'))}/>
            <Route exact path="/funding-monitors/:account/:property" component={asyncComponent(() => import('../account/funding-monitors-status'))}/>
            <Route exact path="/my-assets"                           component={asyncComponent(() => import('../account/my-assets'))}/>
            <Route exact path="/my-currencies"                       component={asyncComponent(() => import('../account/my-currencies'))}/>
            <Route exact path="/open-orders"                         component={asyncComponent(() => import('../account/open-orders'))}/>
            <Route exact path="/peers"                               component={asyncComponent(() => import('../account/peers'))}/>
            <Route exact path="/purchased-products"                  component={asyncComponent(() => import('../account/purchased-proucts'))}/>
            {/*,<Route exact path="/plugins" component={Plugins}/>*/}
            <Route exact path="/scheduled-transactions"              component={asyncComponent(() => import('../account/scheduled-transactions'))}/>
            <Route exact path="/settings"                            component={asyncComponent(() => import('../account/settings'))}/>
            <Route exact path="/trade-history"                       component={asyncComponent(() => import('../account/trade-history'))}/>
            <Route exact path="/exchange-history-currency"           component={asyncComponent(() => import('../account/trade-history-currency'))}/>
            <Route exact path="/transfer-history"                    component={asyncComponent(() => import('../account/transfer-history'))}/>
            <Route exact path="/transfer-history-currency"           component={asyncComponent(() => import('../account/transfer-history-currency'))}/> 
            <Route exact path="/finished-polls"                      component={asyncComponent(() => import('../account/finished-polls'))}/> 
            <Route exact path="/data-storage"                        component={asyncComponent(() => import('../account/datastorage'))}/> 
            <Route exact path="/data-storage/:query"                 component={asyncComponent(() => import('../account/datastorage'))}/> 
            <Route exact path="/finished-shuffling"                  component={asyncComponent(() => import('../account/finished-shufflings'))}/> 
            <Route exact path="/my-messages"                         component={asyncComponent(() => import('../account/finished-shufflings'))}/> 
            <Route exact path="/generators"                          component={asyncComponent(() => import('../account/generators'))}/> 
            <Route exact path="/index.html" render={() => <Redirect to="/dashboard"/>}/>
            <Route exact path="*" render={() => <Redirect to="/dashboard"/>}/>
        </Switch>
    )

    render() {
        const {
            history: {
                location: 
                {
                    pathname
                }
            }
        } = this.props;

        const isLoginPage = pathname === '/login';

        return (
            <div
                className={classNames({
                    'overflow-hidden': this.props.modalType
                })}
            >
                <NotificationContainer/>
                <ModalWindow/>
                <AlertBox/>
                <ReactHint 
                    persist
                    attribute="data-custom"
                    className="custom-hint"
                    events={{hover: true}}
                    onRenderContent={this.onRenderContent}
                    ref={(ref) => this.instance = ref} 
                />
                <header>
                    {
                        this.props.location.pathname !== "/login" &&
                        this.props.account &&
                        <SideBar
                            match={this.props.match}
                            location={this.props.location}
                        />
                    }
                </header>

                <div ref="siteContent"
                     className={classNames({
                         'site-content': true,
                         'login-page':  isLoginPage,
                         'hide-page-body': this.props.bodyModalType
                     })}
                     onClick={(e) => this.handleModal(e)}
                >
                    {
                        this.props.isLocalhost &&
                        this.props.blockchainStatus &&
                        this.props.blockchainStatus.isDownloading &&
                        <BlocksDownloader/>
                    }
                    
                    <Switch>
                        <Route exact path="/login" render={() => (
                            !!this.props.account ? (
                                <Redirect to="/dashboard"/>
                            ) : (
                                <Route exact path="/login" component={Login}/>
                            )
                        )}/>


                        {
                            !!this.props.account &&
                            !this.props.loading &&
                            <>
                                {this.routers()}
                            </> ||
                            <>
                                <PageLoader />
                            </>
                        }
                    </Switch>
                    {
                        !this.props.loading && !isLoginPage &&
                        <div className="site-footer">
                            Copyright © 2017-2018 Apollo Foundation.
                            <br className={'show-media hide-desktop'}/>
                            Apollo Version: {!!this.props.appState && this.props.appState.version} <br/>
                        </div>
                    }
                </div>
            </div>
        );
    }
}


const mapStateToProps = state => ({
    account: state.account.account,
    loading: state.account.loading,
    blockPageBody: state.account.blockPageBody,
    constants: state.account.constants,
    appState: state.account.blockchainStatus,

    // modals
    modalType: state.modals.modalType,
    isLocalhost: state.account.isLocalhost,
    blockchainStatus: state.account.blockchainStatus,
    bodyModalType: state.modals.bodyModalType
});

const mapDispatchToProps = dispatch => ({
    isLoggedIn: (history) => dispatch(isLoggedIn(history)),
    setPageEvents: () => dispatch(setPageEvents()),
    getConstantsAction: () => dispatch(getConstantsAction()),
    getSavedAccountSettings: () => dispatch(getSavedAccountSettingsAction()),
    loginWithShareMessage: (account, transaction) => dispatch(loginWithShareMessage(account, transaction)),
    loadConstants: () => dispatch(loadConstants()),
    
    //modals
    setBodyModalType: () => dispatch(setBodyModalType()),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    startBlockPullingAction: () => dispatch(startBlockPullingAction())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));