import React, { Component } from 'react';

import { connect } from 'react-redux';

import './style-course-list.scss'
import { getAllCourses } from '../../../services/courseService';
import { getAllUsersEnrollment } from '../../../services/enrollmentCourse';
import { Link } from 'react-router-dom';
import { getAllCommentById } from '../../../services/commentService';
import { getAllPostById, getAllLikesOfPost, handleLikePost } from '../../../services/postService';
import { getAllUsers } from '../../../services/userService';
import ModalPost from '../../Auth/Post/ModalPost/modalPost';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { handleAddNewComment, handleEditComment, handleDeleteComment } from '../../../services/commentService';


class CourseList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLiked: [],
            listCourses: [],
            usersOfEnrollment: [],
            listPosts: [],
            listComments: [],
            likePosts: [],
            users: [],
            isRegister: [],
            post: {
                id: "",
                content: "",
                img_url: "",
                createdAt: "",
                isOpenModalComment: false,
            },
        }
    }
    userData = JSON.parse(localStorage.getItem("persist:user"));
    userInfo = JSON.parse(this.userData.userInfo);
    handleAddNewComment = (post) => {
        const updatedPost = { ...post, isOpenModalComment: true };
        this.setState({
            listPosts: this.state.listPosts.map(p => p.id === post.id ? updatedPost : p),
        });
    }
    toggleCommentModal = (post) => {
        const updatedPost = { ...post, isOpenModalComment: !post.isOpenModalComment };
        this.setState({
            listPosts: this.state.listPosts.map(p => p.id === post.id ? updatedPost : p),
        });
    };
    componentDidMount() {
        this.fetchDataOfCourse();
        this.fetchDataOfPost();
    }

    async fetchDataOfCourse() {
        try {
            const response = await getAllCourses('ALL');
            if (response && response.errCode === 0) {
                this.setState({ listCourses: response.courses });
            }

            let userOfEnrollArray = [];
            let isRegisterArray = [];
            for (let i = 0; i < response.courses.length; i++) {
                const responseOfEnroll = await getAllUsersEnrollment(response.courses[i].id);
                const userEnroll = responseOfEnroll.usersOfRegister;
                userOfEnrollArray.push(userEnroll);

                const userIsRegister = userEnroll.some(item => item?.userID === this.userInfo.id)
                isRegisterArray.push(userIsRegister)
            }
            this.setState({
                usersOfEnrollment: userOfEnrollArray,
                isRegister: isRegisterArray
            });
        } catch (error) {
            console.log(error);
        }
    }
    async fetchDataOfPost() {
        try {
            const data = await getAllPostById('ALL');
            this.setState({
                listPosts: data.posts,
            });
            let userArray = [];
            let commentsArray = [];
            let likePostsArray = [];
            let isLikedArray = [];
            for (let i = 0; i < data.posts.length; i++) {
                const response = await getAllUsers(data.posts[i].userID);
                const user = response.users;
                userArray.push(user);

                const responseOfCommentPost = await getAllCommentById(data.posts[i].id);
                const comments = responseOfCommentPost.comments;
                commentsArray.push(comments);

                const responseOfLikePost = await getAllLikesOfPost(data.posts[i].id);
                const likeposts = responseOfLikePost.likes;
                likePostsArray.push(likeposts);
                if (this.userInfo && this.userInfo.id) {
                    const userIsLiked = likeposts.some(item => item?.userID === this.userInfo.id);
                    isLikedArray.push(userIsLiked)
                }
            }
            this.setState({
                users: userArray,
                listComments: commentsArray,
                likePosts: likePostsArray,
                isLiked: isLikedArray
            });
        } catch (error) {
            console.log(error);
        }
    }
    onDeleteComment = async (postIndex, commentIndex, postId) => {
        console.log(this.state.listComments[postIndex][commentIndex]);
        try {
            const response = await handleDeleteComment(this.state.listComments[postIndex][commentIndex].id, this.userInfo)
            if (response && response.errCode === 0) {
                toast.success(<div style={{ width: "300px", fontSize: "14px" }}><i className="fas fa-check-circle"></i> Delete comment success!</div>, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                const newListComments = await this.getAllComments(postId); // Sử dụng await để đợi hàm getAllComments hoàn thành
                const updatedListComments = [...this.state.listComments];
                updatedListComments[postIndex] = newListComments;
                console.log(updatedListComments[postIndex]);
                this.setState({
                    listComments: updatedListComments
                });
            } else {
                toast.error(<div style={{ width: "300px", fontSize: "14px" }}><FontAwesomeIcon icon={faExclamationTriangle} /> Delete comment failed!</div>, {
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
        } catch (error) {
            console.log(error);
        }
    }
    getAllComments = async (postId) => {
        const response = await getAllCommentById(postId)
        if (response && response.errCode === 0) {
            console.log(response.comments);
            return response.comments
        }
    }
    onAddNewComment = async (contentComment, postIndex, postId) => {
        try {
            const response = await handleAddNewComment(this.userInfo.id, contentComment, postId)
            if (response && response.errCode === 0) {
                toast.success(<div style={{ width: "300px", fontSize: "14px" }}><i className="fas fa-check-circle"></i> Add new comment success!</div>, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                const newListComments = await this.getAllComments(postId); // Sử dụng await để đợi hàm getAllComments hoàn thành
                const updatedListComments = [...this.state.listComments];
                updatedListComments[postIndex] = newListComments;

                this.setState({
                    listComments: updatedListComments
                });
            } else if (response && response.errCode !== 0) {
                toast.error(<div style={{ width: "300px", fontSize: "14px" }}><FontAwesomeIcon icon={faExclamationTriangle} /> Add comment failed!</div>, {
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
        } catch (error) {
            console.log(error);
        }
    }
    onSaveComment = async (commentID, contentComment, postId, postIndex) => {
        try {
            const response = await handleEditComment(commentID, contentComment, this.userInfo)
            if (response && response.errCode === 0) {
                toast.success(<div style={{ width: "300px", fontSize: "14px" }}><i className="fas fa-check-circle"></i> Edit comment success!</div>, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                const newListComments = await this.getAllComments(postId); // Sử dụng await để đợi hàm getAllComments hoàn thành
                const updatedListComments = [...this.state.listComments];
                updatedListComments[postIndex] = newListComments;

                this.setState({
                    listComments: updatedListComments
                });
            } else {
                toast.error(<div style={{ width: "300px", fontSize: "14px" }}><FontAwesomeIcon icon={faExclamationTriangle} /> Edit comment failed!</div>, {
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
        } catch (error) {
            console.log(error);
        }
    }
    handleLikeThisPost = async (index, postID) => {
        const response = await handleLikePost(this.userInfo.id, postID);
        if (response.errCode === 1) {
            const likePostsArray = [...this.state.likePosts]
            const responseOfLikePost = await getAllLikesOfPost(postID);
            const likeposts = responseOfLikePost.likes;
            likePostsArray[index] = likeposts;

            const isLikeArray = [...this.state.isLiked];
            const userIsLiked = likeposts.some(item => item?.userID === this.userInfo.id);
            isLikeArray[index] = userIsLiked
            this.setState({
                likePosts: likePostsArray,
                isLiked: isLikeArray
            });
        }
        if (response.errCode === 0) {
            const likePostsArray = [...this.state.likePosts]
            const responseOfLikePost = await getAllLikesOfPost(postID);
            const likeposts = responseOfLikePost.likes;
            likePostsArray[index] = likeposts;

            const isLikeArray = [...this.state.isLiked];
            const userIsLiked = likeposts.some(item => item?.userID === this.userInfo.id);
            isLikeArray[index] = userIsLiked
            this.setState({
                likePosts: likePostsArray,
                isLiked: isLikeArray
            });
        }
    };
    render() {
        const { listCourses, usersOfEnrollment, listPosts, likePosts, listComments, users, isLiked } = this.state
        return (
            <div className="CourseList" style={{ marginTop: "56px" }}>
                <div id="myCarousel" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-indicators">
                        <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="0" className="active" aria-current="true"
                            aria-label="Slide 1"></button>
                        <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="1" aria-label="Slide 2" ></button>
                        <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
                    </div>
                    <div className="carousel-inner">
                        <div className="carousel-item active item-1">
                            <svg className="bd-placeholder-img" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false">
                                <rect width="100%" height="100%" fill="#777" />
                            </svg>

                            <div>
                                <div className="carousel-caption text-start">
                                    <h1>Khóa học Fullstack.</h1>
                                    <p>Đây là khóa học chi tiết, đầy đủ nhất bạn có thể tìm thấy trên CodeCrush.</p>
                                    <Link to="/course/12" onClick={() => window.scrollTo(0, 0)}>
                                        <button className="button-registerCourse" >Đăng ký ngay</button>
                                    </Link>
                                </div>
                            </div>

                            <img style={{ borderRadius: "10px" }} src="https://resources.mindx.edu.vn/uploads/images/2212%20THUMBNAIL%20WEB-04.jpg" />
                        </div>
                        <div className="carousel-item item-2">
                            <svg className="bd-placeholder-img" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false">
                            </svg>

                            <div className='d-flex'>
                                <div className="carousel-caption text-start" style={{ width: "600px" }}>
                                    <h1>Khoá học ReactJS miễn phí.</h1>
                                    <p>Khóa học ReactJS từ cơ bản tới nâng cao. Kết quả của khóa học này là bạn có thể làm hầu hết các dự án thường gặp với ReactJS.</p>
                                    <Link to="/course/10" onClick={() => window.scrollTo(0, 0)}>
                                        <button className="button-registerCourse" href="#">Đăng ký ngay</button>
                                    </Link>
                                </div>
                                <div className="image-container">
                                    <img src="https://files.fullstack.edu.vn/f8-prod/banners/Banner_web_ReactJS.png" />
                                </div>
                            </div>
                        </div>
                        <div className="carousel-item item-1">
                            <svg className="bd-placeholder-img" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false">
                            </svg>

                            <div>
                                <div className="carousel-caption text-start">
                                    <h1>Khóa học HTML CSS miễn phí.</h1>
                                    <p>CodeCrush cung cấp cho học viên các kiến thức cơ bản về HTML/CSS/Website.</p>
                                    <Link to="/course/4" onClick={() => window.scrollTo(0, 0)}>
                                        <button className="button-registerCourse" href="#">Đăng ký ngay</button>
                                    </Link>
                                </div>
                                <div className="image-container">
                                    <img src="https://files.fullstack.edu.vn/f8-prod/banners/20/6308a6bf603a4.png" />
                                </div>
                            </div>

                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
                <main>
                    <section className="home-cl section-padding">
                        <section className="popular-location section-padding">
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="section-tittle text-center mb-40">
                                            <h2 className="display-2">Các khóa học miễn phí</h2>
                                            <p>Tham gia các khóa học chất lượng nhất</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="row course-list mt-5">
                                    {listCourses && listCourses.map((course, index) => {
                                        return (
                                            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6">
                                                <div className="single-location mb-20">
                                                    <div className="location-img">
                                                        <img src={course.img_url} alt="" />
                                                    </div>

                                                    <div className="location-details">
                                                        {this.state.isRegister[index] ?
                                                            <Link to={`/learn/${course.id}`} onClick={() => window.scrollTo(0, 0)}>
                                                                <a className="location-btn">Tiếp tục học</a>
                                                            </Link>
                                                            :
                                                            <Link to={`/course/${course.id}`} onClick={() => window.scrollTo(0, 0)}>
                                                                <a className="location-btn" onClick={() => window.scrollTo(0, 0)}>Xem khóa học</a>
                                                            </Link>}
                                                    </div>
                                                </div>
                                                <h6 style={{ marginTop: "-10px", fontWeight: "700" }}>{course.title}</h6>
                                                <div style={{ marginBottom: "40px", fontSize: "16px" }}>
                                                    <i className="bi bi-people-fill"></i> <span>{usersOfEnrollment[index] ? (`${usersOfEnrollment[index].length}`) : "0"}</span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="section-tittle text-center mb-40">
                                            <h2 className="display-2">Các bài viết nổi bật</h2>
                                            <p>Tham gia trao đổi học tập cùng cộng đồng CodeCrush.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="row course-list mt-5">
                                    {listPosts && listPosts.map((post, index) => {
                                        return (
                                            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6">
                                                <div className="single-location mb-20">
                                                    <div className="location-img">
                                                        <img src={post.img_url} alt="" />
                                                    </div>

                                                    <div className="location-details" style={{ cursor: "pointer" }}>
                                                        <a className="location-btn" onClick={() => this.handleAddNewComment(post)}>Xem bài viết</a>
                                                    </div>
                                                    <ModalPost
                                                        isOpen={post.isOpenModalComment}
                                                        toggleFromParent={() => this.toggleCommentModal(post)}
                                                        user={this.userInfo}
                                                        isLiked={this.state.isLiked[index]}
                                                        likePosts={this.state.likePosts[index]}
                                                        numberOfComment={this.state.listComments[index] ? this.state.listComments[index].length : 0}
                                                        post={post}
                                                        onDeleteComment={(commentIndex) => this.onDeleteComment(index, commentIndex, post.id)}
                                                        onAddNewComment={(contentComment) => this.onAddNewComment(contentComment, index, post.id)}
                                                        onSaveComment={(commentID, contentComment) => this.onSaveComment(commentID, contentComment, post.id, index)}
                                                        listComments={this.state.listComments[index]}
                                                        handleLikeThisPost={() => this.handleLikeThisPost(index, post.id)}
                                                    />
                                                </div>
                                                {/* <h6 style={{ marginTop: "-10px", fontWeight: "700" }}>{this.state.users[index].fullName}</h6> */}
                                                <div style={{ marginBottom: "40px", fontSize: "14px" }}>
                                                    <div className='d-flex action-post'>
                                                        {isLiked[index] ? <div style={{ color: "blue" }}>
                                                            <i className="bi bi-hand-thumbs-up-fill pe-1" onClick={() => this.handleLikeThisPost(index, post.id)}></i>
                                                            <span>{likePosts[index] ? (`${likePosts[index].length}`) : "0"}</span>
                                                        </div> :
                                                            <div>
                                                                <i className="bi bi-hand-thumbs-up-fill pe-1" onClick={() => this.handleLikeThisPost(index, post.id)}></i>
                                                                <span>{likePosts[index] ? (`${likePosts[index].length}`) : "0"}</span>
                                                            </div>}
                                                        <div style={{ marginLeft: "20px" }}>
                                                            <i className="bi bi-chat-fill pe-1"></i>
                                                            <span>{listComments[index] ? (`${listComments[index].length}`) : "0"}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </section>

                    </section>
                </main>
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

export default connect(mapStateToProps, mapDispatchToProps)(CourseList);
