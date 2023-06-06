import { SET_ELEMENT_CLICK } from "../actions";

const initialState = {
    elClick: null
};

const peerReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case SET_ELEMENT_CLICK: {
            return { ...state, ...payload };
        }

        default: {
            return state;
        }
    }
};

export default peerReducer;
