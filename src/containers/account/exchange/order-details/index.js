import React from 'react';
import {Form} from 'react-form';
import {connect} from 'react-redux';
import {setCurrentCurrencyAction} from '../../../../modules/exchange';
import {setBodyModalParamsAction} from '../../../../modules/modals';
import {getMyOfferHistory, getContractStatus} from '../../../../actions/wallet';
import SiteHeader from '../../../components/site-header';
import TextualInputComponent from '../../../components/form-components/textual-input';

class OrderDetails extends React.Component {
    state = {
        gg: false,
    };

    handleOpenDetailedInformation = async () => {
        console.log(this.props);
        await this.props.getContractStatus({orderId: this.props.location.state.selectOrderId})
        this.setState({gg: !this.state.gg})
    }

    renderBasicSenderContractInfo = () => {
        const { orderId, counterOrderId, contractStatus , recipient, deadlineToReply, counterTransferTxId } = this.props.contractStatus[0]
        console.log(this.props.contractStatus[0]);
        
        return (
        <>
            <TextualInputComponent
                label={'Your Order ID'}
                defaultValue={orderId}
                disabled
                placeholder={'Your Order ID'}
            />
            <TextualInputComponent
                label={'Partner Order ID'}
                defaultValue={counterOrderId}
                disabled
                placeholder={'Partner Order ID'}
            />
            <TextualInputComponent
                label={'Partner Account'}
                defaultValue={recipient}
                disabled
                placeholder={'Partner Account'}
            />
            <TextualInputComponent
                label={'Max waiting time'}
                defaultValue={deadlineToReply}
                disabled
                placeholder={'Max waiting time'}
            />
            {contractStatus !== 0 &&
                <TextualInputComponent
                    label={'Partner(Recipient) transfer money transaction'}
                    defaultValue={counterTransferTxId}
                    disabled
                    placeholder={'Partner(Recipient) transfer money transaction'}
                />
            }
        </>)
    }

    renderBasicRecipientContractInfo = () => {
        const { orderId, counterOrderId , sender, contractStatus, deadlineToReply, counterTransferTxId } = this.props.contractStatus[0]
        return (
        <>
            <TextualInputComponent
                label={'Your Order ID'}
                defaultValue={counterOrderId}
                disabled
                placeholder={'Your Order ID'}
            />
            <TextualInputComponent
                label={'Partner Order ID'}
                defaultValue={orderId}
                disabled
                placeholder={'Partner Order ID'}
            />
            <TextualInputComponent
                label={'Partner Account'}
                defaultValue={sender}
                disabled
                placeholder={'Partner Account'}
            />
            <TextualInputComponent
                label={'Max waiting time'}
                defaultValue={deadlineToReply}
                disabled
                placeholder={'Max waiting time'}
            />
            {contractStatus !== 0 &&
                <TextualInputComponent
                    label={'Partner(Recipient) transfer money transaction'}
                    defaultValue={counterTransferTxId}
                    disabled
                    placeholder={'Partner(Recipient) transfer money transaction'}
                />
            }
        </>)
    }

    render() {
        console.log(this.props.contractStatus);
        const {typeName, pairRate, offerAmount, total, statusName, type} = this.props.location.state.orderInfo
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Order Details'}
                />
                <div className="page-body container-fluid full-screen-block">
                    <div className="account-settings">
                        <div className="page-settings-item">
                            <div className={'card full-height'}>
                                <div className="card-title">Order 341235412234 
                                    <button
                                        type={'button'}
                                        className="btn btn-green"
                                        onClick={() => this.handleOpenDetailedInformation()}
                                    >
                                        {this.state.gg ? 'Hide more details' : 'Show more details'}
                                    </button></div>
                                <div className="card-body">
                                    <Form
                                        render={({submitForm, setValue, values, addValue, removeValue, getFormState}) => (
                                            <form className="modal-form" onSubmit={submitForm}>
                                                <div className="form-group-app">
                                                    <div className="form-title">
                                                        <div className="form-sub-title">
                                                            Chosen order information
                                                        </div>
                                                    </div>
                                                    {!this.state.gg
                                                        ? <>
                                                            <TextualInputComponent
                                                                field={'current'}
                                                                label={'Pair Name'}
                                                                defaultValue={`APL/${type.toUpperCase()}`}
                                                                disabled
                                                                placeholder={'Pair Name'}
                                                            />
                                                            <TextualInputComponent
                                                                field={'typeName'}
                                                                label={'Type'}
                                                                defaultValue={typeName}
                                                                disabled
                                                                placeholder={'Type'}
                                                            />
                                                            <TextualInputComponent
                                                                field={'pairRate'}
                                                                label={'Price'}
                                                                defaultValue={pairRate}
                                                                disabled
                                                                placeholder={'Price'}
                                                            />
                                                            <TextualInputComponent
                                                                field={'offerAmount'}
                                                                label={'Amount'}
                                                                defaultValue={offerAmount}
                                                                disabled
                                                                placeholder={'Amount'}
                                                            />
                                                            <TextualInputComponent
                                                                field={'total'}
                                                                label={'Total'}
                                                                disabled
                                                                defaultValue={total}
                                                                placeholder={'Total'}
                                                            />
                                                            <TextualInputComponent
                                                                field={'status'}
                                                                label={'Status'}
                                                                defaultValue={statusName}
                                                                disabled
                                                                placeholder={'Status'}
                                                            />
                                                        </>
                                                        : this.props.account === this.props.contractStatus.sender ? this.renderBasicSenderContractInfo() : this.renderBasicRecipientContractInfo()
                                                    }
                                                </div>
                                            </form>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({exchange, account}) => ({
    account: account.account,
    contractStatus: exchange.contractStatus,
});

const mapDispatchToProps = dispatch => ({
    getContractStatus: (options) => dispatch(getContractStatus(options)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetails)
