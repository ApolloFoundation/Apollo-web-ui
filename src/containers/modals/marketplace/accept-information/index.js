import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction} from '../../../../modules/modals';
import ModalBody             from '../../../components/modals/modal-body';

class AcceptInformation extends React.Component {

    handleSubmit = () => {
        sessionStorage.setItem('accept-info', true);
        this.props.closeModal();
    }

    render() {
        return (
            <ModalBody
                modalTitle={'Welcome to the Marketplace'}
                handleFormSubmit={this.handleSubmit}
                submitButtonName={'Accept'}
                isDisableSecretPhrase
                isClosingButton
                nameModel={this.props.nameModal}
            >
                <p>
                    Here you may find various goods and services at your disposal.
                    In order to find what you need, you can search through them or use the tags of interest.
                    <br /><br />
                    You can further open a store to list your goods and services, receive feedback and give a discount.
                    When using this functionality, please respect the privacy and dignity of other users.
                    <br /><br />
                    The decentralized nature of the blockchain allows listing of any inappropriate material.
                    Please, make sure to comply with local legislation when using the Marketplace.
                </p>
            </ModalBody>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (passphrase) => dispatch(setBodyModalParamsAction(passphrase)),

});

export default connect(null, mapDispatchToProps)(AcceptInformation);