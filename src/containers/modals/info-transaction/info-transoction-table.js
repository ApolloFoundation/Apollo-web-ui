import React, {Component} from "react";
import {formatTransactionType} from "../../../actions/transactions";
import {connect} from "react-redux";

import CurrencyIssuance from "./table-content/currency-issuance";
import BuyCurrency from "./table-content/exchange-buy";
import SellCurrency from "./table-content/exchange-sell";
import CurrencyTransfer from "./table-content/currency-transfer";
import CurrencyExchangeOffer from "./table-content/publish-exchange-offer";
import ShufflingCreation from "./table-content/shuffling-creation";
import ShufflingRegistarion from "./table-content/shuffling-registration";
import ShufflingVerification from "./table-content/shuffling-verification";
import ShufflingProcessing from "./table-content/shuffling-processing";
import OrdinaryPayment from "./table-content/ordinary-payment";
import PrivatePayment from "./table-content/private-payment";
import TargetDataUpload from "./table-content/target-data-upload";
import AccountProperty from "./table-content/account-property";
import AccountPropertyDelete from "./table-content/account-property-delete";
import AliasDelete from "./table-content/alias-delete";
import VoteCasting from "./table-content/vote-casting";
import ArbitraryMessage from "./table-content/arbitrary-message";
import EffectiveBalanceLeasing from "./table-content/effective-balance-leasing";
import AliasAssignment from "./table-content/alias-assignment";
import AccountInfo from "./table-content/account-info";
import PollCreation from "./table-content/poll-creation";
import AliasSell from "./table-content/alias-sell";
import PhasingVoteCasting from "./table-content/phasing-vote-casting";
import ShufflingRecipients from "./table-content/shuffling-recipients";
import DigitalGoodsDelisting from "./table-content/digital-goods-delisting";
import DigitalGoodsPurchase from "./table-content/digital-goods-purchase";
import DigitalGoodsPriceChange from "./table-content/digital-goods-price-change";
import DigitalGoodsListing from "./table-content/digital-goods-listing";
import DigitalGoodsQuantityChange from "./table-content/digital-goods-quantity-change";
import AssetDelete from "./table-content/asset-delete";
import AssetTransfer from "./table-content/asset-transfer";
import AssetIssuance from "./table-content/asset-issuance";
import AskOrderPlacement from "./table-content/ask-order-placement";
import BigOrderPlacement from "./table-content/big-order-placement";


class InfoTransactionTable extends Component {

	render() {
		const modalTypeName = formatTransactionType(this.props.constants.transactionTypes[this.props.transaction.type].subtypes[this.props.transaction.subtype].name);

		return (
			<div className="transaction-table-body transparent">
				{
					this.props.transaction && this.props.constants.transactionTypes &&
					<table>
						<tbody>
						<tr>
							<td>Type:</td>
							<td>{formatTransactionType(this.props.constants.transactionTypes[this.props.transaction.type].subtypes[this.props.transaction.subtype].name)}</td>
						</tr>

						{modalTypeName === "CURRENCY ISSUANCE" && <CurrencyIssuance transaction={this.props.transaction}/>}

						{modalTypeName === "EXCHANGE BUY" && <BuyCurrency transaction={this.props.transaction}/>}

						{modalTypeName === "EXCHANGE SELL" && <SellCurrency transaction={this.props.transaction}/>}

						{modalTypeName === "CURRENCY TRANSFER" && <CurrencyTransfer transaction={this.props.transaction}/>}

						{modalTypeName === "PUBLISH EXCHANGE OFFER" && <CurrencyExchangeOffer transaction={this.props.transaction}/>}

						{modalTypeName === "SHUFFLING CREATION" && <ShufflingCreation transaction={this.props.transaction}/>}

						{modalTypeName === "SHUFFLING REGISTRATION" && <ShufflingRegistarion transaction={this.props.transaction}/>}

						{modalTypeName === "SHUFFLING VERIFICATION" && <ShufflingVerification transaction={this.props.transaction}/>}

						{modalTypeName === "SHUFFLING PROCESSING" && <ShufflingProcessing transaction={this.props.transaction}/>}

						{modalTypeName === "SHUFFLING RECIPIENTS" && <ShufflingRecipients transaction={this.props.transaction}/>}

						{modalTypeName === "ORDINARY PAYMENT" && <OrdinaryPayment transaction={this.props.transaction}/>}

						{modalTypeName === "PRIVATE PAYMENT" && <PrivatePayment transaction={this.props.transaction}/>}

						{modalTypeName === "TAGGED DATA UPLOAD" && <TargetDataUpload transaction={this.props.transaction}/>}

						{modalTypeName === "ACCOUNT PROPERTY" && <AccountProperty transaction={this.props.transaction}/>}

						{modalTypeName === "ACCOUNT PROPERTY DELETE" && <AccountPropertyDelete transaction={this.props.transaction}/>}

						{modalTypeName === "ALIAS DELETE" && <AliasDelete transaction={this.props.transaction}/>}

						{modalTypeName === "VOTE CASTING" && <VoteCasting transaction={this.props.transaction}/>}

						{modalTypeName === "ARBITRARY MESSAGE" && <ArbitraryMessage transaction={this.props.transaction}/>}

						{modalTypeName === "EFFECTIVE BALANCE LEASING" && <EffectiveBalanceLeasing transaction={this.props.transaction}/>}

						{modalTypeName === "ALIAS ASSIGNMENT" && <AliasAssignment transaction={this.props.transaction}/>}

						{modalTypeName === "ACCOUNT INFO" && <AccountInfo transaction={this.props.transaction}/>}

						{modalTypeName === "POLL CREATION" && <PollCreation transaction={this.props.transaction}/>}

						{modalTypeName === "ALIAS SELL" && <AliasSell transaction={this.props.transaction}/>}

						{modalTypeName === "PHASING VOTE CASTING" && <PhasingVoteCasting transaction={this.props.transaction}/>}

						{modalTypeName === "DIGITAL GOODS DELISTING" && <DigitalGoodsDelisting transaction={this.props.transaction}/>}

						{modalTypeName === "DIGITAL GOODS PURCHASE" && <DigitalGoodsPurchase transaction={this.props.transaction}/>}

						{modalTypeName === "DIGITAL GOODS PRICE CHANGE" && <DigitalGoodsPriceChange transaction={this.props.transaction}/>}

						{modalTypeName === "DIGITAL GOODS LISTING" && <DigitalGoodsListing transaction={this.props.transaction}/>}

						{modalTypeName === "DIGITAL GOODS QUANTITY CHANGE" && <DigitalGoodsQuantityChange transaction={this.props.transaction}/>}

						{modalTypeName === "ASSET DELETE" && <AssetDelete transaction={this.props.transaction}/>}

						{modalTypeName === "ASSET TRANSFER" && <AssetTransfer transaction={this.props.transaction}/>}

						{modalTypeName === "ASSET ISSUANCE" && <AssetIssuance transaction={this.props.transaction}/>}

						{modalTypeName === "BID ORDER PLACEMENT" && <BigOrderPlacement transaction={this.props.transaction}/>}

						{modalTypeName === "ASK ORDER PLACEMENT" && <AskOrderPlacement transaction={this.props.transaction}/>}

						</tbody>
					</table>
				}
			</div>
		);
	}
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(InfoTransactionTable);
