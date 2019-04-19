import React from 'react';
import {connect} from "react-redux";
import {NotificationManager} from "react-notifications";
import {Form} from 'react-form';
import InputForm from '../../../components/input-form';
import {walletWidthraw} from "../../../../actions/wallet";

class WithdrawCurrency extends React.Component {

    handleFormSubmit = async (values) => {
        NotificationManager.error('This functionality will be delivered in May 2019.', 'Error', 5000);
        return;

        if (!values.secretPhrase || values.secretPhrase.length === 0) {
            NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
            return;
        }

        const params = {
            account: this.props.account,
            secretPhrase: values.secretPhrase,
            amount: values.amount,
            address: values.address,
            cryptocurrency: this.props.modalData.currency,
        };

        const result = await this.props.walletWidthraw(params);
        if (result) {
            NotificationManager.success('Successfully sent.', null, 5000);
        }
    };

    render () {
        const {currency} = this.props.modalData;
        return (
            <div className="modal-box">
                <Form
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({
                                 submitForm, values, addValue, removeValue, setValue, getFormState
                             }) => (
                            <form className="modal-form"  onSubmit={submitForm}>
                                <div className="form-group-app">
                                    <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>
                                    <div className="form-title">
                                        <p>Withdraw {currency}</p>
                                    </div>
                                    <div className="input-group-app">
                                        <div className="form-group row form-group-white mb-15">
                                            <label className="col-sm-3 col-form-label">
                                                Amount
                                            </label>
                                            <div
                                                className="col-sm-9 input-group input-group-text-transparent input-group-sm">
                                                <InputForm
                                                    field="amount"
                                                    placeholder="Amount"
                                                    type={"float"}
                                                    setValue={setValue}/>
                                                <div className="input-group-append">
                                                    <span className="input-group-text">{currency}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row form-group-white mb-15">
                                            <label className="col-sm-3 col-form-label">
                                                ETH Wallet
                                            </label>
                                            <div className="col-sm-9">
                                                <InputForm
                                                    field="address"
                                                    placeholder={`${currency} Wallet`}
                                                    type={"text"}
                                                    setValue={setValue}/>
                                            </div>
                                        </div>
                                        <div className="form-group row form-group-white mb-15">
                                            <label className="col-sm-3 col-form-label">
                                                Secret phrase&nbsp;<i className="zmdi zmdi-portable-wifi-changes"/>
                                            </label>
                                            <div className="col-sm-9">
                                                <InputForm
                                                    isPlain
                                                    className={'form-control'}
                                                    type="password"
                                                    field="secretPhrase"
                                                    placeholder="Secret Phrase"
                                                    setValue={setValue}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button type="submit" className="btn btn-right blue round round-bottom-right round-top-left">
                                        Withdraw
                                    </button>
                                </div>
                            </form>
                        )
                    } />
            </div>
        )
    }
}

const mapStateToProps = state => ({
    account: state.account.account,
    secretPhrase: state.account.passPhrase,
    modalData: state.modals.modalData,
});

const mapDispatchToProps = dispatch => ({
    walletWidthraw: (params) => dispatch(walletWidthraw(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WithdrawCurrency);