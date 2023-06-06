import { Link } from "react-router-dom";
import Avatar from "../avatar/Avatar";
import "./friend.scss";

export default function Friend({ friend }) {
  return (
    <Link to={"/profile/" + friend?._id} className="rightbarFriend">
      <div className="rightbarProfileImgContainer">
        <Avatar user={friend} link={false} />
      </div>
      <span className="rightbarUsername">{friend?.userName}</span>
    </Link>
  );
}
