import React, {Component} from "react";
import {connect} from 'react-redux';
import {getCurrencyAction, getExchangesByOfferRequest, getOfferRequest} from "../../../../actions/currencies";
import {formatTimestamp} from "../../../../helpers/util/time";
import { getConstantsSelector } from "../../../../selectors";


class CurrencyExchangeOffer extends Component {

    componentDidMount = () => {
        this.getCurrency();
        this.getOfferRequest();
        this.getExchangeOffers();
    }

    state = {};

    getCurrency = async () => {
        const currency = await this.props.getCurrencyAction({currency: this.props.transaction.attachment.currency});

        if (currency) {
            this.setState({
                currency
            });
        }
    }

    getExchangeOffers = async () => {
        const exchanges = await getExchangesByOfferRequest({offer: this.props.transaction.transaction});

        if (exchanges) {
            this.setState({
                exchanges: exchanges.exchanges
            });
        }
    }

    getOfferRequest = async () => {
        const exchanges = await getOfferRequest({offer: this.props.transaction.transaction});

        if (exchanges) {
            this.setState({
                exchanges: exchanges.exchanges
            });
        }
    }

    getUnitsFromExchanges = (exchanges) => {
        if (exchanges && this.state.currency && this.state.currency.length) {
            let sum = exchanges.map((el) => {
                return el.units;
            })
                .reduce((a,b) => {
                    return parseInt(a) + parseInt(b)
                })

            return sum / Math.pow(10, this.state.currency.decimals);
        }
    }

    getTotalFromExchanges = (exchanges) => {
        if (exchanges && this.state.currency && this.state.currency.length) {
            let sum = exchanges.map((el) => {
                return parseInt(el.units / Math.pow(10, this.state.currency.decimals)) * parseInt(el.rateATM / Math.pow(10, this.state.currency.decimals));
            })
                .reduce((a,b) => {
                    return parseInt(a) + parseInt(b)
                })

            return sum;
        }
    }

    render() {
        const unitExchanges = this.getUnitsFromExchanges(this.state.exchanges);
        const totalExchanges = this.getTotalFromExchanges(this.state.exchanges);


        return(
            <React.Fragment>
                {
                    this.state.currency &&
                    this.state.currency.code &&
                    <tr>
                        <td>Code:</td>
                        <td>{this.state.currency.code}</td>
                    </tr>
                }
                {
                    this.state.currency &&
                    this.state.currency.code &&
                    this.props.transaction &&
                    <tr>
                        <td>Buy Supply:</td>
                        <td>{this.props.transaction.attachment.totalBuyLimit / Math.pow(10, this.state.currency.decimals)} (initial : {this.props.transaction.attachment.initialBuySupply / Math.pow(10, this.state.currency.decimals)})</td>
                    </tr>
                }
                {
                    this.state.currency &&
                    this.props.transaction.timestamp &&
                    <tr>
                        <td>Buy Limit:</td>
                        <td>{this.props.transaction.attachment.totalBuyLimit / Math.pow(10, this.state.currency.decimals)} (initial : {this.props.transaction.attachment.initialBuySupply / Math.pow(10, this.state.currency.decimals)})</td>
                    </tr>
                }
                {
                    this.state.currency &&
                    this.state.currency.code &&
                    this.props.transaction &&
                    <tr>
                        <td>Sell Supply:</td>
                        <td>{this.props.transaction.attachment.totalSellLimit / Math.pow(10, this.state.currency.decimals)} (initial : {this.props.transaction.attachment.initialSellSupply / Math.pow(10, this.state.currency.decimals)})</td>
                    </tr>
                }
                {
                    this.state.currency &&
                    this.props.transaction.timestamp &&
                    <tr>
                        <td>Sell Limit:</td>
                        <td>{this.props.transaction.attachment.totalSellLimit / Math.pow(10, this.state.currency.decimals)} (initial : {this.props.transaction.attachment.initialSellSupply / Math.pow(10, this.state.currency.decimals)})</td>
                    </tr>
                }
                {
                    this.state.currency &&
                    this.state.exchanges &&
                    this.state.exchanges.length &&
                    <tr>
                        <td>Exchanges:</td>
                        <td>
                            <div className={'transaction-table transparent no-min-height'}>
                                <div className={'transaction-table-body transparent no-border-top no-padding'}>
                                    <table>
                                        <thead>
                                        <tr>
                                            <td>Date</td>
                                            <td>Units</td>
                                            <td>Rate</td>
                                            <td>Total</td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            this.state.exchanges.map((el) => {
                                                const units = parseInt(el.units) / Math.pow(10, this.state.currency.decimals)
                                                const rate  = parseInt(el.rateATM) / Math.pow(10, this.state.currency.decimals)
                                                return (
                                                    <tr>
                                                        <td>{this.props.formatTimestamp(el.timestamp)}</td>
                                                        <td>{units}</td>
                                                        <td>{units}</td>
                                                        <td>{units * rate}</td>
                                                    </tr>
                                                );
                                            })
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </td>
                    </tr>
                }
                {
                    this.state.currency &&
                    this.state.exchanges &&
                    this.state.exchanges.length &&
                    <tr>
                        <td>Units Exchanged:</td>
                        <td>{unitExchanges}</td>
                    </tr>
                }
                {
                    this.state.currency &&
                    this.state.exchanges &&
                    this.state.exchanges.length &&
                    <tr>
                        <td>Total Exchanged:</td>
                        <td>{totalExchanges} {this.props.ticker}</td>
                    </tr>
                }
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    constants: getConstantsSelector(state),
});

const mapDispatchToProps = {
    getCurrencyAction,
    formatTimestamp,
};

export default connect(mapStateToProps, mapDispatchToProps)(CurrencyExchangeOffer)
