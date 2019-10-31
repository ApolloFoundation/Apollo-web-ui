import React from 'react';
import {connect} from 'react-redux';
import {NotificationManager} from "react-notifications";
import {CopyToClipboard} from "react-copy-to-clipboard";
import ContentLoader from '../../components/content-loader';
import {setBodyModalParamsAction} from '../../../modules/modals';
import {ONE_APL} from '../../../constants';

const TotalBalance = ({dashboardAccountInfo, setBodyModalParamsAction}) => {
    const balanceAPL = (dashboardAccountInfo && dashboardAccountInfo.unconfirmedBalanceATM)
        ? (dashboardAccountInfo.unconfirmedBalanceATM / ONE_APL).toLocaleString('de-DE', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }) 
        : 0;
    return (
        <div className={`card card-primary card-h-195`}>
            <div
                className="card-title cursor-pointer"
                onClick={() => setBodyModalParamsAction('ACCOUNT_DETAILS')}
            >
                <div className={'title'}>Available Balance</div>
            </div>
            <div className="card-body">
                {dashboardAccountInfo ? (
                    <>
                        <div
                            className={'balance-info cursor-pointer'}
                            onClick={() => setBodyModalParamsAction('ACCOUNT_DETAILS')}
                        >
                            <span className={'balance'}>{balanceAPL}</span>
                            <span className={'currency'}>APL</span>
                        </div>
                        <div className={'wallet-info'}>
                            <span className={'label'}>Active Wallet ID:</span>
                            <CopyToClipboard
                                text={dashboardAccountInfo.accountRS}
                                onCopy={() => {
                                    NotificationManager.success('The account has been copied to clipboard.')
                                }}
                            >
                                <div className={'wallet-id-wrap cursor-pointer'}>{dashboardAccountInfo.accountRS}</div>
                            </CopyToClipboard>
                        </div>
                    </>
                ) : (
                    <ContentLoader white noPaddingOnTheSides/>
                )}
            </div>
        </div>
    )
};

const mapStateToProps = state => ({
    dashboardAccountInfo: state.dashboard.dashboardAccoountInfo,
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TotalBalance)