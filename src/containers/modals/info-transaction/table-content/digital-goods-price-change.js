import React, {Component} from "react";
import {connect} from "react-redux";
import submitForm from "helpers/forms/forms";

class DigitalGoodsPriceChange extends Component {

    state = {
        goodsName: "",
        seller: "",
        price: 0,
        quantity: 0,
        buyer: "",
    };

    async componentDidMount() {
        const goods = this.props.transaction.attachment.goods;
        const info = await this.props.submitForm({goods}, "getDGSGood");
        this.setState({
            goodsName: info.name,
            seller: info.sellerRS,
            price: info.priceATM / this.props.decimals,
        })
    }

    render() {

        return (
            <React.Fragment>
                <tr>
                    <td>Item Name:</td>
                    <td>{this.state.goodsName}</td>
                </tr>
                <tr>
                    <td>New Price:</td>
                    <td>{this.state.price}</td>
                </tr>
                <tr>
                    <td>Seller:</td>
                    <td>{this.state.seller}</td>
                </tr>
            </React.Fragment>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
});

export default connect(null, mapDispatchToProps)(DigitalGoodsPriceChange)
