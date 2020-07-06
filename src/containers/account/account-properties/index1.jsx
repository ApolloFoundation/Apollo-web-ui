/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useEffect, useCallback } from 'react';
import { useState, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import SiteHeader from '../../components/site-header';
import { getAccountPropertiesAction } from '../../../actions/account/index';
import InfoBox from '../../components/info-box';
import { setBodyModalParamsAction } from '../../../modules/modals';
import ContentLoader from '../../components/content-loader';
import ContentHendler from '../../components/content-hendler';

import AccountProperty from './acocunt-property';
import CustomTable from '../../components/tables/table';

export default function AccountProperties(props) {
  const dispatch = useDispatch();

  const [properties, setProperties] = useState(null);
  const [recipientRS, setRecipientRS] = useState(null);
  const [setterRS, setSetterRS] = useState(null);
  const [incoming, setIncoming] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    firstIndex: 0,
    lastIndex: 15,
  });

  const getAccountPropertiesIncoming = useCallback(async (state, currPagination) => {
    let newPagination = currPagination;
    let newState = state;

    if (!newState) newState = props;
    if (!newPagination) {
      newPagination = { ...pagination };
    }

    const newProperties = await dispatch(getAccountPropertiesAction({
      recipient: newState.account,
      firstIndex: newPagination.firstIndex,
      lastIndex: newPagination.lastIndex,
    }));

    if (newProperties) {
      setProperties(newProperties.properties);
      setRecipientRS(newProperties.recipientRS);
      setIncoming(true);
      setPagination(...newPagination);
    }
  }, [dispatch, pagination, props]);

  const getAccountPropertiesOutgoing = useCallback(async (state, currPagination) => {
    let newPagination = currPagination;
    let newState = state;

    if (!newState) newState = props;
    if (!newPagination) {
      newPagination = { ...pagination };
    }

    const newProperties = await dispatch(getAccountPropertiesAction({
      setter: newState.account,
      firstIndex: newPagination.firstIndex,
      lastIndex: newPagination.lastIndex,
    }));

    if (newProperties) {
      setProperties(newProperties.properties);
      setSetterRS(newProperties.setterRS);
      setIncoming(false);
      setPagination(...newPagination);
    }
  }, [dispatch, pagination, props]);

  const setProperty = useCallback(() => {
    dispatch(setBodyModalParamsAction('SET_ACCOUNT_PROPERTY', {}));
  }, [dispatch]);

  const onPaginate = useCallback(page => {
    const newPagination = {
      page,
      firstIndex: page * 15 - 15,
      lastIndex: page * 15,
    };
    getAccountPropertiesIncoming(null, newPagination);
  }, [getAccountPropertiesIncoming]);

  useEffect(() => {
    getAccountPropertiesIncoming();

    if (incoming) getAccountPropertiesIncoming(props);
    else getAccountPropertiesOutgoing(props);
  }, [getAccountPropertiesIncoming, getAccountPropertiesOutgoing, incoming, props]);
}
