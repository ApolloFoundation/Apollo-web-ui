import React from 'react';
import ContentLoader from '../../../components/content-loader';
import {connect} from 'react-redux';
import {formatTimestamp} from '../../../../helpers/util/time';
import {Link} from 'react-router-dom';
import {ONE_APL} from '../../../../constants';
import classNames  from 'classnames';

const AvailableBalance = ({dashboardAccoountInfo, actualBlock, blockchainStatus, positionState1, position1, formatTimestamp}) => (
    <div
        className={`card header ballance chart-sprite position-1 ${positionState1 ? "show-hide-content" : ""}`}>
        <div className="card-title">Available Balance</div>
        <div className="arrow-block" onClick={position1}>
            <div className="arrow"/>
        </div>
        {
            dashboardAccoountInfo &&
            <React.Fragment>
                <div className="page-body-item-content">

                    <div
                        onClick={() => this.props.setBodyModalParamsAction('ACCOUNT_DETAILS')}
                        style={{cursor: 'pointer', paddingRight: 0}}
                        className="amount"
                    >
                        {
                            dashboardAccoountInfo.unconfirmedBalanceATM &&
                            Math.round(dashboardAccoountInfo.unconfirmedBalanceATM / ONE_APL).toLocaleString('en')
                            || 0
                        }
                        <span className="currency">
                    &nbsp;APL
                </span>
                    </div>
                    <div className="account-sub-titles">
                        {dashboardAccoountInfo.accountRS}
                    </div>
                    {
                        actualBlock &&
                        <div className="account-sub-titles">
                            Block:&nbsp;{actualBlock.height}&nbsp;/&nbsp;{formatTimestamp(actualBlock.timestamp)}
                        </div>
                    }
                    {
                        blockchainStatus &&
                        blockchainStatus.blockTime &&
                        <div className="account-sub-titles">
                            Transaction Time :&nbsp;{blockchainStatus.blockTime} s
                        </div>
                    }
                </div>
            </React.Fragment>  ||
            <ContentLoader white noPaddingOnTheSides/>
        }
    </div>
)

const AssetsPortfolio = ({dashboardAssets, positionState2, position2}) => (
    <div
        className={`card header assets chart-sprite position-2 ${positionState2 ? "show-hide-content" : ""}`}>
        <div className="arrow-block" onClick={position2}>
            <div className="arrow"/>
        </div>
        <div className="card-title">Assets Value</div>
        {
            dashboardAssets &&
            <div className="page-body-item-content">
                <Link
                    to={'/my-assets'}
                    style={{display: 'block'}}
                    className="amount"
                >
                    <div className="text">
                        {Math.round(dashboardAssets.total).toLocaleString('en')}
                    </div>
                    {
                        Math.round(dashboardAssets.total) > 100000000000 &&
                        <div className="amount-tooltip">
                            <div className="amount-tooltip-text">
                                {Math.round(this.state.assetsValue).toLocaleString('en')}
                            </div>
                        </div>
                    }
                    <div className="owned">
                        {dashboardAssets.count} <span>Owned</span>
                    </div>
                </Link>
            </div>
        }
        {
            !dashboardAssets &&
            <ContentLoader white noPaddingOnTheSides/>
        }
    </div>
);

const CurrenciesVlue = ({dashboardCurrencies, position3, positionState3}) => (
    <div
        className={`card header currencies chart-sprite position-3 ${positionState3 ? "show-hide-content" : ""}`}>
        <div className="arrow-block" onClick={position3}>
            <div className="arrow"/>
        </div>
        <div className="card-title">Currencies Value</div>
        {
            dashboardCurrencies &&
            <div className="page-body-item-content">
                <Link
                    className="amount"
                    to={'/my-currencies'}
                    style={{display: 'block'}}
                >
                    {dashboardCurrencies.total}
                    <div className="owned">
                        {dashboardCurrencies.count} <span>Owned</span>
                    </div>
                </Link>
            </div>
        }
        {
            !dashboardCurrencies &&
            <ContentLoader white noPaddingOnTheSides/>
        }
    </div>
);

const GradientCard = (props) => {
    const {
        availableBalance,
        dashboardAccoountInfo,
        actualBlock,
        blockchainStatus,
        dashboardAssets,
        positionState1,
        position1,
        positionState2,
        position2,
        positionState3,
        position3,
        dashboardCurrencies,
        actuassetsValuealBlock,
        assetsCount,
        assetsValue,
        currenciesValue,
        formatTimestamp
    } = props;

    return (
        <div className="page-body-item ">
            {
                availableBalance &&
                <AvailableBalance
                    formatTimestamp={formatTimestamp}
                    dashboardAccoountInfo={dashboardAccoountInfo}
                    actualBlock={actualBlock}
                    blockchainStatus={blockchainStatus}
                    positionState1={positionState1}
                    position1={position1}
                />
            }
            {
                assetsValue &&
                <AssetsPortfolio
                    assetsCount={assetsCount}
                    dashboardAssets={dashboardAssets}
                    positionState2={positionState2}
                    position2={position2}
                />
            }
            {
                currenciesValue &&
                <CurrenciesVlue
                    dashboardCurrencies={dashboardCurrencies}
                    positionState3={positionState3}
                    position3={position3}
                />
            }
        </div>
    )
}

const mapDispatshToProps = dispatch => ({
    formatTimestamp : time => dispatch(formatTimestamp(time))
})

export default connect(null, mapDispatshToProps)(GradientCard);
