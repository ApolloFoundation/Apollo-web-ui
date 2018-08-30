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

// Assets
import TransferAsset from './assets/transfer-asset';
import DeleteShares from './assets/delete-shares';

// currency System
import ReserveCurrency from './currencies/reserve-currency'
import IssueCurrency from './currencies/issue-currency';

// Voting system
import CreatePoll from './voting-system/create-poll';

// Data storage
import UploadFile from './data-storage/uppload-file';

// Coin shuffling
import CreateShuffling from './coin-shuffling/create-shuffling';

// Aliases
import EditAlias     from './aliases/edit-alias';
import SellAlias     from './aliases/sell-alias';
import TransferAlias from './aliases/transfer-alias';
import DeleteAlias   from './aliases/delete-alias';

// Marketplace
import MarketplaceImage from './marketplace/mraketplace-image-view';
import MarketplaceProductDetails from './marketplace/marketplace-product-details';
import ListProductForSale from './marketplace/list-product-for-sale';

// Marketplace
import DecryptMessage from './messenger/decrypt-messages';

class ModalWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }

        this.handleModal = this.handleModal.bind(this);
    }

    handleModal(e) {
        const modalWindow = document.querySelector('.modal-window');

        if (Object.values(modalWindow.classList).indexOf('active') !== -1) {

            if (!e.target.closest('.modal-window .modal-box')) {
                modalWindow.classList.remove('active');
                setTimeout(() => {
                    this.props.setMopalType(null);

                }, 300);
            }

        } else {
            modalWindow.classList.add('active');
        }
    }

    render() {
        return (
            <div
                onClick={(e) => this.handleModal(e)}
                className={classNames({
                    "modal-window" : true,
                    "active": this.props.modalType
                })}
            >
                {this.props.modalType === 'INFO_TRANSACTION'            && <InfoTransaction           />}
                {this.props.modalType === 'INFO_LEDGER_TRANSACTION'     && <InfoLedgerTransaction     />}
                {this.props.modalType === 'INFO_BLOCK'                  && <InfoBlock                 />}
                {this.props.modalType === 'PrivateTransactions'         && <PrivateTransactions       />}
                {this.props.modalType === 'SEND_APOLLO'                 && <SendApollo                />}
                {this.props.modalType === 'SEND_APOLLO_PRIVATE'         && <SendApolloPrivate         />}


                {/* Assets */}
                {this.props.modalType === 'TRANSFER_ASSET'              && <TransferAsset             />}
                {this.props.modalType === 'DELETE_SHARES'               && <DeleteShares              />}
                {this.props.modalType === 'RESERVE_CURRENCY'            && <ReserveCurrency           />}
                {this.props.modalType === 'ISSUE_ASSET'                 && <IssueAsset                />}


                {/* Currency */}
                {this.props.modalType === 'ISSUE_CURRENCIES'            && <IssueCurrency             />}


                {/* Voting */}
                {this.props.modalType === 'ISSUE_POLL'                  && <CreatePoll                />}


                {/* Data Storage */}
                {this.props.modalType === 'ISSUE_FILE_UPLOAD'           && <UploadFile                />}


                {/*Account*/}
                {this.props.modalType === 'INFO_ACCOUNT'                && <InfoAccount               />}
                {this.props.modalType === 'MANDATORY_APPROVAL'          && <MandatoryApproval         />}
                {this.props.modalType === 'ACCOUNT_DETAILS'             && <AccountDetails            />}
                {this.props.modalType === 'LEASE_BALANCE'               && <LeaseBalance              />}
                {this.props.modalType === 'TOKEN_GENERATION_VALIDATION' && <TokenGenerationValidation />}
                {this.props.modalType === 'CALCULATE_CACHE'             && <HashCalculation           />}
                {this.props.modalType === 'TRANSACTIONS_OPERATIONS'     && <TransactionOperations     />}
                {this.props.modalType === 'DEVICE_SETTINGS'             && <DeviceSettings            />}
                {this.props.modalType === 'GENERATE_HALLMARK'           && <GenerateHallmark          />}
                {this.props.modalType === 'GENERAL_INFO'                && <ApolloAbout               />}
                {this.props.modalType === 'CREATE_USER'                 && <CreateUser             />}


                {/* Shuffling */}
                {this.props.modalType === 'ISSUE_CREATE_SHUFFLING'      && <CreateShuffling           />}


                {/*Aliases */}
                {this.props.modalType === 'EDIT_ALIAS'                  && <EditAlias                 />}
                {this.props.modalType === 'SELL_ALIAS'                  && <SellAlias                 />}
                {this.props.modalType === 'TRANSFER_ALIAS'              && <TransferAlias             />}
                {this.props.modalType === 'DELETE_ALIAS'                && <DeleteAlias               />}

                {/*Marketplace*/}
                {this.props.modalType === 'MARKETPLACE_IMAGE'           && <MarketplaceImage          />}
                {this.props.modalType === 'MARKETPLACE_GOOD_DETAILS'    && <MarketplaceProductDetails />}
                {this.props.modalType === 'LIST_PRODUCT_FOR_SALE'       && <ListProductForSale        />}


                {/*Messages*/}
                {this.props.modalType === 'DECRYPT_MESSAGES'            && <DecryptMessage            />}
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