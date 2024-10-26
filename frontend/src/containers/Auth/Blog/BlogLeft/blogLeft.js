import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getAllPostById } from '../../../../services/postService';
import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
class BlogLeft extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listPosts: [],
            open: false
        };

    }
    userData = JSON.parse(localStorage.getItem("persist:user"));
    userInfo = JSON.parse(this.userData.userInfo);
    componentDidMount() {
        this.fetchData(this.userInfo.id);

    }

    componentWillUnmount() {
        //  Hủy bỏ bất kỳ kết nối hoặc tài nguyên nào đang chạy
        //  để tránh lỗi "memory leaks"
        // this.offcanvasToggle.current.removeEventListener('click');
    }

    async fetchData(userId) {
        try {
            const data = await getAllPostById(userId);
            if (data && data.errCode === 0) {
                this.setState({ listPosts: data.posts });
            }
        } catch (error) {
            console.log(error);
        }
    }



    render() {
        return (
            <>
                <div className="col-lg-3">

                    <nav className="navbar navbar-expand-lg mx-0 mt-5">
                        <div className=" " tabIndex={-1}
                            id="" aria-modal="true" role="dialog"
                            ref={this.offcanvasSideNavbar}>

                            <div className=" d-block px-2 px-lg-0">
                                <div className="cardx">
                                    <div className="card-body pt-0">
                                        <div className="h-50px"></div>
                                        <div className="text-center">
                                            <div className="avatar avatar-lg mt-n5 mb-3">
                                                <Link to={`/profile/${this.userInfo.id}`} onClick={() => window.scrollTo(0, 0)}>
                                                    <img className="rounded-circle" src={this.userInfo.img_url} alt="Avatar" width={75} height={75} />
                                                </Link>
                                            </div>
                                            <h5 className="mb-0">
                                                <Link to={`/profile/${this.userInfo.id}`} style={{ textDecoration: "none", color: "black" }} onClick={() => window.scrollTo(0, 0)}>{this.userInfo.fullName}</Link>
                                            </h5>
                                            <div className="d-flex hstack gap-2 gap-xl-3 justify-content-center mt-3">
                                                <div>
                                                    <h6 className="mb-0">{this.state.listPosts.length}</h6>
                                                    <small>Post</small>
                                                </div>
                                                <div className="vr"></div>
                                                <div>
                                                    <h6 className="mb-0">2.06k</h6>
                                                    <small>Followers</small>
                                                </div>
                                                <div className="vr"></div>
                                                <div>
                                                    <h6 className="mb-0">200</h6>
                                                    <small>Following</small>
                                                </div>
                                            </div>
                                            <hr />
                                            <ul className="nav nav-link-secondary flex-column fw-bold gap-2">
                                                <li className="nav-item">
                                                    <Link to="/home" style={{ color: "black" }} onClick={() => window.scrollTo(0, 0)}>
                                                        <a className="nav-link">
                                                            <i className="bi bi-house-heart-fill me-2 h-20px fa-fw"></i>
                                                            <span>Home</span>
                                                        </a>
                                                    </Link>
                                                </li>
                                                <li className="nav-item">
                                                    <Link to="/blog" style={{ color: "black" }} onClick={() => window.scrollTo(0, 0)}>
                                                        <a className="nav-link">
                                                            <i className="bi bi-people me-2 h-20px fa-fw"></i>
                                                            <span>Blog</span>
                                                        </a>
                                                    </Link>
                                                </li>
                                                <li className="nav-item">
                                                    <Link to="/aboutus" style={{ color: "black" }} onClick={() => window.scrollTo(0, 0)}>
                                                        <a className="nav-link">
                                                            <i className="bi bi-diagram-3 me-2 h-20px fa-fw"></i>
                                                            <span>About us</span>
                                                        </a>
                                                    </Link>
                                                </li>
                                                <li className="nav-item">
                                                    <a className="nav-link">
                                                        <i className="bi bi-box-arrow-right"></i>
                                                        <span> Log out</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="card-footer text-center py-2">
                                            <Link to={`/profile/${this.userInfo.id}`} onClick={() => window.scrollTo(0, 0)}>
                                                <a className="btn btn-link btn-sm text-primary">View profile</a>
                                            </Link>
                                        </div>
                                    </div>
                                    <ul className="nav small mt-4 justify-content-center lh-1">
                                        <li className="nav-item">
                                            <a className="nav-link">About</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link">Settings</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link">Support</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link">Help</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link">Privacy & terms </a>
                                        </li>
                                    </ul>
                                    <p className="small text-center mt-1">©2023 CodeCrush</p>
                                </div>
                            </div>
                        </div>

                    </nav>
                </div>

            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(BlogLeft);
