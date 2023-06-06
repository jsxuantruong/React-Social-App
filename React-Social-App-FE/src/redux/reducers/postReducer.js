import {
    LOADING_POST_END, UPDATE_INFO_GET_POST, USER_LOGOUT
} from "../actions";

const initialState = {
    isLoadingPost: true,
    limit: 5,
    skip: 0,
    isMaxPost: false
};

const postReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case USER_LOGOUT: {
            return { ...initialState };
        }
        case UPDATE_INFO_GET_POST: {
            return { ...state, ...payload };
        }


        case LOADING_POST_END: {
            return { ...state, isLoadingPost: false };
        }

        default: {
            return state;
        }
    }
};

export default postReducer;
