import { SET_IS_ME, SET_STATUS_FRIEND, SET_USER_PROFILE, USER_LOGOUT } from "../actions";


const initialState = {
    isFriend: null,
    userProfile: null,
    isMe: false,
};

const chatReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case USER_LOGOUT: {
            return { ...initialState };
        }
        case SET_STATUS_FRIEND: {
            return {
                ...state,
                isFriend: payload,
            };
        }

        case SET_USER_PROFILE: {
            const { userProfile, isFriend } = payload;
            return {
                ...state,
                userProfile,
                isFriend,
            };
        }

        case SET_IS_ME: {
            return {
                ...state,
                isMe: true,
                userProfile: payload,
            };
        }

        default: {
            return state;
        }
    }
};

export default chatReducer;
