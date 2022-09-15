/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useEffect, useState } from 'react';
import SiteHeader from "../../components/site-header"
import { useDispatch, useSelector } from 'react-redux';
import {setBodyModalParamsAction} from "../../../modules/modals";
import {BlockUpdater} from "../../block-subscriber/index";
import CustomTable from '../../components/tables/table';
import {getMessagesPerpage} from '../../../actions/messager'
import { getMessagesSelector, getPassPhraseSelector } from '../../../selectors';
import MessageItem from './message-item/index'

const itemsPerPage = 15;

const MyMessages = () => {
    const dispatch = useDispatch();
    const messages = useSelector(getMessagesSelector);
    const passPhrase = useSelector(getPassPhraseSelector);
    const [state, setState] = useState({
        page: 1,
        firstIndex: 0,
        lastIndex: itemsPerPage,
        messages: null,
    });

    const getMessagesPerpageRequest = useCallback(async () => {
        await dispatch(getMessagesPerpage({
            firstIndex: state.firstIndex,
            lastIndex: state.lastIndex
        }));
    }, [state.firstIndex, state.lastIndex, dispatch, state.page]);

    const listener = useCallback(() => getMessagesPerpageRequest(), [getMessagesPerpageRequest]);

    const handlePaginate = (page) => () => {
        setState(prevState => ({
            ...prevState,
            page,
            firstIndex: page * itemsPerPage - itemsPerPage,
            lastIndex: page * itemsPerPage,
        }))
    };

    const handleComposeModal = () => dispatch(setBodyModalParamsAction('COMPOSE_MESSAGE', null));

    useEffect(() => {
        listener();
        BlockUpdater.on("data", listener);
        return () => {
            BlockUpdater.removeAllListeners('data', listener);
        }
    }, [listener, passPhrase]);

    // return default state when the passphrase has changed
    useEffect(() => {
        setState({
            page: 1,
            firstIndex: 0,
            lastIndex: itemsPerPage,
            messages: null,
        });
    }, [passPhrase]);

    return (
        <div className="page-content">
            <SiteHeader pageTitle='My messages'>
                <button
                    type='button'
                    onClick={handleComposeModal}
                    className="btn btn-green btn-sm"
                >
                    Compose message
                </button>
            </SiteHeader>
            <div className="page-body container-fluid">
                <CustomTable
                    header={[
                        {
                            name: 'Date',
                            alignRight: false
                        },{
                            name: 'From',
                            alignRight: false
                        },{
                            name: 'To',
                            alignRight: false
                        },{
                            name: 'Message',
                            alignRight: false
                        },{
                            name: 'Action',
                            alignRight: true
                        }
                    ]}
                    emptyMessage='No messages found.'
                    className='mb-3'
                    TableRowComponent={MessageItem}
                    tableData={messages}
                    isPaginate
                    itemsPerPage={itemsPerPage}
                    page={state.page}
                    previousHendler={handlePaginate(state.page - 1)}
                    nextHendler={handlePaginate(state.page + 1)}
                />
            </div>
        </div>
    );
}

export default MyMessages;
