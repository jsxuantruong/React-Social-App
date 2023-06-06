import {
    ADD_FRIEND, FOLLOW, LOADING_END, LOADING_START, LOGIN_FAILED, LOGIN_SUCCESS, REMOVE_FRIEND, UN_FOLLOW, UPDATE_AVATAR_USER, UPDATE_BACKGROUND_USER, UPDATE_USER,
    USER_LOGOUT
} from "../actions";

const initialState = {
    userCurrent: null,
    isLoading: false,
    error: null,
};

const authReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case USER_LOGOUT: {
            return {
                ...initialState,
            };
        }

        case LOADING_START: {
            return {
                ...state,
                isLoading: true,
            };
        }

        case LOADING_END: {
            return {
                ...state,
                isLoading: false,
            };
        }
        case LOGIN_SUCCESS: {
            return {
                ...state,
                userCurrent: payload,
                isLoading: false,
            };
        }
        case LOGIN_FAILED: {
            return {
                ...state,
                isLoading: false,
                userCurrent: null,
                error: payload,
            };
        }

        case UPDATE_USER: {
            return {
                ...state,
                userCurrent: payload,
            };
        }

        case UN_FOLLOW: {
            return {
                ...state,
                userCurrent: {
                    ...state.userCurrent,
                    followings: state.userCurrent.followings.filter(
                        (idUserFollow) => idUserFollow !== payload
                    ),
                },
            };
        }

        case FOLLOW: {
            return {
                ...state,
                userCurrent: {
                    ...state.userCurrent,
                    followings: [payload, ...state.userCurrent.followings],
                },
            };
        }

        case UPDATE_AVATAR_USER: {
            return {
                ...state,
                userCurrent: {
                    ...state.userCurrent,
                    profilePicture: [...payload],
                },
            };
        }

        case UPDATE_BACKGROUND_USER: {
            return {
                ...state,
                userCurrent: {
                    ...state.userCurrent,
                    coverPicture: [...payload],
                },
            };
        }

        case ADD_FRIEND: {
            return {
                ...state,
                userCurrent: {
                    ...state.userCurrent,
                    friends: [payload, ...state.userCurrent.friends],
                    followings: [payload, ...state.userCurrent.followings],
                },
            };
        }

        case REMOVE_FRIEND: {
            return {
                ...state,
                userCurrent: {
                    ...state.userCurrent,
                    friends: state.userCurrent.friends.filter(
                        (friendId) => friendId !== payload
                    ),
                },
            };
        }

        default: {
            return state;
        }
    }
};

export default authReducer;
