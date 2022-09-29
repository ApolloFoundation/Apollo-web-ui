/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { getAccountPropertiesAction } from '../../../actions/account/index';
import { setBodyModalParamsAction } from '../../../modules/modals';
import AccountProperty from './acocunt-property';
import SiteHeader from '../../components/site-header';
import Button from '../../components/button';
import { TableLoader } from '../../components/TableLoader';
import { getAccountInfoSelector } from '../../../selectors';

export default function AccountProperties() {
  const dispatch = useDispatch();
  const { account } = useSelector(getAccountInfoSelector);

  const [state, setState] = useState({
    incoming: true,
    isResetPagination: true,
    isShowLoader: true,
  });

  const handleTab = (val) => () => {
    setState({
      incoming: val,
      isResetPagination: true,
      isShowLoader: true,
    });
  }

  const handleResetPagination = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      isResetPagination: false,
    }));
  }, []);

  const getAccountProperties = useCallback(async ({ firstIndex, lastIndex }) => {
    const params = { firstIndex, lastIndex };

    if (state.incoming) {
      params.recipient = account;
    } else {
      params.setter = account; 
    }

    const newProperties = await dispatch(getAccountPropertiesAction(params));

    setState(prevState => ({
      ...prevState,
      isShowLoader: false,
    }));

    return newProperties?.properties ?? [];
  }, [account, state.incoming, dispatch]);

  
  const setProperty = useCallback(() => 
    dispatch(setBodyModalParamsAction('SET_ACCOUNT_PROPERTY', {})),
  [dispatch]);

  return (
    <div className="page-content">
      <SiteHeader pageTitle="Account properties">
        <button
          type="button"
          className={classNames('btn mr-1', { 'outline-primary': state.incoming, 'outline-transparent': !state.incoming })}
          onClick={handleTab(true)}
        >
          Incoming
        </button>
        <button
          type="button"
          className={classNames('btn mr-1', { 'outline-primary': !state.incoming, 'outline-transparent': state.incoming })}
          onClick={handleTab(false)}
        >
          Outgoing
        </button>
        <Button
          color="green"
          size="sm"
          name="Set"
          onClick={setProperty}
        />
      </SiteHeader>
      <div className="page-body container-fluid">
        <TableLoader
          headersList={[
            {
              name: `${state.incoming ? 'Setter' : 'Recipient'}`,
              alignRight: false,
            }, {
              name: 'Property',
              alignRight: false,
            }, {
              name: 'Value',
              alignRight: false,
            }, {
              name: 'Actions',
              alignRight: true,
            },
          ]}
          className="mb-3"
          emptyMessage="No account properties found ."
          TableRowComponent={AccountProperty}
          dataLoaderCallback={getAccountProperties}
          passProps={{ incoming: state.incoming }}
          isResetPagination={state.isResetPagination}
          onResetPagination={handleResetPagination}
          isShowLoader={state.isShowLoader}
        />
      </div>
    </div>
  );
}
