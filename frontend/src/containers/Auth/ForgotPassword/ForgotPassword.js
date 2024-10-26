import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './style.scss'
class ForgotPassword extends Component {

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className="forgotPassword-page-container">
                <div className="main-forgotPassword">
                    <div className="row">
                        <div className="brand d-flex">
                            <img src={`${process.env.PUBLIC_URL}/assets/img/logo-symbol.png`} alt="Avatar" style={{ height: "50px" }} />
                            <h4 style={{ color: "blue", marginLeft: "10px" }}>C</h4><h4 style={{ color: "red" }}>-</h4>
                            <h4 style={{ color: "green" }}>C</h4><h4 style={{ color: "orange" }}>r</h4><h4 style={{ color: "blue" }}>u</h4><h4 style={{ color: "red" }}>s</h4><h4 style={{ color: "blue" }}>h</h4></div>
                        <div className="col-8 offset-2">
                            <div className="panel panel-default">
                                <div className="text-center">
                                    <h3><i className="fa fa-lock fa-4x mt-4"></i></h3>
                                    <h2 className="text-center mt-5">Forgot Password?</h2>
                                    <p>You can reset your password here.</p>
                                    <div className="panel-body">
                                        <form id="register-form" role="form" autoComplete="off" className="form" method="post">
                                            <div className="form-group">
                                                <div className="input-group">
                                                    <span className="input-group-addon"><i className="glyphicon glyphicon-envelope color-blue"></i></span>
                                                    <input id="email" name="email" placeholder="Email address" className="form-control" type="email" />
                                                </div>
                                            </div>
                                            <div className="form-group mt-3">
                                                <input style={{ width: "100%" }} name="recover-submit" className="btn btn-primary btn-block" value="Reset Password" type="submit" />
                                            </div>
                                            <input type="hidden" className="hide" name="token" id="token" value="" />
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {

    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
