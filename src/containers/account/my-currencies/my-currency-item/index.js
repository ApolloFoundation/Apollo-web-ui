import React from 'react';
import uuid from 'uuid';
import {Link} from 'react-router-dom';
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {connect} from 'react-redux';
import {formatTimestamp} from "../../../../helpers/util/time";

class MyCurrencytemItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            transfer: this.props.currency
        }
    }

    render () {
        if (this.state.transfer) {
            return (
                <tr key={uuid()}>
                    <td>{this.state.transfer.code}</td>
                    <td>{this.state.transfer.name}</td>
                    <td className="align-right">{(this.state.transfer.unconfirmedUnits / Math.pow(10, this.state.transfer.decimals)).toFixed(2)}</td>
                    <td className="align-right">
                        <div className="btn-box inline">
                            <Link to={"/exchange-booth/" + this.state.transfer.code} className="btn primary blue">Exchange</Link>
                            <a
                                onClick={() => this.props.setBodyModalParamsAction('TRANSFER_CURRENCY', this.state.transfer)}
                                style={{marginLeft: 15}}
                                className="btn primary blue"
                            >
                                Transfer
                            </a>
                            <a
                                onClick={() => this.props.setBodyModalParamsAction('OFFER_CURRENCY', this.state.transfer)}
                                className="btn primary blue"
                            >
                                Offer
                            </a>
                        </div>
                    </td>
                </tr>
            );
        } else {
            return (
                <tr key={uuid()}></tr>
            );
        }
    }
}

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    formatTimestamp: (timestamp, date_only, isAbsoluteTime) => dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime)),
});

export default connect(null, mapDispatchToProps)(MyCurrencytemItem);

