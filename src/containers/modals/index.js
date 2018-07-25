import React from 'react';
import {connect} from 'react-redux';
import {setMopalType} from '../../modules/modals';
import classNames from 'classnames';

// Modals
import PrivateTransactions from "./private-transaction";
import SendApollo from "./send-apollo";
import Issue from "./issue"
import InfoTransaction from './info-transaction/info-transaction';

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
                    "active": this.props.openedModalType
                })}
            >
                { this.props.openedModalType === 'INFO_TRANSACTION' && <InfoTransaction/>}
                { this.props.openedModalType === 'PrivateTransactions' && <PrivateTransactions/>}
                { this.props.openedModalType === 'SendApollo' && <SendApollo/>}
                { this.props.openedModalType === 'ISSUE' && <Issue /> }
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