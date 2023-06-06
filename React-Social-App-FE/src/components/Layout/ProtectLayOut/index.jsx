import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getDataAPI } from "../../../api/fetchData";
import { UPDATE_USER } from "../../../redux/actions";
import jwt_decode from "jwt-decode";
import { ACCESS_TOKEN } from "../../../contants";

function ProtectLayOut({ children }) {
  const [isLogin, setIslogin] = useState(false);
  const { userCurrent } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    if (userCurrent) {
      setIslogin(true);
      return;
    }
    const accessToken = localStorage.getItem(ACCESS_TOKEN)
      ? JSON.parse(localStorage.getItem(ACCESS_TOKEN))
      : "";
    if (!accessToken) return navigate("/login");
    const { exp, userId } = jwt_decode(accessToken);
    const date = new Date();
    if (exp < date.getTime() / 1000 || !userId) {
      return navigate("/login");
    }

    const handleGetUser = async () => {
      try {
        const response = await getDataAPI(`/user?userId=${userId}`);

        const { message, user } = response;

        dispatch({
          type: UPDATE_USER,
          payload: user,
        });
      } catch (err) {
        console.log("err", err);
        navigate("/login");
      }
    };

    handleGetUser();
    setIslogin(true);
  }, []);

  return isLogin ? <>{children}</> : <></>;
}

export default ProtectLayOut;
