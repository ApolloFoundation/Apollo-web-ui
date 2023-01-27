import React, {Component} from "react";
import {connect} from "react-redux";
import submitForm from "helpers/forms/forms";

class DigitalGoodsQuantityChange extends Component {

    state = {
        name: "",
        seller: "",
    };

    async componentDidMount() {
        const goods = this.props.transaction.attachment.goods;
        const info = await this.props.submitForm({goods}, "getDGSGood");
        this.setState({
            name: info.name,
            seller: info.sellerRS,
        })
    }

    render() {
        const atch = this.props.transaction.attachment;
        return (
            <React.Fragment>
                <tr>
                    <td>Item Name:</td>
                    <td>{this.state.name}</td>
                </tr>
                <tr>
                    <td>Delta Quantity:</td>
                    <td>{atch.deltaQuantity}</td>
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

export default connect(null, mapDispatchToProps)(DigitalGoodsQuantityChange);