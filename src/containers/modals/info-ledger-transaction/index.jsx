/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useEffect, useState } from 'react';
import {connect} from 'react-redux';
import {setModalData, openPrevModal} from '../../../modules/modals';
import {getLedgerEntryAction} from '../../../actions/ledger';
import ModalBody from "../../components/modals/modal-body";
import { useLoading } from '../../../hooks/useLoading';
import ContentLoader from '../../components/content-loader';
import {
    getDecimalsSelector, getModalDataSelector, getModalHistorySelector, getPassPhraseSelector
} from '../../../selectors';

const InfoTransactions = (props) => {
    const [entry, setEntry] = useState({});
    const {
        isLoading,
        setLoadingTrue,
        setLoadingFalse
    } = useLoading();

    const handleGetData = useCallback(async () => {
        setLoadingTrue();
        let params = {
            ledgerId: props.modalData.ledgerId ? props.modalData.ledgerId : props.modalData,
        };
        
        if (props.modalData.eventType === 'PRIVATE_PAYMENT') {
            params.secretPhrase = props.passPhrase;
        } 
        const entry = await props.getLedgerEntryAction(params);

        setEntry(entry);
        setLoadingFalse();
    }, [props.modalData, props.getLedgerEntryAction, props.passPhrase])

    useEffect(() => {
        handleGetData();
    }, [handleGetData]);

    return (
        <ModalBody
            modalTitle={`Ledger ${entry && !isLoading ? entry.ledgerId : ''} info`}
            closeModal={props.closeModal}
            isDisableFormFooter
            isDisableSecretPhrase
            isWide
        >
            <div className="transaction-table no-min-height">
                <div className="transaction-table-body transparent">
                    <table>
                        {isLoading && <ContentLoader />}
                        {(!isLoading && entry) &&
                            <tbody>
                                <tr>
                                    <td>Event Type:	</td>
                                    <td>{entry.eventType}</td>
                                </tr>
                                <tr>
                                    <td>Ledger Id:</td>
                                    <td>{entry.ledgerId}</td>
                                </tr>
                                <tr>
                                    <td>Holding Type:</td>
                                    <td>{entry.holdingType}</td>
                                </tr>
                                <tr>
                                    <td>Account ID:	</td>
                                    <td>{entry.accountRS}</td>
                                </tr>
                                <tr>
                                    <td>Account ID:</td>
                                    <td>{entry.account}</td>
                                </tr>
                                <tr>
                                    <td>Timestamp:</td>
                                    <td>{entry.timestamp}</td>
                                </tr>
                                <tr>
                                    <td>Height:</td>
                                    <td>{entry.height}</td>
                                </tr>
                                <tr>
                                    <td>Transaction:</td>
                                    <td>{entry.event}</td>
                                </tr>
                                <tr>
                                    <td>Change:</td>
                                    <td>{entry.change / props.decimals}</td>
                                </tr>
                                <tr>
                                    <td>Balance:</td>
                                    <td>{Math.round(entry.balance / props.decimals)}</td>
                                </tr>
                            </tbody>
                        }
                    </table>
                </div>
            </div>
        </ModalBody>
    );
}

const mapStateToProps = state => ({
    modalData: getModalDataSelector(state),
    decimals: getDecimalsSelector(state),
    modalsHistory: getModalHistorySelector(state),
    passPhrase: getPassPhraseSelector(state),
});

const mapDispatchToProps = {
    setModalData,
    getLedgerEntryAction,
    openPrevModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(InfoTransactions);
