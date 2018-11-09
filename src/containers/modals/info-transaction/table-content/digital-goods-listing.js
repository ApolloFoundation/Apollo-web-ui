import React, {Component} from "react";

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
                    <td>{atch.priceATM / 100000000}</td>
                </tr>
                <tr>
                    <td>Quantity:</td>
                    <td>{atch.quantity}</td>
                </tr>
                <tr>
                    <td>Public Message:</td>
                    <td>{atch.messageIsText ? atch.message : "Binary data"}</td>
                </tr>
            </React.Fragment>
        );
    }
}