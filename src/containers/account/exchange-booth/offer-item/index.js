import React from "react";
import {connect} from "react-redux";

class OfferItem extends React.Component {
    render() {
        const {offer, decimals} = this.props;
        return (
            <tr>
                <td className="blue-link-text"><a>{offer.accountRS}</a></td>
                <td className="align-right">{offer.supply}</td>
                <td className="align-right">{offer.supply}</td>
                <td className="align-right">{offer.rateATM / 100}</td>
            </tr>
        );
    }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(OfferItem);