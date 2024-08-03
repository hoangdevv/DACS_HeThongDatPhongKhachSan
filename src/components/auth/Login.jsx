import React, { useState } from "react";
import { useAuth } from "./AuthProvider";
import { loginUser } from "./../utils/ApiFunctions";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaGoogle, FaFacebook } from 'react-icons/fa';
import './scss/login.scss';
import video from './../../assets/video/video-sea.mp4';
// import GoogleLogin from 'react-google-login';
// import FacebookLogin from 'react-facebook-login';

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [login, setLogin] = useState({
    username: "",
    password: ""
  });

  const navigate = useNavigate();
  const auth = useAuth();
  const location = useLocation();
  const redirectUrl = location.state?.path || "/";

  const handleInputChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await loginUser(login);
      if (success && success.token) {
        const token = success.token;
        auth.handleLogin(token);
        navigate(redirectUrl, { replace: true });
      } else {
        setErrorMessage("Sai username hoặc password. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        console.error("Error data:", error.response.data);
        setErrorMessage(`Error: ${error.response.data.message}`);
      } else {
        setErrorMessage("Unknown error occurred. Please try again later.");
      }
    }
    setTimeout(() => {
      setErrorMessage("");
    }, 4000);
  };

  return (
    <div className="login-container">
      <video autoPlay muted loop className="background-video">
        <source src={video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="overlay"></div>
      <div className="login-form-container">
        <div className="loginForm">
          <h2>Đăng nhập</h2>
          {errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username"><FaEnvelope className="icon" /> Email:</label>
              <input type="text" id="username" name="username" className="form-control" value={login.username}
                onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="password"><FaLock className="icon" /> Mật khẩu:</label>
              <input type="password" id="password" name="password" className="form-control" value={login.password}
                onChange={handleInputChange} />
            </div>
            <button type="submit" className="btn btn-primary btn-block">Đăng nhập</button>
          </form>
          <div className="socialLogin">
            <button className="btn btn-google">
              <FaGoogle className="icon" /> Đăng nhập với Google
            </button>
            <button className="btn btn-facebook">
              <FaFacebook className="icon" /> Đăng nhập với Facebook
            </button>
          </div>
          <div className="register-link">
            <p>
              Chưa có tài khoản? <Link to={"/register"}> Đăng ký thành viên</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
