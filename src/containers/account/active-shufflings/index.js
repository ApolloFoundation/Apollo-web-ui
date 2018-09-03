import React from 'react';
import {connect} from 'react-redux';
import uuid from "uuid";
import classNames from "classnames";
import SiteHeader from "../../components/site-header";
import ShufflingItem from './shuffling-item';
import {getActiveShfflings} from '../../../actions/shuffling';
import {NotificationManager} from "react-notifications";
const mapStateToPropms = state => ({
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    getActiveShfflings  : (reqParams) => dispatch(getActiveShfflings(reqParams)),
});

@connect(mapStateToPropms, mapDispatchToProps)
class ActiveShufflings extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            activeShuffling: null
        }
    }

    componentDidMount() {
        NotificationManager.info('After creating or joining a shuffling, you must keep your node online and your shuffler running, leaving enough funds in your account to cover the shuffling fees, until the shuffling completes! If you don\'t and miss your turn, you will be fined.', null, 1000000);
        this.getActiveShfflings({
            firstIndex: 0,
            lastIndex: 14
        });
    }

    getActiveShfflings   = async (reqParams) => {
        const activeShuffling =  await this.props.getActiveShfflings(reqParams);

        if (activeShuffling) {
            this.setState({
                ...this.state,
                activeShuffling: activeShuffling.shufflings
            })
        }
    };

    onPaginate = (page) => {
        this.setState({
            page: page,
            firstIndex: page * 15 - 15,
            lastIndex:  page * 15 - 1
        }, () => {
            this.getActiveShfflings({
                firstIndex: this.state.firstIndex,
                lastIndex: this.state.lastIndex
            })
        });
    };

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Active Shuffling'}
                />
                <div className="page-body container-fluid">
                    <div className="transaction-table">
                        {
                            this.state.activeShuffling && !this.state.activeShuffling.length &&
                            <div className="info-box info">
                                <p>After creating or joining a shuffling, you must keep your node online and your shuffler running, leaving enough funds in your account to cover the shuffling fees, until the shuffling completes! If you don't and miss your turn, you will be fined.</p>
                            </div>
                        }
                        {
                            this.state.activeShuffling && !!this.state.activeShuffling.length &&
                            <div className="transaction-table-body">
                                <table>
                                    <thead>
                                    <tr>
                                        <td>Code</td>
                                        <td>Name</td>
                                        <td>Type</td>
                                        <td className="align-right">Current Supply</td>
                                        <td className="align-right">Max Supply</td>
                                        <td className="align-right">Actions</td>
                                    </tr>
                                    </thead>
                                    <tbody key={uuid()}>
                                    {
                                        this.state.activeShuffling &&
                                        this.state.activeShuffling.map((el, index) => {
                                            return (
                                                <ShufflingItem
                                                    {...el}
                                                    getTransaction={this.getTransaction}
                                                />
                                            );
                                        })
                                    }
                                    </tbody>
                                </table>
                                {
                                    this.state.activeShuffling &&
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
                                                'disabled' : this.state.activeShuffling.length < 15
                                            })}
                                        >Next</a>
                                    </div>
                            }
                        </div>
                    }
                    </div>
                </div>
            </div>
        );
    }
}

export default ActiveShufflings;