import {
    UPDATE_ID_COMMENT, USER_LOGOUT
} from "../actions";


const initialState = {
    idComment: null,
    idPostOpen: null
};

const commentReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case USER_LOGOUT: {
            return { ...initialState };
        }
        case UPDATE_ID_COMMENT: {
            return { ...state, ...payload };
        }

        default: {
            return state;
        }
    }
};

export default commentReducer;
