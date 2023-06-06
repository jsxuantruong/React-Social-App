import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getDataAPI } from "../../api/fetchData";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../contants";
import {
  INCREASE_NUMBER_FRIEND_REQUEST,
  SET_NUMBER_FRIEND_REQUEST,
  SET_STATUS_CONVERSATION,
  USER_LOGOUT,
} from "../../redux/actions";
import IconMessage from "./IconMessage";
import IconNotifycation from "./IconNotifycation";
import IconPerson from "./IconPerson";
import SeachUser from "./SeachUser";
import "./topbar.scss";

export default function Topbar() {
  const [notifications, setNotifications] = useState([]);
  const [firstShowNotification, setFirstShowNotification] = useState(false);

  const { socket } = useSelector((state) => state.network);
  const { userCurrent } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    let isMount = true;

    const getNumberFriendRequest = async () => {
      try {
        const response = await getDataAPI(`/friend-request/get-number`);

        const { number } = response;

        if (isMount) {
          dispatch({
            type: SET_NUMBER_FRIEND_REQUEST,
            payload: number,
          });
        }
      } catch (err) {
        console.log("err", err);
      }
    };

    getNumberFriendRequest();

    return () => (isMount = false);
  }, []);

  useEffect(() => {
    const updateNumberFriendRequest = () => {
      dispatch({
        type: INCREASE_NUMBER_FRIEND_REQUEST,
      });
    };

    if (socket) {
      socket.on("updateNotification", updateNumberFriendRequest);
    }

    return () => socket?.off("updateNotification", updateNumberFriendRequest);
  }, [socket]);

  useEffect(() => {
    let isMount = true;

    const handleUpdateNotification = ({ notification }) => {
      if (isMount) {
        setNotifications((prev) => [notification, ...prev]);
        setFirstShowNotification(false);
      }
    };

    if (socket) {
      socket.on("updateNotification", handleUpdateNotification);
    }

    return () => {
      isMount = false;
      socket?.off("updateNotification", handleUpdateNotification);
    };
  }, [socket]);

  useEffect(() => {
    let isMount = true;

    const getNumberConversationUnWatch = async () => {
      if (userCurrent) {
        try {
          const response = await getDataAPI(
            `/conversation/get-status-conversation`
          );

          const { conversations } = response;

          dispatch({
            type: SET_STATUS_CONVERSATION,
            payload: conversations,
          });
        } catch (err) {
          console.log("err", err);
        }
      }
    };
    getNumberConversationUnWatch();

    return () => (isMount = false);
  }, [userCurrent]);

  const logOut = () => {
    dispatch({
      type: USER_LOGOUT,
    });

    localStorage.setItem(REFRESH_TOKEN, "");
    localStorage.setItem(ACCESS_TOKEN, "");

    localStorage.setItem("userId", "");

    socket?.emit("userLogOut", userCurrent?._id);
    navigate("/login");
  };

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">CoderNoob</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <SeachUser />
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarLink">Homepage</span>
          <span className="topbarLink">Timeline</span>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <IconPerson />
          </div>
          <div className="topbarIconItem">
            <IconMessage />
          </div>
          <div className="topbarIconItem">
            <IconNotifycation />
          </div>
        </div>
        <div onClick={logOut} className="logout">
          <i className="fa-solid fa-right-from-bracket topbarImg"></i>
        </div>
      </div>
    </div>
  );
}
