import React from 'react';
import {Link} from 'react-router-dom';
import SiteHeader from '../../components/site-header'
import ExchangeBoothTable from './exchange-booth-table';
import {connect} from 'react-redux';
import {getCurrencyAction, getAllCurrenciesAction} from "../../../actions/currencies";
import classNames from "classnames";
import {BlockUpdater} from "../../block-subscriber";

const mapDispatchToProps = dispatch => ({
    getCurrencyAction: (reqParams) => dispatch(getCurrencyAction(reqParams)),
    getAllCurrenciesAction: (reqParams) => dispatch(getAllCurrenciesAction(reqParams))
});

class ExchangeBooth extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currency: null
        };
    }

    listener = data => {
        this.getCurrency({code: this.props.match.params.currency});
        this.getCurrencies();
    };

    componentDidMount() {
        this.getCurrency({code: this.props.match.params.currency});
        this.getCurrencies();
        BlockUpdater.on("data", this.listener);
    }

    componentWillUnmount() {
        BlockUpdater.off("data", this.listener);
    }

    componentWillReceiveProps(newState) {
        this.getCurrency({code: newState.match.params.currency});
        this.getCurrencies();
    }

    getCurrency = async (reqParams) => {
        const currency = await this.props.getCurrencyAction(reqParams);

        if (currency) {

            this.setState({
                ...this.state,
                ...currency
            });
        }
    };

    getCurrencies = async (reqParams) => {
        const allCurrencies = await this.props.getAllCurrenciesAction(reqParams);

        if (allCurrencies) {
            this.setState({
                currencies: allCurrencies.currencies
            })
        }
    };

	render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Exchange booth'}
                />
                {
                    this.state.currency &&
                    <div className="page-body container-fluid assets-exchange">
	                    <div className="row">
		                    <div className="col-md-4">
			                    <div className="card card-full-screen no-padding scroll">
				                    {
					                    this.state.currencies &&
					                    this.state.currencies.map((el, index) => {

                                            return (
							                    <Link
								                    style={{display: 'block'}}
								                    to={"/exchange-booth/" + (el ? el.code : "")}
								                    className={classNames({
									                    "chat-item": true,
									                    "active": this.state.currency === (el ? el.currency : "")
								                    })}
							                    >
								                    <div className="chat-box-item">
									                    <div className="chat-box-rs">
										                    {el ? el.name : ""}
									                    </div>
									                    <div className="chat-date">
										                    Quantity:&nbsp;{el ? el.initialQuantityATU : 0 * Math.pow(10, el ? el.decimals : 0)}
									                    </div>
								                    </div>
							                    </Link>
						                    );
					                    })
				                    }
			                    </div>
		                    </div>
		                    <div className="col-md-8">
			                    <div className="row">
				                    <div className="col-md-6">
					                    <div className="card header ballance medium-padding">
						                    <div className="row">
							                    <div className="col-md-6">
								                    <div className="card-title medium">{this.state.code}</div>
							                    </div>
							                    <div className="col-md-6 flex">
								                    <div className="card-title small">{this.state.description}</div>
							                    </div>
						                    </div>
					                    </div>
					                    <div className="card ballance auto-height medium-padding">
						                    <div className="form-group-app">
							                    <div className="form-title">
								                    <p>Buy {this.state.code}</p>
								                    <div className="form-sub-title">
									                    balance: <strong>8,686 NXT</strong>
								                    </div>
							                    </div>
							                    <div
								                    className="input-group-app offset-top display-block inline no-margin">
								                    <div className="form-group row form-group-white">
									                    <div className="col-md-3 pl-0">
										                    <label>Quantity</label>
									                    </div>
									                    <div className="col-md-9 pr-0 input-group input-group-text-transparent">
										                    <input ref="quantity1" placeholder='Recipient' className={"form-control"}/>
										                    <div className="input-group-append">
											                    <span className="input-group-text" id="amountText">{this.state.code}</span>
										                    </div>
									                    </div>
								                    </div>
							                    </div>
							                    <div
								                    className="input-group-app offset-top display-block inline no-margin">
								                    <div className="form-group row form-group-white">
									                    <div className="col-md-3 pl-0">
										                    <label>Price</label>
									                    </div>
									                    <div className="col-md-9 pr-0 input-group input-group-text-transparent">
										                    <input ref="priceATM1" placeholder='Quantity' className={"form-control"}/>
										                    <div className="input-group-append">
											                    <span className="input-group-text" id="amountText">{this.state.code}</span>
										                    </div>
									                    </div>
								                    </div>
							                    </div>
							                    <div
								                    className="input-group-app offset-top display-block inline no-margin">
								                    <div className="form-group row form-group-white">
									                    <div className="col-md-3 pl-0">
										                    <label>Total</label>
									                    </div>
									                    <div className="col-md-9 pr-0 input-group input-group-text-transparent">
										                    <input ref="total1" placeholder='Price' className={"form-control"}/>
										                    <div className="input-group-append">
											                    <span className="input-group-text" id="amountText">{this.state.code}</span>
										                    </div>
									                    </div>
								                    </div>
							                    </div>
							                    <div
								                    className="input-group-app offset-top display-block inline no-margin">
								                    <div className="row form-group-white">
									                    <div className="col-md-3 pl-0">
									                    </div>
									                    <div className="col-md-9 pr-0">
										                    <button className="btn static blue">Buy ({this.state.code} > {this.state.code})</button>
									                    </div>
								                    </div>
							                    </div>
						                    </div>
					                    </div>
				                    </div>
				                    <div className="col-md-6">
					                    <div className="card header assets medium-padding">
						                    <div className="full-box full">
							                    <div className="full-box-item">
								                    <div className='box'>
									                    <div className="card-title bold">Account:</div>
									                    <div className="card-title description">{this.state.accountRS}</div>
								                    </div>
								                    <div className='box'>
									                    <div className="card-title bold">Currency ID:</div>
									                    <div className="card-title asset-id description">{this.state.currency}</div>
								                    </div>
							                    </div>
							                    <div className="full-box-item">
								                    <div className='box'>
									                    <div className="card-title bold">Current supply:</div>
									                    <div className="card-title description">{this.state.currentSupply / 100000000}</div>
								                    </div>
								                    <div className='box'>
									                    <div className="card-title bold">Max supply:</div>
									                    <div className="card-title description">{this.state.maxSupply / 100000000}</div>
								                    </div>
								                    <div className='box'>
									                    <div className="card-title bold">Currency decimals:</div>
									                    <div className="card-title description">{this.state.decimals}</div>
								                    </div>
							                    </div>
						                    </div>
					                    </div>
					                    <div className="card assets auto-height medium-padding">
						                    <div className="form-group-app">
							                    <div className="form-title">
								                    <p>Sell {this.state.code}</p>
								                    <div className="form-sub-title">
									                    balance: <strong>8,686 NXT</strong>
								                    </div>
							                    </div>
							                    <div
								                    className="input-group-app offset-top display-block inline no-margin">
								                    <div className="form-group row form-group-white">
									                    <div className="col-md-3 pl-0">
										                    <label>Quantity</label>
									                    </div>
									                    <div className="col-md-9 pr-0 input-group input-group-text-transparent">
										                    <input ref="quantity1" placeholder='Recipient' className={"form-control"}/>
										                    <div className="input-group-append">
											                    <span className="input-group-text" id="amountText">{this.state.code}</span>
										                    </div>
									                    </div>
								                    </div>
							                    </div>
							                    <div
								                    className="input-group-app offset-top display-block inline no-margin">
								                    <div className="form-group row form-group-white">
									                    <div className="col-md-3 pl-0">
										                    <label>Price</label>
									                    </div>
									                    <div className="col-md-9 pr-0 input-group input-group-text-transparent">
										                    <input ref="priceATM1" placeholder='Quantity' className={"form-control"}/>
										                    <div className="input-group-append">
											                    <span className="input-group-text" id="amountText">{this.state.code}</span>
										                    </div>
									                    </div>
								                    </div>
							                    </div>
							                    <div
								                    className="input-group-app offset-top display-block inline no-margin">
								                    <div className="form-group row form-group-white">
									                    <div className="col-md-3 pl-0">
										                    <label>Total</label>
									                    </div>
									                    <div className="col-md-9 pr-0 input-group input-group-text-transparent">
										                    <input ref="total1" placeholder='Price' className={"form-control"}/>
										                    <div className="input-group-append">
											                    <span className="input-group-text" id="amountText">{this.state.code}</span>
										                    </div>
									                    </div>
								                    </div>
							                    </div>
							                    <div
								                    className="input-group-app offset-top display-block inline no-margin">
								                    <div className="row form-group-white">
									                    <div className="col-md-3 pl-0">
									                    </div>
									                    <div className="col-md-9 pr-0">
										                    <button className="btn static blue">Sell ({this.state.code} > {this.state.code})</button>
									                    </div>
								                    </div>
							                    </div>
						                    </div>
					                    </div>
				                    </div>
				                    <div className="col-md-12 no-padding">
					                    <div className="row">
						                    <div className="col-md-6">
							                    <div className="card ballance medium-padding">
								                    <div className="form-group-app">
									                    <div className="form-title">
										                    <p>Offers to sell SECRT</p>
									                    </div>
									                    <div className="info-box simple">
										                    <p>No open buy offers. You cannot sell this currency now, but you could publish an exchange offer instead, and wait for others to fill it.</p>
									                    </div>
									                    {/*<div className="transaction-table no-min-height">*/}
									                    {/*<div className="transaction-table-body padding-only-top">*/}
									                    {/*<table>*/}
									                    {/*<thead>*/}
									                    {/*<tr>*/}
									                    {/*<td>Account</td>*/}
									                    {/*<td className="align-right">Units</td>*/}
									                    {/*<td className="align-right">Limit</td>*/}
									                    {/*<td className="align-right">Rate</td>*/}
									                    {/*</tr>*/}
									                    {/*</thead>*/}
									                    {/*<tbody>*/}
									                    {/*<tr>*/}
									                    {/*<td className="blue-link-text"><a>APL-3LCH-GAAS-8ND5-B38B7</a></td>*/}
									                    {/*<td className="align-right">9,999,995</td >*/}
									                    {/*<td className="align-right">10,999,995</td>*/}
									                    {/*<td className="align-right">10</td>*/}
									                    {/*</tr>*/}
									                    {/*</tbody>*/}
									                    {/*</table>*/}
									                    {/*</div>*/}
									                    {/*</div>*/}
								                    </div>
							                    </div>
						                    </div>
						                    <div className="col-md-6">
							                    <div className="card assets medium-padding">
								                    <div className="form-group-app">
									                    <div className="form-title">
										                    <p>Offers to buy KKT</p>
									                    </div>
									                    <div className="info-box simple">
										                    <p>No open buy offers. You cannot sell this currency now, but you could publish an exchange offer instead, and wait for others to fill it.</p>
									                    </div>
								                    </div>
							                    </div>
						                    </div>
					                    </div>
				                    </div>
				                    <div className="col-md-12">
					                    <div className="card ballance medium-padding">
						                    <div className="form-group-app">
							                    <div className="form-title">
								                    <p>Exchange requests</p>
							                    </div>
							                    <div className="info-box simple">
								                    <p>No open buy offers. You cannot sell this currency now, but you could publish an exchange offer instead, and wait for others to fill it.</p>
							                    </div>
							                    {/*<div className="transaction-table no-min-height">*/}
							                    {/*<div className="transaction-table-body padding-only-top">*/}
							                    {/*<table>*/}
							                    {/*<thead>*/}
							                    {/*<tr>*/}
							                    {/*<td>Account</td>*/}
							                    {/*<td className="align-right">Units</td>*/}
							                    {/*<td className="align-right">Limit</td>*/}
							                    {/*<td className="align-right">Rate</td>*/}
							                    {/*</tr>*/}
							                    {/*</thead>*/}
							                    {/*<tbody>*/}
							                    {/*<tr>*/}
							                    {/*<td className="blue-link-text"><a>APL-3LCH-GAAS-8ND5-B38B7</a></td>*/}
							                    {/*<td className="align-right">9,999,995</td >*/}
							                    {/*<td className="align-right">10,999,995</td>*/}
							                    {/*<td className="align-right">10</td>*/}
							                    {/*</tr>*/}
							                    {/*</tbody>*/}
							                    {/*</table>*/}
							                    {/*</div>*/}
							                    {/*</div>*/}
						                    </div>
					                    </div>
				                    </div>
				                    <div className="col-md-12">
					                    <div className="card ballance medium-padding card-flexible">
						                    <div className="form-group-app">
							                    <div className="form-title">
								                    <p>Executed exchanges</p>
							                    </div>
							                    <div className="info-box simple">
								                    <p>No open buy offers. You cannot sell this currency now, but you could publish an exchange offer instead, and wait for others to fill it.</p>
							                    </div>
							                    {/*<div className="transaction-table no-min-height">*/}
							                    {/*<div className="transaction-table-body padding-only-top">*/}
							                    {/*<table>*/}
							                    {/*<thead>*/}
							                    {/*<tr>*/}
							                    {/*<td className="align-right">Date</td>*/}
							                    {/*<td className="align-right">Seller</td>*/}
							                    {/*<td className="align-right">Buyer</td>*/}
							                    {/*<td className="align-right">Units</td>*/}
							                    {/*<td className="align-right">Rate</td>*/}
							                    {/*<td className="align-right">Total</td>*/}
							                    {/*</tr>*/}
							                    {/*</thead>*/}
							                    {/*<tbody>*/}
							                    {/*<tr>*/}
							                    {/*<td className="blue-link-text">*/}
							                    {/*<a>6/13/2018  11:34:03</a>*/}
							                    {/*</td>*/}
							                    {/*<td className="align-right blue-link-text">*/}
							                    {/*<a>APL-3LCH-GAAS-8ND5-B38B7</a>*/}
							                    {/*</td >*/}
							                    {/*<td className="align-right blue-link-text">*/}
							                    {/*<a>APL-3LCH-GAAS-8ND5-B38B7</a>*/}
							                    {/*</td>*/}
							                    {/*<td className="align-right">*/}
							                    {/*5.0*/}
							                    {/*</td>*/}
							                    {/*<td className="align-right">*/}
							                    {/*10*/}
							                    {/*</td>*/}
							                    {/*<td className="align-right">*/}
							                    {/*50*/}
							                    {/*</td>*/}
							                    {/*</tr>*/}
							                    {/*<tr>*/}
							                    {/*<td className="blue-link-text">*/}
							                    {/*<a>6/13/2018  11:34:03</a>*/}
							                    {/*</td>*/}
							                    {/*<td className="align-right blue-link-text">*/}
							                    {/*<a>APL-3LCH-GAAS-8ND5-B38B7</a>*/}
							                    {/*</td >*/}
							                    {/*<td className="align-right blue-link-text">*/}
							                    {/*<a>APL-3LCH-GAAS-8ND5-B38B7</a>*/}
							                    {/*</td>*/}
							                    {/*<td className="align-right">*/}
							                    {/*5.0*/}
							                    {/*</td>*/}
							                    {/*<td className="align-right">*/}
							                    {/*10*/}
							                    {/*</td>*/}
							                    {/*<td className="align-right">*/}
							                    {/*50*/}
							                    {/*</td>*/}
							                    {/*</tr>*/}
							                    {/*<tr>*/}
							                    {/*<td className="blue-link-text">*/}
							                    {/*<a>6/13/2018  11:34:03</a>*/}
							                    {/*</td>*/}
							                    {/*<td className="align-right blue-link-text">*/}
							                    {/*<a>APL-3LCH-GAAS-8ND5-B38B7</a>*/}
							                    {/*</td >*/}
							                    {/*<td className="align-right blue-link-text">*/}
							                    {/*<a>APL-3LCH-GAAS-8ND5-B38B7</a>*/}
							                    {/*</td>*/}
							                    {/*<td className="align-right">*/}
							                    {/*5.0*/}
							                    {/*</td>*/}
							                    {/*<td className="align-right">*/}
							                    {/*10*/}
							                    {/*</td>*/}
							                    {/*<td className="align-right">*/}
							                    {/*50*/}
							                    {/*</td>*/}
							                    {/*</tr>*/}
							                    {/*<tr>*/}
							                    {/*<td className="blue-link-text">*/}
							                    {/*<a>6/13/2018  11:34:03</a>*/}
							                    {/*</td>*/}
							                    {/*<td className="align-right blue-link-text">*/}
							                    {/*<a>APL-3LCH-GAAS-8ND5-B38B7</a>*/}
							                    {/*</td >*/}
							                    {/*<td className="align-right blue-link-text">*/}
							                    {/*<a>APL-3LCH-GAAS-8ND5-B38B7</a>*/}
							                    {/*</td>*/}
							                    {/*<td className="align-right">*/}
							                    {/*5.0*/}
							                    {/*</td>*/}
							                    {/*<td className="align-right">*/}
							                    {/*10*/}
							                    {/*</td>*/}
							                    {/*<td className="align-right">*/}
							                    {/*50*/}
							                    {/*</td>*/}
							                    {/*</tr>*/}
							                    {/*<tr>*/}
							                    {/*<td className="blue-link-text">*/}
							                    {/*<a>6/13/2018  11:34:03</a>*/}
							                    {/*</td>*/}
							                    {/*<td className="align-right blue-link-text">*/}
							                    {/*<a>APL-3LCH-GAAS-8ND5-B38B7</a>*/}
							                    {/*</td >*/}
							                    {/*<td className="align-right blue-link-text">*/}
							                    {/*<a>APL-3LCH-GAAS-8ND5-B38B7</a>*/}
							                    {/*</td>*/}
							                    {/*<td className="align-right">*/}
							                    {/*5.0*/}
							                    {/*</td>*/}
							                    {/*<td className="align-right">*/}
							                    {/*10*/}
							                    {/*</td>*/}
							                    {/*<td className="align-right">*/}
							                    {/*50*/}
							                    {/*</td>*/}
							                    {/*</tr>*/}
							                    {/*<tr>*/}
							                    {/*<td className="blue-link-text">*/}
							                    {/*<a>6/13/2018  11:34:03</a>*/}
							                    {/*</td>*/}
							                    {/*<td className="align-right blue-link-text">*/}
							                    {/*<a>APL-3LCH-GAAS-8ND5-B38B7</a>*/}
							                    {/*</td >*/}
							                    {/*<td className="align-right blue-link-text">*/}
							                    {/*<a>APL-3LCH-GAAS-8ND5-B38B7</a>*/}
							                    {/*</td>*/}
							                    {/*<td className="align-right">*/}
							                    {/*5.0*/}
							                    {/*</td>*/}
							                    {/*<td className="align-right">*/}
							                    {/*10*/}
							                    {/*</td>*/}
							                    {/*<td className="align-right">*/}
							                    {/*50*/}
							                    {/*</td>*/}
							                    {/*</tr>*/}
							                    {/*<tr>*/}
							                    {/*<td className="blue-link-text">*/}
							                    {/*<a>6/13/2018  11:34:03</a>*/}
							                    {/*</td>*/}
							                    {/*<td className="align-right blue-link-text">*/}
							                    {/*<a>APL-3LCH-GAAS-8ND5-B38B7</a>*/}
							                    {/*</td >*/}
							                    {/*<td className="align-right blue-link-text">*/}
							                    {/*<a>APL-3LCH-GAAS-8ND5-B38B7</a>*/}
							                    {/*</td>*/}
							                    {/*<td className="align-right">*/}
							                    {/*5.0*/}
							                    {/*</td>*/}
							                    {/*<td className="align-right">*/}
							                    {/*10*/}
							                    {/*</td>*/}
							                    {/*<td className="align-right">*/}
							                    {/*50*/}
							                    {/*</td>*/}
							                    {/*</tr>*/}

							                    {/*</tbody>*/}
							                    {/*</table>*/}
							                    {/*</div>*/}
							                    {/*</div>*/}
						                    </div>
					                    </div>
				                    </div>
			                    </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default connect(null, mapDispatchToProps)(ExchangeBooth);