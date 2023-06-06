import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick-theme.css";
import { getDataAPI } from "../../api/fetchData";
import Carousel from "../../components/Carousel/Carousel";
import { PUBLIC_FOLDER } from "../../contants";
import "./displayFriendList.scss";

const DisplayFriendList = () => {
  const [friendList, setFriendList] = useState([]);

  const { userCurrent } = useSelector((state) => state.auth);
  const { userProfile } = useSelector((state) => state.profile);

  useEffect(() => {
    let isMount = true;

    const handleFetchFriends = async () => {
      if (userProfile && userProfile._id) {
        try {
          const response = await getDataAPI(
            `/user/get-friends/${userProfile?._id}`
          );

          const { friends } = response;
          if (isMount) {
            setFriendList(friends);
          }
        } catch (err) {
          console.log("err", err);
        }
      }
    };
    handleFetchFriends();

    return () => (isMount = false);
  }, [userProfile?._id, userCurrent]);
  const navigate = useNavigate();

  return (
    <div className="row friend-container">
      <Carousel length={friendList.length}>
        {friendList.map((friend) => (
          <div
            key={friend?._id}
            onClick={() => navigate(`/profile/${friend?._id}`)}
          >
            <div className="our-friend">
              <div className="picture">
                <img
                  className="img-fluid"
                  src={
                    (friend?.profilePicture?.length &&
                      friend?.profilePicture[0]) ||
                    PUBLIC_FOLDER + "no-avatar.png"
                  }
                />
              </div>
              <div className="friend-content">
                <p className="name">{friend?.userName}</p>
                <h4 className="title">{friend?.desc}</h4>
              </div>
              <ul className="social">
                <li>
                  <i className="fa-brands fa-facebook-square"></i>
                </li>
                <li>
                  <i className="fa-brands fa-twitter-square"></i>
                </li>
                <li>
                  <i className="fa-brands fa-youtube-square"></i>
                </li>
                <li>
                  <i className="fa-brands fa-github-square"></i>
                </li>
              </ul>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default DisplayFriendList;
