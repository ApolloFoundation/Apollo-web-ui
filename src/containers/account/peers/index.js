/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import SiteHeader from 'containers/components/site-header'
import {getPeerAction, getPeersAction, getPeersInfoAction} from "actions/peers";
import {setBodyModalParamsAction} from "modules/modals";
import CustomTable from 'containers/components/tables/table';
import TopPageBlocks from 'containers/components/tob-page-blocks';
import { getIsLocalhostSelector } from 'selectors';
import Peer from './peer'

const mapStateToProps = state => ({
    isLocalhost: getIsLocalhostSelector(state),
});

const mapDispatchToProps = {
    getPeersAction,
    getPeerAction,
    getPeersInfoAction,
    setBodyModalParamsAction,
};

class Peers extends React.Component {
    state = {
        peersInfo: null,
        peers: null
    };

    componentDidMount() {
        this.initPeersPage();
        this.getPeers();
    }

    peersPageUpdater = setInterval(() => {
        this.getPeers();
    }, 4000);

    componentWillUnmount() {
        clearInterval(this.peersPageUpdater)
    }

    initPeersPage = async () => {
        this.setState({
            peersInfo: await this.props.getPeersInfoAction()()
        })
    };

    getPeers = async (reqParams) => {
        const peers = await this.props.getPeersAction(reqParams);

        if (peers) {
            this.setState({
                peers: peers.peers
            })
        }
    };

    getPeer = async peerAddress => {
        const peer = await this.props.getPeerAction(peerAddress);

        if (peer) {
            this.props.setBodyModalParamsAction("ABOUT_PEER_INFO", peer)
        }
    };

    connectPeer = peerAddress => this.props.setBodyModalParamsAction("CONNECT_PEER", peerAddress);

    blacklistPeer = peerAddress => this.props.setBodyModalParamsAction("BLACKLIST_PEER", peerAddress);

    render () {
        const {peersInfo} = this.state;

        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Peers'}
                >
                    {
                        this.props.isLocalhost &&
                        <button
                            type={'button'}
                            className="btn btn-green btn-sm"
                            onClick={() => this.connectPeer()}
                        >
                            Add peer
                        </button>
                    }
                </SiteHeader>
                <div className="page-body container-fluid">
                    <div className="">
                        {
                            peersInfo &&
                            <TopPageBlocks
                                cards={[
                                    {
                                        label: 'Uploaded Volume',
                                        value: `${Math.round(peersInfo.volumeUploaded / 1000000, 2)} MB`
                                    },{
                                        label: 'Downloaded Volume',
                                        value: `${Math.round(peersInfo.volumeDownloaded / 1000000, 2)} MB`
                                    },{
                                        label: 'Connected Peers',
                                        value: peersInfo.upToDatePeers || 0
                                    },{
                                        label: 'Up-to-date Peers',
                                        value: peersInfo.connectedPeers / peersInfo.peersVolume || 0
                                    }
                                ]}
                            />
                        }
                        <CustomTable
                            header={[
                                {
                                    name: 'Address',
                                    alignRight: false
                                },{
                                    name: 'Weight',
                                    alignRight: true
                                },{
                                    name: 'Downloaded',
                                    alignRight: true
                                },{
                                    name: 'Uploaded',
                                    alignRight: true
                                },{
                                    name: 'Application',
                                    alignRight: true
                                },{
                                    name: 'Platform',
                                    alignRight: false
                                },{
                                    name: 'Services',
                                    alignRight: true
                                },{
                                    name: 'Actions',
                                    alignRight: true,
                                    isRneder: this.props.isLocalhost
                                }
                            ]}
                            TableRowComponent={Peer}
                            tableData={this.state.peers}
                            passProps={{
                                onTransactionSelected: this.getPeer,
                                onConnectClick: this.connectPeer,
                                onBlacklistClick: this.blacklistPeer,
                            }}
                            className={'mb-3'}
                            emptyMessage={'No peers found.'}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Peers);