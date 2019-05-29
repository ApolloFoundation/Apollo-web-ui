import React, {Component} from 'react';
import {connect} from 'react-redux';
import ContentLoader from '../../../components/content-loader';
import {formatTimestamp} from "../../../../helpers/util/time";
import {setBodyModalParamsAction} from '../../../../modules/modals';
import {ONE_APL} from '../../../../constants';

class AvailableBalance extends Component {
    render() {
        const {dashboardAccoountInfo, actualBlock, setBodyModalParamsAction, blockchainStatus, positionState1, position1, timestamp, formatTimestamp} = this.props;

        return (
            <div
                className={`card ${positionState1 ? "show-hide-content" : ""}`}>
                <div className="card-title card-title-lg bg-primary">Available Balance</div>
                <div className="card-body">
                    <div
                        onClick={() => setBodyModalParamsAction('ACCOUNT_DETAILS')}
                        className="d-flex flex-column justify-content-between h-100 cursor-pointer"
                    >
                        {dashboardAccoountInfo ? (
                            <React.Fragment>
                                <div className="amount text-lg text-green mb-3">
                                    {
                                        dashboardAccoountInfo.unconfirmedBalanceATM &&
                                        Math.round(dashboardAccoountInfo.unconfirmedBalanceATM / ONE_APL).toLocaleString('en')
                                        || 0
                                    }
                                    <span className="currency">&nbsp;APL</span>
                                </div>
                                <div>
                                    <div className="account-sub-titles blue-link-text mb-2">
                                        {dashboardAccoountInfo.accountRS}
                                    </div>
                                    {
                                        actualBlock &&
                                        <div className="account-sub-titles text-sm mb-2">
                                            Block:&nbsp;{actualBlock}&nbsp;/&nbsp;{formatTimestamp(timestamp)}
                                        </div>
                                    }
                                    {
                                        blockchainStatus &&
                                        blockchainStatus.blockTime &&
                                        <div className="account-sub-titles text-sm mb-2">
                                            Transaction Time :&nbsp;{blockchainStatus.blockTime} s
                                        </div>
                                    }
                                </div>
                            </React.Fragment>
                        ) : (
                            <ContentLoader white noPaddingOnTheSides/>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    dashboardAccoountInfo: state.dashboard.dashboardAccoountInfo,
    actualBlock: state.account.actualBlock,
    timestamp: state.account.timestamp,
    blockchainStatus: state.account.blockchainStatus,
});

const mapDispatchToProps = dispatch => ({
    formatTimestamp: (time) => dispatch(formatTimestamp(time)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AvailableBalance)