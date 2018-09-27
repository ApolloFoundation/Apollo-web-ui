/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setModalData} from '../../../modules/modals';

class AboutPeerInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    formDate = date => {
        if (!date) return "";
        const lastUpdDate = new Date(Date.now() - date);
        const month = lastUpdDate.getMonth();
        const day = lastUpdDate.getDay();
        const year = lastUpdDate.getFullYear();
        const time = lastUpdDate.getHours() + ":" + lastUpdDate.getMinutes() + ":" + lastUpdDate.getSeconds();
        return `${month}/${day}/${year} ${time}`;
    };

    formMegabytes = bytes => {
        if (!bytes) return "";
        return (bytes / 1000000) + "MB";
    };

    render() {
        const peer = this.props.modalData;
        return (
            <div className="modal-box">
                {
                    this.props.modalData &&
                    <form className="modal-form">
                        <div className="form-group-app">
                            <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close"/></a>
                            <div className="form-title">
                                <p>Peer {peer.address} Info</p>
                            </div>

                            <div className="transaction-table no-min-height">
                                <div className="transaction-table-body transparent padding-only-top">
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td>Address:</td>
                                            <td>{peer.address}</td>
                                        </tr>
                                        <tr>
                                            <td>Inbound</td>
                                            <td>{peer.inbound === undefined ? "" : peer.inbound.toString()}</td>
                                        </tr>
                                        <tr>
                                            <td>Blockchain state</td>
                                            <td>{peer.blockchainState}</td>
                                        </tr>
                                        <tr>
                                            <td>Weight:</td>
                                            <td>{peer.weight}</td>
                                        </tr>
                                        {peer.services &&
                                        <tr>
                                            <td>Services:</td>
                                            <td>{peer.services.toString()}</td>
                                        </tr>
                                        }
                                        <tr>
                                            <td>Version:</td>
                                            <td>{peer.version}</td>
                                        </tr>
                                        <tr>
                                            <td>Platform:</td>
                                            <td>{peer.platform}</td>
                                        </tr>
                                        <tr>
                                            <td>Inbound Web Socket:</td>
                                            <td>{peer.inboundWebSocket === undefined ? "" : peer.inboundWebSocket.toString()}</td>
                                        </tr>
                                        <tr>
                                            <td>Last Updated:</td>
                                            <td>{this.formDate(peer.lastUpdated)}</td>
                                        </tr>
                                        <tr>
                                            <td>Blacklisted:</td>
                                            <td>{peer.blacklisted === undefined ? "" : peer.blacklisted.toString()}</td>
                                        </tr>
                                        <tr>
                                            <td>Announced Address:</td>
                                            <td>{peer.announcedAddress}</td>
                                        </tr>
                                        <tr>
                                            <td>Api Port:</td>
                                            <td>{peer.apiPort}</td>
                                        </tr>
                                        <tr>
                                            <td>Application:</td>
                                            <td>{peer.application}</td>
                                        </tr>
                                        <tr>
                                            <td>Port:</td>
                                            <td>{peer.port}</td>
                                        </tr>
                                        <tr>
                                            <td>Outbound Web Socket:</td>
                                            <td>{peer.outboundWebSocket === undefined ? "" : peer.outboundWebSocket.toString()}</td>
                                        </tr>
                                        <tr>
                                            <td>Last Connection Attempt:</td>
                                            <td>{this.formDate(peer.lastConnectAttempt)}</td>
                                        </tr>
                                        <tr>
                                            <td>State:</td>
                                            <td>{peer.state}</td>
                                        </tr>
                                        <tr>
                                            <td>Share Address:</td>
                                            <td>{peer.shareAddress === undefined ? "" : peer.shareAddress.toString()}</td>
                                        </tr>
                                        <tr>
                                            <td>Downloaded:</td>
                                            <td>{this.formMegabytes(peer.downloadedVolume)}</td>
                                        </tr>
                                        <tr>
                                            <td>Uploaded:</td>
                                            <td>{this.formMegabytes(peer.uploadedVolume)}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <a
                                className="btn btn-right round round-top-left round-bottom-right absolute"
                                onClick={() => this.props.closeModal()}
                            >
                                Close
                            </a>
                        </div>
                    </form>
                }

            </div>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(AboutPeerInfo);
