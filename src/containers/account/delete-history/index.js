/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import SiteHeader from '../../components/site-header'
import uuid from "uuid";
import {connect} from "react-redux";
import {getDeleteHistory} from "../../../actions/delete-history";
import DeleteItem from "./deletes";
import {BlockUpdater} from "../../block-subscriber";
import InfoBox from '../../components/info-box';
import ContentLoader from '../../components/content-loader'
import ContentHendler from '../../components/content-hendler'

class DeleteHistory extends React.Component {

    state = {
        deletes: null,
    };

    componentWillMount() {
        this.getDeleteHistory(this.props.account);
    }

    listener = data => {
        this.getDeleteHistory(this.props.account);
    };

    componentDidMount() {
        BlockUpdater.on("data", this.listener);
    }

    componentWillUnmount() {
        BlockUpdater.removeListener("data", this.listener)
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.account && nextProps.account.length > 0) {
            this.getDeleteHistory(nextProps.account);
        }
    };

    getDeleteHistory = account => {
        console.warn("account-history", account);
        this.props.getDeleteHistory(account).then(history => this.setState({
                deletes: history ? history.deletes : null
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
                        <ContentHendler
                            items={this.state.deletes}
                            emptyMessage={'No deletes found.'}
                        >
                            {
                                this.state.deletes &&
                                this.state.deletes.length > 0 &&
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
                                            {
                                                this.state.deletes.map(el => {
                                                    return (
                                                        <DeleteItem
                                                            key={uuid()}
                                                            delete={el}
                                                        />
                                                    )
                                                })
                                            }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            }

                        </ContentHendler>
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