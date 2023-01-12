/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {closeModal, SET_MODAL_DATA, setModalType} from '../../modules/modals';
import classNames from 'classnames';
import ModalProvider from '../components/modals/modal-provider';
import $ from 'jquery';
// Modals
import PrivateTransactions from "./private-transaction";
import SendApollo from "./send-apollo";
import SendApolloPrivate from "./send-apollo-private";
import IssueAsset from "./issue/issue-asset"
import InfoTransaction from './info-transaction/info-transaction';
import { TransactionFail } from './transaction-fail';
import InfoLedgerTransaction from './info-ledger-transaction/index';
import InfoBlock from './info-block';
import RawTransactionDetails from './send-apollo/raw-transaction-details';
import { LoginSaveData } from './login-save-data/index';
// Account
import InfoAccount from './account/account/';
import AccountDetails from './account/account-details/';
import LeaseBalance from './account/lease-balance/';
import TokenGenerationValidation from './account/token-generation-validation/';
import HashCalculation from './account/hash-calculation';
import TransactionOperations from './account/transaction-operation';
import ApolloAbout from './about';
import AccountInfo from './account/account-info';
import ShardingInfo from './account/ShardingInfo/sharding-info';
import SaveAccount from './account/save-account';
import SetAccountProperty from './account/SetAccountProperty/set-account-property';
import DeleteAccountProperty from './account/DeleteAccountProperty';
import ChainProps from './account/chain-properties';
// Assets
import TransferAsset from './assets/transfer-asset/';
import DeleteShares from './assets/delete-shares';
import BuyAssets from './assets/buy-asset';
import SellAssets from './assets/sell-asset';
import AssetDistribution from './assets/view-asset-distribution';
// Currency System
import TransferCurrency from './currencies/transfer-currency';
import OfferCurrency from './currencies/offer-currebcy';
import ReserveCurrency from './currencies/ReserveCurrency/index';
import IssueCurrency from './currencies/issue-currency';
import ClaimCurrency from './currencies/claim-currency/';
import BuyCurrency from './currencies/confirm-buy-request';
import SellCurrency from './currencies/confirm-sell-request';
// Voting system
import CreatePoll from './voting-system/create-poll/';
import CastVote from './voting-system/cast-vote/';
import PollResults from './voting-system/poll-results/';
// Data storage
import UploadFile from './data-storage/uppload-file/';
// Coin shuffling
import CreateShuffling from './coin-shuffling/create-shuffling/';
import JoinShuffling from './coin-shuffling/join-shuffling/index.jsx';
// Aliases
import EditAlias from './aliases/edit-alias';
import SellAlias from './aliases/sell-alias';
import GetAlais from './aliases/buy-alias';
import TransferAlias from './aliases/transfer-alias';
import DeleteAlias from './aliases/delete-alias';
import AddAlias from './aliases/add-alias';
import CancelSell from './aliases/cancel-sell';
// Marketplace
import MarketplaceImage from './marketplace/mraketplace-image-view';
import MarketplaceProductDetails from './marketplace/marketplace-product-details';
import ListProductForSale from './marketplace/list-product-for-sale/';
import MarketplacePurchase from './marketplace/marketplace-purchase/';
import MarketplaceChangePrice from './marketplace/change-price/';
import MarketplaceChangeQuantity from './marketplace/change-quantity/';
import MarketplaceDelete from './marketplace/delete-goods/';
import MarketplaceDeliver from './marketplace/deliver-goods/';
// Messenger
import DecryptMessage from './messenger/decrypt-messages';
import ComposeMessage from './messenger/compose-message/';
import ShareMessage from "./messenger/share-message";
import AboutPeerInfo from "./peer/about-peer-info";
import ConnectPeer from "./peer/connect-peer";
import BlacklistPeer from "./peer/blacklist-peer";
import AddMonitor from "./monitors/add-monitor";
import RemoveMonitor from "./monitors/remove-monitor";
import AddMonitoredAccount from "./monitors/add-monitored-account";
import OrderCancel from "./order-cancellation/order-cancel";
import ApproveTransaction from "./approve-transaction";
// General
import InfoPopup from './general/info-popup';

