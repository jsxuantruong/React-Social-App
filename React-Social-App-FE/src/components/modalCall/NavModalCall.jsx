import React from "react";
import { PUBLIC_FOLDER } from "../../contants";

const NavModalCall = () => {
  return (
    <nav>
      <img src={PUBLIC_FOLDER + "logo.png"} alt="" />
      <ul>
        <li>
          <img
            src={PUBLIC_FOLDER + "live.png"}
            alt=""
            className="icon_modal-active"
          />
        </li>
        <li>
          <img src={PUBLIC_FOLDER + "video.png"} alt="" />
        </li>
        <li>
          <img src={PUBLIC_FOLDER + "message.png"} alt="" />
        </li>
        <li>
          <img src={PUBLIC_FOLDER + "notification.png"} alt="" />
        </li>
        <li>
          <img src={PUBLIC_FOLDER + "users.png"} alt="" />
        </li>
        <li>
          <img src={PUBLIC_FOLDER + "setting.png"} alt="" />
        </li>
      </ul>
    </nav>
  );
};

export default NavModalCall;
