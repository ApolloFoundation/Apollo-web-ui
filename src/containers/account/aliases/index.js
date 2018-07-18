import React from 'react';
import {connect} from 'react-redux';
import {getAliasesAction} from "../../../actions/aliases";
import SiteHeader from '../../components/site-header'
import Alias from "./alias";
import classNames from "classnames";

class Aliases extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            aliases: [],
            firstIndex: 0,
            lastIndex: 14,
            page: 1
        };

        this.getAliases = this.getAliases.bind(this);
        this.onPaginate = this.onPaginate.bind(this);
    }

    componentDidMount() {
        this.getAliases({
            account:    this.props.account,
            firstIndex: this.state.firstIndex,
            lastIndex:  this.state.lastIndex,
        });
    }

    componentWillReceiveProps(newState) {
        this.setState({...newState},() => {
            this.getAliases({
                account:    this.props.account,
                firstIndex: this.state.firstIndex,
                lastIndex:  this.state.lastIndex,
            });
        });
    }

    async getAliases(reqParams){
        const aliases = await this.props.getAliasesAction(reqParams);

        if (aliases) {
            this.setState({
                ...this.props,
                aliases: aliases.aliases
            });
        }
    }

    onPaginate (page) {
        this.setState({
            page: page,
            account: this.props.account,
            firstIndex: page * 15 - 15,
            lastIndex:  page * 15 - 1
        }, () => {
            this.getAliases({
                account: this.props.account,
                firstIndex: this.state.firstIndex,
                lastIndex: this.state.lastIndex
            })
        });
    }

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Aliases'}
                />
                <div className="page-body container-fluid">
                    <div className="blocks">
                        <div className="transaction-table">
                            <div className="transaction-table-body">
                                <table>
                                    <thead>
                                    <tr>
                                        <td>Aliases</td>
                                        <td>URI</td>
                                        <td>Status</td>
                                        <td className="align-right">Actions</td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.aliases &&
                                            this.state.aliases.map((el, index) => {
                                                return (
                                                    <Alias {...el}/>
                                                )
                                            })
                                        }
                                    <tr>
                                        <td>Alias_name_1</td>
                                        <td className="blue-link-text"><a>http://</a>
                                        </td>
                                        <td>Registered</td>
                                        <td className="align-right">
                                            <div className="btn-box inline"><a className="btn primary blue">Edit</a><a
                                                className="btn primary blue">Transfer</a><a
                                                className="btn primary blue">Sell</a><a
                                                className="btn primary">Delete</a>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Alias_name_1</td>
                                        <td className="blue-link-text"><a>http://</a>
                                        </td>
                                        <td>Registered</td>
                                        <td className="align-right">
                                            <div className="btn-box inline"><a className="btn primary blue">Edit</a><a
                                                className="btn primary blue">Transfer</a><a
                                                className="btn primary blue">Sell</a><a
                                                className="btn primary">Delete</a>
                                            </div>
                                        </td>
                                    </tr>
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
                                            'disabled' : this.state.aliases.length < 15
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

const mapStateToProps = state => ({
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    getAliasesAction: (reqParams) => dispatch(getAliasesAction(reqParams))
});


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Aliases);