import React from "react";
import {connect} from "react-redux";

class ExchangeItem extends React.Component {
    render() {
        const {exchange} = this.props;
        return (
            <tr>
                <td className="blue-link-text"><a>{exchange.height}</a></td>
                <td className="align-right">{"buy"}</td>
                <td className="align-right">{exchange.units / 100}</td>
                <td className="align-right">{exchange.rateATM / 6}</td>
                <td className="align-right">{exchange.rateATM / 6 * exchange.units / 100}</td>
            </tr>
        );
    }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeItem);