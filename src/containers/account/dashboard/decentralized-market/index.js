import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import ContentLoader from '../../../components/content-loader'
import {getAccountAssetsAction, getSpecificAccountAssetsAction} from '../../../../actions/assets'
import {
	getDGSGoodsCountAction,
	getDGSPurchaseCountAction,
	getDGSPurchasesAction,
	getDGSPendingPurchases
} from "../../../../actions/marketplace";

class DecentralizedMarketplace extends Component {

    componentDidMount = () => {
        this.getGoods({seller: this.props.account});
    }

    getGoods = async (reqParams) => {
		const purchased = await this.props.getDGSPurchaseCountAction(reqParams);
		const pendingGoods = await this.props.getDGSPendingPurchases(reqParams);
		const completedPurchased = await this.props.getDGSPurchaseCountAction(reqParams);


		const numberOfGoods = await this.props.getDGSPurchaseCountAction({...reqParams, requestType: 'getDGSGoodsCount'});

        reqParams.buyer = reqParams.account;
        delete reqParams.account;
        delete reqParams.seller;

		const proedeductsForSale = await this.props.getDGSPurchaseCountAction({...reqParams , requestType: 'getDGSPurchases'});

        if (proedeductsForSale && purchased && completedPurchased && pendingGoods) {
			this.setState({
				numberOfGoods: proedeductsForSale.purchases.length,
				completedGoods: numberOfGoods.numberOfGoods,
				pendingGoods: pendingGoods.purchases.length,
			})
		}
	};

    render () {
        return (
            <div className="card decentralized-marketplace">
                <div className="card-title">Decentralized Marketplace</div>
                <div className="full-box">
                    {
                        !!this.state.pendingGoods && !!this.state.completedGoods &&
                        <div className="full-box-item">

                        <div className="marketplace-box">
                                <Link to={'/purchased-products'} className="digit">{this.state.numberOfGoods}</Link>
                                <div className="subtitle">Purchased products</div>
                            </div>
                            <div className="marketplace-box">
                                <div
                                    className="digit">
                                    <Link className="digit" to={'/my-pending-orders'}>
                                        {this.state.pendingGoods}
                                    </Link>
                                    /
                                    <Link className="digit" to={'/my-products-for-sale'}>
                                        {this.state.completedGoods}
                                    </Link>
                                </div>
                                <div className="subtitle">Sales</div>
                            </div>
                        </div>
                    }
                    {
                        typeof this.state.pendingGoods === 'undefined' &&
                        typeof this.state.completedGoods === 'undefined' &&
                        <ContentLoader noPaddingOnTheSides/>
                    }
                    {
                        this.state.pendingGoods === 0 &&
                        <p>No pending orders.</p>
                    }
                    {
                        this.state.completedGoods === 0 &&
                        <p>No completed orders.</p>
                    }

                </div>
                <Link to="/marketplace" className="btn btn-left btn-simple absolute">Marketplace</Link>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    account: state.account.account
})

const mapDispatchToProps = dispatch => ({
	getDGSPurchaseCountAction: (requestParams) => dispatch(getDGSPurchaseCountAction(requestParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DecentralizedMarketplace)
