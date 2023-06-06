import { addElment } from "../../helpers";
import {
    ADD_USER_ONLINE,
    REMOVE_USER_OFFLINE,
    RESET_NETWORK, SET_SOCKET,
    SET_USERS_ONLINE, USER_LOGOUT
} from "../actions";

const initialState = {
    firstConnect: true,
    socket: null,
    usersOnline: [],
    firstGetData: true,
};

const networkReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case USER_LOGOUT: {
            return { ...initialState };
        }
        case RESET_NETWORK: {
            return {
                ...initialState,
            };
        }

        case SET_SOCKET: {
            return {
                ...state,
                socket: payload,
                firstConnect: false,
            };
        }

        case SET_USERS_ONLINE: {
            return {
                ...state,
                usersOnline: payload ? payload : [],
                firstGetData: false,
            };
        }

        case ADD_USER_ONLINE: {
            return {
                ...state,
                usersOnline: addElment(state.usersOnline, payload),
            };
        }

        case REMOVE_USER_OFFLINE: {
            return {
                ...state,
                usersOnline: state.usersOnline.filter((user) => user !== payload),
            };
        }

        default: {
            return state;
        }
    }
};

export default networkReducer;
