import React from "react";
import {connect} from "react-redux";
import {setBodyModalParamsAction} from "../../../../modules/modals";

class OfferItem extends React.Component {
    render() {
        const {offer} = this.props;
        return (
            <tr>
                <td className="blue-link-text" onClick={this.props.setBodyModalParamsAction.bind(this, 'INFO_ACCOUNT', offer.accountRS)}><a>{offer.accountRS}</a></td>
                <td className="align-right">{offer.supply / Math.pow(10, this.props.decimals)}</td>
                <td className="align-right">{offer.limit / Math.pow(10, this.props.decimals)}</td>
                <td className="align-right">{(offer.rateATM * Math.pow(10, this.props.decimals) / 100000000)}</td>
            </tr>
        );
    }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data))

});

export default connect(mapStateToProps, mapDispatchToProps)(OfferItem);