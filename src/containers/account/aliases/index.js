/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {getAliasesAction} from "../../../actions/aliases";
import SiteHeader from '../../components/site-header'
import Alias from "./alias";
import classNames from "classnames";
import {setBodyModalParamsAction} from "../../../modules/modals";
import {BlockUpdater} from "../../block-subscriber";
import uuid from "uuid";
import ContentHendler from '../../components/content-hendler'

import CustomTable from '../../components/tables/table';

class Aliases extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            aliases: null,
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

	cancelSaleAlias = () => {
		this.props.setBodyModalParamsAction('CANCEL_SALE_ALIAS', {});
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
                    <CustomTable 
                        header={[
                            {
                                name: 'Aliases',
                                alignRight: false
                            },{
                                name: 'URI',
                                alignRight: false
                            },{
                                name: 'Status',
                                alignRight: false
                            },{
                                name: 'Actions',
                                alignRight: true
                            }
                        ]}
                        TableRowComponent={Alias}
                        tableData={this.state.aliases}
                        isPaginate
                        page={this.state.page}
                        previousHendler={this.onPaginate.bind(this, this.state.page - 1)}
                        nextHendler={this.onPaginate.bind(this, this.state.page + 1)}
                        className={'no-min-height'}
                        emptyMessage={'No aliases found.'}
                    />        
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
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Aliases);