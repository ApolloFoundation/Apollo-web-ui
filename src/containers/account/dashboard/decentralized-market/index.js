import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import ContentLoader from '../../../components/content-loader'

class DecentralizedMarketplace extends Component {
    render () {
        const {dashboardDgsGoods} = this.props;

        console.log(dashboardDgsGoods)
        return (
            <div className="card decentralized-marketplace">
                <div className="card-title">Decentralized Marketplace</div>
                <div className="full-box">
                    {
                        !!dashboardDgsGoods &&
                        <div className="full-box-item">

                        <div className="marketplace-box">
                                <Link to={'/purchased-products'} className="digit">
                                    {dashboardDgsGoods.totalPurchases} {/** Number of goods */}
                                </Link> 
                                <div className="subtitle">Purchased products</div>
                            </div>
                            <div className="marketplace-box">
                                <div
                                    className="digit">
                                    <Link className="digit" to={'/my-pending-orders'}>
                                        {dashboardDgsGoods.numberOfPurchases} {/** Pending orders */}
                                    </Link>
                                    /
                                    <Link className="digit" to={'/my-products-for-sale'}>
                                        {dashboardDgsGoods.numberOfGoods} {/** Completed orders */}
                                    </Link>
                                </div>
                                <div className="subtitle">Sales</div>
                            </div>
                        </div>
                    }
                    {
                        !dashboardDgsGoods &&
                        <ContentLoader noPaddingOnTheSides/>
                    }
                    {/* {
                        this.state.pendingGoods === 0 &&
                        <p>No pending orders.</p>
                    }
                    {
                        this.state.completedGoods === 0 &&
                        <p>No completed orders.</p>
                    } */}

                </div>
                <Link to="/marketplace" className="btn btn-left btn-simple absolute">Marketplace</Link>
            </div>
							
        )
    }
}

const mapStateToProps = state => ({
    dashboardDgsGoods: state.dashboard.dashboardDgsGoods
})

export default connect(mapStateToProps)(DecentralizedMarketplace)
