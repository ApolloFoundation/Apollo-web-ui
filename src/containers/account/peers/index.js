import React from 'react';
import SiteHeader from '../../components/site-header'
import {connect} from 'react-redux';
import {getPeerAction, getPeersAction, getPeersInfoAction} from "../../../actions/peers";
import Peer from './peer'
import {setBodyModalParamsAction} from "../../../modules/modals";

const mapDispatchToProps = dispatch => ({
    getPeersAction: (requestParams) => dispatch(getPeersAction(requestParams)),
    getPeerAction: peerAddress => dispatch(getPeerAction(peerAddress)),
    getPeersInfoAction: (requestParams) => dispatch(getPeersInfoAction(requestParams)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data))
});

class Peers extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        peersInfo: null,
        peers: null
    };

    componentDidMount() {
        this.initPeersPage();
        this.getPeers({firstIndex: 0, lastIndex: 14});
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
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Peers'}
                />
                <div className="page-body container-fluid">
                    <div className="peers">
                        <div className="row" style={{height: '100%'}}>
                            <div className="col-sm-12 col-md-6 col-lg-3">
                                <div className="card header ballance single">
                                    <div className="card-title">Uploaded Volume</div>
                                    {
                                        this.state.peersInfo &&
                                        <div className="amount">{Math.round(this.state.peersInfo.volumeUploaded / 1000000, 2)} MB</div>
                                    }
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-3">
                                <div className="card header assets single">
                                    <div className="card-title">Downloaded Volume</div>
                                    {
                                        this.state.peersInfo &&
                                        <div className="amount">{Math.round(this.state.peersInfo.volumeDownloaded / 1000000, 2)} MB</div>
                                    }
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-3">
                                <div className="card header currencies single">
                                    <div className="card-title">Connected Peers</div>
                                    {
                                        this.state.peersInfo &&
                                        <div className="amount">{this.state.peersInfo.upToDatePeers}</div>
                                    }
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-3">
                                <div className="card header coins single">
                                    <div className="card-title">Up-to-date Peers</div>
                                    {
                                        this.state.peersInfo &&
                                        <div className="amount">{this.state.peersInfo.connectedPeers}/{this.state.peersInfo.peersVolume}</div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="transaction-table">
                            <div className="transaction-table-body">
                                <table>
                                    <thead>
                                        <tr>
                                            <td>Address</td>
                                            <td className="align-right">Weight</td>
                                            <td className="align-right">Downloaded</td>
                                            <td className="align-right">Uploaded</td>
                                            <td className="align-right">Application</td>
                                            <td>Platform</td>
                                            <td className="align-right">Services</td>
                                            <td className="align-right">Actions</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.peers &&
                                            this.state.peers.map(peer => {
                                                return (
                                                    <Peer {...peer}
                                                          onTransactionSelected={() => this.getPeer(peer.address)}
                                                          onConnectClick={() => this.connectPeer(peer.address)}
                                                          onBlacklistClick={() => this.blacklistPeer(peer.address)}
                                                    />
                                                );
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(null, mapDispatchToProps)(Peers);