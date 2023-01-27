import React from 'react';
import {connect} from 'react-redux';
import { getModalDataSelector } from 'selectors';
import ModalBody from 'containers/components/modals/modal-body';

class InfoPopup extends React.Component {

    handleSubmit = () => {
        const { onClick } = this.props.modalData;
        if (onClick) onClick();
        this.props.closeModal();
    }

    render() {
        const { title, modalText, submitButtonName } = this.props.modalData
        return (
            <ModalBody
                modalTitle={title}
                handleFormSubmit={this.handleSubmit}
                submitButtonName={submitButtonName}
                isDisableSecretPhrase
                isClosingButton
                nameModel={this.props.nameModal}
            >
                <p>
                    {modalText.map(text => (
                        <>
                            {text}
                            <br /><br />
                        </>
                    ))}
                </p>
            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    modalData: getModalDataSelector(state),
});

export default connect(mapStateToProps, null)(InfoPopup);