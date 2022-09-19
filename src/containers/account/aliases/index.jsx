/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import { TableLoader } from '../../components/TableLoader';
import {useDispatch, useSelector} from 'react-redux';
import {getAliasesAction} from "../../../actions/aliases";
import {setBodyModalParamsAction} from "../../../modules/modals";
import SiteHeader from '../../components/site-header'
import { getAccountSelector } from '../../../selectors';
import Alias from "./alias/index";

const headersList = [
  {
    name: 'Aliases',
    alignRight: false
  },
  {
    name: 'Type Value',
    alignRight: false
  },
  {
    name: 'Status',
    alignRight: false
  },
  {
    name: 'Actions',
    alignRight: true
  }
];

export const Aliases = () => {
  const dispatch = useDispatch();
  const account = useSelector(getAccountSelector);

  const getAliases = useCallback(async ({ firstIndex, lastIndex }) => {
    const { aliases } = await dispatch(getAliasesAction({
      firstIndex,
      lastIndex,
      account,
    }))
    return aliases;
  }
  , [dispatch, account]);

  const handleAddAlias = () => {
    dispatch(setBodyModalParamsAction('ADD_ALIAS', {}));
  }

  return (
      <div className="page-content">
          <SiteHeader
              pageTitle='Aliases'
          >
              <button
                  type='button'
                  className="btn btn-green btn-sm"
                  onClick={handleAddAlias}
              >
                  Add alias
              </button>
          </SiteHeader>
          <div className="page-body container-fluid">
              <TableLoader
                  headersList={headersList}
                  TableRowComponent={Alias}
                  className='no-min-height mb-3'
                  emptyMessage='No aliases found.'
                  dataLoaderCallback={getAliases}
              />        
          </div>
      </div>
  );
}

export default Aliases;
