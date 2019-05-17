import React, {Component} from "react";
import {ONE_APL} from '../../../../constants';

export default class DigitalGoodsListing extends Component {

    render() {
        const atch = this.props.transaction.attachment;
        return (
            <React.Fragment>
                <tr>
                    <td>Name:</td>
                    <td>{atch.name}</td>
                </tr>
                <tr>
                    <td>Description:</td>
                    <td>{atch.description}</td>
                </tr>
                <tr>
                    <td>Price:</td>
                    <td>{atch.priceATM / ONE_APL}</td>
                </tr>
                <tr>
                    <td>Quantity:</td>
                    <td>{atch.quantity}</td>
                </tr>
            </React.Fragment>
        );
    }
}
