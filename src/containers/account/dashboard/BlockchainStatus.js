import React, {Component} from 'react';
import {connect} from 'react-redux';
import {NotificationManager} from 'react-notifications';
import ContentLoader from '../../components/content-loader';
import {formatTimestamp} from "../../../helpers/util/time";
import {setBodyModalParamsAction} from '../../../modules/modals';
import {getForging, setForging} from "../../../actions/login";
import {ReactComponent as ClockIcon} from "../../../assets/clock-icon.svg";

class BlockchainStatus extends Component {
    setForgingData = (action) => {
        return {
            getStatus: action,
            handleSuccess: (res) => {
                this.setState({forgingStatus: res});
            }
        }
    };

    handleSetForging = async (action) => {
        if (!this.props.effectiveBalanceAPL || this.props.effectiveBalanceAPL < 1000) {
            NotificationManager.error('Your effective balance must be greater than 1000 APL to forge.', 'Error', 5000);
            return;
        }
        const passPhrase = JSON.parse(localStorage.getItem('secretPhrase')) || this.props.secretPhrase;
        if (!passPhrase || this.props.is2FA) {
            this.props.setBodyModalParamsAction('CONFIRM_FORGING', this.setForgingData(action))
        } else {
            const forging = await this.props.setForging({requestType: action});

            if (forging) {
                if (!forging.errorCode) {
                    const forgingStatus = await this.props.getForging();

                    if (!forgingStatus.errorCode || forgingStatus.errorCode === 5) {
                        this.setState({forgingStatus: forgingStatus});
                    } else {
                        NotificationManager.error('Something went wrong. Please, try again later', 'Error', 5000);
                    }
                } else {
                    NotificationManager.error(forging.errorDescription, 'Error', 5000);
                }
            }
        }
    };

    render() {
        const {actualBlock, blockchainStatus, timestamp, formatTimestamp, forgingStatus} = this.props;
        return (
            <div className={`card card-success card-h-195`}>
                <div className="card-title">
                    <div className={'title'}>Blockchain Status</div>
                    <div className={'connect-status-wrap'}>
                        <div className="connect-status success">
                            <div className="connect-icon"/>
                            <span>Live</span>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <div className={'mb-3'}>
                        <div className={'ml-15'}>
                            {!!(actualBlock && timestamp) ? (
                                <>
                                    <p className={'label label-icon-left'}>
                                        <ClockIcon/>Last updated:
                                    </p>
                                    <p>Block {actualBlock}</p>
                                    <p>{formatTimestamp(timestamp)}</p>
                                </>
                            ) : (
                                <ContentLoader white noPaddingOnTheSides className={'m-0'}/>
                            )}
                            {!!(blockchainStatus && blockchainStatus.blockTime) && (
                                <div>
                                    <span className={'label'}>Transaction time:&nbsp;</span>
                                    <span>{blockchainStatus.blockTime} sec</span>
                                </div>
                            )}
                        </div>
                    </div>
                    {forgingStatus ? (
                        !forgingStatus.errorCode ? (
                            <div className="connect-status success">
                                <div className={'d-flex align-items-center'}>
                                    <div className="connect-icon"/>
                                    <span>Forging</span>
                                </div>
                                <button
                                    type={'button'}
                                    className={'btn btn-white ml-2'}
                                    onClick={() => this.handleSetForging('stopForging')}
                                >
                                    Stop Forging
                                </button>
                            </div>
                        ) : (
                            <div className="connect-status">
                                <div className={'d-flex align-items-center'}>
                                    <div className="connect-icon"/>
                                    <span>{forgingStatus.errorCode === 5 ? "Not forging" : "Unknown forging status"}</span>
                                </div>
                                <button
                                    type={'button'}
                                    className={'btn btn-white ml-2'}
                                    onClick={() => this.handleSetForging('startForging')}
                                >
                                    Start Forging
                                </button>
                            </div>
                        )
                    ) : (
                        <ContentLoader white noPaddingOnTheSides className={'m-0'}/>
                    )}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    actualBlock: state.account.actualBlock,
    timestamp: state.account.timestamp,
    blockchainStatus: state.account.blockchainStatus,
    forgingStatus: state.account.forgingStatus,
    secretPhrase: state.account.passPhrase,
    is2FA: state.account.is2FA,
    effectiveBalanceAPL: state.account.effectiveBalanceAPL,
});

const mapDispatchToProps = dispatch => ({
    formatTimestamp: (time) => dispatch(formatTimestamp(time)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    setForging: (reqParams) => dispatch(setForging(reqParams)),
    getForging: (reqParams) => dispatch(getForging(reqParams)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BlockchainStatus)