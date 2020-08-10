/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, {
  useState, useEffect, useCallback,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAccountPropertiesAction } from '../../../actions/account/index';
import { setBodyModalParamsAction } from '../../../modules/modals';
import AccountProperty from './acocunt-property/index1';
import SiteHeader from '../../components/site-header';
import CustomTable from '../../components/tables/table1';
import Button from '../../components/button';

const initialPagination = {
  page: 1,
  firstIndex: 0,
  lastIndex: 15,
};

export default function AccountProperties() {
  const dispatch = useDispatch();

  const { actualBlock, account } = useSelector(state => state.account);

  const [properties, setProperties] = useState(null);
  const [incoming, setIncoming] = useState(true);
  const [pagination, setPagination] = useState({ ...initialPagination });

  const getAccountPropertiesIncoming = useCallback(async (currAccount, currPagination) => {
    let newPagination = currPagination;
    let newAccount = currAccount;

    if (!newAccount) newAccount = account;
    if (!newPagination) {
      newPagination = { ...pagination };
    }

    const newProperties = await dispatch(getAccountPropertiesAction({
      recipient: newAccount,
      firstIndex: newPagination.firstIndex,
      lastIndex: newPagination.lastIndex,
    }));

    if (newProperties) {
      setProperties(newProperties.properties);
      setIncoming(true);
      setPagination({ ...newPagination });
    }
  }, [account, dispatch, pagination]);

  const getAccountPropertiesOutgoing = useCallback(async (currAccount, currPagination) => {
    let newPagination = currPagination;
    let newAccount = currAccount;

    if (!newAccount) newAccount = account;
    if (!newPagination) {
      newPagination = { ...pagination };
    }

    const newProperties = await dispatch(getAccountPropertiesAction({
      setter: newAccount,
      firstIndex: newPagination.firstIndex,
      lastIndex: newPagination.lastIndex,
    }));

    if (newProperties) {
      setProperties(newProperties.properties);
      setIncoming(false);
      setPagination({ ...newPagination });
    }
  }, [account, dispatch, pagination]);

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
    if (incoming) getAccountPropertiesIncoming(account);
    else getAccountPropertiesOutgoing(account);
  }, [incoming, account, actualBlock]);

  useEffect(() => {
    getAccountPropertiesIncoming();
  }, []);

  return (
    <div className="page-content">
      <SiteHeader
        pageTitle="Account properties"
      >
        <button
          type="button"
          className={`btn ${incoming ? 'outline-primary' : 'outline-transparent'} mr-1`}
          onClick={() => getAccountPropertiesIncoming(null, initialPagination)}
        >
          Incoming
        </button>
        <button
          type="button"
          className={`btn ${incoming ? 'outline-transparent' : 'outline-primary'} mr-1`}
          onClick={() => getAccountPropertiesOutgoing(null, initialPagination)}
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
        <CustomTable
          header={[
            {
              name: `${incoming ? 'Setter' : 'Recipient'}`,
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
          TableRowComponent={conponentProps => <AccountProperty incoming={incoming} {...conponentProps} />}
          tableData={properties}
          isPaginate
          page={pagination.page}
          previousHendler={() => onPaginate(pagination.page - 1)}
          nextHendler={() => onPaginate(pagination.page + 1)}
          itemsPerPage={15}
        />
      </div>
    </div>
  );
}
