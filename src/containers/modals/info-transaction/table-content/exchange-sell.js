import React, {Component} from "react";
import {connect} from 'react-redux';
import {getCurrencyAction, getExchangesByExchangeRequest} from "actions/currencies";
import {formatTimestamp} from "helpers/util/time";
import { getConstantsSelector } from "selectors";
import { bigIntDecimalsDivision, bigIntFormat, bigIntMultiply, bigIntSum } from "helpers/util/bigNumberWrappers";

class SellCurrency extends Component {

    componentDidMount = () => {
        this.getCurrency();
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
    };

    getExchangeOffers = async () => {
        const exchanges = await this.props.getExchangesByExchangeRequest({transaction: this.props.transaction.transaction});

        if (exchanges) {
            this.setState({
                exchanges: exchanges.exchanges
            });
        }
    };

    getUnitsFromExchanges = (exchanges) => {
        if (exchanges && exchanges.length &&  this.state.currency) {
            let sum = exchanges.map((el) => {
                return el.units;
            })
                .reduce((a,b) => {
                    return bigIntSum(a,b);
                })
            return bigIntFormat(bigIntDecimalsDivision(sum, this.state.currency.decimals));
        }
    };

    getTotalFromExchanges = (exchanges) => {
        if (exchanges && exchanges.length && this.state.currency) {
            let sum = exchanges.map((el) => {
                const a = bigIntDecimalsDivision(el.units, this.state.currency.decimals);
                const b = bigIntDecimalsDivision(el.rateATM, this.state.currency.decimals);
                return bigIntMultiply(a,b);
            })
                .reduce((a,b) => {
                    return bigIntSum(a,b)
                }, 0)

                return bigIntFormat(sum);
        }
    };

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
                        <td>Units:</td>
                        <td>{bigIntFormat(bigIntDecimalsDivision(this.props.transaction.attachment.units, this.state.currency.decimals))}</td>
                    </tr>
                }
                {
                    this.state.currency &&
                    this.state.exchanges &&
                    !!this.state.exchanges.length &&
                    <tr>
                        <td>Exchanges:</td>
                        <td>
                            <div className={'transaction-table no-min-height transparent'}>
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
                                                const units = bigIntDecimalsDivision(el.units, this.state.currency.decimals);
                                                const rate  = bigIntDecimalsDivision(el.rateATM, this.state.currency.decimals);
                                                const total = bigIntMultiply(units, rate);
                                                return (
                                                    <tr>
                                                        <td>{this.props.formatTimestamp(el.timestamp)}</td>
                                                        <td>{bigIntFormat(units)}</td>
                                                        <td>{bigIntFormat(rate)}</td>
                                                        <td>{bigIntFormat(total)}</td>
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
                    !!this.state.exchanges.length &&
                    <tr>
                        <td>Units Exchanged:</td>
                        <td>{unitExchanges}</td>
                    </tr>
                }
                {
                    this.state.currency &&
                    this.state.exchanges &&
                    !!this.state.exchanges.length &&
                    <tr>
                        <td>Total Exchanged:</td>
                        <td>{totalExchanges}</td>
                    </tr>
                }
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    constants: getConstantsSelector(state),
});

const mapDispatchToProps ={
    getCurrencyAction,
    formatTimestamp,
    getExchangesByExchangeRequest,
};


export default connect(mapStateToProps, mapDispatchToProps)(SellCurrency)