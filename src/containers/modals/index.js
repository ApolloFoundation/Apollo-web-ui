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
import ApolloAbout from './about';

// Aliases
import EditAlias     from './aliases/edit-alias';
import SellAlias     from './aliases/sell-alias';
import TransferAlias from './aliases/transfer-alias';
import DeleteAlias   from './aliases/delete-alias';


// Marketplace
import MarketplaceImage from './marketplace/mraketplace-image-view';
import MarketplaceProductDetails from './marketplace/marketplace-product-details';

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
                {this.props.modalType === 'INFO_TRANSACTION'         && <InfoTransaction           />}
                {this.props.modalType === 'INFO_LEDGER_TRANSACTION'  && <InfoLedgerTransaction     />}
                {this.props.modalType === 'INFO_BLOCK'               && <InfoBlock                 />}
                {this.props.modalType === 'PrivateTransactions'      && <PrivateTransactions       />}
                {this.props.modalType === 'SEND_APOLLO'              && <SendApollo                />}
                {this.props.modalType === 'SEND_APOLLO_PRIVATE'      && <SendApolloPrivate         />}


                {/* Issues */}
                {this.props.modalType === 'ISSUE_ASSET'              && <IssueAsset                />}


                {/*Account*/}
                {this.props.modalType === 'INFO_ACCOUNT'             && <InfoAccount               />}


                {/*Aliases */}
                {this.props.modalType === 'EDIT_ALIAS'               && <EditAlias                 />}
                {this.props.modalType === 'SELL_ALIAS'               && <SellAlias                 />}
                {this.props.modalType === 'TRANSFER_ALIAS'           && <TransferAlias             />}
                {this.props.modalType === 'DELETE_ALIAS'             && <DeleteAlias               />}

                {/*Marketplace*/}
                {this.props.modalType === 'MARKETPLACE_IMAGE'        && <MarketplaceImage          />}


                {this.props.modalType === 'MARKETPLACE_GOOD_DETAILS' && <MarketplaceProductDetails />}


                {this.props.modalType === 'GENERAL_INFO'             && <ApolloAbout />}

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