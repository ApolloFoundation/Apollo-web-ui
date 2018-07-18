import React from 'react';
import SiteHeader from '../../components/site-header'

class AssetExchange extends React.Component {
    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Asset exchange'}
                />
                <div className="page-body container-fluid">

                    <div className="row">
                        <div className="col-md-6">
                            <div className="card header ballance card-tiny medium-padding">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="card-title big">KKT</div>
                                        </div>
                                        <div className="col-md-6 flex">
                                            <div className="card-title align-middle">Krusty Krab Tokens (KKT)</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card ballance card-medium medium-padding">
                                <div className="form-group">
                                    <div className="form-title">
                                        <p>Buy KKT</p>
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
                                                <button className="btn blue">Buy (NXT > KKT)</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card ballance card-tiny medium-padding">
                                <div className="form-group">
                                    <div className="form-title">
                                        <p>Offers to sell KKT</p>
                                    </div>
                                    <div className="info-box simple">
                                        <p>No buy offersfor this aaset.</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="col-md-6">
                            <div className="card header assets card-tiny medium-padding">
                                <div className="full-box full">
                                    <div className="full-box-item">
                                        <div className='box'>
                                            <div className="card-title bold">Account:</div>
                                            <div className="card-title description">APL-NVY4-HNR6-2T9C-7GBNW</div>
                                        </div>
                                        <div className='box'>
                                            <div className="card-title bold">Asset ID:</div>
                                            <div className="card-title description">15278477198234166574</div>
                                        </div>
                                    </div>
                                    <div className="full-box-item">
                                        <div className='box'>
                                            <div className="card-title bold">Quantity:</div>
                                            <div className="card-title description">1,000</div>
                                        </div>
                                        <div className='box'>
                                            <div className="card-title bold">Asset decimals:</div>
                                            <div className="card-title description">2</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card assets card-medium medium-padding">
                                <div className="form-group">
                                    <div className="form-title">
                                        <p>Sell KKT</p>
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
                                                <button className="btn blue">Sell (KKT > NXT)</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card assets card-tiny medium-padding">
                                <div className="form-group">
                                    <div className="form-title">
                                        <p>Offers to buy KKT</p>
                                    </div>
                                    <div className="info-box simple">
                                        <p>No buy offersfor this aaset.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*<div className="scheduled-transactions">*/}
                        {/*<div className="approval-request white-space">*/}
                            {/*<div className="alert">You don`t have any asst in your bookmark list yet. Click on "Add*/}
                                {/*asset" to add asset.*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                </div>
            </div>
        );
    }
}

export default AssetExchange;