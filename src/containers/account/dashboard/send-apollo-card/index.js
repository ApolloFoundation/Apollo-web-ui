import React, {Component} from 'react';
import {connect} from 'react-redux';
import AccountRS from '../../../components/account-rs';
import {Form} from 'react-form';
import InputForm from '../../../components/input-form';
import {setBodyModalParamsAction, clearDashboardForm} from '../../../../modules/modals';

class SendApolloCard extends Component {
    
    submitForm = ({recipient, amountATM, feeATM}) => {
        this.props.setBodyModalParamsAction('SEND_APOLLO', {recipient, amountATM , feeATM});
    };

    openPrivateTransactionModalWindow = ({recipient, amountATM, feeATM}) => {
        this.props.setBodyModalParamsAction('SEND_APOLLO_PRIVATE', {recipient, amountATM ,feeATM});
    };

    getApi = (form) => {
        this.setState({form});
        clearDashboardForm(form);
    };

    render () {
        return (
            <div className={'page-body-item h-auto w-100 p-0'}>
                <Form
                    getApi={(form) => this.getApi(form)}
                    onSubmit={(values) => this.submitForm(values)}
                    render={({
                                 submitForm, setValue, values
                             }) => (
                        <form onSubmit={submitForm} className="card send-apollo mb-3">
                            <div className="card-title">Send Apollo</div>
                            <div className="card-body">
                                <div className="full-box">
                                    <div className="form-group-app mb-0">
                                        <div className="form-group">
                                            <label
                                                style={{"word-break": 'normal'}}
                                            >
                                                Recipient
                                            </label>
                                            <AccountRS
                                                field={'recipient'}
                                                setValue={setValue}
                                                placeholder="Account ID"
                                                noContactList
                                                defaultValue={values.recipient}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label
                                                style={{"word-break": 'normal'}}
                                            >
                                                Amount
                                            </label>
                                            <div>
                                                <div  style={{position: 'relative'}}>
                                                    <InputForm
                                                        field={'amountATM'}
                                                        placeholder={'Amount'}
                                                        type={'float'}
                                                        setValue={setValue}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label
                                                style={{"word-break": 'normal'}}
                                            >
                                                Fee
                                            </label>
                                            <div>
                                            <div  style={{position: 'relative'}}>
                                                <InputForm
                                                    field={'feeATM'}
                                                    placeholder={'Fee'}
                                                    type={'float'}
                                                    setValue={setValue}
                                                />
                                                </div>
                                            </div>
                                        </div>
                                        <a
                                            onClick={() => this.openPrivateTransactionModalWindow(values)}
                                            className="btn btn-left btn-simple btn-sm"
                                        >
                                            Private APL
                                        </a>
                                        <button
                                            className="btn btn-right btn-green btn-sm"
                                            data-modal="sendMoney"
                                        >
                                            Send&nbsp;
                                            <i className="arrow zmdi zmdi-chevron-right"/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}
                />
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});


export default connect(null, mapDispatchToProps)(SendApolloCard)