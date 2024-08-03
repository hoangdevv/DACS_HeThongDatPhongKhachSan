import React, { useState, useEffect } from "react";
import { FaEnvelope, FaPhone, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { sendOTPEmail, verifyOTP, registerUser } from "./../utils/ApiFunctions";
import "./scss/register.scss";
import video from "./../../assets/video/video-sea.mp4";
import { useAuth } from "./AuthProvider";

const Register = () => {
  const [user, setUser] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErrors] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    otpError: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otpToken, setOtpToken] = useState(""); // Token lưu trữ
  const [countdown, setCountdown] = useState(60);

  const navigate = useNavigate();
  const { handleLogin } = useAuth();

  useEffect(() => {
    let intervalId;

    if (otpSent) {
      intervalId = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [otpSent]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          email: value.length > 0 ? "" : "Email không được để trống",
        }));
        break;
      case "phone":
        if (!/^[0-9]{9,12}$/.test(value)) {
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            phone: "Số điện thoại không hợp lệ",
          }));
        } else {
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            phone: "",
          }));
        }
        break;
      case "password":
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          password: value.length > 0 ? "" : "Mật khẩu không được để trống",
        }));
        break;
      case "confirmPassword":
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          confirmPassword:
            value.length > 0 ? "" : "Xác nhận mật khẩu không được để trống",
        }));
        break;
      case "otp":
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          otpError: value.length > 0 ? "" : "Vui lòng nhập OTP",
        }));
        break;
      default:
        break;
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (user.email.length === 0) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        email: "Email không được để trống",
      }));
      return;
    }

    try {
      const token = await sendOTPEmail(user.email);
      setOtpToken(token);
      setOtpSent(true);
      setErrorMessage("");
      Swal.fire({
        title: "Gửi mã OTP thành công!",
        text: "Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra và nhập vào ô bên dưới.",
        icon: "success",
        confirmButtonText: "Đồng ý",
      });
    } catch (error) {
      setErrorMessage("Có lỗi xảy ra khi gửi OTP. Vui lòng thử lại sau.");
      console.error("Send OTP Error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(formErrors).some((error) => error.length > 0)) {
      setErrorMessage("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (user.password !== user.confirmPassword) {
      setErrorMessage("Mật khẩu không khớp");
      return;
    }

    try {
      if (otpSent && user.otp.length > 0) {
        try {
          const otpVerified = await verifyOTP(otpToken, user.otp);
          if (otpVerified) {
            const response = await registerUser({
              email: user.email,
              phone: user.phone,
              password: user.password,
            });
            if (response) {
              Swal.fire({
                title: "Đăng ký thành công!",
                text: "Bạn đã đăng ký thành công. Vui lòng đăng nhập để tiếp tục.",
                icon: "success",
                confirmButtonText: "Đăng nhập",
              }).then(() => {
                navigate("/login");
              });
            } else {
              setErrorMessage(
                "Đăng ký không thành công. Vui lòng thử lại sau."
              );
            }
          } else {
            setErrorMessage("OTP không hợp lệ. Vui lòng thử lại.");
          }
        } catch (error) {
          // Log and handle specific OTP verification errors
          setErrorMessage("Lỗi khi xác minh OTP. Vui lòng thử lại.");
          console.error("Verify OTP Error:", error);
        }
      } else {
        setErrorMessage("Vui lòng nhập mã OTP để hoàn thành đăng ký.");
      }
    } catch (error) {
      // Handle registration errors, check if specific errors like '409' are present
      if (error.message.includes("409")) {
        setErrorMessage(
          "Email hoặc số điện thoại đã tồn tại. Vui lòng thử lại!"
        );
      } else {
        setErrorMessage(error.message || "Có lỗi xảy ra, vui lòng thử lại");
      }
      console.error("Registration Error:", error);
    }
  };

  return (
    <div className="register-container">
      <video autoPlay muted loop className="background-video">
        <source src={video} type="video/mp4" />
        Trình duyệt của bạn không hỗ trợ video tag.
      </video>
      <div className="overlay"></div>
      <div className="register-form-container">
        <div className="registerForm">
          <h2>Đăng ký</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">
                <FaEnvelope className="icon" /> Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`form-control ${formErrors.email && "is-invalid"}`}
                value={user.email}
                onChange={handleInputChange}
              />
              {formErrors.email && (
                <div className="invalid-feedback">{formErrors.email}</div>
              )}
              <button
                className="btn btn-secondary btn-sm mt-2"
                onClick={handleSendOTP}
              >
                Gửi mã
              </button>
            </div>
            <div className="form-group">
              <label htmlFor="phone">
                <FaPhone className="icon" /> Số điện thoại:
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className={`form-control ${formErrors.phone && "is-invalid"}`}
                value={user.phone}
                onChange={handleInputChange}
              />
              {formErrors.phone && (
                <div className="invalid-feedback">{formErrors.phone}</div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="password">
                <FaLock className="icon" /> Mật khẩu:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className={`form-control ${
                  formErrors.password && "is-invalid"
                }`}
                value={user.password}
                onChange={handleInputChange}
              />
              {formErrors.password && (
                <div className="invalid-feedback">{formErrors.password}</div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">
                <FaLock className="icon" /> Xác nhận mật khẩu:
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className={`form-control ${
                  formErrors.confirmPassword && "is-invalid"
                }`}
                value={user.confirmPassword}
                onChange={handleInputChange}
              />
              {formErrors.confirmPassword && (
                <div className="invalid-feedback">
                  {formErrors.confirmPassword}
                </div>
              )}
            </div>
            {otpSent && (
              <div className="form-group">
                <label htmlFor="otp">
                  <FaLock className="icon" /> OTP:
                </label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  className={`form-control ${
                    formErrors.otpError && "is-invalid"
                  }`}
                  value={user.otp}
                  onChange={handleInputChange}
                />
                {formErrors.otpError && (
                  <div className="invalid-feedback">{formErrors.otpError}</div>
                )}
                <p>Thời gian còn lại: {countdown} giây</p>
              </div>
            )}
            <button type="submit" className="btn btn-primary">
              Đăng ký
            </button>
            {errorMessage && (
              <div className="alert alert-danger mt-2">{errorMessage}</div>
            )}
            <p>
              Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
