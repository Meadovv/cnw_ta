import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './signup.scss';
import { handleSignUpApi } from '../../../services/userService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import Spinner from "react-bootstrap/Spinner";

const SignUp = (props) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const navigate = useNavigate();

    const handleOnChangeInput = (e, id) => {
        const value = e.target.value;
        switch (id) {
            case "fullName":
                setFullName(value);
                setErrors({ ...errors, fullName: '' });
                break;
            case "email":
                setEmail(value);
                setErrors({ ...errors, email: '' });
                break;
            case "password":
                setPassword(value);
                setErrors({ ...errors, password: '' });
                break;
            case "confirmPassword":
                setConfirmPassword(value);
                setErrors({ ...errors, confirmPassword: '' });
                break;
            default:
                break;
        }
    };

    const handleShowHidePassword = () => setIsShowPassword(!isShowPassword);

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
        };

        if (fullName.trim() === '') {
            isValid = false;
            newErrors.fullName = 'Tên đầy đủ không được để trống';
        }
        if (email.trim() === '') {
            isValid = false;
            newErrors.email = 'Email không được để trống';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            isValid = false;
            newErrors.email = 'Email không hợp lệ';
        }
        if (password.trim() === '') {
            isValid = false;
            newErrors.password = 'Mật khẩu không được để trống';
        } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/.test(password)) {
            isValid = false;
            newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ cái, chữ cái in hoa, số và biểu tượng';
        }
        if (confirmPassword.trim() === '') {
            isValid = false;
            newErrors.confirmPassword = 'Xác nhận mật khẩu không được để trống';
        } else if (password !== confirmPassword) {
            isValid = false;
            newErrors.confirmPassword = 'Mật khẩu không khớp';
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleOnSubmit = async (event) => {
        event.preventDefault();
        const isValid = validateForm();

        if (isValid) {
            setIsLoading(true);
            try {
                const response = await handleSignUpApi(email, password, fullName);
                if (response && response.errCode === 0) {
                    setMessage(response.message);
                    toast.success("Successful account registration!", {
                        position: "top-center",
                        autoClose: 5000,
                        theme: "colored",
                    });
                    navigate('/login');
                } else {
                    setMessage(response.message);
                    toast.error("Account registration failed!", {
                        position: "top-center",
                        autoClose: 5000,
                        theme: "light",
                    });
                }
            } catch (error) {
                console.log(error);
            }
            setIsLoading(false);
        }
    };

    return (
        <div className="signup-page-container">
            <div className="main">
                <div className="brand d-flex">
                    <img src={`${process.env.PUBLIC_URL}/assets/img/logo-symbol.png`} alt="Avatar" style={{ height: "50px" }} />
                    <h4 style={{ color: "blue", marginLeft: "10px" }}>C</h4><h4 style={{ color: "red" }}>-</h4>
                    <h4 style={{ color: "green" }}>C</h4><h4 style={{ color: "orange" }}>r</h4><h4 style={{ color: "blue" }}>u</h4><h4 style={{ color: "red" }}>s</h4><h4 style={{ color: "blue" }}>h</h4>
                </div>
                <h2 className="mt-2">Tạo Tài khoản</h2>
                <br />
                <div className="main__form">
                    <div className="main__form__children d-flex">
                        <form onSubmit={handleOnSubmit} className="form col-6" id="form-1">
                            <div className="inputBox">
                                <input
                                    id="fullName"
                                    type="text"
                                    name="fullName"
                                    placeholder="Tên đầy đủ"
                                    className="form-control"
                                    value={fullName}
                                    onChange={(e) => handleOnChangeInput(e, "fullName")}
                                />
                                {errors.fullName && <div className="text-danger" style={{ fontSize: "14px", padding: "6px" }}>{errors.fullName}</div>}
                            </div>
                            <div className="inputEmail">
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => handleOnChangeInput(e, "email")}
                                />
                                {errors.email ? <p className="text-danger" style={{ fontSize: "14px" }}>{errors.email}</p> : <p>Bạn có thể sử dụng chữ cái, số và dấu chấm</p>}
                            </div>
                            <div className="inputPassword d-flex">
                                <div>
                                    <input
                                        id="password"
                                        type={isShowPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Mật khẩu"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => handleOnChangeInput(e, "password")}
                                    />
                                </div>
                                <div>
                                    <input
                                        id="confirmPassword"
                                        type={isShowPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        placeholder="Xác nhận"
                                        className="form-control"
                                        value={confirmPassword}
                                        onChange={(e) => handleOnChangeInput(e, "confirmPassword")}
                                    />
                                    {password !== confirmPassword && <div className="text-danger" style={{ fontSize: "14px" }}>Mật khẩu không khớp</div>}
                                </div>
                            </div>
                            {errors.password ? <p className="text-danger" style={{ fontSize: "14px" }}>{errors.password}</p> : <p>Sử dụng 8 ký tự trở lên và kết hợp chữ cái, chữ số và biểu tượng</p>}
                            <div className="showPassword d-flex" onClick={handleShowHidePassword}>
                                <input type="checkbox" id="isShowPassword" name="isShowPassword" checked={isShowPassword} />
                                <div className="textShow"> Hiện mật khẩu</div>
                            </div>
                            <div className="button-list">
                                <button type="button" className="btn-signUP" onClick={() => navigate('/login')}>Đăng nhập</button>
                                <button type="submit" className="btn-next">{isLoading ? <Spinner animation="border" variant="primary" /> : "Tiếp theo"}</button>
                            </div>
                            {message && <div className={`mt-3 ${message === 'Ok' ? "text-success" : "text-danger"}`} style={{ fontSize: "14px" }}>{message}</div>}
                        </form>
                        <div className="google-image col-5 offset-1">
                            <img src="https://ssl.gstatic.com/accounts/signup/glif/account.svg" alt="" width="244" height="244" />
                            <figcaption>CodeCrush. Không gian học lập trình, trao đổi học tập, kết nối tới mọi người.</figcaption>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default connect(null, null)(SignUp);
