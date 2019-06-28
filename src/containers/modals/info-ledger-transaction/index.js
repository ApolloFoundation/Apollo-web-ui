/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setModalData, openPrevModal} from '../../../modules/modals';
import {getLedgerEntryAction} from '../../../actions/ledger/';
import {ONE_APL} from '../../../constants';
import ModalBody from "../../components/modals/modal-body";

class InfoTransactions extends React.Component {
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

    componentDidMount = () => {
        this.getAccountLedgerEntry(this.props);
    };

    componentWillReceiveProps = (newState) => {
        this.getAccountLedgerEntry(newState);
    }

    getAccountLedgerEntry = async (newState) => {

        let params;

        if (typeof newState.modalData === 'object') {

            this.setState({
                entry: newState.modalData
            });

            return;

        } else {

            params = {ledgerId: newState.modalData};

        }

        const entry = await this.props.getLedgerEntryAction(params);

        if (entry) {
            this.setState({
                entry
            })
        }
    };

    // TODO: migrate timesamp, migrate account to RS

    render() {
        return (
            <ModalBody
                modalTitle={`Ledger ${this.state.entry ? this.state.entry.ledgerId : ''} info`}
                closeModal={this.props.closeModal}
                isDisableFormFooter
                isDisableSecretPhrase
                isWide
            >
                            <div className="transaction-table no-min-height">
                                <div className="transaction-table-body transparent">
                                    <table>
                                        {
                                            this.state.entry &&
                                            <tbody>
                                                <tr>
                                                    <td>Event Type:	</td>
                                                    <td>{this.state.entry.eventType}</td>
                                                </tr>
                                                <tr>
                                                    <td>Ledger Id:</td>
                                                    <td>{this.state.entry.ledgerId}</td>
                                                </tr>
                                                <tr>
                                                    <td>Holding Type:</td>
                                                    <td>{this.state.entry.holdingType}</td>
                                                </tr>
                                                <tr>
                                                    <td>Account ID:	</td>
                                                    <td>{this.state.entry.accountRS}</td>
                                                </tr>
                                                <tr>
                                                    <td>Account ID:</td>
                                                    <td>{this.state.entry.account}</td>
                                                </tr>
                                                <tr>
                                                    <td>Timestamp:</td>
                                                    <td>{this.state.entry.timestamp}</td>
                                                </tr>
                                                <tr>
                                                    <td>Height:</td>
                                                    <td>{this.state.entry.height}</td>
                                                </tr>
                                                <tr>
                                                    <td>Transaction:</td>
                                                    <td>{this.state.entry.event}</td>
                                                </tr>
                                                <tr>
                                                    <td>Change:</td>
                                                    <td>{this.state.entry.change / ONE_APL}</td>
                                                </tr>
                                                <tr>
                                                    <td>Balance:</td>
                                                    <td>{Math.round(this.state.entry.balance / ONE_APL)}</td>
                                                </tr>
                                            </tbody>
                                        }
                                    </table>
                                </div>
                            </div>
            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    modalsHistory: state.modals.modalsHistory,
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    getLedgerEntryAction: (data) => dispatch(getLedgerEntryAction(data)),
    openPrevModal: () => dispatch(openPrevModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(InfoTransactions);
