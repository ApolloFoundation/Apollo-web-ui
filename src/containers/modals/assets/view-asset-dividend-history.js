/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {openPrevModal, setBodyModalParamsAction} from '../../../modules/modals';
import {getDividendsHistory} from "../../../actions/assets";
import {formatTimestamp} from "../../../helpers/util/time";

// This modal don't call at any project place
class AssetDividendHistory extends React.Component {
    state = {
        dividends: []
    };

    componentDidUpdate = () => {
        if (this.props.account && !this.state.dividends) {
            this.getDividendHistory();
        }
    };

    componentDidMount() {
        this.getDividendHistory();
    }


    getDividendHistory = async () => {
        const assets = await getDividendsHistory({
            requestType: 'getAssetDividends',
            asset: this.props.modalData.asset
        });

        if (assets) {
            this.setState({
                dividends: assets.dividends
            })
        }
    };

    render() {
        return (
            <div className="modal-box x-wide">
                <div className="modal-form">
                    <div className="form-group-app">
                        <button type="button" onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close"/></button>

                        <div className="form-title">
                            <p>Asset Dividend History</p>
                        </div>

                        <div className="transaction-table no-min-height">
                            <div className="transaction-table-body transparent padding-vertical-padding">
                                {this.state.dividends &&
                                this.state.dividends.length > 0 ?
                                    <table>
                                        <thead>
                                        <tr>
                                            <td>Date</td>
                                            <td className="align-right">Dividend Height</td>
                                            <td>Total</td>
                                            <td>Accounts</td>
                                            <td>Amount per share</td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            this.state.dividends.map((el, index) => {

                                                return (
                                                    <tr>
                                                        <td
                                                            className={'blue-link-text'}>
                                                            <span
                                                                className={'blue-link-text'}
                                                                onClick={() => this.props.setBodyModalParamsAction('INFO_TRANSACTION', el.assetDividend)}>
                                                                {this.props.formatTimestamp(el.timestamp)}
                                                            </span>
                                                        </td>

                                                        <td className="align-right">{el.dividendHeight}</td>
                                                        <td>{el.totalDividend / this.props.decimals}</td>
                                                        <td>{el.numberOfAccounts}</td>
                                                        <td>{el.amountATMPerATU / 1000000}</td>
                                                    </tr>
                                                )
                                            })
                                        }

                                        </tbody>
                                    </table>
                                    :
                                    <p>
                                        No history available
                                    </p>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    modalsHistory: state.modals.modalsHistory,
    decimals: state.account.decimals,
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    formatTimestamp: (time) => dispatch(formatTimestamp(time)),
    openPrevModal: (Params) => dispatch(openPrevModal(Params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AssetDividendHistory);
