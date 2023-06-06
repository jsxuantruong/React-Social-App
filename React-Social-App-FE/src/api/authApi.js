import axios from "axios";
import { toast } from "react-toastify";
import { ACCESS_TOKEN, REFRESH_TOKEN, URL_BE } from "../contants";
import { LOADING_END, LOADING_START, LOGIN_FAILED, LOGIN_SUCCESS } from "../redux/actions";

axios.defaults.baseURL = URL_BE + "v1/api";


export const login = (userInfo, navigate) => async (dispatch) => {
    dispatch({
        type: LOADING_START,
    });
    try {
        const response = await axios.post("/auth/login", userInfo);
        const { user, message, accessToken, refreshToken } = response.data;

        toast.success(message, { autoClose: 500 });

        dispatch({
            type: LOGIN_SUCCESS,
            payload: user,
        });

        localStorage.setItem(ACCESS_TOKEN, JSON.stringify(accessToken));
        localStorage.setItem(REFRESH_TOKEN, JSON.stringify(refreshToken));

        navigate("/");
    } catch (err) {
        const message = err.message || err?.response?.data?.message;
        toast.error(message, { autoClose: 2000 });

        dispatch({
            type: LOGIN_FAILED,
            payload: err,
        });
    }
};

export const register = (userInfo, navigate) => async (dispatch) => {
    try {
        dispatch({
            type: LOADING_START,
        })
        await axios.post("/auth/register", userInfo);
        navigate("/login");
    } catch (err) {
        const message = err.message || err?.response?.data?.message;
        toast.error(message, { autoClose: 2000 });
    }
    finally {
        dispatch({ type: LOADING_END })
    }
};
