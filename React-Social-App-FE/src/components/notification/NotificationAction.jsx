import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { deleteDataAPI, putDataAPI } from "../../api/fetchData";
import {
  REMOVE_NOTIFICATION,
  UPDATE_LIST_CONVERSATION,
} from "../../redux/actions";
import "./notificationAction.scss";

const NotificationAction = ({ notification }) => {
  const dispatch = useDispatch();

  const handleRemoveNotification = async () => {
    try {
      const response = await deleteDataAPI(`/notification/${notification._id}`);

      const { message } = response;

      toast.success(message, { autoClose: 1000 });

      dispatch({
        type: REMOVE_NOTIFICATION,
        payload: notification?._id,
      });
    } catch (err) {
      console.log("err", err);
    }
  };

  const handleUnReadNotification = async () => {
    try {
      const response = await putDataAPI(
        `/notification/unRead/${notification._id}`
      );

      const { message, newNotification } = response;

      toast.success(message, { autoClose: 1000 });

      dispatch({
        type: UPDATE_LIST_CONVERSATION,
        payload: newNotification,
      });
    } catch (err) {
      console.log("err", err);
    }
  };

  const readNotification = async () => {
    try {
      const response = await putDataAPI(`/notification/${notification._id}`);

      const { message, newNotification } = response;

      toast.success(message, { autoClose: 1000 });

      dispatch({
        type: UPDATE_LIST_CONVERSATION,
        payload: newNotification,
      });
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <>
      <div className="notificationCrudAction">
        <button
          className={`${notification.isRead ? "disable" : ""} `}
          onClick={readNotification}
        >
          Mark
        </button>

        <button
          onClick={handleUnReadNotification}
          className={`${!notification.isRead ? "disable" : ""} `}
        >
          Unread
        </button>

        <button onClick={handleRemoveNotification}>Remove</button>
      </div>
    </>
  );
};

export default NotificationAction;
