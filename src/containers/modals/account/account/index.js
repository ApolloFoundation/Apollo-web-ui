/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useEffect, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {openPrevModal} from '../../../../modules/modals';
import {useHistory, withRouter} from "react-router-dom";
import {getAccountInfoAction, switchAccountAction} from "../../../../actions/account";
import TabulationBody from '../../../components/tabulator/tabuator-body';
import TabContaier from '../../../components/tabulator/tab-container';
import {
    getAccountInfoSelector,
    getModalDataSelector,
    getModalHistorySelector
} from '../../../../selectors';
import { TransactionTable } from './Tables/TransactionTable';
import { LedgerTable } from './Tables/LedgerTable';
import { AssetsTable } from './Tables/AssetsTable';
import { TradeHistoryTable } from './Tables/TradeHistory';
import { CurrenciesTable } from './Tables/CurrenciesTable';
import { MarketplaceTable } from './Tables/MarketPlaceTable';
import { AliasesTable } from './Tables/AliasesTable';
import { Actions } from './Tables/Actions';

const InfoAccount = (props) => {
    const dispatch = useDispatch();
    const modalData = useSelector(getModalDataSelector);
    const modalsHistory = useSelector(getModalHistorySelector);
    const { account, ticker } = useSelector(getAccountInfoSelector);
    const history = useHistory();

    const [state, setState] = useState({
        account: {},
    });

    const handleLoadAccoutData = useCallback(async () => {
        const account = await dispatch(getAccountInfoAction({ account: modalData }));
        setState({
            account,
        })
    }, [dispatch, modalData]);

    const handlePrevModal = () => dispatch(openPrevModal());

    const handleSwitchAccount = () => dispatch(switchAccountAction(state.account.accountRS, history));

    useEffect(() => {
        handleLoadAccoutData();
    }, [handleLoadAccoutData]);

    const recipient = state.account ? state.account.accountRS : null;

    return (
        <div className="modal-box x-wide">
            {modalData &&
                <form className="modal-form">
                    <div className="form-group-app media-tab">
                        <button type="button" onClick={props.closeModal} className="exit">
                            <i className="zmdi zmdi-close"/>
                        </button>

                        <div className="form-title inline">
                            {modalsHistory.length > 1 &&
                                <div className="backMy" onClick={handlePrevModal}/>
                            }
                            {state.account &&
                                <>
                                    <p>Account {state.account.accountRS} info</p>
                                    {
                                        account !== state.account.account &&
                                        <span
                                            onClick={handleSwitchAccount}
                                            className="btn btn-green btn-sm"
                                            style={{
                                                margin: '0 0 10px 30px'
                                            }}
                                        >
                                            Switch Account
                                        </span>
                                    }
                                </>
                            }
                            {
                                state.account &&
                                <div className={"account-balance-text"}>Account has a balance
                                    of <strong>{Math.round(state.account.unconfirmedBalanceATM / Math.pow(10, 8))} {ticker}</strong>
                                </div>
                            }
                        </div>
                        <TabulationBody>
                            <TabContaier sectionName="Transactions">
                                <TransactionTable activeTab={props.activeTab} />
                            </TabContaier>
                            <TabContaier sectionName="Ledger">
                                <LedgerTable />
                            </TabContaier>
                            <TabContaier sectionName="Assets">
                                <AssetsTable />
                            </TabContaier>
                            <TabContaier sectionName="Trade history">
                                <TradeHistoryTable />
                            </TabContaier>
                            <TabContaier sectionName="Currencies">
                                <CurrenciesTable />
                            </TabContaier>
                            <TabContaier sectionName="Marketplace">
                                <MarketplaceTable />
                            </TabContaier>
                            <TabContaier sectionName="Aliases">
                                <AliasesTable />
                            </TabContaier>
                            <TabContaier sectionName="Actions">
                                <Actions recipient={recipient} account={state.account} />
                            </TabContaier>
                        </TabulationBody>
                    </div>
                </form>
            }
        </div>
    );
}

export default InfoAccount;
