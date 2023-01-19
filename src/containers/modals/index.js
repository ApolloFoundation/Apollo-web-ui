/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useEffect, useRef } from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import { closeModal } from '../../modules/modals';
import ModalProvider from '../components/modals/modal-provider';
import { getModalTypeSelector } from '../../selectors';
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
import HashCalculation from './account/HashCalculation';
import TransactionOperations from './account/transaction-operation';
import ApolloAbout from './about';
import AccountInfo from './account/account-info';
import ShardingInfo from './account/ShardingInfo/sharding-info';
import SaveAccount from './account/SaveAccount';
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

const ModalWindow = (props) => {
    const modalRef = useRef();

    const handleClickOutside = useCallback((event) => {
        if (event.target === modalRef.current) {
            props.closeModal();
        }
    }, [props.closeModal, modalRef.current]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [handleClickOutside]);

    return (
        <div
            onClick={handleClickOutside}
            className={classNames("modal-window", {
                "active": props.modalType
            })}
            ref={modalRef}
            id="modal-window-container"
        >
            <ModalProvider>
                {props.modalType === 'SAVE_CREDENTIALS'            && <LoginSaveData             closeModal={props.closeModal} nameModal={'SAVE_CREDENTIALS'}/>}
                {props.modalType === 'INFO_TRANSACTION'            && <InfoTransaction           closeModal={props.closeModal} nameModal={'INFO_TRANSACTION'}/>}
                {props.modalType === 'INFO_LEDGER_TRANSACTION'     && <InfoLedgerTransaction     closeModal={props.closeModal} nameModal={'INFO_LEDGER_TRANSACTION'}/>}
                {props.modalType === 'INFO_BLOCK'                  && <InfoBlock                 closeModal={props.closeModal} nameModal={'INFO_BLOCK'}/>}
                {props.modalType === 'PrivateTransactions'         && <PrivateTransactions       closeModal={props.closeModal} nameModal={'PrivateTransactions'}/>}
                {props.modalType === 'SEND_APOLLO'                 && <SendApollo                closeModal={props.closeModal} nameModal={'SEND_APOLLO'}/>}
                {props.modalType === 'SEND_APOLLO_PRIVATE'         && <SendApolloPrivate         closeModal={props.closeModal} nameModal={'SEND_APOLLO_PRIVATE'}/>}
                {props.modalType === 'APPROVE_TRANSACTION'         && <ApproveTransaction        closeModal={props.closeModal} nameModal={'APPROVE_TRANSACTION'}/>}
                {props.modalType === 'RAW_TRANSACTION_DETAILS'     && <RawTransactionDetails     closeModal={props.closeModal} nameModal={'RAW_TRANSACTION_DETAILS'}/>}
                {props.modalType === 'TRANSACTION_FAIL'            && <TransactionFail closeModal={props.closeModal} nameModal={'TRANSACTION_FAIL'} />}

                {/* Assets */}
                {props.modalType === 'TRANSFER_ASSET'              && <TransferAsset             closeModal={props.closeModal} nameModal={'TRANSFER_ASSET'}/>}
                {props.modalType === 'DELETE_SHARES'               && <DeleteShares              closeModal={props.closeModal} nameModal={'DELETE_SHARES'}/>}
                {props.modalType === 'RESERVE_CURRENCY'            && <ReserveCurrency           closeModal={props.closeModal} nameModal={'RESERVE_CURRENCY'}/>}
                {props.modalType === 'ISSUE_ASSET'                 && <IssueAsset                closeModal={props.closeModal} nameModal={'ISSUE_ASSET'}/>}
                {props.modalType === 'BUY_ASSET'                   && <BuyAssets                 closeModal={props.closeModal} nameModal={'BUY_ASSET'}/>}
                {props.modalType === 'SELL_ASSET'                  && <SellAssets                closeModal={props.closeModal} nameModal={'SELL_ASSET'}/>}
                {props.modalType === 'VIEW_ASSET_DISTRIBUTION'     && <AssetDistribution         closeModal={props.closeModal} nameModal={'VIEW_ASSET_DISTRIBUTION'}/>}

                {/* Currency */}
                {props.modalType === 'ISSUE_CURRENCIES'            && <IssueCurrency             closeModal={props.closeModal} nameModal={'ISSUE_CURRENCIES'}/>}
                {props.modalType === 'TRANSFER_CURRENCY'           && <TransferCurrency          closeModal={props.closeModal} nameModal={'TRANSFER_CURRENCY'}/>}
                {props.modalType === 'OFFER_CURRENCY'              && <OfferCurrency             closeModal={props.closeModal} nameModal={'OFFER_CURRENCY'}/>}
                {props.modalType === 'BUY_CURRENCY'                && <BuyCurrency               closeModal={props.closeModal} nameModal={'BUY_CURRENCY'}/>}
                {props.modalType === 'SELL_CURRENCY'               && <SellCurrency              closeModal={props.closeModal} nameModal={'SELL_CURRENCY'}/>}
                {props.modalType === 'CLAIM_CURRENCY'              && <ClaimCurrency             closeModal={props.closeModal} nameModal={'CLAIM_CURRENCY'}/>}


                {/* Voting */}
                {props.modalType === 'ISSUE_POLL'                  && <CreatePoll                closeModal={props.closeModal} nameModal={'ISSUE_POLL'}/>}
                {props.modalType === 'CAST_VOTE'                   && <CastVote                  closeModal={props.closeModal} nameModal={'CAST_VOTE'}/>}
                {props.modalType === 'POLL_RESULTS'                && <PollResults               closeModal={props.closeModal} nameModal={'CAST_VOTE'}/>}

                {/* Data Storage */}
                {props.modalType === 'ISSUE_FILE_UPLOAD'           && <UploadFile                closeModal={props.closeModal} nameModal={'ISSUE_FILE_UPLOAD'}/>}


                {/*Account*/}
                {props.modalType === 'INFO_ACCOUNT'                && <InfoAccount               setModal={props.setModalType} closeModal={props.closeModal} nameModal={'INFO_ACCOUNT'}/>}
                {props.modalType === 'ACCOUNT_DETAILS'             && <AccountDetails            closeModal={props.closeModal} nameModal={'ACCOUNT_DETAILS'}/>}
                {props.modalType === 'LEASE_BALANCE'               && <LeaseBalance              closeModal={props.closeModal} nameModal={'LEASE_BALANCE'}/>}
                {props.modalType === 'TOKEN_GENERATION_VALIDATION' && <TokenGenerationValidation closeModal={props.closeModal} nameModal={'TOKEN_GENERATION_VALIDATION'}/>}
                {props.modalType === 'CALCULATE_CACHE'             && <HashCalculation           closeModal={props.closeModal} nameModal={'CALCULATE_CACHE'}/>}
                {props.modalType === 'TRANSACTIONS_OPERATIONS'     && <TransactionOperations     closeModal={props.closeModal} nameModal={'TRANSACTIONS_OPERATIONS'}/>}
                {props.modalType === 'GENERAL_INFO'                && <ApolloAbout               closeModal={props.closeModal} nameModal={'GENERAL_INFO'}/>}
                {props.modalType === 'SHARDING_INFO'               && <ShardingInfo              closeModal={props.closeModal} nameModal={'SHARDING_INFO'}/>}
                {props.modalType === 'SET_ACCOUNT_INFO'            && <AccountInfo               closeModal={props.closeModal} nameModal={'SET_ACCOUNT_INFO'}/>}
                {props.modalType === 'SAVE_ACCOUNT'                && <SaveAccount               closeModal={props.closeModal} nameModal={'SAVE_ACCOUNT'}/>}
                {props.modalType === 'SET_ACCOUNT_PROPERTY'        && <SetAccountProperty        closeModal={props.closeModal} nameModal={'SET_ACCOUNT_PROPERTY'}/>}
                {props.modalType === 'DELETE_ACCOUNT_PROPERTY'     && <DeleteAccountProperty     closeModal={props.closeModal} nameModal={'DELETE_ACCOUNT_PROPERTY'}/>}
                {props.modalType === 'CONFIRM_2FA_OPERATION'       && <Confirm2FA                closeModal={props.closeModal} nameModal={'CONFIRM_2FA_OPERATION'}/>}
                {props.modalType === 'EXPORT_KEY_SEED'             && <ExportAccount             closeModal={props.closeModal} nameModal={'EXPORT_KEY_SEED'}/>}
                {props.modalType === 'DELETE_ACCOUNT_FROM_NODE'    && <DeleteAccountFromWebNode  closeModal={props.closeModal} nameModal={'DELETE_ACCOUNT_FROM_NODE'}/>}
                {props.modalType === 'CONFIRM_FORGING'             && <ConfirmForging            closeModal={props.closeModal}/>}
                {props.modalType === 'INFO_NETWORK'                && <ChainProps                closeModal={props.closeModal}/>}


                {/* Shuffling */}
                {props.modalType === 'ISSUE_CREATE_SHUFFLING'      && <CreateShuffling           closeModal={props.closeModal} nameModal={'ISSUE_CREATE_SHUFFLING'}/>}
                {props.modalType === 'START_SHUFFLING'             && <JoinShuffling             closeModal={props.closeModal} nameModal={'START_SHUFFLING'}/>}


                {/*Aliases */}
                {props.modalType === 'EDIT_ALIAS'                  && <EditAlias                 closeModal={props.closeModal} nameModal={'EDIT_ALIAS'}/>}
                {props.modalType === 'SELL_ALIAS'                  && <SellAlias                 closeModal={props.closeModal} nameModal={'SELL_ALIAS'}/>}
                {props.modalType === 'TRANSFER_ALIAS'              && <TransferAlias             closeModal={props.closeModal} nameModal={'TRANSFER_ALIAS'}/>}
                {props.modalType === 'DELETE_ALIAS'                && <DeleteAlias               closeModal={props.closeModal} nameModal={'DELETE_ALIAS'}/>}
                {props.modalType === 'ADD_ALIAS'                   && <AddAlias                  closeModal={props.closeModal} nameModal={'ADD_ALIAS'}/>}
                {props.modalType === 'CANCEL_SALE_ALIAS'           && <CancelSell                closeModal={props.closeModal} nameModal={'CANCEL_SALE_ALIAS'}/>}
                {props.modalType === 'BUY_ALIAS'                   && <GetAlais                  closeModal={props.closeModal} nameModal={'BUY_ALIAS'}/>}


                {/*Marketplace*/}
                {props.modalType === 'MARKETPLACE_IMAGE'           && <MarketplaceImage          closeModal={props.closeModal} nameModal={'MARKETPLACE_IMAGE'}/>}
                {props.modalType === 'MARKETPLACE_GOOD_DETAILS'    && <MarketplaceProductDetails closeModal={props.closeModal} nameModal={'MARKETPLACE_GOOD_DETAILS'}/>}
                {props.modalType === 'LIST_PRODUCT_FOR_SALE'       && <ListProductForSale        closeModal={props.closeModal} nameModal={'LIST_PRODUCT_FOR_SALE'}/>}
                {props.modalType === 'MARKETPLACE_PURCHASE'        && <MarketplacePurchase       closeModal={props.closeModal} nameModal={'MARKETPLACE_PURCHASE'}/>}
                {props.modalType === 'CHANGE_PRICE'                && <MarketplaceChangePrice    closeModal={props.closeModal} nameModal={'CHANGE_PRICE'}/>}
                {props.modalType === 'CHANGE_QUANTITY'             && <MarketplaceChangeQuantity closeModal={props.closeModal} nameModal={'CHANGE_QUANTITY'}/>}
                {props.modalType === 'DELETE_GOODS'                && <MarketplaceDelete         closeModal={props.closeModal} nameModal={'DELETE_GOODS'}/>}
                {props.modalType === 'MARKETPLACE_GOODS_DELIVER'   && <MarketplaceDeliver        closeModal={props.closeModal} nameModal={'MARKETPLACE_GOODS_DELIVER'}/>}

                {/* General */}
                {props.modalType === 'INFO-POPUP'                  && <InfoPopup                 closeModal={props.closeModal} nameModal={'INFO-POPUP'}/>}

                {/*Peers*/}
                {props.modalType === 'ABOUT_PEER_INFO'             && <AboutPeerInfo             closeModal={props.closeModal} nameModal={'ABOUT_PEER_INFO'}/>}
                {props.modalType === 'CONNECT_PEER'                && <ConnectPeer               closeModal={props.closeModal} nameModal={'CONNECT_PEER'}/>}
                {props.modalType === 'BLACKLIST_PEER'              && <BlacklistPeer             closeModal={props.closeModal} nameModal={'BLACKLIST_PEER'}/>}


                {/*Monitors*/}
                {props.modalType === 'ADD_MONITOR'                 && <AddMonitor                closeModal={props.closeModal} nameModal={'ADD_MONITOR'}/>}
                {props.modalType === 'ADD_MONITORED_ACCOUNT'       && <AddMonitoredAccount       closeModal={props.closeModal} nameModal={'ADD_MONITORED_ACCOUNT'}/>}
                {props.modalType === 'REMOVE_MONITOR'              && <RemoveMonitor             closeModal={props.closeModal} nameModal={'REMOVE_MONITOR'}/>}
                {props.modalType === 'CANCEL_ORDER'                && <OrderCancel               closeModal={props.closeModal} nameModal={'CANCEL_ORDER'}/>}


                {/*Messages*/}
                {props.modalType === 'DECRYPT_MESSAGES'            && <DecryptMessage            closeModal={props.closeModal} nameModal={'DECRYPT_MESSAGES'}/>}
                {props.modalType === 'COMPOSE_MESSAGE'             && <ComposeMessage            closeModal={props.closeModal} nameModal={'COMPOSE_MESSAGE'}/>}
                {props.modalType === 'SCHEDULE_CURRENCY'           && <ScheaduleCurrency         closeModal={props.closeModal} nameModal={'SCHEDULE_CURRENCY'}/>}

                {/* Exchange */}
                {props.modalType === 'LOGIN_EXCHANGE'              && <LoginToExchange           closeModal={props.closeModal}/>}
                {props.modalType === 'WITHDRAW_CURRENCY'           && <WithdrawCurrency          closeModal={props.closeModal}/>}
                {props.modalType === 'CONFIRM_CREATE_OFFER'        && <ConfirmCreateOffer        closeModal={props.closeModal}/>}
                {props.modalType === 'CONFIRM_CANCEL_ORDER'        && <ConfirmCancelOrder        closeModal={props.closeModal}/>}
                {props.modalType === 'CONFIRM_EXPORT_WALLET'       && <ConfirmExportWallet       closeModal={props.closeModal}/>}
                {props.modalType === 'SELECT_ORDER'                && <SelectOrder               closeModal={props.closeModal}/>}
                {props.modalType === 'LOGOUT_EXCHANGE'             && <LogoutExchange            closeModal={props.closeModal}/>}
            </ModalProvider>
        </div>
    );
}

const mapStateToProps = state => ({
    modalType: getModalTypeSelector(state),
});

const mapDispatchToProps = {
    closeModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalWindow)
