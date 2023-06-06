import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { getDataAPI, patchDataAPI } from "../../api/fetchData";
import ModalChooseImage from "../../components/modal/ModalChooseImage";
import Topbar from "../../components/topbar/Topbar";
import UpdateImage from "../../components/UpdateImage/UpdateImage.jsx";
import { PUBLIC_FOLDER } from "../../contants";
import { imageUpload, removeImage } from "../../helpers/image";
import {
  SET_IS_ME,
  SET_USER_PROFILE,
  UPDATE_AVATAR_USER,
  UPDATE_BACKGROUND_USER,
} from "../../redux/actions";
import "./profile.scss";
import ProflieLeft from "./ProfileLeft";
import ProfileRight from "./ProfileRight";

export default function Profile() {
  const { id } = useParams();

  const { userCurrent } = useSelector((state) => state.auth);
  const { userProfile } = useSelector((state) => state.profile);

  const idBgc = useRef(uuidv4());
  const idAvatar = useRef(uuidv4());

  const dispatch = useDispatch();

  useEffect(() => {
    let isMount = true;
    if (userCurrent) {
      if (userCurrent?._id !== id) {
        const fetchUser = async () => {
          try {
            const response = await getDataAPI(`/user?userId=${id}`);

            const { user } = response;

            dispatch({
              type: SET_USER_PROFILE,
              payload: {
                userProfile: user,
                isFriend: user?.friends.includes(userCurrent?._id),
              },
            });
          } catch (err) {
            console.log("err", err);
          }
        };
        fetchUser();
      } else {
        if (isMount) {
          dispatch({
            type: SET_IS_ME,
            payload: userCurrent,
          });
        }
      }
    }

    return () => (isMount = false);
  }, [userCurrent, id]);

  const handleUpload = async (files, typeImage) => {
    if (!files.length) return;

    if (userProfile[typeImage]?.length) {
      removeImage([userProfile[typeImage][1]]);
    }

    const images = await imageUpload(files);

    const dataImage = [];
    for (const key in images[0]) {
      dataImage.push(images[0][key]);
    }

    const response = await patchDataAPI(`/user/update-user`, {
      [typeImage]: dataImage,
      userId: userProfile?._id,
    });

    dispatch({
      type:
        typeImage === "coverPicture"
          ? UPDATE_BACKGROUND_USER
          : UPDATE_AVATAR_USER,
      payload: dataImage,
    });
  };

  return (
    <>
      <Topbar />
      <div className="profile-container">
        <div
          className="profile-bgc"
          style={{
            backgroundImage: `url(${
              (userProfile?.coverPicture?.length &&
                userProfile?.coverPicture[0]) ||
              PUBLIC_FOLDER + "no-backgound.jpg"
            })`,
          }}
        >
          <i className="fa fa-bars" aria-hidden="true"></i>

          {userProfile?._id === userCurrent?._id && (
            <UpdateImage
              id={idBgc.current}
              text={`${
                userProfile?.coverPicture?.length &&
                userProfile?.coverPicture[0]
                  ? "Change"
                  : "Add"
              } cover photo`}
              type="background"
            />
          )}
        </div>

        <hr className="separator separator--line" />

        <main>
          <div className="row">
            <ProflieLeft idAvatar={idAvatar} />
            <ProfileRight />
          </div>
        </main>
      </div>

      <ModalChooseImage
        onSave={handleUpload}
        width={"100%"}
        multiple={false}
        height={"300px"}
        id={idBgc.current}
        text={"Select the background image you want to update"}
        typeImage="coverPicture"
      />

      <ModalChooseImage
        onSave={handleUpload}
        multiple={false}
        width={"100%"}
        height={"250px"}
        id={idAvatar.current}
        text={"Select the avatar image you want to update"}
        typeImage="profilePicture"
      />
    </>
  );
}
