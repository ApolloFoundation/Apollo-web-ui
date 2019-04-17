import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from "react-redux";
import {NotificationManager} from "react-notifications";
import {CopyToClipboard} from 'react-copy-to-clipboard';

import {setBodyModalParamsAction} from '../../../../modules/modals';
import {formatCrypto} from '../../../../helpers/format';

class CurrencyDescriptionComponent extends Component {
    render() {
        const {address, balance, currency, handleCurrentCurrency} = this.props;
        const balanceFormat = formatCrypto(balance);
        return (
            <tr>
                <td>
                    <CopyToClipboard
                        text={address}
                        onCopy={() => {
                            NotificationManager.success('The wallet address has been copied to clipboard.')
                        }}
                    >
                        <span className="cursor-pointer">{address}</span>
                    </CopyToClipboard>
                </td>
                <td>{balanceFormat}</td>
                <td>
                    <div className="btn-box inline">
                        <Link
                            to={'/exchange'}
                            className="btn primary bg-success"
                            onClick={() => handleCurrentCurrency(currency)}
                        >
                            Buy
                        </Link>
                    </div>
                </td>
                <td>
                    <div className="btn-box inline">
                        <Link
                            to={'/exchange'}
                            className="btn primary bg-danger"
                            onClick={() => handleCurrentCurrency(currency)}
                        >
                            Sell
                        </Link>
                    </div>
                </td>
                <td>
                    <div className="btn-box inline">
                        <a
                            className="btn primary defaullt"
                            onClick={() => NotificationManager.error('This functionality will be delivered in April 2019.', 'Error', 5000)}
                        >
                            View History
                        </a>
                    </div>
                </td>
                <td className={'align-right'}>
                    <div className="btn-box inline pr-1">
                        <a
                            className="btn primary defaullt"
                            onClick={() => NotificationManager.error('This functionality will be delivered in April 2019.', 'Error', 5000)}
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