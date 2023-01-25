/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import SiteHeader from  '../../components/site-header'
import {setModalCallback, setModalType} from "../../../modules/modals";
import { TransactionFilter } from './TransactionFilter';
import { TransactionTable } from './TransactionTable';

const Transactions = () => {
    const dispatch = useDispatch();
    // there is a common filter state of component. There is not data loading logic
    const [isPrivate, setIsPrivate] = useState(false);
    // open modal for showing private transaction and enter passPhrase
    const getPrivateTransactions = useCallback(() => {
        setIsPrivate(true);
    }, []);

    const handleModal = () => dispatch(setModalType('PrivateTransactions'));

    useEffect(() => {
        dispatch(setModalCallback(getPrivateTransactions));
    }, [dispatch, getPrivateTransactions]);

    return (
        <div className="page-content">
            <SiteHeader pageTitle='Transactions'>
                <button
                    type='button'
                    className={classNames({
                        'btn btn-green btn-sm': true,
                        'disabled' : isPrivate
                    })}
                    onClick={handleModal}
                >
                    Show private transactions
                </button>
            </SiteHeader>
            <div className="page-body container-fluid">
                <div className='my-transactions'>
                    <TransactionFilter />
                    <TransactionTable
                        isPrivate={isPrivate}
                        onPrivateTransaction={getPrivateTransactions}
                    />
                </div>
            </div>
        </div>
    );
}

export default Transactions;
