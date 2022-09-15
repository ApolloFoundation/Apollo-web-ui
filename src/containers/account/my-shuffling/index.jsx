/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useEffect, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import SiteHeader from '../../components/site-header';
import CustomTable from '../../components/tables/table';
import {getAccountShufflingsAction} from '../../../actions/shuffling';
import {getTransactionAction} from '../../../actions/transactions';
import ShufflingItem from './shuffling-item/index'
import submitForm from '../../../helpers/forms/forms';
import {BlockUpdater} from '../../block-subscriber/index';
import {setBodyModalParamsAction} from '../../../modules/modals';
import { getAccountSelector } from '../../../selectors';

const initialPagination = {
    page: 1,
    firstIndex: 0,
    lastIndex: 15,
};

const MyShufling = () => {
    const dispatch = useDispatch();
    const account = useSelector(getAccountSelector);
    const [state, setState] = useState({
        ...initialPagination,
        shufflings: null,
    });

    const handlePaginate = (page) => () => {
        setState(prevState => ({
            ...prevState,
            page,
            firstIndex: page * 15 - 15,
            lastIndex: page * 15,
        }));
    };

    const getAccountShufflings = useCallback(async () => {
        const {shufflings} = await dispatch(getAccountShufflingsAction({
            account,
            firstIndex: state.firstIndex,
            lastIndex: state.lastIndex
        }));

        if (shufflings) {
            setState(prevState => ({
                ...prevState,
                shufflings,
            }));
        }
    }, [dispatch, state.firstIndex, state.lastIndex, account]);

    const getTransaction = useCallback(async (transaction) => {
        const res = await dispatch(getTransactionAction({
            transaction,
            account,
        }));
        if (res) {
            dispatch(setBodyModalParamsAction('INFO_TRANSACTION', res));
        }
    }, [dispatch, account]);

    useEffect(() => {
        getAccountShufflings();
        BlockUpdater.on('data', getAccountShufflings);
        return () => {
            BlockUpdater.removeAllListeners('data', getAccountShufflings);
        }
    }, [getAccountShufflings]);

        return (
            <div className="page-content">
                <SiteHeader pageTitle='My shuffling' />
                <div className="page-body container-fluid">
                    <CustomTable
                        header={[
                            {
                                name: 'Shuffling',
                                alignRight: false
                            }, {
                                name: 'Stage',
                                alignRight: false
                            }, {
                                name: 'Holding',
                                alignRight: false
                            }, {
                                name: 'Amount',
                                alignRight: false
                            }, {
                                name: 'Blocks Remaining',
                                alignRight: false
                            }, {
                                name: 'Participants',
                                alignRight: true
                            }, {
                                name: 'Assignee',
                                alignRight: true
                            }
                        ]}
                        className='no-min-height mb-3'
                        emptyMessage='No shufflings found.'
                        TableRowComponent={ShufflingItem}
                        tableData={state.shufflings}
                        passProps={{ getTransaction }}
                        isPaginate
                        page={state.page}
                        previousHendler={handlePaginate(state.page - 1)}
                        nextHendler={handlePaginate(state.page + 1)}
                        itemsPerPage={15}
                    />
                </div>
            </div>
        );
}

const mapStateToProps = state => ({
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    getAccountShufflingsAction: (requestParams) => dispatch(getAccountShufflingsAction(requestParams)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    getTransactionAction: (requestParams) => dispatch(getTransactionAction(requestParams)),
})

export default MyShufling;
