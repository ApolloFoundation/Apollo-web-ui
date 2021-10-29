export const SET_TRANSACTION = "SET_TRANSACTION";
export const ADD_CONTRACT = 'smc/ADD_CONTRACT';
export const ADD_CONTRACT_EVENT_INFO = 'smc/ADD_CONTRACT_EVENT_INFO';
export const ADD_CONTRACT_EVENT_DATA = 'smc/ADD_CONTRACT_EVENT_DATA';
export const ADD_CONTRACT_EVENT = 'smc/ADD_CONTRACT_EVENT';
export const REMOVE_CONTRACT_EVENT = 'smc/REMOVE_CONTRACT_EVENT';
export const REMOVE_CONTRACT = 'smc/REMOVE_CONTRACT';
export const CLEAR_ALL_CONTRACTS = 'smc/CLEAR_ALL_CONTRACTS';

const initialState = {
  transactions: {},
  contractsData: {},
  contractsEventsData: {},
  contractsEventsInfo: {},
  contractsEvents: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_TRANSACTION:
      return {
        ...state,
        transactions: {
          ...state.transactions,
          [action.payload.key]: action.payload.value,
        },
      };

    case ADD_CONTRACT:
      if (!state.contractsData[action.payload.contractId]) {
        return {
          ...state,
          contractsData: {
            ...state.contractsData,
            [action.payload.contractId]: action.payload.contract,
          }
        }
      }
      return state;

    case ADD_CONTRACT_EVENT_DATA:
      const defaultDataEvents = state.contractsEventsData[action.payload.contractId] || [];

      const dataListInfo = [action.payload.data, ...defaultDataEvents];
      return {
        ...state,
        contractsEventsData: {
          ...state.contractsEventsData,
          [action.payload.contractId]: dataListInfo,
        },
      };

    case ADD_CONTRACT_EVENT_INFO:
      const defaultData = state.contractsEventsInfo[action.payload.contractId] || [];
      const dataList = [...defaultData, action.payload.data];
      return {
        ...state,
        contractsEventsInfo: {
          ...state.contractsEventsInfo,
          [action.payload.contractId]: dataList,
        },
      };

    case ADD_CONTRACT_EVENT:
      const contractsEventsOld = state.contractsEvents[action.payload.contractId] || [];
      return {
        ...state,
        contractsEvents: {
          ...state.contractsEvents,
          [action.payload.contractId]: [...contractsEventsOld, action.payload.event],
        }
      };

    case REMOVE_CONTRACT_EVENT:
      const index = state.contractsEvents[action.payload.contractId].findIndex(item => 
        (item.subscriptionId === action.payload.event.subscriptionId));

      return {
        ...state,
        contractsEvents: {
          ...state.contractsEvents,
          [action.payload.contractId]: [
              ...state.contractsEvents[action.payload.contractId].slice(0, index), 
              ...state.contractsEvents[action.payload.contractId].slice(index + 1), 
            ],
        }
      }

    case REMOVE_CONTRACT:
      const { [action.payload.contractId]: removedConstractData, ...contractsData } = state.contractsData;
      const { [action.payload.contractId]: removedContractsEventsData, ...contractsEventsData } = state.contractsEventsData;
      const { [action.payload.contractId]: removedContractsEventsInfo, ...contractsEventsInfo } = state.contractsEventsInfo;
      const { [action.payload.contractId]: removedContractsEvents, ...contractsEvents } = state.contractsEvents;
      
      return {
        ...state,
        contractsData,
        contractsEventsData,
        contractsEventsInfo,
        contractsEvents,
      };

      case CLEAR_ALL_CONTRACTS:
        // close all created connections and reset events
        Object.values(state.contractsData).forEach(item => {
          item.closeEventConnection();
        });

        return initialState;


      default:
        return state;
  }
};

export const setTransaction = (key, value) => (dispatch) => {
  dispatch({
    type: SET_TRANSACTION,
    payload: {
      key,
      value,
    },
  });
};
