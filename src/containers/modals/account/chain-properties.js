import React from 'react';
import {connect} from 'react-redux';
import ModalBody from '../../components/modals/modal-body';
import { getBlockchainStatusSelector } from '../../../selectors';

const mapStateToProps = state => ({
    appState: getBlockchainStatusSelector(state),
})

const ChainProps = (props) => (
    <ModalBody
        isWide
        modalTitle="Chain properties"
        isDisableFormFooter
        closeModal={props.closeModal}
    >
        <div className="transaction-table no-min-height">
            <div className="transaction-table-body transparent">
                <table>
                    {
                        props.appState &&
                        <tbody>
                            <tr>
                                <td>Chain ID:</td>
                                <td>{props.appState.chainId.toString()}</td>
                            </tr>
                            <tr>
                                <td>Chain Name:</td>
                                <td>{props.appState.chainName.toString()}</td>
                            </tr>
                            <tr>
                                <td>Chain Description:</td>
                                <td>{props.appState.chainDescription.toString()}</td>
                            </tr>
                            <tr>
                                <td>Project Name:</td>
                                <td>{props.appState.projectName.toString()}</td>
                            </tr>
                            <tr>
                                <td>Application:</td>
                                <td>{props.appState.application.toString()}</td>
                            </tr>
                            <tr>
                                <td>Consensus:</td>
                                <td>{props.appState.consensus.toString()}</td>
                            </tr>
                            <tr>
                                <td>Block Time:</td>
                                <td>{props.appState.blockTime.toString()}s</td>
                            </tr>
                            <tr>
                                <td>Adaptive forging:</td>
                                <td>{props.appState.adaptiveForging.toString()}</td>
                            </tr>
                            <tr>
                                <td>Coin symbol:</td>
                                <td>{props.appState.coinSymbol.toString()}</td>
                            </tr>

                        </tbody>
                    }
                </table>
            </div>
        </div>
    </ModalBody>
)

export default connect(mapStateToProps)(ChainProps)