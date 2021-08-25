const SET_TRANSACTION = "SET_TRANSACTION";

const initialState = {
  transactions: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_TRANSACTION:
      return Object.assign({}, state, {
        transactions: {
          ...state.transactions,
          [action.payload.key]: action.payload.value,
        },
      });
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
