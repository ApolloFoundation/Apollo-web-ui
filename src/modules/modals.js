export const SET_MODAL_TYPE = 'SET_MODAL_TYPE';

const initialState = {
    modalType: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_MODAL_TYPE:
            return {
                ...state,
                modalType: action.payload
            };

        default:
            return state
    }
}


export const setMopalType = (reqParams) => {
    return dispatch => {
        console.log(reqParams);
        if (reqParams) {
            document.querySelector('.modal-window').classList.add('active');

        }

        dispatch({
            type: SET_MODAL_TYPE,
            payload: reqParams
        });

    }
};