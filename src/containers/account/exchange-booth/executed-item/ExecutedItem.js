import React from "react";
import {connect} from "react-redux";
import {formatTimestamp} from "../../../../helpers/util/time";

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
                <td className="blue-link-text"><a>{this.props.formatTimestamp(exchange.timestamp)}</a></td>
                <td className="align-right">{exchange.sellerRS}</td>
                <td className="align-right">{exchange.buyerRS === this.props.account ? "You" : exchange.buyerRS}</td>
                <td className="align-right">{exchange.units / this.convertDecimalsToNum(exchange.decimals)}</td>
                <td className="align-right">{exchange.rateATM / this.convertDecimalsToNum(exchange.decimals)}</td>
                <td className="align-right">{exchange.rateATM / this.convertDecimalsToNum(exchange.decimals) * exchange.units / this.convertDecimalsToNum(exchange.decimals)}</td>
            </tr>
        );
    }
}

const mapStateToProps = state => ({
    account: state.account.accountRS
});

const mapDispatchToProps = dispatch => ({
    formatTimestamp: (timestamp, date_only, isAbsoluteTime) => dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExecutedItem);