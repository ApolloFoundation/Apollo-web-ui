import {getpollAction} from '../actions/polls';

const initState = {
    followedPolls: []
};

const SET_FOLLOWED_POLLS = 'SET_FOLLOWED_POLLS';

export default (state = initState, action) => {
    switch (action.type) {
        case SET_FOLLOWED_POLLS:
            return {
                ...state,
                followedPolls: action.payload
            } 
        default: return state;
    }
}

export const getFollowedPolls = () => dispatch => {
    console.log('get pools');
    let polls = localStorage.getItem('followedPolls');
    if (polls) {
        polls = JSON.parse(polls);

        const followedpolls = polls.map((el, index) => {
            return dispatch(getpollAction({poll: el}));
        });

        Promise.all(followedpolls)
            .then((data) => {
                data = data.filter(el => {
                    return !el.errorCode
                });

                dispatch({
                    type: SET_FOLLOWED_POLLS,
                    payload: data
                });
            })
    } else {
        dispatch({
            type: SET_FOLLOWED_POLLS,
            payload: []
        })
    }
    
}