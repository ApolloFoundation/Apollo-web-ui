import React from 'react';
import SiteHeader from '../../components/site-header'
import ExchangeBoothTable from './exchange-booth-table';
import {connect} from 'react-redux';
import {getCurrencyAction} from "../../../actions/currencies";

const mapDispatchToProps = dispatch => ({
    getCurrencyAction: (reqParams) => dispatch(getCurrencyAction(reqParams))
});

@connect(null, mapDispatchToProps)
class ExchangeBooth extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currency: null
        };
    }

    componentDidMount() {
        this.getCurrency({code: this.props.match.params.currency});
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

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Exchange booth'}
                />
                {
                    this.state.currency &&
                    <div className="page-body container-fluid">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="transactions-filters align-for-inputs">
                                    <div className="input-block">
                                        <input type=""/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card header ballance medium-padding">
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="card-title big">{this.state.code}</div>
                                            </div>
                                            <div className="col-md-6 flex">
                                                <div className="card-title align-middle">{this.state.description}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card ballance card-medium medium-padding">
                                    <div className="form-group">
                                        <div className="form-title">
                                            <p>Buy {this.state.code}</p>
                                            <div className="form-sub-title">
                                                balance: <strong>8,686 NXT</strong>
                                            </div>
                                        </div>
                                        <div className="input-group">
                                            <div className="row">
                                                <div className="col-md-5">
                                                    <label>Quantity</label>
                                                </div>
                                                <div className="col-md-7">
                                                    <input type="select"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="input-group">
                                            <div className="row">
                                                <div className="col-md-5">
                                                    <label>Price</label>
                                                </div>
                                                <div className="col-md-7">
                                                    <input type="select"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="input-group">
                                            <div className="row">
                                                <div className="col-md-5">
                                                    <label>Total</label>
                                                </div>
                                                <div className="col-md-7">
                                                    <input type="select"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="input-group">
                                            <div className="row">
                                                <div className="col-md-5">
                                                    <label>Fee</label>
                                                </div>
                                                <div className="col-md-7">
                                                    <input type="select"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="input-group">
                                            <div className="row">
                                                <div className="col-md-5">
                                                    <label></label>
                                                </div>
                                                <div className="col-md-7">
                                                    <button className="btn blue">Buy ({this.state.code} > {this.state.code})</button>
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
                                                <div className="card-title description">{this.state.currency}</div>
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
                                <div className="card assets card-medium medium-padding">
                                    <div className="form-group">
                                        <div className="form-title">
                                            <p>Sell {this.state.code}</p>
                                            <div className="form-sub-title">
                                                balance: <strong>8,686 NXT</strong>
                                            </div>
                                        </div>
                                        <div className="input-group">
                                            <div className="row">
                                                <div className="col-md-5">
                                                    <label>Quantity</label>
                                                </div>
                                                <div className="col-md-7">
                                                    <input type="select"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="input-group">
                                            <div className="row">
                                                <div className="col-md-5">
                                                    <label>Price</label>
                                                </div>
                                                <div className="col-md-7">
                                                    <input type="select"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="input-group">
                                            <div className="row">
                                                <div className="col-md-5">
                                                    <label>Total</label>
                                                </div>
                                                <div className="col-md-7">
                                                    <input type="select"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="input-group">
                                            <div className="row">
                                                <div className="col-md-5">
                                                    <label>Fee</label>
                                                </div>
                                                <div className="col-md-7">
                                                    <input type="select"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="input-group">
                                            <div className="row">
                                                <div className="col-md-5">
                                                    <label></label>
                                                </div>
                                                <div className="col-md-7">
                                                    <button className="btn blue">Sell ({this.state.code} > {this.state.code})</button>
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
                                            <div className="form-group">
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
                                            <div className="form-group">
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
                                    <div className="form-group">
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
                                    <div className="form-group">
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
                }
            </div>
        );
    }
}

export default ExchangeBooth;