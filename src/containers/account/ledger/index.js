import React from 'react';
import {connect} from 'react-redux';
import SiteHeader from '../../components/site-header'
import {getAccountLedgerAction} from "../../../actions/ledger";
import Entry from './entry';
import classNames from "classnames";

class Ledger extends React.Component {
    constructor(props) {
        super(props);

        this.getAccountLedger = this.getAccountLedger.bind(this);

        this.state = {
            page: 1,
            firstIndex: 0,
            lastIndex: 14,
            ledger: []
        };
    }

    componentWillMount() {
        this.getAccountLedger({
            account: this.props.account,
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex
        });
    }

    async getAccountLedger(requestParams) {
        const ledger = await this.props.getAccountLedgerAction(requestParams);
        this.setState({
            ...this.props,
            ledger: ledger.entries
        });
    }

    onPaginate (page) {
        this.setState({
            page: page,
            account: this.props.account,
            firstIndex: page * 15 - 15,
            lastIndex:  page * 15 - 1
        }, () => {
            this.getAccountLedger({
                account: this.props.account,
                firstIndex: this.state.firstIndex,
                lastIndex: this.state.lastIndex
            })
        });
    }

    render() {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Account ledger'}
                    showPrivateTransactions={'ledger'}
                />
                <div className="page-body container-fluid">
                    <div className="account-ledger">
                        <div className="info-box info">
                            <p>Only ledger entries created during the last 30000 blocks are displayed.</p>
                        </div>
                        <div className="transaction-table">
                            <div className="transaction-table-body">
                                <table>
                                    <thead>
                                    <tr>
                                        <td>Entry</td>
                                        <td>Type</td>
                                        <td className="align-right">Change</td>
                                        <td>Balance</td>
                                        <td>Holding</td>
                                        <td className="align-right">Change</td>
                                        <td className="align-right">Balance</td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.ledger.map((el, index) => {
                                                return (
                                                    <Entry entry={el}/>
                                                );
                                            })
                                        }
                                    </tbody>
                                </table>
                                <div className="btn-box">
                                    <a
                                        className={classNames({
                                            'btn' : true,
                                            'btn-left' : true,
                                            'disabled' : this.state.page <= 1
                                        })}
                                        onClick={this.onPaginate.bind(this, this.state.page - 1)}
                                    > Previous</a>
                                    <div className='pagination-nav'>
                                        <span>{this.state.firstIndex + 1}</span>
                                        <span>&hellip;</span>
                                        <span>{this.state.lastIndex + 1}</span>
                                    </div>
                                    <a
                                        onClick={this.onPaginate.bind(this, this.state.page + 1)}
                                        className={classNames({
                                            'btn' : true,
                                            'btn-right' : true,
                                            'disabled' : this.state.ledger.length < 15
                                        })}
                                    >Next</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mpaStateToProps = state => ({
   account: state.account.account
});

const mapDispatchToProps = dispatch => ({
   getAccountLedgerAction: (requestParams) => dispatch(getAccountLedgerAction(requestParams))
});

export default connect(mpaStateToProps, mapDispatchToProps)(Ledger);