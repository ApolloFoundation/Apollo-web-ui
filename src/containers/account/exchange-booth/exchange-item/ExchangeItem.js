import React from "react";
import {connect} from "react-redux";

class ExchangeItem extends React.Component {
    render() {
        const {exchange} = this.props;
        return (
            <tr>
                <td className="align-left">{exchange.height}</td>
                <td className="align-right">{"buy"}</td>
                <td className="align-right">{(parseInt(exchange.units) / Math.pow(10, this.props.decimals))}</td>
                <td className="align-right">{((exchange.rateATM / 100000000) * Math.pow(10, this.props.decimals)).toFixed(2)}</td>
                <td className="align-right">{(((parseInt(exchange.units) / Math.pow(10, this.props.decimals))) * ((exchange.rateATM / 100000000))* Math.pow(10, this.props.decimals)).toFixed(2)}</td>
            </tr>
        );s
    }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeItem);