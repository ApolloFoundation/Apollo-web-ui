import React from 'react';
import {connect} from 'react-redux';
import {setMopalType} from '../../modules/modals';
import classNames from 'classnames';

// Modals
import PrivateTransactions from "./private-transaction";
import SendApollo from "./send-apollo";
import SendApolloPrivate from "./send-apollo-private";
import Issue from "./issue"
import InfoTransaction from './info-transaction/info-transaction';
import InfoLedgerTransaction from './info-ledger-transaction';

class ModalWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }

        this.handleModal = this.handleModal.bind(this);
    }


    handleModal(e, eventClose) {
        const modalWindow = document.querySelector('.modal-window');
        if (Object.values(modalWindow.classList).indexOf('active') !== -1) {
            if (e.target && !e.target.closest('.modal-window .modal-box')) {
                modalWindow.classList.remove('active');
                setTimeout(() => {
                    this.props.setMopalType(null);

                }, 300);
            }
        }

        if (eventClose) {
            modalWindow.classList.remove('active');
            setTimeout(() => {
                this.props.setMopalType(null);

            }, 300);
        }
        else {
            modalWindow.classList.add('active');
        }
    }

    render() {
        return (
            <div
                onClick={(e) => this.handleModal(e)}
                className={classNames({
                    "modal-window" : true,
                    "active": this.props.openedModalType
                })}
            >
                {this.props.openedModalType === 'INFO_TRANSACTION'        && <InfoTransaction        handleCloseModal={this.handleModal}/>}
                {this.props.openedModalType === 'INFO_LEDGER_TRANSACTION' && <InfoLedgerTransaction  handleCloseModal={this.handleModal}/>}
                {this.props.openedModalType === 'PrivateTransactions'     && <PrivateTransactions    handleCloseModal={this.handleModal}/>}
                {this.props.openedModalType === 'SEND_APOLLO'             && <SendApollo             handleCloseModal={this.handleModal}/>}
                {this.props.openedModalType === 'SEND_APOLLO_PRIVATE'     && <SendApolloPrivate      handleCloseModal={this.handleModal}/>}
                {this.props.openedModalType === 'ISSUE'                   && <Issue                  handleCloseModal={this.handleModal}/>}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    openedModalType: state.modals.modalType
});

const mapDispatchToProps = dispatch => ({
    setMopalType : (modalType) => dispatch(setMopalType(modalType))
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalWindow)