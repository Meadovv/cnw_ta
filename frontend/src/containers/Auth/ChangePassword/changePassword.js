import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './style.scss'
import { userChangePassword } from '../../../services/userService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import Spinner from "react-bootstrap/Spinner";
class ChangePassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            curPassword: '',
            newPassword: '',
            verPassword: '',
            isLoading: false,
            errors: {
                curPassword: '',
                newPassword: '',
                verPassword: ''
            }
        }
    }
    handleOnChangeInput = (e, id) => {
        let copyState = { ...this.state };
        copyState[id] = e.target.value;
        copyState.errors[id] = ""
        this.setState({
            ...copyState
        })
    }
    handleOnSubmit = async (event) => {
        event.preventDefault(); // Ngăn chặn hành vi mặc định của trình duyệt khi submit form
        const isValid = this.validateForm();
        if (isValid && this.state.newPassword === this.state.verPassword) {
            const id = this.props.userInfo?.id;
            this.setState({
                message: '',
                isLoading: true
            })
            try {
                const response = await userChangePassword(id, this.state.curPassword, this.state.newPassword);
                if (response && response.errCode === 0) {
                    this.setState({
                        message: response.message
                    })
                    toast.success(<div style={{ width: "300px", fontSize: "14px" }}><i className="fas fa-check-circle"></i> You have successfully changed your password!</div>, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                    this.props.history.push('/home');
                }
                if (response && response.errCode !== 0) {
                    this.setState({
                        message: response.message
                    })
                    toast.error(<div style={{ width: "300px", fontSize: "14px" }}><FontAwesomeIcon icon={faExclamationTriangle} /> Change password failed!</div>, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });

                }
                this.setState({
                    isLoading: false
                })
            } catch (error) {
                console.log(error);

            }
        }
    }
    validateForm = () => {
        let isValid = true;
        const errors = {
            curPassword: '',
            newPassword: '',
            verPassword: ''
        };
        if (this.state.curPassword.trim() === '') {
            isValid = false;
            errors.curPassword = 'Vui lòng nhập mật khẩu hiện tại của bạn!';
        }
        if (this.state.newPassword.trim() === '') {
            isValid = false;
            errors.newPassword = 'Mật khẩu không được để trống!';
        } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/.test(this.state.newPassword)) {
            isValid = false;
            errors.newPassword = 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ cái, số và biểu tượng!';
        }
        if (this.state.verPassword.trim() === '') {
            isValid = false;
            errors.verPassword = 'Xác nhận mật khẩu không được để trống!';
        }
        this.setState({
            errors: errors
        });
        return isValid;
    }
    render() {
        return (
            <div className="changePassword-page-container">
                <div className="main-changePassword">
                    <div className="brand d-flex">
                        <img src={`${process.env.PUBLIC_URL}/assets/img/logo-symbol.png`} alt="Avatar" style={{ height: "50px" }} />
                        <h4 style={{ color: "blue", marginLeft: "10px" }}>C</h4><h4 style={{ color: "red" }}>-</h4>
                        <h4 style={{ color: "green" }}>C</h4><h4 style={{ color: "orange" }}>r</h4><h4 style={{ color: "blue" }}>u</h4><h4 style={{ color: "red" }}>s</h4><h4 style={{ color: "blue" }}>h</h4></div>
                    <h2 className="mt-4">Đổi mật khẩu</h2>
                    <div className="main__form mt-4">
                        <div className="main__form__children d-flex">
                            <form action="" method="POST" className="form" id="form-1"
                                onSubmit={this.handleOnSubmit}>
                                <div className="inputPassword mt-3">
                                    <input id="password" style={{ minWidth: "445px" }} type="password" name="curPassword" placeholder="Mật khẩu" className="form-control"
                                        value={this.state.curPassword}
                                        onChange={e => this.handleOnChangeInput(e, "curPassword")}
                                    />
                                </div>
                                {this.state.errors.curPassword ? <p className='text-danger' style={{ marginBottom: "-20px" }}>{this.state.errors.curPassword}</p> : ""}
                                <div className="inputPassword mt-3">
                                    <input id="password" type="password" name="newPassword" placeholder="Mật khẩu mới" className="form-control"
                                        value={this.state.newPassword}
                                        onChange={e => this.handleOnChangeInput(e, "newPassword")}
                                    />
                                </div>
                                {this.state.errors.newPassword ? <p className='text-danger' style={{ marginBottom: "-20px", width: "440px" }}>{this.state.errors.newPassword}</p> : ""}
                                <div className="inputPassword mt-3">
                                    <input id="password" type="password" name="verPassword" placeholder="Xác nhận" className="form-control"
                                        value={this.state.verPassword}
                                        onChange={e => this.handleOnChangeInput(e, "verPassword")}
                                    />
                                </div>
                                {this.state.newPassword !== this.state.verPassword && <div className="text-danger" style={{ fontSize: "14px", marginBottom: "-20px", paddingLeft: "8px" }}>Mật khẩu không khớp</div>}
                                <div className="showPassword d-flex mt-3 text-secondary">
                                    {this.state.errors.newPassword ? "" : <div className="textShow"> Sử dụng 8 ký tự trở lên và kết hợp chữ cái, chữ số và biểu tượng</div>}
                                </div>
                                <div className="button-list mt-4" style={{ justifyContent: "center" }}>
                                    <div>
                                        {this.state.isLoading ? <div className="text-center">
                                            <Spinner animation="border" variant="primary" />
                                        </div> :
                                            <button className="btn-next">Đổi</button>
                                        }
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
