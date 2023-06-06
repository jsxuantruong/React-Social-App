import { SET_PEER, USER_LOGOUT } from "../actions";

const initialState = null;

const peerReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case SET_PEER: {
            return payload;
        }

        case USER_LOGOUT: {
            return null;
        }
        default: {
            return state;
        }
    }
};

export default peerReducer;
