import React from "react";
import {connect} from "react-redux";

class ExchangeItem extends React.Component {
    render() {
        const {exchange, setBlockInfo} = this.props;
        return (
            <tr>
                <td className="blue-link-text"><a onClick={setBlockInfo.bind(this, 'INFO_BLOCK', exchange.height)}>{exchange.height}</a></td>
                <td>{"buy"}</td>
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