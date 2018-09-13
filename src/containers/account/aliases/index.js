import React from 'react';
import {connect} from 'react-redux';
import {getAliasesAction} from "../../../actions/aliases";
import SiteHeader from '../../components/site-header'
import Alias from "./alias";
import classNames from "classnames";
import {getTransactionAction, getTransactionsAction} from "../../../actions/transactions";
import {setBodyModalParamsAction, setModalCallback} from "../../../modules/modals";
import {submitForm} from  '../../../helpers/forms/forms';
import {NotificationManager} from "react-notifications";
import {BlockUpdater} from "../../block-subscriber";

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

    listener = data => {
        this.getAliases({
            account:    this.props.account,
            firstIndex: this.state.firstIndex,
            lastIndex:  this.state.lastIndex,
        });
    };

    componentDidMount() {
        this.getAliases({
            account:    this.props.account,
            firstIndex: this.state.firstIndex,
            lastIndex:  this.state.lastIndex,
        });
        BlockUpdater.on("data", this.listener);
    }

    componentWillUnmount() {
        BlockUpdater.removeListener("data", this.listener)
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

    addAlias = () => {
        this.props.setBodyModalParamsAction('ADD_ALIAS', {});
    };

    editAlias = () => {
        this.props.setBodyModalParamsAction('EDIT_ALIAS', {});
    };

    sellAlias = () => {
        this.props.setBodyModalParamsAction('SELL_ALIAS', {});
    };

    transferAlias = () => {
        this.props.setBodyModalParamsAction('TRANSFER_ALIAS', {});
    };

    deleteAlias = () => {
        this.props.setBodyModalParamsAction('DELETE_ALIAS', {});
    };

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Aliases'}
                >
                    <a
                        className="btn primary"
                        style={{marginLeft: 15}}
                        onClick={() => this.props.setBodyModalParamsAction('ADD_ALIAS', {})}
                    >
                        Add alias
                    </a>
                </SiteHeader>
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
                                                    <Alias
                                                        editAlias={this.editAlias}
                                                        sellAlias={this.sellAlias}
                                                        transferAlias={this.transferAlias}
                                                        deleteAlias={this.deleteAlias}
                                                        {...el}
                                                    />
                                                )
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
    getAliasesAction: (reqParams) => dispatch(getAliasesAction(reqParams)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    // submitForm: (modal, btn, data, requestType) => dispatch(submitForm.submitForm(modal, btn, data, requestType)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Aliases);