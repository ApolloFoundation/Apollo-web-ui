import React from 'react';
import {connect} from 'react-redux';
import {setMopalType} from '../../modules/modals';
import classNames from 'classnames';

// Modals
import PrivateTransactions from "./private-transaction";
import SendApollo from "./send-apollo";
import SendApolloPrivate from "./send-apollo-private";
import IssueAsset from "./issue/issue-asset"
import InfoTransaction from './info-transaction/info-transaction';
import InfoLedgerTransaction from './info-ledger-transaction';
import InfoBlock from './info-block';

// Account
import InfoAccount from './account/account';
import CreateUser from './account/create-account';
import MandatoryApproval from './account/mandatory-approval';
import AccountDetails from './account/account-details';
import LeaseBalance from './account/lease-balance';
import TokenGenerationValidation from './account/token-generation-validation';
import GenerateHallmark from './account/generate-halmark';
import HashCalculation from './account/hash-calculation';
import TransactionOperations from './account/transactions-operations';
import DeviceSettings from './account/device-settings';
import ApolloAbout from './about';
import AccountInfo from './account/account-info';
import SaveAccount from './account/save-account';
import EnterAdminPassword from './admin-password';
import EnterSecretPhrase from './account/get-seecret-phrase';
import SetAccountProperty from './account/set-account-property';
import DeleteAccountProperty from './account/delete-account-property';

// Assets
import TransferAsset from './assets/transfer-asset';
import DeleteShares from './assets/delete-shares';
import BuyAssets from './assets/buy-asset';
import SellAssets from './assets/sell-asset';
import BuyCurrency from './currencies/confirm-buy-request';
import SellCurrency from './currencies/confirm-sell-request';

// currency System
import TransferCurrency from './currencies/transfer-currency'
import OfferCurrency from './currencies/offer-currebcy'
import ReserveCurrency from './currencies/reserve-currency'
import IssueCurrency from './currencies/issue-currency';

// Voting system
import CreatePoll from './voting-system/create-poll';
import CastVote from './voting-system/cast-vote';

// Data storage
import UploadFile from './data-storage/uppload-file';

// Coin shuffling
import CreateShuffling from './coin-shuffling/create-shuffling';
import JoinShuffling from './coin-shuffling/join-shuffling';

// Aliases
import EditAlias     from './aliases/edit-alias';
import SellAlias     from './aliases/sell-alias';
import CancelSaleAlias     from './aliases/cancel-alias';
import TransferAlias from './aliases/transfer-alias';
import DeleteAlias   from './aliases/delete-alias';
import AddAlias   from './aliases/add-alias';

// Marketplace
import MarketplaceImage from './marketplace/mraketplace-image-view';
import MarketplaceProductDetails from './marketplace/marketplace-product-details';
import ListProductForSale from './marketplace/list-product-for-sale';
import MarketplacePurchase from './marketplace/marketplace-purchase/';
import MarketplaceChangePrice from './marketplace/change-price/';
import MarketplaceChangeQuantity from './marketplace/change-quantity/';
import MarketplaceDelete from './marketplace/delete-goods/';
import MarketplaceDeliver from './marketplace/deliver-goods/';

// Messenger
import DecryptMessage from './messenger/decrypt-messages';
import ComposeMessage from './messenger/compose-message';
import AboutPeerInfo from "./peer/about-peer-info";
import ConnectPeer from "./peer/connect-peer";
import BlacklistPeer from "./peer/blacklist-peer";
import AddMonitor from "./monitors/add-monitor";
import OrderCancel from "./order-cancellation/order-cancel";
import ApproveTransaction from "./approve-transaction";

class ModalWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };

        this.handleModal = this.handleModal.bind(this);
    }

    handleModal(e) {
        const modalWindow = document.querySelector('.modal-window');
        const modalBox = document.querySelectorAll('.modal-box');

        if (Object.values(modalWindow.classList).indexOf('active') !== -1) {

            if (!e.target.closest('.modal-window .modal-box')) {
                Object.values(modalBox).map((el, index) => {
                    setTimeout(() => {
                        el.classList.remove('active');
                    }, 1);


                });
                modalWindow.classList.remove('active');
                setTimeout(() => {
                    this.props.setMopalType(null);

                }, 300);
            }

        } else {
            modalWindow.classList.add('active');
        }
    }

    componentDidUpdate() {
        if (this.refs.modalWindow.childNodes.length) {
            setTimeout(() => {
                document.querySelector('.modal-box').classList.add('active')
            }, 10)
        }
    }

    closeModal = () => {
        const modalWindow = document.querySelectorAll('.modal-window');
        const modalBox = document.querySelectorAll('.modal-box');

        Object.values(modalWindow).map((el, index) => {
            setTimeout(() => {
                el.classList.remove('active');
            }, 10);


        });

        Object.values(modalBox).map((el, index) => {
            setTimeout(() => {
                el.classList.remove('active');
            }, 10);


        });
        // document.querySelector('.modal-window').classList.remove('active');

        setTimeout(() => {
            this.props.setMopalType(null);
        }, 300);
    };

    render() {
        return (
            <div
                onClick={(e) => this.handleModal(e)}
                className={classNames({
                    "modal-window" : true,
                    "active": this.props.modalType
                })}
                ref={'modalWindow'}
            >
                {this.props.modalType === 'INFO_TRANSACTION'            && <InfoTransaction           closeModal={this.closeModal}/>}
                {this.props.modalType === 'INFO_LEDGER_TRANSACTION'     && <InfoLedgerTransaction     closeModal={this.closeModal}/>}
                {this.props.modalType === 'INFO_BLOCK'                  && <InfoBlock                 closeModal={this.closeModal}/>}
                {this.props.modalType === 'PrivateTransactions'         && <PrivateTransactions       closeModal={this.closeModal}/>}
                {this.props.modalType === 'SEND_APOLLO'                 && <SendApollo                closeModal={this.closeModal}/>}
                {this.props.modalType === 'SEND_APOLLO_PRIVATE'         && <SendApolloPrivate         closeModal={this.closeModal}/>}
                {this.props.modalType === 'APPROVE_TRANSACTION'         && <ApproveTransaction        closeModal={this.closeModal}/>}


                {/* Assets */}
                {this.props.modalType === 'TRANSFER_ASSET'              && <TransferAsset             closeModal={this.closeModal}/>}
                {this.props.modalType === 'DELETE_SHARES'               && <DeleteShares              closeModal={this.closeModal}/>}
                {this.props.modalType === 'RESERVE_CURRENCY'            && <ReserveCurrency           closeModal={this.closeModal}/>}
                {this.props.modalType === 'ISSUE_ASSET'                 && <IssueAsset                closeModal={this.closeModal}/>}
                {this.props.modalType === 'BUY_ASSET'                   && <BuyAssets                 closeModal={this.closeModal}/>}
                {this.props.modalType === 'SELL_ASSET'                  && <SellAssets                closeModal={this.closeModal}/>}

                {/* Currency */}
                {this.props.modalType === 'ISSUE_CURRENCIES'            && <IssueCurrency             closeModal={this.closeModal}/>}
                {this.props.modalType === 'TRANSFER_CURRENCY'           && <TransferCurrency          closeModal={this.closeModal}/>}
                {this.props.modalType === 'OFFER_CURRENCY'              && <OfferCurrency             closeModal={this.closeModal}/>}
                {this.props.modalType === 'BUY_CURRENCY'                && <BuyCurrency               closeModal={this.closeModal}/>}
                {this.props.modalType === 'SELL_CURRENCY'               && <SellCurrency              closeModal={this.closeModal}/>}


                {/* Voting */}
                {this.props.modalType === 'ISSUE_POLL'                  && <CreatePoll                closeModal={this.closeModal}/>}
                {this.props.modalType === 'CAST_VOTE'                   && <CastVote                  closeModal={this.closeModal}/>}


                {/* Data Storage */}
                {this.props.modalType === 'ISSUE_FILE_UPLOAD'           && <UploadFile                closeModal={this.closeModal}/>}


                {/*Account*/}
                {this.props.modalType === 'INFO_ACCOUNT'                && <InfoAccount               setModal={this.props.setMopalType} closeModal={this.closeModal}/>}
                {this.props.modalType === 'MANDATORY_APPROVAL'          && <MandatoryApproval         closeModal={this.closeModal}/>}
                {this.props.modalType === 'ACCOUNT_DETAILS'             && <AccountDetails            closeModal={this.closeModal}/>}
                {this.props.modalType === 'LEASE_BALANCE'               && <LeaseBalance              closeModal={this.closeModal}/>}
                {this.props.modalType === 'TOKEN_GENERATION_VALIDATION' && <TokenGenerationValidation closeModal={this.closeModal}/>}
                {this.props.modalType === 'CALCULATE_CACHE'             && <HashCalculation           closeModal={this.closeModal}/>}
                {this.props.modalType === 'TRANSACTIONS_OPERATIONS'     && <TransactionOperations     closeModal={this.closeModal}/>}
                {this.props.modalType === 'DEVICE_SETTINGS'             && <DeviceSettings            closeModal={this.closeModal}/>}
                {this.props.modalType === 'GENERATE_HALLMARK'           && <GenerateHallmark          closeModal={this.closeModal}/>}
                {this.props.modalType === 'GENERAL_INFO'                && <ApolloAbout               closeModal={this.closeModal}/>}
                {this.props.modalType === 'CREATE_USER'                 && <CreateUser                closeModal={this.closeModal}/>}
                {this.props.modalType === 'SET_ACCOUNT_INFO'            && <AccountInfo               closeModal={this.closeModal}/>}
                {this.props.modalType === 'SAVE_ACCOUNT'                && <SaveAccount               closeModal={this.closeModal}/>}
                {this.props.modalType === 'ADMIN_PASSWORD'              && <EnterAdminPassword        closeModal={this.closeModal}/>}
                {this.props.modalType === 'ENTER_SECRET_PHRASE'         && <EnterSecretPhrase         closeModal={this.closeModal}/>}
                {this.props.modalType === 'SET_ACCOUNT_PROPERTY'        && <SetAccountProperty        closeModal={this.closeModal}/>}
                {this.props.modalType === 'DELETE_ACCOUNT_PROPERTY'     && <DeleteAccountProperty     closeModal={this.closeModal}/>}

                {/* Shuffling */}
                {this.props.modalType === 'ISSUE_CREATE_SHUFFLING'      && <CreateShuffling           closeModal={this.closeModal}/>}
                {this.props.modalType === 'START_SHUFFLING'             && <JoinShuffling             closeModal={this.closeModal}/>}

                {/*Aliases */}
                {this.props.modalType === 'EDIT_ALIAS'                  && <EditAlias                 closeModal={this.closeModal}/>}
                {this.props.modalType === 'SELL_ALIAS'                  && <SellAlias                 closeModal={this.closeModal}/>}
                {this.props.modalType === 'CANCEL_SALE_ALIAS'           && <CancelSaleAlias           closeModal={this.closeModal}/>}
                {this.props.modalType === 'TRANSFER_ALIAS'              && <TransferAlias             closeModal={this.closeModal}/>}
                {this.props.modalType === 'DELETE_ALIAS'                && <DeleteAlias               closeModal={this.closeModal}/>}
                {this.props.modalType === 'ADD_ALIAS'                   && <AddAlias                  closeModal={this.closeModal}/>}

                {/*Marketplace*/}
                {this.props.modalType === 'MARKETPLACE_IMAGE'           && <MarketplaceImage          closeModal={this.closeModal}/>}
                {this.props.modalType === 'MARKETPLACE_GOOD_DETAILS'    && <MarketplaceProductDetails closeModal={this.closeModal}/>}
                {this.props.modalType === 'LIST_PRODUCT_FOR_SALE'       && <ListProductForSale        closeModal={this.closeModal}/>}
                {this.props.modalType === 'MARKETPLACE_PURCHASE'        && <MarketplacePurchase       closeModal={this.closeModal}/>}
                {this.props.modalType === 'CHANGE_PRICE'                && <MarketplaceChangePrice    closeModal={this.closeModal}/>}
                {this.props.modalType === 'CHANGE_QUANTITY'             && <MarketplaceChangeQuantity closeModal={this.closeModal}/>}
                {this.props.modalType === 'DELETE_GOODS'                && <MarketplaceDelete         closeModal={this.closeModal}/>}
                {this.props.modalType === 'MARKETPLACE_GOODS_DELIVER'   && <MarketplaceDeliver        closeModal={this.closeModal}/>}

                {/*Peers*/}
                {this.props.modalType === 'ABOUT_PEER_INFO'             && <AboutPeerInfo             closeModal={this.closeModal}/>}
                {this.props.modalType === 'CONNECT_PEER'                && <ConnectPeer               closeModal={this.closeModal}/>}
                {this.props.modalType === 'BLACKLIST_PEER'              && <BlacklistPeer             closeModal={this.closeModal}/>}

                {this.props.modalType === 'ADD_MONITOR'                 && <AddMonitor                closeModal={this.closeModal}/>}
                {this.props.modalType === 'CANCEL_ORDER'                && <OrderCancel               closeModal={this.closeModal}/>}

                {/*Messages*/}
                {this.props.modalType === 'DECRYPT_MESSAGES'            && <DecryptMessage            closeModal={this.closeModal}/>}
                {this.props.modalType === 'COMPOSE_MESSAGE'             && <ComposeMessage            closeModal={this.closeModal}/>}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    modalType: state.modals.modalType
});

const mapDispatchToProps = dispatch => ({
    setMopalType : (modalType) => dispatch(setMopalType(modalType))
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalWindow)