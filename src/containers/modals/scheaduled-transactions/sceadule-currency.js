import React from 'react';
import BackForm from "../modal-form/modal-form-container";
import InputForm from "../../components/input-form";
import {getCurrencyAction} from "../../../actions/currencies";
import {saveSendModalState, setBodyModalParamsAction} from "../../../modules/modals";
import {connect} from 'react-redux';
import AccountRS from '../../components/account-rs';
import ModalFooter from "../../components/modal-footer";
import submitForm from '../../../helpers/forms/forms'
import {NotificationManager} from "react-notifications";

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    modalsHistory: state.modals.modalsHistory,
    adminPassword: state.account.adminPassword,
    ticker: state.account.ticker,
});

const mapDispatchToProps = dispatch => ({
    getCurrencyAction: (requestParams) => dispatch(getCurrencyAction(requestParams)),
    setBodyModalParamsAction: (requestType, data) => dispatch(setBodyModalParamsAction(requestType, data)),
    saveSendModalState: (Params) => dispatch(saveSendModalState(Params)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
});

class ScheaduleCurrency extends React.Component {

    handleFormSubmit = async (values) => {

        values = {
            ...values,
            broadcast: false,
            currency: this.state.currency,
            adminPassword: this.props.adminPassword,
            units: values.units * Math.pow(10, this.state.currencyDecimals)
        };

        this.props.processForm(values, 'scheduleCurrencyBuy', 'Schedule currency has been submitted.', () => {
            NotificationManager.success('Schedule currency has been submitted.', null, 5000);
                this.props.modalData()
                this.props.closeModal();
        })
    };

    state = {

    }

    getCurrency = async (reqParams, setValue) => {
        const result = await this.props.getCurrencyAction(reqParams);

        if (result) {
            this.setState({ currency: result.currency, currencyDecimals: result.decimals });
            setValue('holding', result.currency);
            setValue('create_poll_ms_id', result.currency);
        } else {
            this.setState({ currency: '-' });
            setValue('holding', '');
            setValue('create_poll_ms_id', '');
        }
    }

    render(){
        return (
            <div className="modal-box">
                <BackForm
                    nameModal={this.props.nameModal}
                    onSubmit={values => this.handleFormSubmit(values)}
                    render={({
                                 submitForm, values, setValue, getValue, getFormState
                             }) => (
                        <form className="modal-form" onChange={() => this.props.saveSendModalState(values)} onSubmit={submitForm}>
                            <div className="form-group-app">
                                <button type="button" onClick={this.props.closeModal} className="exit"><i className="zmdi zmdi-close" /></button>

                                <div className="form-title">
                                    {this.props.modalsHistory.length > 1 &&
                                    <div className={"backMy"} onClick={() => {this.props.openPrevModal()}}></div>
                                    }
                                    <p>Schedule Currency</p>
                                </div>

                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Currency code
                                    </label>
                                    <div className="col-sm-9 input-group input-group-text-transparent">
                                        <InputForm
                                            field="currency"
                                            placeholder="Code"
                                            onChange={(code) => this.getCurrency({code}, setValue)}
                                            setValue={setValue}/>
                                        <div className="input-group-append">
                                            <span className="input-group-text">{this.state.currency}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Rate
                                    </label>
                                    <div
                                        className="col-sm-9 input-group input-group-text-transparent input-group-sm">
                                        <InputForm
                                            field="rateATM"
                                            placeholder="Rate"
                                            type={"float"}
                                            setValue={setValue}/>
                                        <div className="input-group-append">
                                            <span className="input-group-text">{this.props.ticker}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Units
                                    </label>
                                    <div
                                        className="col-sm-9 input-group input-group-text-transparent input-group-sm">
                                        <InputForm
                                            field="units"
                                            placeholder="Units"
                                            type={"float"}
                                            setValue={setValue}/>
                                        <div className="input-group-append">
                                            <span className="input-group-text"></span>
                                        </div>
                                    </div>
                                </div>

                                <div className="input-group-app form-group mb-15 display-block inline user">
                                    <div className="row form-group-white">
                                        <label htmlFor="recipient" className="col-sm-3 col-form-label">
                                            Issuer <i className="zmdi zmdi-portable-wifi-changes"/>
                                        </label>
                                        <div className="col-sm-9">
                                            <div className="iconned-input-field">
                                                <AccountRS
                                                    field={'offerIssuer'}
                                                    setValue={setValue}
                                                    defaultValue={values.offerIssuer || ''}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Fee
                                    </label>
                                    <div
                                        className="col-sm-9 input-group input-group-text-transparent input-group-sm">
                                        <InputForm
                                            field="feeATM"
                                            placeholder="Fee"
                                            type={"float"}
                                            setValue={setValue}/>
                                        <div className="input-group-append">
                                            <span className="input-group-text">{this.props.ticker}</span>
                                        </div>
                                    </div>
                                </div>

                                <ModalFooter
                                    setValue={setValue}
                                    getFormState={getFormState}
                                    values={values}
                                />

                                <div className="btn-box align-buttons-inside absolute right-conner align-right">
                                    {
                                        !!this.state.isPending ?
                                            <div
                                                style={{
                                                    width: 100
                                                }}
                                                className="btn btn-right blue round round-bottom-right"
                                            >
                                                <div className="ball-pulse">
                                                    <div></div>
                                                    <div></div>
                                                    <div></div>
                                                </div>
                                            </div> :
                                            <button
                                                style={{
                                                    width: 150
                                                }}
                                                type="submit"
                                                name={'closeModal'}
                                                className="btn btn-right blue round round-bottom-right"
                                            >
                                                Schedule currency
                                            </button>
                                    }
                                    <button
                                        type={'button'}
                                        onClick={() => this.props.closeModal()}
                                        className="btn round round-top-left"
                                    >
                                        Cancel
                                    </button>

                                </div>
                            </div>
                        </form>
                    )} />
            </div>
        )
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheaduleCurrency);
