/******************************************************************************
 * Copyright © 2020 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {getNodeHealthInfo} from '../../../actions/blocks';
import ModalBody from "../../components/modals/modal-body";

class NodeHealthInfo extends React.Component {

    state = {
        nodeHealthInfo: null,
    }

    componentDidMount() {
        this.getAllShards();
    }
    
    getAllShards = async () => {
        const nodeHealthInfo = await this.props.getNodeHealthInfo();
        this.setState({nodeHealthInfo});
    }

    render() {
        const {nodeHealthInfo} = this.state;
        return (
            <ModalBody
                modalTitle={'Node Health Info'}
                closeModal={this.props.closeModal}
                isDisableFormFooter
                isXWide
                isDisableSecretPhrase
            >
                <div className="transaction-table no-min-height">
                    <div className="transaction-table-body transparent">
                        {nodeHealthInfo
                        ? <table>
                                <tbody>
                                    <tr>
                                        <td>Database:</td>
                                        <td>{nodeHealthInfo.healthInfo.dbOK ? 'OK' : 'FAILED'}</td>
                                    </tr>
                                    <tr>
                                        <td>CPU Load:</td>
                                        <td>{nodeHealthInfo.statusInfo.cpuLoad}</td>
                                    </tr>
                                    <tr>
                                        <td>Apollo memory total:</td>
                                        <td>{Math.round(nodeHealthInfo.statusInfo.memoryTotal / 1000000)} MB</td>
                                    </tr>
                                    <tr>
                                        <td>Apollo free memory:</td>
                                        <td>{Math.round(nodeHealthInfo.statusInfo.memoryFree / 1000000)} MB</td>
                                    </tr>
                                    <tr>
                                        <td>Inbound Peers Number:</td>
                                        <td>{nodeHealthInfo.networkingInfo.inboundPeers}</td>
                                    </tr>
                                    <tr>
                                        <td>Outbound Peers Number:</td>
                                        <td>{nodeHealthInfo.networkingInfo.outboundPeers}</td>
                                    </tr>
                                </tbody>
                            </table>
                        : <div className={'align-items-center loader-box'}>
                            <div className="ball-pulse">
                                <div/>
                                <div/>
                                <div/>
                            </div>
                        </div>}
                    </div>
                </div>
            </ModalBody>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    getNodeHealthInfo: (data) => dispatch(getNodeHealthInfo(data)),
});

export default connect(null, mapDispatchToProps)(NodeHealthInfo);
