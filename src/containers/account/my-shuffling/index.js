import React from 'react';
import SiteHeader from '../../components/site-header'
import {connect} from 'react-redux';
import {getBlocksAction} from "../../../actions/blocks";

import classNames from "classnames";


class MyShufling extends React.Component {
    constructor(props) {
        super(props);

        this.getBlocks = this.getBlocks.bind(this);

        this.state = {
            page: 1,
            firstIndex: 0,
            lastIndex: 14,
            blocks: []
        };
    }

    componentWillMount() {
        this.getBlocks({
            account: this.props.account,
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex
        });
    }

    async getBlocks(requestParams) {
        const ledger = await this.props.getBlocksAction(requestParams);
        this.setState({
            ...this.props,
            blocks: ledger.blocks
        });
    }

    onPaginate (page) {
        this.setState({
            page: page,
            account: this.props.account,
            firstIndex: page * 15 - 15,
            lastIndex:  page * 15 - 1
        }, () => {
            this.getBlocks({
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
                    pageTitle={'Currency system / My shuffling'}
                />
                <div className="page-body container-fluid">
                    <div className="approval-request white-space">
                        <div className="alert">There are no shufflings.</div>
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
    getBlocksAction : (requestParams) => dispatch(getBlocksAction(requestParams))

})

export default connect(mapStateToProps, mapDispatchToProps)(MyShufling);