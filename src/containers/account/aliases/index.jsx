/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useEffect, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getAliasesAction} from "../../../actions/aliases";
import {setBodyModalParamsAction} from "../../../modules/modals";
import {BlockUpdater} from "../../block-subscriber";
import SiteHeader from '../../components/site-header'
import CustomTable from '../../components/tables/table';
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
  const account = useSelector(state => state.account.account)
  const [state, setState] = useState({
        aliases: null,
        firstIndex: 0,
        lastIndex: 15,
        page: 1
    });

  const listener = useCallback(() => {
      getAliases({
          account:    account,
          firstIndex: state.firstIndex,
          lastIndex:  state.lastIndex,
      });
  }, [account, state.firstIndex, state.lastIndex, getAliases]);


  const getAliases = useCallback(async (reqParams) => {
    const aliases = await dispatch(getAliasesAction(reqParams));

    if (aliases) {
        setState(prevState => ({
          ...prevState,
          aliases: aliases.aliases
        }));
    }
  }, [dispatch]);

  const handlePaginate = (page) => () => {
      setState(prevState => ({
        ...prevState,
        page: page,
        firstIndex: page * 15 - 15,
        lastIndex:  page * 15
      }));
  }

  const handleAddAlias = () => {
    dispatch(setBodyModalParamsAction('ADD_ALIAS', {}));
  }

  useEffect(() => {
    getAliases({
      account:    account,
      firstIndex: state.firstIndex,
      lastIndex:  state.lastIndex,
    });

    BlockUpdater.on("data", listener);

    return () => {
      BlockUpdater.removeListener("data", listener)
    }
  }, [getAliases, listener]);

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
              <CustomTable 
                  header={headersList}
                  TableRowComponent={Alias}
                  tableData={state.aliases}
                  isPaginate
                  page={state.page}
                  previousHendler={handlePaginate(state.page - 1)}
                  nextHendler={handlePaginate(state.page + 1)}
                  className='no-min-height mb-3'
                  emptyMessage='No aliases found.'
                  itemsPerPage={15}
              />        
          </div>
      </div>
  );
}

export default Aliases;
