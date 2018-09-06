import React from 'react';
import {connect} from 'react-redux';
import {setModalData} from '../../../modules/modals';
import classNames from 'classnames';

class InfoLedgerTransaction extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 0
        };

        this.handleTab = this.handleTab.bind(this);
    }

    handleTab(e, index) {
        e.preventDefault();

        this.setState({
            ...this.props,
            activeTab: index
        })
    }

    render() {
        return (
            <div className="modal-box wide">
                {
                    this.props.modalData &&
                    <form className="modal-form">
                        <div className="form-group-app">
                            <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                            <div className="form-title">
                                <p>Transaction</p>
                            </div>

                            <div className="form-tabulator active">
                                <div className="form-tab-nav-box justify-left">
                                    <a onClick={(e) => this.handleTab(e, 0)} className={classNames({
                                        "form-tab": true,
                                        "active": this.state.activeTab === 0
                                    })}>
                                        <span className="pre">Info</span>
                                    </a>
                                    <a onClick={(e) => this.handleTab(e, 1)} className={classNames({
                                        "form-tab": true,
                                        "active": this.state.activeTab === 1
                                    })}>
                                        <span className="pre">Actions</span>
                                    </a>
                                    <a onClick={(e) => this.handleTab(e, 2)} className={classNames({
                                        "form-tab": true,
                                        "active": this.state.activeTab === 2
                                    })}>
                                        <span className="pre">Transactions Details</span>
                                    </a>

                                </div>

                                <div className={classNames({
                                    "tab-body": true,
                                    "active": this.state.activeTab === 0
                                })}>
                                    <div className="transaction-table no-min-height">
                                        <div className="transaction-table-body transparent">
                                            <table>
                                                <tbody>
                                                <tr>
                                                    <td>Encrypted message:</td>
                                                    <td>This is encrypted test message!</td>
                                                </tr>
                                                <tr>
                                                    <td>Shared key:</td>
                                                    <td>{this.props.modalData.senderPublicKey}</td>
                                                </tr>
                                                <tr>
                                                    <td>From:</td>
                                                    <td>{this.props.modalData.senderRS}</td>
                                                </tr>
                                                <tr>
                                                    <td>To:</td>
                                                    <td>{this.props.modalData.recipientRS}</td>
                                                </tr>
                                                <tr>
                                                    <td>Compressed:</td>
                                                    <td>?</td>
                                                </tr>
                                                <tr>
                                                    <td>Hash:</td>
                                                    <td>{this.props.modalData.fullHash}</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className={classNames({
                                    "tab-body": true,
                                    "active": this.state.activeTab === 1
                                })}>
                                    <div className="flexible-grid">
                                        <div className="btn btn-primary blue static">Send Apollo</div>
                                        <div className="btn btn-primary blue static">Send currency to sender</div>
                                        <div className="btn btn-primary blue static">Send a message to sender</div>
                                        <div className="btn btn-primary blue static">Add sender as contact</div>
                                        <div className="btn btn-primary blue static">Apptove transaction</div>
                                        <div className="btn btn-primary blue static">Extend data lifetime</div>
                                    </div>
                                </div>
                                <div className={classNames({
                                    "tab-body": true,
                                    "active": this.state.activeTab === 2
                                })}>
                                    <div className="transaction-table no-min-height">
                                        <div className="transaction-table-body transparent">
                                            <table>
                                                <tbody>
                                                <tr>
                                                    <td>Sender public key:</td>
                                                    <td>{this.props.modalData.senderPublicKey}</td>
                                                </tr>
                                                <tr>
                                                    <td>Signature:</td>
                                                    <td>{this.props.modalData.senderRS}</td>
                                                </tr>
                                                <tr>
                                                    <td>Fee NQT:</td>
                                                    <td>{this.props.modalData.recipientRS}</td>
                                                </tr>
                                                <tr>
                                                    <td>Transaction index:</td>
                                                    <td>?</td>
                                                </tr>
                                                <tr>
                                                    <td>Type:</td>
                                                    <td>{this.props.modalData.fullHash}</td>
                                                </tr>
                                                <tr>
                                                    <td>Confirmations:</td>
                                                    <td>{this.props.modalData.fullHash}</td>
                                                </tr>
                                                <tr>
                                                    <td>Full Hash:</td>
                                                    <td>{this.props.modalData.fullHash}</td>
                                                </tr>
                                                <tr>
                                                    <td>Version:</td>
                                                    <td>{this.props.modalData.fullHash}</td>
                                                </tr>
                                                <tr>
                                                    <td>Phased:</td>
                                                    <td>{this.props.modalData.fullHash}</td>
                                                </tr>
                                                <tr>
                                                    <td>Phased:</td>
                                                    <td>{this.props.modalData.fullHash}</td>
                                                </tr>
                                                <tr>
                                                    <td>EC block id:</td>
                                                    <td>{this.props.modalData.fullHash}</td>
                                                </tr>
                                                <tr>
                                                    <td>Signature hash:</td>
                                                    <td>{this.props.modalData.fullHash}</td>
                                                </tr>
                                                <tr>
                                                    <td>Sender RS:</td>
                                                    <td>{this.props.modalData.fullHash}</td>
                                                </tr>
                                                <tr>
                                                    <td>Subtype:</td>
                                                    <td>{this.props.modalData.fullHash}</td>
                                                </tr>
                                                <tr>
                                                    <td>Amount NQT:</td>
                                                    <td>{this.props.modalData.fullHash}</td>
                                                </tr>
                                                <tr>
                                                    <td>Sender:</td>
                                                    <td>{this.props.modalData.fullHash}</td>
                                                </tr>
                                                <tr>
                                                    <td>EC block height:</td>
                                                    <td>{this.props.modalData.fullHash}</td>
                                                </tr>
                                                <tr>
                                                    <td>Block:</td>
                                                    <td>{this.props.modalData.fullHash}</td>
                                                </tr>
                                                <tr>
                                                    <td>Block timestamp:</td>
                                                    <td>{this.props.modalData.fullHash}</td>
                                                </tr>
                                                <tr>
                                                    <td>Deadline:</td>
                                                    <td>{this.props.modalData.fullHash}</td>
                                                </tr>
                                                <tr>
                                                    <td>Timestamp:</td>
                                                    <td>{this.props.modalData.fullHash}</td>
                                                </tr>
                                                <tr>
                                                    <td>Transaction time:</td>
                                                    <td>{this.props.modalData.fullHash}</td>
                                                </tr>
                                                <tr>
                                                    <td>Block generation time:</td>
                                                    <td>{this.props.modalData.fullHash}</td>
                                                </tr>
                                                <tr>
                                                    <td>Height:</td>
                                                    <td>{this.props.modalData.fullHash}</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="btn-box align-buttons-inside absolute right-conner">
                                <a className="btn btn-right round round-top-left round-bottom-right"
                                   onClick={() => this.props.closeModal()}
                                >
                                    Close
                                </a>
                            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(InfoLedgerTransaction);
