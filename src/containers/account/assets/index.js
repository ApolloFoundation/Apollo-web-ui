/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/
import React, {Component} from 'react';
import {connect} from 'react-redux';

import {getAssets} from '../../../modules/assets';


import SiteHeader from '../../components/site-header'
import {BlockUpdater} from "../../block-subscriber";

import AssetItem from './asset-item/';
import CustomTable from '../../components/tables/table';


class Assets extends Component {
    componentDidMount = () => {
        this.props.getAssets();
    }

    render () {
        const {getAssets, assetsPage, assets} = this.props;

        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'All assets'}
                />
                <div className="page-body container-fluid">
                    <CustomTable 
                        header={[
                            {
                                name: 'Asset',
                                alignRight: false
                            },{
                                name: 'Issuer',
                                alignRight: false
                            },{
                                name: 'Number of accounts',
                                alignRight: true
                            },{
                                name: 'Number of transfers',
                                alignRight: true
                            },{
                                name: 'Number of trades',
                                alignRight: true
                            },{
                                name: 'Initial supply',
                                alignRight: true
                            },{
                                name: 'Total supply',
                                alignRight: true
                            }
                        ]}
                        TableRowComponent={AssetItem}
                        tableData={assets}
                        isPaginate
                        page={assetsPage}
                        previousHendler={getAssets.bind(this, assetsPage - 1)}
                        nextHendler={getAssets.bind(this, assetsPage + 1)}
                        className={'no-min-height mb-3'}
                        emptyMessage={'No assets found.'}
                        itemsPerPage={15}
                    />        
                </div>
            </div>
        )
    }
}


const mapStateToProps = state => ({
    account: state.account.account,
    assets: state.assets.assets,
    assetsPage: state.assets.assetsPage
});

const mapDispatchToProps = dispatch => ({
    getAssets: (page) => dispatch(getAssets(page)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Assets);


