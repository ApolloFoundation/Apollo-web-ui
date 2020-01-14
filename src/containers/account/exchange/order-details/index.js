import React from 'react';
import {Redirect} from 'react-router-dom'
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
        selectOrderId: null,
    };

    componentDidMount() {
        if (this.props.match.params.id) {
            this.props.getContractStatus({orderId: this.props.match.params.id});
            this.props.getAllContractStatus({orderId: this.props.match.params.id});
            this.setState({selectOrderId: this.props.match.params.id})
        }
    }

    renderMoreDetails = type => {
        const {account, selectedContractStatus, allContractStatus} = this.props;
        if (type) {
            return <ContractStatusItem isContractHistory account={account} contracts={allContractStatus}/>
        } else {
            return <ContractStatusItem account={account} contracts={selectedContractStatus}
                                       label={'Contract (Status) details'}/>
        }
    };

    handleBack = () => {
        this.props.history.push({
            pathname: `/order-history`,
        })
    };

    handleOpenContractHistory = () => {
        if (!(this.props.allContractStatus && this.props.allContractStatus.length)) {
            NotificationManager.error('Error', 'Error', 5000);
            return
        }
        this.setState((state) => ({isShowingContractHistory: !state.isShowingContractHistory}))
    };

    render() {
        const {orderInfo: {typeName, pairRate, offerAmount, total, statusName, type} = {}} = this.props.location.state || {};
        const {selectedContractStatus, allContractStatus, account} = this.props;
        const {isShowingContractHistory} = this.state;
        if (!this.props.location.state) return <Redirect to='/order-history'/>;
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Order Details'}
                />
                <div className="page-body container-fluid full-screen-block mb-3">
                    <div className="account-settings">
                        <div className="page-settings-item">
                            {this.state.selectOrderId && (
                                <div className={'card full-height mb-3'}>
                                    <div className="card-title">Order {this.state.selectOrderId}
                                        <div>
                                            <button
                                                type={'button'}
                                                className="btn btn-default mr-3"
                                                onClick={this.handleBack}
                                            >
                                                Back to list
                                            </button>
                                            <button
                                                type={'button'}
                                                className="btn btn-green"
                                                onClick={this.handleOpenContractHistory}
                                            >
                                                {isShowingContractHistory ? 'Hide more details' : 'Show more details'}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <Form
                                            render={() => (
                                                <form className="modal-form">
                                                    <div className="form-group-app">
                                                        {!isShowingContractHistory
                                                            ? <>
                                                                {!!(selectedContractStatus && selectedContractStatus.length) &&
                                                                <SimpleProgressBar
                                                                    step={selectedContractStatus[0].contractStatus}
                                                                    time={selectedContractStatus[0].deadlineToReply}
                                                                    blockTime={account.timestamp}
                                                                    status={statusName}
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
                            )}
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
