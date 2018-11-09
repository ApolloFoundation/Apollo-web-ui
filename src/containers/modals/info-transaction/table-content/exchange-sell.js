import React, {Component} from "react";
import {getShufflingAction} from "../../../../actions/shuffling";
import {connect} from 'react-redux';
import {getCurrencyAction, getExchangesByExchangeRequest} from "../../../../actions/currencies";
import {formatTimestamp} from "../../../../helpers/util/time";


class SellCurrency extends Component {

    componentDidMount = () => {
        this.getCurrency();
        this.getExchangeOffers();
    }

    state = {};

    getCurrency = async () => {
        const currency = await this.props.getCurrencyAction({currency: this.props.transaction.attachment.currency});

        console.log(currency);

        if (currency) {
            this.setState({
                ...this.state,
                currency
            });
        }
    };

    getExchangeOffers = async () => {
        const exchanges = await getExchangesByExchangeRequest({transaction: this.props.transaction.transaction});

        console.log(exchanges);

        if (exchanges) {
            this.setState({
                ...this.state,
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
                    return parseInt(a) + parseInt(b)
                })

            return sum / Math.pow(10, this.state.currency.decimals);
        }
    };

    getTotalFromExchanges = (exchanges) => {
        if (exchanges && exchanges.length && this.state.currency) {
            let sum = exchanges.map((el) => {
                return parseInt(el.units / Math.pow(10, this.state.currency.decimals)) * parseInt(el.rateATM / Math.pow(10, this.state.currency.decimals));
            })
                .reduce((a,b) => {
                    return parseInt(a) + parseInt(b)
                })

            return sum;
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
                        <td>{this.props.transaction.attachment.units / Math.pow(10, this.state.currency.decimals)}</td>
                    </tr>
                }
                {
                    this.state.currency &&
                    this.state.exchanges &&
                    !!this.state.exchanges.length &&
                    <tr>
                        <td>Exchanges:</td>
                        <td>
                            <div className={'transaction-table no-min-height'}>
                                <div className={'transaction-table-body transparent no-border-top'}>
                                    <table>
                                        <thead>
                                        <tr>
                                            <td style={{padding: '20px 0 20px '}}>Date</td>
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
    constants: state.account.constants,
});

const mapDispatchToProps = dispatch => ({
    getCurrencyAction: (reqParams) => dispatch(getCurrencyAction(reqParams)),
    formatTimestamp: (timestamp, date_only, isAbsoluteTime) => dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime)),

});


export default connect(mapStateToProps, mapDispatchToProps)(SellCurrency)