import React, {Component} from "react";
import {connect} from "react-redux";
import submitForm from "../../../../helpers/forms/forms";


/*
amountATM: "0"
attachment: {version.DigitalGoodsDelisting: 1, goods: "16777559807621099207"}
block: "8311244647661380783"
blockTimestamp: 25053613
confirmations: 12812
deadline: 1440
ecBlockHeight: 226179
ecBlockId: "13396143486085366297"
feeATM: "3300000000"
fullHash: "7f7c71fd5a331daf14efed6b307ad9bbcb23b1b0d7f5ffe8ef4dc4d11528be21"
height: 226900
phased: false
requestProcessingTime: 0
sender: "9211698109297098287"
senderPublicKey: "bf0ced0472d8ba3df9e21808e98e61b34404aad737e2bae1778cebc698b40f37"
senderRS: "APL-NZKH-MZRE-2CTT-98NPZ"
signature: "57087f5a79a8dd9aaf50543dc42a8f09e0f70002d6448952d60d42955ded74005eeead4cb8b4a36f0688605b762082df198d49d5086cf7b83e3ed6159e7eaf8d"
signatureHash: "b91b5be784edf8897850e575a74ec44f921d359c48723c72fc62b67dc38322e8"
subtype: 1
timestamp: 25053619
transaction: "12618298196854144127"
transactionIndex: 0
type: 3
version: 1
 */
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
            price: info.priceATM / 1000000000,
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