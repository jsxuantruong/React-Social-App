import { Notifications } from "@material-ui/icons";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDataAPI } from "../../api/fetchData";
import {
  INCREASE_NUMBER_NOTIFICATION_UNREAD,
  SET_LIST_NOTIFICATION,
  SET_NUMBER_NOTIFICATION_UNREAD,
  SET_SHOW_NOTIFICATION,
} from "../../redux/actions";
import Notification from "../notification/Notification";
import "./iconNotification.scss";

const IconNotification = () => {
  const { number, isShow } = useSelector((state) => state.notification);
  const { userCurrent } = useSelector((state) => state.auth);
  const { socket } = useSelector((state) => state.network);

  const { elClick } = useSelector((state) => state.global);
  const dispatch = useDispatch();

  const notifyRef = useRef();
  useEffect(() => {
    if (notifyRef.current.contains(elClick)) return;
    dispatch({
      type: SET_SHOW_NOTIFICATION,
      payload: false,
    });
  }, [elClick]);

  useEffect(() => {
    if (!socket) return;

    const updateNumberNotification = () => {
      if (!isShow) {
        dispatch({
          type: INCREASE_NUMBER_NOTIFICATION_UNREAD,
        });
      }
    };

    socket.on("updateNotification", updateNumberNotification);

    return () => socket?.off("updateNotification", updateNumberNotification);
  }, [socket, isShow]);

  useEffect(() => {
    let isMount = true;

    const getConversation = async () => {
      if (userCurrent && isShow) {
        try {
          const response = await getDataAPI(`/notification`);

          const { message, notifications } = response;

          const data = [];
          notifications.forEach((notification) => {
            !notification.isRead && data.push(notification);
          });
          notifications.forEach((notification) => {
            notification.isRead && data.push(notification);
          });

          // toast.success(message, { autoClose: 1000 });
          if (isMount) {
            dispatch({
              type: SET_LIST_NOTIFICATION,
              payload: data,
            });
          }
        } catch (err) {
          console.log("err", err);
        }
      }
    };
    getConversation();

    return () => (isMount = false);
  }, [userCurrent, isShow]);

  useEffect(() => {
    let isMount = true;

    const getNumberNotificationNotRead = async () => {
      if (userCurrent) {
        try {
          const response = await getDataAPI(
            `/notification/get-number-notification-not-read`
          );

          const { message, number } = response;

          // toast.success(message, { autoClose: 1000 });
          if (isMount) {
            dispatch({
              type: SET_NUMBER_NOTIFICATION_UNREAD,
              payload: number,
            });
          }
        } catch (err) {
          console.log("err", err);
        }
      }
    };
    getNumberNotificationNotRead();

    return () => (isMount = false);
  }, [userCurrent]);

  const toogleNotification = () => {
    dispatch({
      type: SET_SHOW_NOTIFICATION,
      payload: !isShow,
    });
  };

  return (
    <div ref={notifyRef}>
      <Notifications
        className="svg-notification"
        style={{
          cursor: "pointer",
        }}
        onClick={toogleNotification}
      />
      <span className="topbarIconBadge">{number}</span>
      <div className="my-btn-border-notification"></div>
      <div className="my-btn-1"></div>
      {isShow && <Notification />}
    </div>
  );
};

export default IconNotification;
