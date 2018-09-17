import React from 'react';
import SiteHeader from '../../components/site-header'
import uuid from "uuid";
import DeleteItem from "../delete-history/deletes";
import {connect} from "react-redux";
import {getBuyOrdersAction, getSellOrdersAction} from "../../../actions/open-orders";
import OrderItem from "./order";
import {BlockUpdater} from "../../block-subscriber";

class OpenOrders extends React.Component {

    state = {
        sellOrders: [],
        buyOrders: [],
    };

    componentWillMount() {
        this.getBuyOrders(this.props.account);
        this.getSellOrders(this.props.account);
        BlockUpdater.on("data", data => {
            console.warn("height in dashboard", data);
            console.warn("updating dashboard");
            this.getBuyOrders(this.props.account);
            this.getSellOrders(this.props.account);
        });
    }

    componentWillUnmount() {
        BlockUpdater.removeAllListeners('data');
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.account && nextProps.account.length > 0) {
            this.getBuyOrders(nextProps.account);
            this.getSellOrders(nextProps.account);
        }
    };

    getBuyOrders = account => {
          this.props.getBuyOrders(account).then(res => {
              this.setState({
                  buyOrders: res ? res.bidOrders : []
              });
          });
    };

    getSellOrders = account => {
          this.props.getSellOrders(account).then(res => {
              this.setState({
                  sellOrders: res ? res.askOrders : []
              });
          });
    };

    render() {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Open orders'}
                />
                <div className="page-body container-fluid">
                    <div className="open-orders">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group-app">
                                    <div className="form-title">
                                        <p>Sell Orders</p>
                                    </div>
                                    <div className="approval-request white-space no-padding">
                                        {this.state.sellOrders.length === 0 ? <div className="alert">No assets.</div> :
                                            <div className="transaction-table">
                                                <div className="transaction-table-body no-padding">
                                                    <table>
                                                        <thead key={uuid()}>
                                                        <tr>
                                                            <td className="align-left">Asset</td>
                                                            <td>Quantity</td>
                                                            <td>Price</td>
                                                            <td>Total</td>
                                                            <td className="align-left">Cancel</td>
                                                        </tr>
                                                        </thead>
                                                        <tbody key={uuid()}>
                                                        {
                                                            this.state.sellOrders.map(el => {
                                                                return (
                                                                    <OrderItem
                                                                        key={uuid()}
                                                                        order={el}
                                                                        type={"cancelAskOrder"}
                                                                    />
                                                                )
                                                            })
                                                        }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group-app">
                                    <div className="form-title">
                                        <p>Buy Orders</p>
                                    </div>
                                    <div className="approval-request white-space no-padding">
                                        {this.state.buyOrders.length === 0 ? <div className="alert">No assets.</div> :
                                            <div className="transaction-table">
                                                <div className="transaction-table-body no-padding">
                                                    <table className="no-padding">
                                                        <thead key={uuid()}>
                                                        <tr>
                                                            <td className="align-left">Asset</td>
                                                            <td>Quantity</td>
                                                            <td>Price</td>
                                                            <td>Total</td>
                                                            <td className="align-right">Actions</td>
                                                        </tr>
                                                        </thead>
                                                        <tbody key={uuid()}>
                                                        {
                                                            this.state.buyOrders.map(el => {
                                                                return (
                                                                    <OrderItem
                                                                        key={uuid()}
                                                                        order={el}
                                                                        type={"cancelBidOrder"}
                                                                    />
                                                                )
                                                            })
                                                        }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    account: state.account.account,

});

const mapDispatchToProps = dispatch => ({
    getBuyOrders: account => dispatch(getBuyOrdersAction(account)),
    getSellOrders: account => dispatch(getSellOrdersAction(account)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OpenOrders);