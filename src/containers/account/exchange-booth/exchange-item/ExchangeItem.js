import React from "react";
import {connect} from "react-redux";

class ExchangeItem extends React.Component {
    render() {
        const {exchange} = this.props;
        return (
            <tr>
                <td className="align-left">{exchange.height}</td>
                <td className="align-right">{"buy"}</td>
                <td className="align-right">{Math.ceil(exchange.units / 100)}</td>
                <td className="align-right">{Math.ceil(exchange.rateATM / 6)}</td>
                <td className="align-right">{Math.ceil(exchange.rateATM / 6 * exchange.units / 100)}</td>
            </tr>
        );
    }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeItem);