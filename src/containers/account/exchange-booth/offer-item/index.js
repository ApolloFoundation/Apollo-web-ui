/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from "react";
import {connect} from "react-redux";
import {setBodyModalParamsAction} from "../../../../modules/modals";

class OfferItem extends React.Component {
    render() {
        const {...offer} = this.props;
        return (
            <tr>
                <td className="blue-link-text" onClick={this.props.setBodyModalParamsAction.bind(this, 'INFO_ACCOUNT', offer.accountRS)}><a>{offer.accountRS}</a></td>
                <td className="align-right">{offer.supply / Math.pow(10, this.props.decimals)}</td>
                <td className="align-right">{offer.limit / Math.pow(10, this.props.decimals)}</td>
                <td className="align-right">{(offer.rateATM * Math.pow(10, this.props.decimals) / this.props.currentCoinDecimals)}</td>
            </tr>
        );
    }
}

const mapStateToProps = state => ({
  currentCoinDecimals: state.account.decimals,
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),

});

export default connect(mapStateToProps, mapDispatchToProps)(OfferItem);
