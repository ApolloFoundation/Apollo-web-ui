/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import { getModalDataSelector } from '../../../selectors';
import ModalBody from '../../components/modals/modal-body';

class AboutPeerInfo extends React.Component {
    formDate = date => {
        if (!date) return "";
        const lastUpdDate = new Date(Date.now() - date);
        const month = lastUpdDate.getMonth() +1;
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
            <ModalBody
                modalTitle={`Peer ${this.props?.modalData?.address} Info`}
                isDisableSecretPhrase
                isDisableFormFooter
                closeModal={this.props.closeModal}
            >
                {
                    this.props.modalData &&
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
                                            <td>{(!!peer.sharedAddress).toString()}</td>
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
                }
            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    modalData: getModalDataSelector(state),
});

export default connect(mapStateToProps)(AboutPeerInfo);
