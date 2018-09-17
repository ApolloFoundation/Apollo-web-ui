import React from "react";
import {connect} from "react-redux";
import {formatTimestamp} from "../../../../helpers/util/time";
import {setBodyModalParamsAction} from "../../../../modules/modals";

class ExecutedItem extends React.Component {

    convertDecimalsToNum = decimals => {
        let num = 1;
        for (let i = 0; i < decimals; i++) {
            num = num * 10;
        }
        return num;
    };

    render() {
        const {exchange} = this.props;
        return (
            <tr>
                <td className="align-left">{this.props.formatTimestamp(exchange.timestamp)}</td>
                <td className="align-right blue-link-text" onClick={this.props.setBodyModalParamsAction.bind(this, 'INFO_ACCOUNT', exchange.sellerRS)}><a>{exchange.sellerRS}</a></td>
                <td className="align-right blue-link-text" onClick={exchange.buyerRS === this.props.account ? () => {} : this.props.setBodyModalParamsAction.bind(this, 'INFO_ACCOUNT', exchange.buyerRS)}><a>{exchange.buyerRS === this.props.account ? "You" : exchange.buyerRS}</a></td>
                <td className="align-right">{Math.ceil(exchange.units / this.convertDecimalsToNum(exchange.decimals))}</td>
                <td className="align-right">{Math.ceil(exchange.rateATM / this.convertDecimalsToNum(exchange.decimals))}</td>
                <td className="align-right">{Math.ceil((exchange.rateATM / this.convertDecimalsToNum(exchange.decimals)) * exchange.units / this.convertDecimalsToNum(exchange.decimals))}</td>
            </tr>
        );
    }
}

const mapStateToProps = state => ({
    account: state.account.accountRS
});

const mapDispatchToProps = dispatch => ({
    formatTimestamp: (timestamp, date_only, isAbsoluteTime) => dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data))
});

export default connect(mapStateToProps, mapDispatchToProps)(ExecutedItem);