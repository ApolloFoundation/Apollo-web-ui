import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from "react-redux";
import {NotificationManager} from "react-notifications";
import {CopyToClipboard} from 'react-copy-to-clipboard';

import {setBodyModalParamsAction} from '../../../../modules/modals'

class CurrencyDescriptionComponent extends Component {
    render() {
        const {address, balance, currency} = this.props;
        return (
            <tr>
                <td>{address}</td>
                <td>{balance && balance.amount}</td>
                <td>
                    <div className="btn-box inline">
                        <Link
                            to={'/exchanger'}
                            className="btn primary bg-success"
                        >
                            Buy
                        </Link>
                    </div>
                </td>
                <td>
                    <div className="btn-box inline">
                        <Link
                            to={'/exchanger'}
                            className="btn primary bg-danger"
                        >
                            Sell
                        </Link>
                    </div>
                </td>
                <td>
                    <div className="btn-box inline">
                        <a
                            className="btn primary defaullt"
                        >
                            View History
                        </a>
                    </div>
                </td>
                <td className={'align-right'}>
                    <div className="btn-box inline">
                        <a
                            className="btn primary defaullt"
                            onClick={() => this.props.setBodyModalParamsAction('WITHDRAW_CURRENCY', {currency})}
                        >
                            Withdraw
                        </a>
                        <CopyToClipboard
                            text={address}
                            onCopy={() => {
                                NotificationManager.success('The wallet address has been copied to clipboard.')
                            }}
                        >
                            <a
                                className="btn primary blue"
                            >
                                Deposit
                            </a>
                        </CopyToClipboard>
                    </div>
                </td>
            </tr>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, value) => dispatch(setBodyModalParamsAction(type, value)),
});

export default connect(null, mapDispatchToProps)(CurrencyDescriptionComponent);