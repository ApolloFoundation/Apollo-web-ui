import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Form} from "react-form";
import {clearDashboardForm, setBodyModalParamsAction} from '../../../modules/modals';
import AccountRS from "../../components/account-rs";
import InputForm from "../../components/input-form";
import {ReactComponent as ArrowRight} from "../../../assets/arrow-right.svg";
import AccountRSFormInput from "../../components/form-components/account-rs";
import NummericInputForm from "../../components/form-components/numeric-input";

class SendApollo extends Component {
    submitForm = ({recipient, amountATM, feeATM}) => {
        this.props.setBodyModalParamsAction('SEND_APOLLO', {recipient, amountATM, feeATM});
    };

    openPrivateTransactionModalWindow = ({recipient, amountATM, feeATM}) => {
        this.props.setBodyModalParamsAction('SEND_APOLLO_PRIVATE', {recipient, amountATM, feeATM});
    };

    getApi = (form) => {
        this.setState({form});
        clearDashboardForm(form);
    };

    render() {
        return (
            <div className={`card card-primary-action`}>
                <div className="card-title card-title-tabs card-title-lg bg-primary">
                    <div className={'title'}>Send Apollo</div>
                    <div className={'title-tabs-section'}>
                        <span className={'tab active'}>Send</span>
                        <span className={'tab'}>Receive</span>
                    </div>
                </div>
                <div className="card-body">
                    <Form
                        getApi={(form) => this.getApi(form)}
                        onSubmit={(values) => this.submitForm(values)}
                        render={({
                                     submitForm, setValue, values
                                 }) => (
                            <form onSubmit={submitForm}>
                                <div className="form-group-app mb-0">
                                    <AccountRSFormInput
                                        field={'recipient'}
                                        defaultValue={values.recipient || ''}
                                        label={'Send To'}
                                        placeholder={'Send To'}
                                        setValue={setValue}
                                    />
                                    <NummericInputForm
                                        field={'amountATM'}
                                        type={'tel'}
                                        label={'Amount APL'}
                                        setValue={setValue}
                                        placeholder={'Amount'}
                                    />
                                    <NummericInputForm
                                        field={'feeATM'}
                                        counterLabel={'APL'}
                                        type={'tel'}
                                        label={'Fee'}
                                        values={values}
                                        setValue={setValue}
                                        placeholder={'Fee'}
                                        defaultValue={"1"}
                                        disabledFee
                                        disableArrows
                                    />
                                    <button
                                        type={'submit'}
                                        className={'btn btn-corner-primary'}
                                    >
                                        <span>Send</span>
                                        <div className={'btn-arrow'}>
                                            <ArrowRight/>
                                        </div>
                                    </button>
                                </div>
                            </form>
                        )}
                    />
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

export default connect(null, mapDispatchToProps)(SendApollo)