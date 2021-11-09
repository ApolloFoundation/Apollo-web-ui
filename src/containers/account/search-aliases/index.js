/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {Form, Text} from 'react-form';
import {NotificationManager} from 'react-notifications';
import {searchAliases} from "../../../actions/aliases";
import SiteHeader from '../../components/site-header'
import Alias from "./alias";

import CustomTable from '../../components/tables/table';

class SearchAliases extends React.Component {

    state = {
        aliases: [],
        alias: '',
        firstIndex: 0,
        lastIndex: 14,
        page: 1
    };

    getAliases = async reqParams => {
        const aliases = await this.props.searchAliases(reqParams);
        if (aliases && !aliases.aliases.length) {
            NotificationManager.error('No aliases found.', 'Error', 5000);
        } else {
            this.setState({
                aliases: aliases.aliases
            });
        }
    };

    onPaginate = page => {
        this.setState({
            page: page,
            firstIndex: page * 15 - 15,
            lastIndex:  page * 15 - 1
        }, () => {
            const {alias, firstIndex, lastIndex} = this.state;
            this.getAliases({
                aliasPrefix: alias,
                firstIndex: firstIndex,
                lastIndex: lastIndex
            })
        });
    };

    handleSearchAlias = ({alias}) => {
        const {firstIndex, lastIndex} = this.state;
        if(!alias || alias.length < 2) {
            NotificationManager.error('Alias name must be no less than 2 symbols.', 'Error', 5000);
            return
        }
        this.setState({alias});
        this.getAliases({
            aliasPrefix: alias,
            firstIndex: firstIndex,
            lastIndex: lastIndex
        });
    };

    render () {
        const {page, aliases} = this.state;
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Aliases'}
                >
                </SiteHeader>
                <div className="page-body container-fluid">
                    <div className="data-storage">
                        <div className="row">
                            <div className="col-md-12 p-0">
                                <div className="transactions-filters">
                                    <div className="search-bar row"></div>
                                    <Form
                                        onSubmit={values => this.handleSearchAlias(values)}
                                        render={({submitForm, setAllValues, setValue}) => {
                                            return (
                                                <form onSubmit={submitForm}
                                                        className="input-group-app search col-md-3 pl-0">
                                                    <div className="iconned-input-field">
                                                        <Text
                                                            placeholder={'Alias'}
                                                            field={'alias'}
                                                            type="text"
                                                        />
                                                        <button
                                                            type={'submit'}
                                                            className="input-icon"
                                                            style={{
                                                                width: 41
                                                            }}
                                                        >
                                                            <i className="zmdi zmdi-search"/>
                                                        </button>
                                                    </div>
                                                </form>
                                            )
                                        }}
                                    />
                                </div>
                            </div>
                            <CustomTable 
                                header={[
                                    {
                                        name: 'Aliases',
                                        alignRight: false
                                    },{
                                        name: 'Type Value',
                                        alignRight: false
                                    },{
                                        name: 'Status',
                                        alignRight: false
                                    },{
                                        name: 'Price',
                                        alignRight: false
                                    }
                                ]}
                                TableRowComponent={Alias}
                                tableData={aliases}
                                isPaginate
                                page={page}
                                previousHendler={this.onPaginate.bind(this, page - 1)}
                                nextHendler={this.onPaginate.bind(this, page + 1)}
                                className={'no-min-height mb-3'}
                                emptyMessage={'Enter the Alias you want to find (no less than 2 symbols)'}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    searchAliases: (reqParams) => dispatch(searchAliases(reqParams)),
});

export default connect(
    null,
    mapDispatchToProps
)(SearchAliases);