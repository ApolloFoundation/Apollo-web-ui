import React from 'react';
import {connect} from 'react-redux';
import {getAliasesAction} from "../../../actions/aliases";
import SiteHeader from '../../components/site-header'
import {getPoolsAction} from '../../../actions/pools';
import PoolItem from './pool-item';
import uuid from "uuid";
import {getTransactionAction} from "../../../actions/transactions";
import {setBodyModalParamsAction} from "../../../modules/modals";
import {Link} from 'react-router-dom';

const mapStateToProps = state => ({
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    getPoolsAction: (reqParams) => dispatch(getPoolsAction(reqParams)),
    getAliasesAction: (reqParams) => dispatch(getAliasesAction(reqParams)),
    getTransactionAction:     (requestParams) => dispatch(getTransactionAction(requestParams)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data))
});


class ActivePools extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            firstIndex: 0,
            lastIndex: 14,
            page: 1,
            activePools: null,
            finishedPools: null
        };

        this.getActivePools   = this.getActivePools.bind(this);
        this.getFinishedPools = this.getFinishedPools.bind(this);
        this.getTransaction   = this.getTransaction.bind(this);
    }

    componentDidMount() {
        this.getActivePools({
            firstIndex: 0,
            lastIndex:  2,
        });
        this.getFinishedPools({
            firstIndex: 0,
            lastIndex:  9,
        });

    }

    componentWillReceiveProps(newState) {
        this.getActivePools({
            firstIndex: 0,
            lastIndex:  2,
        });
        this.getFinishedPools({
            firstIndex: 0,
            lastIndex:  9,
        });
    }

    async getActivePools(reqParams){
        reqParams = {
            ...reqParams,
            includeFinished: false,
        };

        const activePools = await this.props.getPoolsAction(reqParams);

        if (activePools) {
            this.setState({
                ...this.props,
                activePools: activePools.polls
            });
        }
    }

    async getFinishedPools(reqParams){
        reqParams = {
            ...reqParams,
            finishedOnly: true
        };

        const finishedPools = await this.props.getPoolsAction(reqParams);

        if (finishedPools) {
            this.setState({
                ...this.props,
                finishedPools: finishedPools.polls
            });
        }
    }

    async getTransaction(data) {
        const reqParams = {
            transaction: data,
            account: this.props.account
        };

        const transaction = await this.props.getTransactionAction(reqParams);
        if (transaction) {
            this.props.setBodyModalParamsAction('INFO_TRANSACTION', transaction);
        }

    }

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Active Pools'}
                />
                <div className="page-body container-fluid">
                    <div className="active-pools white-space">
                        <div className="transaction-table no-min-height">
                            <div className="transaction-table-body">
                                <table>
                                    <thead>
                                    <tr>
                                        <td>Title</td>
                                        <td>Description</td>
                                        <td>Sender</td>
                                        <td>Start date</td>
                                        <td>Blocks left</td>
                                        <td className="align-right">Actions</td>
                                    </tr>
                                    </thead>
                                    <tbody  key={uuid()}>
                                        {
                                            this.state.activePools &&
                                            this.state.activePools.map((el, index) => {
                                                return (
                                                    <PoolItem
                                                        {...el}
                                                        activePools
                                                        getTransaction={this.getTransaction}
                                                    />
                                                );
                                            })
                                        }
                                    </tbody>
                                </table>

                            </div>
                        </div>
                        <div className="form-group-app offset-bottom height-auto no-padding">
                            <div className="form-title padding-left padding-top">
                                <p>Finished pools</p>
                            </div>
                            <div className="transaction-table no-min-height">
                                <div className="transaction-table-body offset-bottom">
                                    <table>
                                        <thead>
                                        <tr>
                                            <td>Title</td>
                                            <td>Description</td>
                                            <td>Sender</td>
                                            <td>Start date</td>
                                            <td>Blocks left</td>
                                            <td className="align-right">Actions</td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.finishedPools &&
                                                this.state.finishedPools.map((el, index) => {
                                                    return (
                                                        <PoolItem
                                                            {...el}
                                                            activePools
                                                            getTransaction={this.getTransaction}
                                                        />
                                                    );
                                                })
                                            }
                                        </tbody>
                                    </table>
                                    <div className="btn-box">
                                        <Link to="/finished-pools" className="btn btn-right blue" >View more</Link>
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ActivePools);