import React from 'react';
import {connect} from 'react-redux';


const mapStateToProps = state => ({
    appState: state.account.blockchainStatus,
})

const ChainProps = (props) => (
    <div className="modal-box wide">
            <div className="modal-form">
                <div className="form-group-app">
                    <button type="button" onClick={props.closeModal} className="exit"><i className="zmdi zmdi-close" /></button>

                    <div className="form-title">
                        <p>Chain properties</p>
                    </div>

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
                </div>
            </div>
    </div>
)

export default connect(mapStateToProps)(ChainProps)