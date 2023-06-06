import Peer from "peerjs";
import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { io } from "socket.io-client";
import ModalCall from "./components/modalCall/ModalCall";
import { SOCKET_SERVER } from "./contants";
import {
    ADD_FRIEND,
    ADD_USER_ONLINE,
    REMOVE_FRIEND,
    REMOVE_USER_OFFLINE,
    SET_CALL,
    SET_ELEMENT_CLICK,
    SET_PEER,
    SET_SOCKET,
    SET_USERS_ONLINE
} from "./redux/actions";
import { privateRoutes, publicRoutes } from "./routes";


function App() {
    const { firstConnect, socket, firstGetData, usersOnline } = useSelector(
        (state) => state.network
    );

    const { userCurrent } = useSelector((state) => state.auth);
    const { isCall } = useSelector((state) => state.call);

    const dispatch = useDispatch();

    useEffect(() => {
        const handleClick = (e) => {
            dispatch({
                type: SET_ELEMENT_CLICK,
                payload: { elClick: e.target }
            })
        }
        window.addEventListener("click", handleClick);

        return () => window.removeEventListener("click", handleClick);
    }, []);

    useEffect(() => {
        if (!socket) return;

        const handleConnectCall = (data) => {
            const { isVideo, userSendCall, roomCallId, isCreate, conversationId } =
                data;

            dispatch({
                type: SET_CALL,
                payload: {
                    isCall: true,
                    isVideo,
                    userSendCall,
                    roomCallId,
                    isCreate,
                    isSenderCall: false,
                    conversationId,
                },
            });
        };

        socket.on("connectCall", handleConnectCall);

        return () => {
            socket?.off("handleConnectCall", handleConnectCall);
        };
    }, [socket]);

    useEffect(() => {
        const peer = new Peer(undefined, {
            host: "/",
            port: 9000,
        });

        dispatch({ type: SET_PEER, payload: peer });
    }, [dispatch]);

    useEffect(() => {
        const addUserOnline = (userLoginId) => {
            if (usersOnline.includes(userLoginId)) {
                return;
            }
            dispatch({
                type: ADD_USER_ONLINE,
                payload: userLoginId,
            });
        };

        const removeUserOffline = ({ userDisconnectId }) => {
            dispatch({
                type: REMOVE_USER_OFFLINE,
                payload: userDisconnectId,
            });
        };

        if (socket) {
            socket.on("friendOnline", addUserOnline);
            socket.on("friendLogout", removeUserOffline);
        }

        return () => {
            socket?.off("friendOnline", addUserOnline);
            socket?.off("friendLogout", removeUserOffline);
        };
    }, [socket]);

    useEffect(() => {
        const addListFriend = (userId) => {
            dispatch({
                type: ADD_FRIEND,
                payload: userId,
            });
        };

        const removeListFriend = (userId) => {
            dispatch({
                type: REMOVE_FRIEND,
                payload: userId,
            });
        };

        if (socket) {
            socket.on("addListFriend", addListFriend);
            socket.on("removeListFriend", removeListFriend);
        }

        return () => {
            socket?.off("addListFriend", addListFriend);
            socket?.off("removeListFriend", removeListFriend);
        };
    }, [socket]);

    useEffect(() => {
        if (!userCurrent) return;

        const handleSetUserOnline = (allUser) => {
            if (!firstGetData) return;
            const usersFollowOnline = userCurrent?.followings.filter((followingiD) =>
                allUser.find((userId) => userId === followingiD)
            );

            dispatch({
                type: SET_USERS_ONLINE,
                payload: usersFollowOnline,
            });
        };
        const socket = io(SOCKET_SERVER);

        socket.emit("userLogin", {
            userId: userCurrent?._id,
            friends: userCurrent?.friends,
            userName: userCurrent?.userName,
        });
        socket.on("getUsers", handleSetUserOnline);

        dispatch({
            type: SET_SOCKET,
            payload: socket
        });
        return () => {
            socket?.off("getUsers", handleSetUserOnline);
        };
    }, [userCurrent]);



    return (
        <>
            <Routes>
                {publicRoutes.map((route) => {
                    const Layout = route.layout ? route.layout : Fragment;

                    const Page = route.component;

                    return (
                        <Route
                            key={route.key}
                            path={route.path}
                            element={
                                <Layout>
                                    <Page />
                                </Layout>
                            }
                        />
                    );
                })}

                {privateRoutes.map((route) => {
                    const Layout = route.layout ? route.layout : Fragment;

                    const Page = route.component;

                    return (
                        <Route
                            key={route.key}
                            path={route.path}
                            element={
                                <Layout>
                                    <Page />
                                </Layout>
                            }
                        />
                    );
                })}
            </Routes>

            {isCall && <ModalCall />}
        </>
    );
}

export default App;
