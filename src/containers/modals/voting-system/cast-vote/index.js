/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useState, useEffect } from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import submitForm from "../../../../helpers/forms/forms";
import {NotificationManager} from "react-notifications";
import {getpollAction} from "../../../../actions/polls";
import {getAssetAction} from "../../../../actions/assets";
import {getCurrencyAction} from "../../../../actions/currencies";
import ModalBody from '../../../components/modals/modal-body';
import { getModalDataSelector } from '../../../../selectors';
import CastVoteForm   from './form';

const CastPoll = ({ closeModal, nameModal }) => {
    const dispatch = useDispatch();
    const [poll, setPoll] = useState(null);
    const [votes, setVotes] = useState(null);
    const [asset, setAsset] = useState(null);
    const [currency, setCurrency] = useState();
    const [isPending, setIsPending] = useState(false);
    const modalData = useSelector(getModalDataSelector, shallowEqual);

   
    const getAsset = useCallback(async (asset) => {
        const res = await dispatch(getAssetAction({ asset }));

        if (res && !res.errorCode) {
            setAsset(res);
        }
    }, [dispatch])

    const getCurrency = useCallback(async (currency) => {
        const res = await dispatch(getCurrencyAction({ currency }));

        if (res && !res.errorCode) {
            setCurrency(res);
        }
    }, [dispatch]);

    const getPoll = useCallback(async () => {
        const poll = await dispatch(getpollAction({
            poll: modalData
        }));

        if (poll && !poll.errorCode) {
            const votes = Object.values(poll.options).reduce((acc, item, index) => {
                if (index > 9) {
                    acc['vote' + index] = item;
                } else {
                    acc['vote0' + index] = item;
                }
                return acc;
            }, {});
            // update state
            setPoll(poll);
            setVotes(votes);
            // get info about asset and currency
            getAsset(poll.holding);
            getCurrency(poll.holding);
        }
    }, [dispatch]);

    const handleFormSubmit = useCallback(async({ feeATM, secretPhrase, ...votesUnhandlered }) => {
        if (!isPending) {
            setIsPending(true);
            let votes = {};

            if (poll.maxRangeValue === 1) {
                // we need update votes to number values
                votes = Object
                    .entries(votesUnhandlered)
                    .reduce((acc, [key, value]) => {
                        acc[key] = value === true ? 1 : -128;
                        return acc;
                    }, {});
            } else {
                // we must remove values equal to 0
                votes = Object
                    .entries(votesUnhandlered)
                    .reduce((acc, [key, value]) => {
                        if (value > 0) {
                            acc[key] = value;
                        }
                        return acc;
                    }, {});
            }

            const data = {
                poll: poll.poll,
                feeATM,
                secretPhrase,
                ...votes,
            };

            const res = await dispatch(submitForm.submitForm(data, 'castVote'));
            if (res.errorCode) {
                setIsPending(false);
                NotificationManager.error(res.errorDescription, 'Error', 5000)
            } else {
                closeModal();
                NotificationManager.success('Your vote has been cast!', null, 5000);
            }
        }
    }, [isPending, dispatch, poll, ]);

    useEffect(() => {
        getPoll();
    }, [getPoll]);

    const assetHint    = asset    ? `This vote is based on the balance of asset: ${asset.asset}. If you do not have enough of this asset, your vote will not be counted.` : null;
    const currencyHint = currency ? `This vote is based on the balance of asset: ${currency.currency}. If you do not have enough of this currency, your vote will not be counted.` : null;

    return (
        <ModalBody
            modalTitle='Cast vote'
            closeModal={closeModal}
            handleFormSubmit={handleFormSubmit}
            submitButtonName='Cast vote'
            isFee
            nameModel={nameModal}
            isPending={isPending}
            initialValues={{
                ...votes,
            }}
        >
            <CastVoteForm
                assetHint={assetHint}
                currencyHint={currencyHint}
                poll={poll}
                votes={votes}
            />
        </ModalBody>
    );
}

export default CastPoll;
