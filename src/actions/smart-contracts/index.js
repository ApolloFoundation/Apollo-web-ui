/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/
import {
  ADD_CONTRACT,
  ADD_CONTRACT_EVENT_INFO,
  ADD_CONTRACT_EVENT_DATA,
  ADD_CONTRACT_EVENT,
  REMOVE_CONTRACT_EVENT,
  REMOVE_CONTRACT,
  CLEAR_ALL_CONTRACTS,
} from '../../modules/smartContract';

export const addContractAction = (contractId, contract) => ({
  type: ADD_CONTRACT,
  payload: {
    contractId,
    contract,
  },
});

export const addContractEventInfoAction = (contractId, data) => ({
  type: ADD_CONTRACT_EVENT_INFO,
  payload: { data, contractId },
});

export const addContractEventDataAction = (contractId, data) => ({
  type: ADD_CONTRACT_EVENT_DATA,
  payload: {
    contractId,
    data,
  },
});

export const addEventAction = (contractId, event) => ({
  type: ADD_CONTRACT_EVENT,
  payload: {
    contractId, 
    event,
  },
});

export const removeEventAction = (contractId, event) => ({
  type: REMOVE_CONTRACT_EVENT,
  payload: {
    contractId, 
    event,
  },
});

export const removeContractAction = (contractId) => ({
  type: REMOVE_CONTRACT,
  payload: { contractId },
});

export const clearAllSmartContractsEventsAction = () => ({
  type: CLEAR_ALL_CONTRACTS,
  payload: {},
});
