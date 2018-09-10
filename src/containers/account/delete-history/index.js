import React from 'react';
import SiteHeader from '../../components/site-header'
import uuid from "uuid";
import {connect} from "react-redux";
import {getDeleteHistory} from "../../../actions/delete-history";
import DeleteItem from "./deletes";

class DeleteHistory extends React.Component {

    state = {
        deletes: [],
    };

    componentWillMount() {
        this.getDeleteHistory(this.props.account);
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.account && nextProps.account.length > 0) {
            this.getDeleteHistory(nextProps.account);
        }
    };

    getDeleteHistory = account => {
        console.warn("account-history", account);
        this.props.getDeleteHistory(account).then(history => this.setState({
                deletes: history ? history.deletes : []
            })
        )
    };

    render() {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Delete History'}
                />
                <div className="page-body container-fluid">
                    <div className="scheduled-transactions">
                        <div className="approval-request white-space">
                            <div className="transaction-table">
                                <div className="transaction-table-body">
                                    <table>
                                        <thead key={uuid()}>
                                        <tr>
                                            <td className="align-left">Transaction</td>
                                            <td>Asset</td>
                                            <td className="align-left">Date</td>
                                            <td className="align-right">Quantity</td>
                                        </tr>
                                        </thead>
                                        <tbody key={uuid()}>
                                        {this.state.deletes.length > 0 ?
                                            this.state.deletes.map(el => {
                                                return (
                                                    <DeleteItem
                                                        delete={el}
                                                    />
                                                )
                                            }) : <p>No delete history</p>
                                        }
                                        </tbody>
                                    </table>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const
    mapStateToProps = state => ({
        account: state.account.accountRS,

    });

const
    mapDispatchToProps = dispatch => ({
        getDeleteHistory: account => dispatch(getDeleteHistory(account))
    });

export default connect(mapStateToProps, mapDispatchToProps)

(
    DeleteHistory
)
;