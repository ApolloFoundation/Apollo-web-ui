import React from 'react';
import {connect} from 'react-redux';
import SiteHeader from '../../../components/site-header';
import CustomTable from '../../../components/tables/table';
import {getMyOfferHistory} from '../../../../actions/wallet';
import {formatDivision} from '../../../../helpers/format';
import {ONE_GWEI} from '../../../../constants';
import InfoBox from '../../../components/info-box';

class TradeHistory extends React.Component {
    state = {
        loading: true,
        firstIndex: 0,
        lastIndex: 14,
        page: 1,
    };

    componentDidMount() {
        let wallets = localStorage.getItem('wallets');
        if (!wallets) {
            this.props.setBodyModalParamsAction('LOGIN_EXCHANGE', {});
        } else {
            this.props.getMyOfferHistory({
                firstIndex: this.state.firstIndex,
                lastIndex: this.state.lastIndex
            });
            this.setState({loading: false});
        }
        // BlockUpdater.on("data", this.listener);
    }

    // componentWillUnmount() {
    //     BlockUpdater.removeListener("data", this.listener)
    // }

    componentDidUpdate() {
        if (this.props.wallets && this.state.loading) {
            this.props.getMyOfferHistory(null, {
                firstIndex: this.state.firstIndex,
                lastIndex: this.state.lastIndex
            });
            this.setState({loading: false});
        }
    }

    // listener = () => {
    //     this.props.getMyOfferHistory({
    //         firstIndex: this.state.firstIndex,
    //         lastIndex: this.state.lastIndex
    //     });
    // };

    onPaginate = (page) => {
        this.setState({
            page: page,
            firstIndex: page * 15 - 15,
            lastIndex:  page * 15 - 1
        }, () => {
            this.props.getMyOfferHistory({
                firstIndex: this.state.firstIndex,
                lastIndex: this.state.lastIndex
            });
        });
    };

    render() {
        const {myOrderHistory} = this.props;
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Trade History'}
                />
                <div className="exchange page-body container-fluid">
                    {!this.state.loading ? (
                    <div className={'card-block primary form-group-app p-0 mb-3'}>
                        <div className={'form-title form-title-lg d-flex flex-column justify-content-between'}>
                            <p className="title-lg">My trades</p>
                        </div>
                            {myOrderHistory
                            ?   <CustomTable
                                    header={[
                                        {
                                            name: `Price `,
                                            alignRight: false
                                        }, {
                                            name: `Amount APL`,
                                            alignRight: true
                                        }, {
                                            name: `Total `,
                                            alignRight: true
                                        }
                                    ]}
                                    className={'no-min-height transparent'}
                                    emptyMessage={'No created orders.'}
                                    tableData={myOrderHistory}
                                    TableRowComponent={(props) => {
                                        const pairRate = formatDivision(props.pairRate, ONE_GWEI, 9);
                                        const offerAmount = formatDivision(props.offerAmount, ONE_GWEI, 3);
                                        const total = formatDivision(props.pairRate * props.offerAmount, Math.pow(10, 18), 9);
                                        return (
                                            <tr>
                                                <td>{pairRate}</td>
                                                <td  className={'align-right'}>{offerAmount}</td>
                                                <td  className={'align-right'}>{total}</td>
                                            </tr>
                                        )
                                    }}
                                    isPaginate
                                    page={this.state.page}
                                    previousHendler={this.onPaginate.bind(this, this.state.page - 1)}
                                    nextHendler={this.onPaginate.bind(this, this.state.page + 1)}
                                />
                            : <div className={'align-items-center loader-box'}>
                                <div className="ball-pulse">
                                    <div/>
                                    <div/>
                                    <div/>
                                </div>
                            </div>}
                        </div>
                    ):(
                        <div>
                            <InfoBox default>
                                You have no Wallet at the moment.&nbsp;
                                <a className={'blue-link-text'} onClick={() => this.props.setBodyModalParamsAction('LOGIN_EXCHANGE', {})}>Log in</a>
                            </InfoBox>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({exchange, account}) => ({
    wallets: account.wallets,
    currentCurrency: exchange.currentCurrency,
    myOrderHistory: exchange.myOrderHistory,
});

const mapDispatchToProps = dispatch => ({
    getMyOfferHistory: (options) => dispatch(getMyOfferHistory(options)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TradeHistory)
