import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Form} from "react-form";
import {NotificationManager} from "react-notifications";
import {CopyToClipboard} from "react-copy-to-clipboard";
import QRCode from "qrcode.react";
import {clearDashboardForm, setBodyModalParamsAction} from '../../../modules/modals';
import {ReactComponent as ArrowRight} from "../../../assets/arrow-right.svg";
import {ReactComponent as QrIcon} from "../../../assets/qr-icon.svg";
import AccountRSFormInput from "../../components/form-components/account-rs";
import NummericInputForm from "../../components/form-components/numeric-input";
import ContentLoader from "../../components/content-loader";
import FeeInputForm from "../../components/form-components/fee-input";

class SendApollo extends Component {
    state = {
        actionType: 0
    };

    submitForm = ({type, recipient, amountATM, feeATM}) => {
        if (type === 'private') {
            this.props.setBodyModalParamsAction('SEND_APOLLO_PRIVATE', {recipient, amountATM, feeATM});
        } else {
            this.props.setBodyModalParamsAction('SEND_APOLLO', {recipient, amountATM, feeATM});
        }
    };

    getApi = (form) => {
        this.setState({form});
        clearDashboardForm(form);
    };

    handleActionType = (type) => {
        this.setState({actionType: type});
    };

    handleSwitch = (setValue, type) => {
        setValue('type', type);
    };

    render() {
        return (
            <div className={`card card-light w-100`}>
                <div className="card-title">
                    <div className={'title'}>Send Apollo</div>
                </div>
                <div className="card-body">
                    <Form
                        getApi={(form) => this.getApi(form)}
                        onSubmit={(values) => this.submitForm(values)}
                        render={({
                                     submitForm, setValue, values
                                 }) => (
                            <form
                                onSubmit={submitForm}
                                className="form-group-app d-flex flex-column justify-content-between h-100 mb-0"
                            >
                                <div className={'tabs-wrap mb-3'}>
                                    <div
                                        className={`tab-item ${this.state.actionType === 0 ? 'active' : ''}`}
                                        onClick={this.handleActionType.bind(this, 0)}
                                    >
                                        Send APL
                                    </div>
                                    <div
                                        className={`tab-item ${this.state.actionType === 1 ? 'active' : ''}`}
                                        onClick={this.handleActionType.bind(this, 1)}
                                    >
                                        Receive APL&nbsp;<QrIcon/>
                                    </div>
                                </div>
                                {this.state.actionType === 0 ? (
                                    <>
                                        <div className={'switch-wrap mb-3'}>
                                            <div
                                                className={`switch-item ${values.type !== 'private' ? 'active' : ''}`}
                                                onClick={this.handleSwitch.bind(this, setValue, 'public')}
                                            >
                                                <i className="zmdi zmdi-eye"/>&nbsp;Public
                                            </div>
                                            <div
                                                className={`switch-item ${values.type === 'private' ? 'active' : ''}`}
                                                onClick={this.handleSwitch.bind(this, setValue, 'private')}
                                            >
                                                <i className="zmdi zmdi-eye-off"/>&nbsp;Private
                                            </div>
                                        </div>
                                        <AccountRSFormInput
                                            field={'recipient'}
                                            defaultValue={values.recipient || ''}
                                            label={'Recipient'}
                                            placeholder={'Recipient'}
                                            setValue={setValue}
                                        />
                                        <NummericInputForm
                                            field={'amountATM'}
                                            type={'tel'}
                                            label={'Amount APL'}
                                            setValue={setValue}
                                            placeholder={'Amount'}
                                        />
                                        <FeeInputForm
                                            field={'feeATM'}
                                            type={'tel'}
                                            values={values}
                                            setValue={setValue}
                                            disableArrows
                                        />
                                        <button
                                            type={'submit'}
                                            className={'btn btn-green btn-lg'}
                                        >
                                            <span>Send Apollo</span>
                                            <div className={'btn-arrow'}>
                                                <ArrowRight/>
                                            </div>
                                        </button>
                                    </>
                                ) : (
                                    <div className={'qr-code-wrap'}>
                                        {this.props.dashboardAccountInfo ? (
                                            <>
                                                <QRCode
                                                    className={'qr-code mb-3'}
                                                    value={this.props.dashboardAccountInfo.accountRS}
                                                    size={'100'}
                                                />
                                                <CopyToClipboard
                                                    text={this.props.dashboardAccountInfo.accountRS}
                                                    onCopy={() => {
                                                        NotificationManager.success('The account has been copied to clipboard.')
                                                    }}
                                                >
                                                    <div className={'wallet-id-wrap cursor-pointer'}>
                                                        {this.props.dashboardAccountInfo.accountRS}
                                                    </div>
                                                </CopyToClipboard>
                                            </>
                                        ) : (
                                            <ContentLoader noPaddingOnTheSides/>
                                        )}
                                    </div>
                                )}
                            </form>
                        )}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    dashboardAccountInfo: state.dashboard.dashboardAccoountInfo,
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SendApollo)