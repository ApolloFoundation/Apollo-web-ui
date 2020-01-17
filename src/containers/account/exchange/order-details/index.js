import React from 'react';
import {Form} from 'react-form';
import {connect} from 'react-redux';
import {NotificationManager} from 'react-notifications';
import {getAllContractStatus, getContractStatus, getOrderById} from '../../../../actions/wallet';
import SiteHeader from '../../../components/site-header';
import TextualInputComponent from '../../../components/form-components/textual-input';
import SimpleProgressBar from '../../../components/simple-progress-bar/simple-progress-bar';
import InfoBox from "../../../components/info-box";
import ContentLoader from "../../../components/content-loader";
import ContractStatusItem from './contract-status-item';
import {currencyTypes, formatDivision} from "../../../../helpers/format";
import {ONE_GWEI} from "../../../../constants";

class OrderDetails extends React.Component {
    state = {
        isPending: true,
        isShowingContractHistory: false,
        selectOrderId: null,
        orderInfo: null,
    };

    componentDidMount() {
        if (this.props.match.params.id) {
            this.getOrder(this.props.match.params.id);
        }
    }

    statusOfOrder = status => {
        const allStatuses = {
            0: 'Open',
            1: 'Pending',
            2: 'Expired',
            3: 'Cancel',
            4: 'Waiting approval',
            5: 'Closed',
        };

        return allStatuses[status];
    };

    getOrder = async orderId => {
        const orderInfo = await this.props.getOrderById(orderId);
        if (orderInfo) {
            this.props.getContractStatus({orderId, accountId: orderInfo.accountId});
            this.props.getAllContractStatus({orderId, accountId: orderInfo.accountId});

            const pairRate = formatDivision(orderInfo.pairRate, ONE_GWEI, 9);
            const offerAmount = formatDivision(orderInfo.offerAmount, ONE_GWEI, 9);
            const total = formatDivision(orderInfo.pairRate * orderInfo.offerAmount, Math.pow(10, 18), 9);
            const currency = orderInfo.pairCurrency;
            const statusName = this.statusOfOrder(orderInfo.status);
            const typeName = orderInfo.type ? 'SELL' : 'BUY';
            const type = Object.keys(currencyTypes).find(key => currencyTypes[key] === currency).toUpperCase();
            this.setState({
                isPending: false,
                selectOrderId: orderId,
                orderInfo: {...orderInfo, pairRate, offerAmount, total, currency, typeName, statusName, type}
            });
        } else {
            this.setState({
                isPending: false,
                selectOrderId: orderId
            });
        }
    };

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
            return;
        }
        this.setState((state) => ({isShowingContractHistory: !state.isShowingContractHistory}));
    };

    render() {
        const {orderInfo, isShowingContractHistory, isPending} = this.state;
        const {selectedContractStatus, allContractStatus, account} = this.props;
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Order Details'}
                />
                <div className="page-body container-fluid full-screen-block mb-3">
                    {!isPending ? (
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
                                                {orderInfo && (
                                                    <button
                                                        type={'button'}
                                                        className="btn btn-green"
                                                        onClick={this.handleOpenContractHistory}
                                                    >
                                                        {isShowingContractHistory ? 'Hide more details' : 'Show more details'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            {orderInfo ? (
                                                <>
                                                    {!orderInfo.hasFrozenMoney && orderInfo.status !== 2 && orderInfo.status !== 3 && orderInfo.status !== 5 && (
                                                        <InfoBox default>
                                                            Order cant be matched, your deposit doesnt allow to freeze
                                                            funds.
                                                        </InfoBox>
                                                    )}

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
                                                                                status={orderInfo.statusName}
                                                                            />}
                                                                            <TextualInputComponent
                                                                                field={'current'}
                                                                                label={'Pair Name'}
                                                                                defaultValue={`APL/${orderInfo.type.toUpperCase()}`}
                                                                                disabled
                                                                                placeholder={'Pair Name'}
                                                                            />
                                                                            <TextualInputComponent
                                                                                field={'typeName'}
                                                                                label={'Type'}
                                                                                defaultValue={orderInfo.typeName}
                                                                                disabled
                                                                                placeholder={'Type'}
                                                                            />
                                                                            <TextualInputComponent
                                                                                field={'pairRate'}
                                                                                label={'Price'}
                                                                                defaultValue={orderInfo.pairRate}
                                                                                disabled
                                                                                placeholder={'Price'}
                                                                            />
                                                                            <TextualInputComponent
                                                                                field={'offerAmount'}
                                                                                label={'Amount'}
                                                                                defaultValue={orderInfo.offerAmount}
                                                                                disabled
                                                                                placeholder={'Amount'}
                                                                            />
                                                                            <TextualInputComponent
                                                                                field={'total'}
                                                                                label={'Total'}
                                                                                disabled
                                                                                defaultValue={orderInfo.total}
                                                                                placeholder={'Total'}
                                                                            />
                                                                            <TextualInputComponent
                                                                                field={'status'}
                                                                                label={'Status'}
                                                                                defaultValue={orderInfo.statusName}
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
                                                </>
                                            ) : (
                                                <InfoBox default>
                                                    Order not found.
                                                </InfoBox>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <ContentLoader/>
                    )}
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
    getOrderById: (orderId) => dispatch(getOrderById(orderId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetails)
