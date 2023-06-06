import { Link } from "react-router-dom";
import { PUBLIC_FOLDER } from "../../contants";
import "./userSuggestion.css";
export default function UserSuggestion({ user }) {
  return (
    <Link
      to={"/profile/" + user?._id}
      style={{
        textDecoration: "none",
        color: "#333",
      }}
    >
      <li className="sidebarFriend">
        <img
          className="sidebarFriendImg"
          src={
            (user?.profilePicture?.length && user?.profilePicture[0]) ||
            PUBLIC_FOLDER + "no-avatar.png"
          }
          alt=""
        />
        <span className="sidebarFriendName">{user.userName}</span>
      </li>
    </Link>
  );
}
