import React, {Component} from "react";
import {getShufflingAction} from "../../../../actions/shuffling";
import {connect} from 'react-redux';
import {getCurrencyAction, getExchangesByExchangeRequest} from "../../../../actions/currencies";
import {formatTimestamp} from "../../../../helpers/util/time";


class BuyCurrency extends Component {

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
    }

    getExchangeOffers = async () => {
        const exchanges = await getExchangesByExchangeRequest({transaction: this.props.transaction.transaction});

        console.log(exchanges);

        if (exchanges) {
            this.setState({
                ...this.state,
                exchanges: exchanges.exchanges
            });
        }
    }

    render() {

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
                {/*{*/}
                    {/*this.state.currency.code &&*/}
                    {/*<tr>*/}
                        {/*<td>Rate:</td>*/}
                        {/*<td>{this.state.currency.code}</td>*/}
                    {/*</tr>*/}
                {/*}*/}
                {
                    this.state.currency &&
                    this.props.transaction.timestamp &&
                    <tr>
                        <td>Date:</td>
                        <td>{this.props.transaction.timestamp}</td>
                    </tr>
                }
                {
                    this.state.currency &&
                    this.state.exchanges &&
                    this.state.exchanges.length &&
                    <tr>
                        <td>Exchanges:</td>
                        <td>
                            <div className={'transaction-table no-min-height'}>
                                <div className={'transaction-table-body transparent'}>
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
                                                return (
                                                    <tr>
                                                        <td>{this.props.formatTimestamp(el.timestamp)}</td>
                                                        <td>{parseInt(el.units) / Math.pow(10, this.state.currency.decimals)}</td>
                                                        <td></td>
                                                        <td></td>
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
                    this.state.currency.timestamp &&
                    <tr>
                        <td>Date:</td>
                        <td>{this.state.currency.timestamp}</td>
                    </tr>
                }
                {
                    this.state.currency &&
                    this.state.currency.timestamp &&
                    <tr>
                        <td>Date:</td>
                        <td>{this.state.currency.timestamp}</td>
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


export default connect(mapStateToProps, mapDispatchToProps)(BuyCurrency)