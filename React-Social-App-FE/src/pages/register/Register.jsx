import { CircularProgress } from "@material-ui/core";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { register } from "../../api/authApi";
import ShowError from "../../components/ShowError/ShowError";
import { checkMinLength, isEmail } from "../../helpers";
import { generateKeywords } from "../../helpers/createKeyUser";
import "./register.css";

const initValue = {
  userName: "",
  password: "",
  passwordAgain: "",
  email: "",
};

export default function Register() {
  const [infoRegister, setInfoRegister] = useState({ ...initValue });
  const [errors, setErrors] = useState({ ...initValue });
  const { isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setInfoRegister({ ...infoRegister, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    let isValid = true;

    let newErrors = { ...errors };
    if (!isEmail(infoRegister.email)) {
      isValid = false;
      newErrors.email = "Please enter the correct email format";
    }
    let message;
    message = checkMinLength(infoRegister.userName, "User name", 6);
    if (message) {
      isValid = false;
      newErrors.userName = message;
    }

    message = checkMinLength(infoRegister.password, "Password", 6);
    if (message) {
      isValid = false;
      newErrors.password = message;
    }

    if (infoRegister.password !== infoRegister.passwordAgain) {
      newErrors.passwordAgain = "Passwords do not match";
      isValid = false;
    }
    if (!isValid) {
      setErrors(newErrors);
      toast.warn("Please check registration information again", {
        autoClose: 500,
      });
      return;
    }

    infoRegister.keys = generateKeywords(infoRegister.userName);
    dispatch(register(infoRegister, navigate));
  };

  return (
    <div className="register">
      <div className="registerWrapper">
        <div className="registerLeft">
          <h3 className="registerLogo">CoderNoob</h3>
          <span className="registerDesc">
            Connect with friends and the world around you on CoderNoob.
          </span>
        </div>
        <div className="registerRight">
          <form className="registerBox" onSubmit={handleRegister}>
            <input
              required
              minLength={"6"}
              maxLength={"20"}
              name="userName"
              value={infoRegister.userName}
              onChange={handleChangeInput}
              placeholder="Username"
              className="registerInput"
            />
            <ShowError err={errors.userName}></ShowError>
            <input
              required
              name="email"
              value={infoRegister.email}
              onChange={handleChangeInput}
              placeholder="Email"
              type="email"
              className="registerInput"
            />
            <ShowError err={errors.email}></ShowError>
            <input
              type="password"
              minLength={"6"}
              required
              name="password"
              value={infoRegister.password}
              onChange={handleChangeInput}
              placeholder="Password"
              className="registerInput"
            />
            <ShowError err={errors.password}></ShowError>
            <input
              type="password"
              minLength={"6"}
              required
              name="passwordAgain"
              value={infoRegister.passwordAgain}
              onChange={handleChangeInput}
              placeholder="Password Again"
              className="registerInput"
            />
            <ShowError err={errors.passwordAgain}></ShowError>
            <button className="registerButton">
              {isLoading ? <CircularProgress color={"primary"} /> : "Register"}
            </button>
            <Link
              to={"/login"}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <button className="redirectButton">
                {isLoading ? (
                  <CircularProgress color={"primary"} />
                ) : (
                  "Log into Account"
                )}
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
