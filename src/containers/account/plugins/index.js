/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {getPluginsAction} from '../../../actions/plugins';
import SiteHeader from '../../components/site-header'
import {BlockUpdater} from "../../block-subscriber";

class Plugins extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            plugins: []
        };

        this.getPlugins = this.getPlugins.bind(this);
    }

    componentDidMount() {
        this.getPlugins({
            account: this.props.account
        });
        BlockUpdater.on("data", data => {
            this.getPlugins({
                account: this.props.account
            });
        });
    }

    componentWillUnmount() {
        BlockUpdater.removeAllListeners('data');
    }

    async getPlugins (reqParams) {
        const plugins = await this.props.getPluginsAction(reqParams);
        this.setState({
            ...this.props,
            plugins : plugins
        })
    }

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Plugins'}
                />
                <div className="page-body container-fluid">
                    <div className="scheduled-transactions">
                        {

                            this.state.plugins && !this.state.plugins.length &&
                            <div className="approval-request white-space">
                                <div className="alert">0 Plugins active and running. <span
                                    className="blue">Status page.</span>
                                </div>
                            </div>

                        }
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateTpProps = state => ({
   account: state.account.account
});

const mpaDispatchToProps = dispatch => ({
    getPluginsAction: (reqParams) => dispatch(getPluginsAction(reqParams))
})

export default connect(
    mapStateTpProps,
    mpaDispatchToProps
)(Plugins);