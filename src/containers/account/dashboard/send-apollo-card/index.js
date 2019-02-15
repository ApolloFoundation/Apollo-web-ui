import React, {Component} from 'react';
import {connect} from 'react-redux';
import AccountRS from '../../../components/account-rs';
import {Form} from 'react-form';
import InputForm from '../../../components/input-form';
import {setBodyModalParamsAction, clearDashboardForm} from '../../../../modules/modals';

class SendApolloCard extends Component {
    
    submitForm = ({recipient, amountATM, feeAPL}) => {
        this.props.setBodyModalParamsAction('SEND_APOLLO', {recipient, amountATM , feeAPL})
    }

    opnePrivateTransactionModalWindow = ({recipient, amountATM, feeAPL}) => {
        this.props.setBodyModalParamsAction('SEND_APOLLO_PRIVATE', {recipient, amountATM ,feeAPL}) 
    }

    getApi = (form) => {
        this.setState({form})
        clearDashboardForm(form)
    }

    render () {
        return (
            <div className={'page-body-item h-auto w-100 p-0'}>
                <Form
                    getApi={(form) => this.getApi(form)}
                    onSubmit={(values) => this.submitForm(values)}
                    render={({
                            submitForm, setValue, getFormState
                        }) => (
                            <form onSubmit={submitForm} className="card send-apollo mb-3">
                                <div className="card-title">Send Apollo</div>
                                <div className="full-box">
                                    <div className="form-group-app offset">
                                        <div className="input-group-app lighten">
                                            <label
                                                style={{"word-break": 'normal'}}
                                            >
                                                Recipient
                                            </label>
                                            <AccountRS 
                                                field={'recipient'}
                                                setValue={setValue}
                                                plsceholder="Account ID"
                                                noContactList
                                                value={getFormState().values.recipient}
                                            />
                                        </div>
                                        <div className="input-group-app lighten">
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
                                        <div className="input-group-app lighten">
                                            <label
                                                style={{"word-break": 'normal'}}
                                            >
                                                Fee
                                            </label>
                                            <div>
                                            <div  style={{position: 'relative'}}>
                                                <InputForm
                                                    field={'feeAPL'}
                                                    placeholder={'Amount'}
                                                    type={'float'}
                                                    setValue={setValue}
                                                />
                                                </div>
                                            </div>
                                        </div> 
                                    </div>                                   
                                </div>
                                <a
                                    onClick={() => this.opnePrivateTransactionModalWindow(getFormState().values)}
                                    className="btn absolute btn-left btn-simple"
                                    style={{margin: '0 0 -7px 35px'}}
                                >
                                    Private APL
                                </a>
                                <button
                                    className="btn btn-right gray round round-bottom-right round-top-left absolute"
                                    data-modal="sendMoney"
                                    >
                                        Send&nbsp;
                                    <i className="arrow zmdi zmdi-chevron-right"/>
                                </button>
                            </form>
                        )}
                />
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
})


export default connect(null, mapDispatchToProps)(SendApolloCard)