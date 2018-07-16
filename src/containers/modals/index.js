import React from 'react';
import {connect} from 'react-redux';
import {setMopalType} from '../../modules/modals';
import classNames from 'classnames';
import PrivateTransactions from "./private-transaction";

class ModalWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }

        this.handleModal = this.handleModal.bind(this);
    }

    componentWillMount() {
        console.log(this.props);
    }

    componentWillReceiveProps(newState) {
        console.log(newState);
    }

    handleModal(e) {
        console.log(e.target.closest('.modal-window .modal-box'));
        const modalWindow = document.querySelector('.modal-window');
        console.log(modalWindow);
        if (Object.values(modalWindow.classList).indexOf('active') !== -1) {

            if (!e.target.closest('.modal-window .modal-box')) {
                modalWindow.classList.remove('active');
                setTimeout(() => {
                    this.props.setMopalType(null);

                }, 300);
                console.log(this.openedModalType);
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
                    "modal-window" : true
                })}
            >
                { this.props.openedModalType === 'PrivateTransactions' && <PrivateTransactions/>}
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