import store from '../../store';
//2fa
import Confirm2FA from './2fa'
import DeleteAccountFromWebNode from './account/delete-account-from-node';
import ConfirmForging from './account/confirm-forging';
//Login
import ExportAccount from './account/ExportAccount/export-account'
// scheduled transactins
import ScheaduleCurrency from './scheaduled-transactions/scheaduled-currency'
//exchange
import LoginToExchange from './exchange/login/index.jsx';
import LogoutExchange from './exchange/logout';
import WithdrawCurrency from './exchange/withdraw-currency';
import ConfirmCreateOffer from './exchange/confirm-create-offer';
import ConfirmCancelOrder from './exchange/confirm-cancel-offer';
import SelectOrder from './exchange/select-order';
import ConfirmExportWallet from "./exchange/confirm-export-wallet";

class ModalWindow extends React.Component {
    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        const modalWindow = document.querySelector('.modal-window');
        const modalBox = $('.modal-box');

        if (Object.values(modalWindow.classList).indexOf('active') !== -1 &&
            !modalBox.is(event.target) && modalBox.has(event.target).length === 0) {
            this.closeModal();
        }
    };

    handleModal = (e) => {
        const modalWindow = document.querySelector('.modal-window');

        if (Object.values(modalWindow.classList).indexOf('active') === -1) {
            modalWindow.classList.add('active');
        }
    };

    componentDidUpdate() {
        const modalBox = document.querySelector('.modal-box');
        if (this.refs.modalWindow.childNodes.length && modalBox) {
            setTimeout(() => {
                modalBox.classList.add('active')
            }, 100)
        }
    }

    closeModal = () => {
        const modalWindow = document.querySelectorAll('.modal-window');
        const modalBox = document.querySelectorAll('.modal-box');

        Object.values(modalWindow).map((el, index) => {
            setTimeout(() => {
                el.classList.remove('active');
            }, 100);


        });

        Object.values(modalBox).map((el, index) => {
            setTimeout(() => {
                el.classList.remove('active');
            }, 100);


        });

        setTimeout(() => {
            this.props.setModalType(null);
            store.dispatch({
                type: SET_MODAL_DATA,
                payload: null
            });

            this.props.closeModal();
        }, 300);

    };

    render() {
        return (
            <div
                onClick={(e) => this.handleModal(e)}
                className={classNames({
                    "modal-window": true,
                    "active": this.props.modalType
                })}
                ref={'modalWindow'}
                id="modal-window-container"
            >
                <ModalProvider>
                    {this.props.modalType === 'SAVE_CREDENTIALS'            && <LoginSaveData             closeModal={this.closeModal} nameModal={'SAVE_CREDENTIALS'}/>}
                    {this.props.modalType === 'INFO_TRANSACTION'            && <InfoTransaction           closeModal={this.closeModal} nameModal={'INFO_TRANSACTION'}/>}
                    {this.props.modalType === 'INFO_LEDGER_TRANSACTION'     && <InfoLedgerTransaction     closeModal={this.closeModal} nameModal={'INFO_LEDGER_TRANSACTION'}/>}
                    {this.props.modalType === 'INFO_BLOCK'                  && <InfoBlock                 closeModal={this.closeModal} nameModal={'INFO_BLOCK'}/>}
                    {this.props.modalType === 'PrivateTransactions'         && <PrivateTransactions       closeModal={this.closeModal} nameModal={'PrivateTransactions'}/>}
                    {this.props.modalType === 'SEND_APOLLO'                 && <SendApollo                closeModal={this.closeModal} nameModal={'SEND_APOLLO'}/>}
                    {this.props.modalType === 'SEND_APOLLO_PRIVATE'         && <SendApolloPrivate         closeModal={this.closeModal} nameModal={'SEND_APOLLO_PRIVATE'}/>}
                    {this.props.modalType === 'APPROVE_TRANSACTION'         && <ApproveTransaction        closeModal={this.closeModal} nameModal={'APPROVE_TRANSACTION'}/>}
                    {this.props.modalType === 'RAW_TRANSACTION_DETAILS'     && <RawTransactionDetails     closeModal={this.closeModal} nameModal={'RAW_TRANSACTION_DETAILS'}/>}
                    {this.props.modalType === 'TRANSACTION_FAIL'            && <TransactionFail closeModal={this.closeModal} nameModal={'TRANSACTION_FAIL'} />}

                    {/* Assets */}
                    {this.props.modalType === 'TRANSFER_ASSET'              && <TransferAsset             closeModal={this.closeModal} nameModal={'TRANSFER_ASSET'}/>}
                    {this.props.modalType === 'DELETE_SHARES'               && <DeleteShares              closeModal={this.closeModal} nameModal={'DELETE_SHARES'}/>}
                    {this.props.modalType === 'RESERVE_CURRENCY'            && <ReserveCurrency           closeModal={this.closeModal} nameModal={'RESERVE_CURRENCY'}/>}
                    {this.props.modalType === 'ISSUE_ASSET'                 && <IssueAsset                closeModal={this.closeModal} nameModal={'ISSUE_ASSET'}/>}
                    {this.props.modalType === 'BUY_ASSET'                   && <BuyAssets                 closeModal={this.closeModal} nameModal={'BUY_ASSET'}/>}
                    {this.props.modalType === 'SELL_ASSET'                  && <SellAssets                closeModal={this.closeModal} nameModal={'SELL_ASSET'}/>}
                    {this.props.modalType === 'VIEW_ASSET_DISTRIBUTION'     && <AssetDistribution         closeModal={this.closeModal} nameModal={'VIEW_ASSET_DISTRIBUTION'}/>}

                    {/* Currency */}
                    {this.props.modalType === 'ISSUE_CURRENCIES'            && <IssueCurrency             closeModal={this.closeModal} nameModal={'ISSUE_CURRENCIES'}/>}
                    {this.props.modalType === 'TRANSFER_CURRENCY'           && <TransferCurrency          closeModal={this.closeModal} nameModal={'TRANSFER_CURRENCY'}/>}
                    {this.props.modalType === 'OFFER_CURRENCY'              && <OfferCurrency             closeModal={this.closeModal} nameModal={'OFFER_CURRENCY'}/>}
                    {this.props.modalType === 'BUY_CURRENCY'                && <BuyCurrency               closeModal={this.closeModal} nameModal={'BUY_CURRENCY'}/>}
                    {this.props.modalType === 'SELL_CURRENCY'               && <SellCurrency              closeModal={this.closeModal} nameModal={'SELL_CURRENCY'}/>}
                    {this.props.modalType === 'CLAIM_CURRENCY'              && <ClaimCurrency             closeModal={this.closeModal} nameModal={'CLAIM_CURRENCY'}/>}


                    {/* Voting */}
                    {this.props.modalType === 'ISSUE_POLL'                  && <CreatePoll                closeModal={this.closeModal} nameModal={'ISSUE_POLL'}/>}
                    {this.props.modalType === 'CAST_VOTE'                   && <CastVote                  closeModal={this.closeModal} nameModal={'CAST_VOTE'}/>}
                    {this.props.modalType === 'POLL_RESULTS'                && <PollResults               closeModal={this.closeModal} nameModal={'CAST_VOTE'}/>}

                    {/* Data Storage */}
                    {this.props.modalType === 'ISSUE_FILE_UPLOAD'           && <UploadFile                closeModal={this.closeModal} nameModal={'ISSUE_FILE_UPLOAD'}/>}


                    {/*Account*/}
                    {this.props.modalType === 'INFO_ACCOUNT'                && <InfoAccount               setModal={this.props.setModalType} closeModal={this.closeModal} nameModal={'INFO_ACCOUNT'}/>}
                    {this.props.modalType === 'ACCOUNT_DETAILS'             && <AccountDetails            closeModal={this.closeModal} nameModal={'ACCOUNT_DETAILS'}/>}
                    {this.props.modalType === 'LEASE_BALANCE'               && <LeaseBalance              closeModal={this.closeModal} nameModal={'LEASE_BALANCE'}/>}
                    {this.props.modalType === 'TOKEN_GENERATION_VALIDATION' && <TokenGenerationValidation closeModal={this.closeModal} nameModal={'TOKEN_GENERATION_VALIDATION'}/>}
                    {this.props.modalType === 'CALCULATE_CACHE'             && <HashCalculation           closeModal={this.closeModal} nameModal={'CALCULATE_CACHE'}/>}
                    {this.props.modalType === 'TRANSACTIONS_OPERATIONS'     && <TransactionOperations     closeModal={this.closeModal} nameModal={'TRANSACTIONS_OPERATIONS'}/>}
                    {this.props.modalType === 'GENERAL_INFO'                && <ApolloAbout               closeModal={this.closeModal} nameModal={'GENERAL_INFO'}/>}
                    {this.props.modalType === 'SHARDING_INFO'               && <ShardingInfo              closeModal={this.closeModal} nameModal={'SHARDING_INFO'}/>}
                    {this.props.modalType === 'SET_ACCOUNT_INFO'            && <AccountInfo               closeModal={this.closeModal} nameModal={'SET_ACCOUNT_INFO'}/>}
                    {this.props.modalType === 'SAVE_ACCOUNT'                && <SaveAccount               closeModal={this.closeModal} nameModal={'SAVE_ACCOUNT'}/>}
                    {this.props.modalType === 'SET_ACCOUNT_PROPERTY'        && <SetAccountProperty        closeModal={this.closeModal} nameModal={'SET_ACCOUNT_PROPERTY'}/>}
                    {this.props.modalType === 'DELETE_ACCOUNT_PROPERTY'     && <DeleteAccountProperty     closeModal={this.closeModal} nameModal={'DELETE_ACCOUNT_PROPERTY'}/>}
                    {this.props.modalType === 'CONFIRM_2FA_OPERATION'       && <Confirm2FA                closeModal={this.closeModal} nameModal={'CONFIRM_2FA_OPERATION'}/>}
                    {this.props.modalType === 'EXPORT_KEY_SEED'             && <ExportAccount             closeModal={this.closeModal} nameModal={'EXPORT_KEY_SEED'}/>}
                    {this.props.modalType === 'DELETE_ACCOUNT_FROM_NODE'    && <DeleteAccountFromWebNode  closeModal={this.closeModal} nameModal={'DELETE_ACCOUNT_FROM_NODE'}/>}
                    {this.props.modalType === 'CONFIRM_FORGING'             && <ConfirmForging            closeModal={this.closeModal}/>}
                    {this.props.modalType === 'INFO_NETWORK'                && <ChainProps                closeModal={this.closeModal}/>}


                    {/* Shuffling */}
                    {this.props.modalType === 'ISSUE_CREATE_SHUFFLING'      && <CreateShuffling           closeModal={this.closeModal} nameModal={'ISSUE_CREATE_SHUFFLING'}/>}
                    {this.props.modalType === 'START_SHUFFLING'             && <JoinShuffling             closeModal={this.closeModal} nameModal={'START_SHUFFLING'}/>}


                    {/*Aliases */}
                    {this.props.modalType === 'EDIT_ALIAS'                  && <EditAlias                 closeModal={this.closeModal} nameModal={'EDIT_ALIAS'}/>}
                    {this.props.modalType === 'SELL_ALIAS'                  && <SellAlias                 closeModal={this.closeModal} nameModal={'SELL_ALIAS'}/>}
                    {this.props.modalType === 'TRANSFER_ALIAS'              && <TransferAlias             closeModal={this.closeModal} nameModal={'TRANSFER_ALIAS'}/>}
                    {this.props.modalType === 'DELETE_ALIAS'                && <DeleteAlias               closeModal={this.closeModal} nameModal={'DELETE_ALIAS'}/>}
                    {this.props.modalType === 'ADD_ALIAS'                   && <AddAlias                  closeModal={this.closeModal} nameModal={'ADD_ALIAS'}/>}
                    {this.props.modalType === 'CANCEL_SALE_ALIAS'           && <CancelSell                closeModal={this.closeModal} nameModal={'CANCEL_SALE_ALIAS'}/>}
                    {this.props.modalType === 'BUY_ALIAS'                   && <GetAlais                  closeModal={this.closeModal} nameModal={'BUY_ALIAS'}/>}


                    {/*Marketplace*/}
                    {this.props.modalType === 'MARKETPLACE_IMAGE'           && <MarketplaceImage          closeModal={this.closeModal} nameModal={'MARKETPLACE_IMAGE'}/>}
                    {this.props.modalType === 'MARKETPLACE_GOOD_DETAILS'    && <MarketplaceProductDetails closeModal={this.closeModal} nameModal={'MARKETPLACE_GOOD_DETAILS'}/>}
                    {this.props.modalType === 'LIST_PRODUCT_FOR_SALE'       && <ListProductForSale        closeModal={this.closeModal} nameModal={'LIST_PRODUCT_FOR_SALE'}/>}
                    {this.props.modalType === 'MARKETPLACE_PURCHASE'        && <MarketplacePurchase       closeModal={this.closeModal} nameModal={'MARKETPLACE_PURCHASE'}/>}
                    {this.props.modalType === 'CHANGE_PRICE'                && <MarketplaceChangePrice    closeModal={this.closeModal} nameModal={'CHANGE_PRICE'}/>}
                    {this.props.modalType === 'CHANGE_QUANTITY'             && <MarketplaceChangeQuantity closeModal={this.closeModal} nameModal={'CHANGE_QUANTITY'}/>}
                    {this.props.modalType === 'DELETE_GOODS'                && <MarketplaceDelete         closeModal={this.closeModal} nameModal={'DELETE_GOODS'}/>}
                    {this.props.modalType === 'MARKETPLACE_GOODS_DELIVER'   && <MarketplaceDeliver        closeModal={this.closeModal} nameModal={'MARKETPLACE_GOODS_DELIVER'}/>}

                    {/* General */}
                    {this.props.modalType === 'INFO-POPUP'                  && <InfoPopup                 closeModal={this.closeModal} nameModal={'INFO-POPUP'}/>}

                    {/*Peers*/}
                    {this.props.modalType === 'ABOUT_PEER_INFO'             && <AboutPeerInfo             closeModal={this.closeModal} nameModal={'ABOUT_PEER_INFO'}/>}
                    {this.props.modalType === 'CONNECT_PEER'                && <ConnectPeer               closeModal={this.closeModal} nameModal={'CONNECT_PEER'}/>}
                    {this.props.modalType === 'BLACKLIST_PEER'              && <BlacklistPeer             closeModal={this.closeModal} nameModal={'BLACKLIST_PEER'}/>}


                    {/*Monitors*/}
                    {this.props.modalType === 'ADD_MONITOR'                 && <AddMonitor                closeModal={this.closeModal} nameModal={'ADD_MONITOR'}/>}
                    {this.props.modalType === 'ADD_MONITORED_ACCOUNT'       && <AddMonitoredAccount       closeModal={this.closeModal} nameModal={'ADD_MONITORED_ACCOUNT'}/>}
                    {this.props.modalType === 'REMOVE_MONITOR'              && <RemoveMonitor             closeModal={this.closeModal} nameModal={'REMOVE_MONITOR'}/>}
                    {this.props.modalType === 'CANCEL_ORDER'                && <OrderCancel               closeModal={this.closeModal} nameModal={'CANCEL_ORDER'}/>}


                    {/*Messages*/}
                    {this.props.modalType === 'DECRYPT_MESSAGES'            && <DecryptMessage            closeModal={this.closeModal} nameModal={'DECRYPT_MESSAGES'}/>}
                    {this.props.modalType === 'COMPOSE_MESSAGE'             && <ComposeMessage            closeModal={this.closeModal} nameModal={'COMPOSE_MESSAGE'}/>}
                    {this.props.modalType === 'SHARE_MESSAGE'               && <ShareMessage              closeModal={this.closeModal}/>}
                    {this.props.modalType === 'SCHEDULE_CURRENCY'           && <ScheaduleCurrency         closeModal={this.closeModal} nameModal={'SCHEDULE_CURRENCY'}/>}

                    {/* Exchange */}
                    {this.props.modalType === 'LOGIN_EXCHANGE'              && <LoginToExchange           closeModal={this.closeModal}/>}
                    {this.props.modalType === 'WITHDRAW_CURRENCY'           && <WithdrawCurrency          closeModal={this.closeModal}/>}
                    {this.props.modalType === 'CONFIRM_CREATE_OFFER'        && <ConfirmCreateOffer        closeModal={this.closeModal}/>}
                    {this.props.modalType === 'CONFIRM_CANCEL_ORDER'        && <ConfirmCancelOrder        closeModal={this.closeModal}/>}
                    {this.props.modalType === 'CONFIRM_EXPORT_WALLET'       && <ConfirmExportWallet       closeModal={this.closeModal}/>}
                    {this.props.modalType === 'SELECT_ORDER'                && <SelectOrder               closeModal={this.closeModal}/>}
                    {this.props.modalType === 'LOGOUT_EXCHANGE'             && <LogoutExchange            closeModal={this.closeModal}/>}
                </ModalProvider>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    modalType: state.modals.modalType
});

const mapDispatchToProps = dispatch => ({
    setModalType: (modalType) => dispatch(setModalType(modalType)),
    closeModal: (param) => dispatch(closeModal(param))
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalWindow)
