import React from 'react';
import {Form, Text} from "react-form";
import {connect} from 'react-redux';
import {NotificationManager} from "react-notifications";
import {setModalData, setModalType, setBodyModalParamsAction} from '../../../../modules/modals';
import {setAccountPassphrase} from '../../../../modules/account';
import {getWallets} from "../../../../actions/wallet";

class LoginToExchange extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            passphraseStatus: false
        };

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    async handleFormSubmit(values) {
        let passphrase = values.passphrase;
        if (!passphrase || passphrase.length === 0) {
            NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
            return;
        }

        const params = {
            account: this.props.accountRS,
            passphrase
        };
        const wallets = await this.props.getWallets(params);
        if (wallets) {
            this.props.setAccountPassphrase(passphrase);
            this.props.closeModal();
        } else {
            NotificationManager.error('Secret Phrase is incorrect or you not in Vault Wallet.', 'Error', 5000);
        }
    }

    render() {
        return (
            <div className="modal-box">
                <Form
                    onSubmit={values => this.handleFormSubmit(values)}
                    render={({
                                 submitForm, getFormState, setValue, values
                             }) => (
                        <form className="modal-form"  onSubmit={submitForm}>
                            <div className="form-group-app">
                                <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                <div className="form-title">
                                    <p>Login to Exchange</p>
                                </div>
                                <div className="input-group-app">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <label>Secret phrase</label>
                                        </div>
                                        <div className="col-md-8">
                                            <Text field="passphrase" placeholder='Secret phrase' type={'password'}/>
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-right blue round round-bottom-right round-top-left">
                                    Enter
                                </button>
                            </div>
                        </form>
                    )} />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    accountRS: state.account.accountRS,
    publicKey: state.account.publicKey
});

const mapDispatchToProps = dispatch => ({
    getWallets: (params) => dispatch(getWallets(params)),
    setModalData: (data) => dispatch(setModalData(data)),
    setModalType: (passphrase) => dispatch(setModalType(passphrase)),
    setBodyModalParamsAction: (passphrase) => dispatch(setBodyModalParamsAction(passphrase)),
    setAccountPassphrase: (passphrase) => dispatch(setAccountPassphrase(passphrase)),

});

export default connect(mapStateToProps, mapDispatchToProps)(LoginToExchange);