import React from 'react';
import {Form} from 'react-form';
import {connect} from 'react-redux';
import {getAllContractStatus, getContractStatus} from '../../../../actions/wallet';
import {NotificationManager} from "react-notifications";
import SiteHeader from '../../../components/site-header';
import TextualInputComponent from '../../../components/form-components/textual-input';
import SimpleProgressBar from '../../../components/simple-progress-bar/simple-progress-bar';
import ContractStatusItem from './contract-status-item';

class OrderDetails extends React.Component {
    state = {
        isShowingContractHistory: false,
    };

    componentDidMount() {
        this.props.getContractStatus({orderId: this.props.location.state.selectOrderId})
        this.props.getAllContractStatus({orderId: this.props.location.state.selectOrderId})
    }

    renderMoreDetails = type => {
        const {account, selectedContractStatus, allContractStatus} = this.props
        if (type) {
            return <ContractStatusItem isShowTime account={account} contract={allContractStatus} />
        } else {
            return <ContractStatusItem account={account} contract={selectedContractStatus} label={'Contract (Status) details'} />
        }
    }

    render() {
        const {typeName, pairRate, offerAmount, total, statusName, type} = this.props.location.state.orderInfo
        const {selectedContractStatus, allContractStatus, account} = this.props
        const {isShowingContractHistory} = this.state
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Order Details'}
                />
                <div className="page-body container-fluid full-screen-block">
                    <div className="account-settings">
                        <div className="page-settings-item">
                            <div className={'card full-height'}>
                                <div className="card-title">Order {this.props.location.state.selectOrderId}
                                    <button
                                        type={'button'}
                                        className="btn btn-green"
                                        onClick={() => {
                                            if(!allContractStatus) {
                                                NotificationManager.error('Error', 'Error', 5000);
                                                return 
                                            }
                                            this.setState({isShowingContractHistory: !isShowingContractHistory})
                                        }}
                                    >
                                        {isShowingContractHistory ? 'Hide more details' : 'Show more details'}
                                    </button>
                                </div>
                                <div className="card-body">
                                    <Form
                                        render={() => (
                                            <form className="modal-form">
                                                <div className="form-group-app">
                                                    {/* <div className="form-title">
                                                        <div className="form-sub-title">
                                                            Chosen order information
                                                        </div>
                                                    </div> */}
                                                    {!isShowingContractHistory
                                                        ? <>
                                                            {!!(selectedContractStatus && selectedContractStatus.length) &&
                                                                <SimpleProgressBar
                                                                    step={selectedContractStatus[0].contractStatus}
                                                                    time={selectedContractStatus[0].deadlineToReply}
                                                                    blockTime={account.timestamp}
                                                                />}
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
                                                            {!!(selectedContractStatus && selectedContractStatus.length) && this.renderMoreDetails()}
                                                        </>
                                                        : !!(allContractStatus && allContractStatus.length) && this.renderMoreDetails('history')
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
