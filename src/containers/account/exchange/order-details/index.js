import React from 'react';
import {Form} from 'react-form';
import {connect} from 'react-redux';
import {getAllContractStatus, getContractStatus} from '../../../../actions/wallet';
import SiteHeader from '../../../components/site-header';
import TextualInputComponent from '../../../components/form-components/textual-input';
import SimpleProgressBar from '../../../components/simple-progress-bar/simple-progress-bar';

class OrderDetails extends React.Component {
    state = {
        gg: false,
    };

    componentDidMount() {
        this.props.getContractStatus({orderId: this.props.location.state.selectOrderId})
        this.props.getAllContractStatus({orderId: this.props.location.state.selectOrderId})
    }

    renderMoreDetails = () => {
        console.log(this.props);
        const {account: {accountRS}, selectedContractStatus} = this.props
        this.renderContractHistory()
        if (accountRS === selectedContractStatus[0].sender) {
            return this.renderBasicSenderContractInfo()
        } else {
            return this.renderBasicRecipientContractInfo()
        }
    }

    renderBasicSenderContractInfo = () => {
        const { orderId, counterOrderId, contractStatus , recipient, deadlineToReply, counterTransferTxId } = this.props.selectedContractStatus[0]
        return (
            <table>
                <tbody>
                    <tr>
                        <td>Your Order ID:</td>
                        <td>{orderId}</td>
                    </tr>
                    <tr>
                        <td>Partner Order ID:</td>
                        <td>{counterOrderId}</td>
                    </tr>
                    <tr>
                        <td>Partner Account:</td>
                        <td>{recipient}</td>
                    </tr>
                    <tr>
                        <td>Max waiting time:</td>
                        <td>{deadlineToReply}</td>
                    </tr>
                    {(contractStatus === 1 || contractStatus === 2) &&
                        <tr>
                            <td>Partner transfer
                                money transaction:</td>
                            <td>{counterTransferTxId}</td>
                        </tr>
                    }
                </tbody>
            </table>
        )
    }

    renderContractHistory = () => {
        const { allContractStatus } = this.props
        console.log(allContractStatus);
        
        return (
            <>
                {allContractStatus && allContractStatus.map(i =>
                    <div className="transaction-table details">
                        <table>
                            <tbody>
                                <tr>
                                    <td>Chain ID:</td>
                                    <td>{i.orderId}</td>
                                </tr>
                                <tr>
                                    <td>Chain Name:</td>
                                    <td>{i.counterOrderId}</td>
                                </tr>
                                <tr>
                                    <td>Project Name:</td>
                                    <td>{i.sender}</td>
                                </tr>
                                <tr>
                                    <td>Application:</td>
                                    <td>{i.deadlineToReply}</td>
                                </tr>
                                {(i.contractStatus === 1 || i.contractStatus === 2) &&
                                    <tr>
                                        <td>Coin symbol:</td>
                                        <td>{i.counterTransferTxId}</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                )}
            </>
        )
    }

    renderBasicRecipientContractInfo = () => {
        const { orderId, counterOrderId , sender, contractStatus, deadlineToReply, counterTransferTxId } = this.props.selectedContractStatus[0]
        return (
            <table>
                <tbody>
                    <tr>
                        <td>Chain ID:</td>
                        <td>{orderId}</td>
                    </tr>
                    <tr>
                        <td>Chain Name:</td>
                        <td>{counterOrderId}</td>
                    </tr>
                    <tr>
                        <td>Project Name:</td>
                        <td>{sender}</td>
                    </tr>
                    <tr>
                        <td>Application:</td>
                        <td>{deadlineToReply}</td>
                    </tr>
                    {(contractStatus === 1 || contractStatus === 2) &&
                        <tr>
                            <td>Coin symbol:</td>
                            <td>{counterTransferTxId}</td>
                        </tr>
                    }
                </tbody>
            </table>
        )
    }

    render() {
        const {typeName, pairRate, offerAmount, total, statusName, type} = this.props.location.state.orderInfo
        const {selectedContractStatus, allContractStatus} = this.props
        console.log(allContractStatus);
        
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
                                        onClick={() => this.setState({gg: !this.state.gg})}
                                    >
                                        {this.state.gg ? 'Hide more details' : 'Show more details'}
                                    </button></div>
                                <div className="card-body">
                                    <Form
                                        render={({submitForm, setValue, values, addValue, removeValue, getFormState}) => (
                                            <form className="modal-form" onSubmit={submitForm}>
                                                <div className="form-group-app">
                                                    {/* <div className="form-title">
                                                        <div className="form-sub-title">
                                                            Chosen order information
                                                        </div>
                                                    </div> */}
                                                    {!this.state.gg
                                                        ? <>
                                                            {selectedContractStatus && <SimpleProgressBar step={selectedContractStatus[0].contractStatus} time={selectedContractStatus[0].deadlineToReply} />}
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
                                                            {selectedContractStatus &&
                                                                <>
                                                                    <label>
                                                                        Conntract (Status) details
                                                                    </label>
                                                                    <div className="transaction-table details">
                                                                            {this.renderMoreDetails()}
                                                                    </div>
                                                                </>
                                                            }
                                                        </>
                                                        : allContractStatus && <>{selectedContractStatus && this.renderContractHistory()}</>
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
    account: account,
    selectedContractStatus: exchange.contractStatus,
    allContractStatus: exchange.allContractStatus,
});

const mapDispatchToProps = dispatch => ({
    getContractStatus: (options) => dispatch(getContractStatus(options)),
    getAllContractStatus: (options) => dispatch(getAllContractStatus(options)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetails)
