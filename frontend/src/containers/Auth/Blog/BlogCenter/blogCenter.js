import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllCommentById, handleEditComment, handleDeleteComment, handleAddNewComment } from '../../../../services/commentService';
import { getAllUsers } from '../../../../services/userService';
import { getAllPostById, getAllLikesOfPost, handleLikePost, editPost, deletePost } from '../../../../services/postService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import ModalPost from '../../Post/ModalPost/modalPost';
import ModalPostSubmission from '../../Post/Submission/modalPostSubmission';
import Scrollbars from "react-custom-scrollbars";
import { Link } from 'react-router-dom';
import moment from 'moment';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
class BlogCenter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listPosts: [],
            listComments: [],
            likePosts: [],
            isLiked: [],
            users: [],
            isOpenModalSubmission: false,
            contentPost: "",
            post: {
                id: "",
                content: "",
                img_url: "",
                createdAt: "",
                isOpenModalComment: false,
                isEditPost: false,
            },
        };
    }
    handleAddPostSubmission = () => {
        this.setState({
            isOpenModalSubmission: true
        })
    }
    togglePostSubmissionModal = () => {
        this.setState({
            isOpenModalSubmission: !this.state.isOpenModalSubmission
        })
    }
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
    userData = JSON.parse(localStorage.getItem("persist:user"));
    userInfo = JSON.parse(this.userData.userInfo);

    componentDidMount() {
        // let isMounted = true;
        const fetchData = async () => {
            const data = await getAllPostById('ALL');
            this.setState({
                listPosts: data.posts,
            });
            if (true) {
                let userArray = [];
                let commentsArray = [];
                let likePostsArray = [];
                let isLikedArray = [];
                for (let i = 0; i < data.posts.length; i++) {
                    const response = await getAllUsers(data.posts[i].userID);
                    const user = response.users;
                    userArray.push(user);

                    const responseOfCommentPost = await getAllCommentById(data.posts[i].id);
                    // console.log(responseOfCommentPost);
                    const comments = responseOfCommentPost.comments;
                    commentsArray.push(comments);

                    const responseOfLikePost = await getAllLikesOfPost(data.posts[i].id);
                    const likeposts = responseOfLikePost.likes;
                    likePostsArray.push(likeposts);

                    const userIsLiked = likeposts.some(item => item?.userID === this.userInfo.id);
                    isLikedArray.push(userIsLiked)
                }
                this.setState({
                    users: userArray,
                    listComments: commentsArray,
                    likePosts: likePostsArray,
                    isLiked: isLikedArray
                });
            }
        };
        fetchData();
        // return () => {
        //     isMounted = false;
        // };
    }
    // Lưu trạng thái like của bài viết vào localStorage
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
    componentDidUpdate(prevProps, prevState) {
        // if (this.state.listPosts !== prevState.listPosts) {
        //     const newIsLiked = [...this.state.isLiked];
        //     this.state.listPosts.forEach((post, index) => {
        //         const isPostLiked = localStorage.getItem(post.id); // Lấy giá trị trạng thái like từ localStorage
        //         if (isPostLiked === "true") {
        //             newIsLiked[index] = true;
        //         }
        //     });
        //     this.setState({
        //         isLiked: newIsLiked,
        //     });
        // }
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
    handleEditPost = (post) => {
        const updatedPost = { ...post, isEditPost: true };
        this.setState({
            listPosts: this.state.listPosts.map(p => p.id === post.id ? updatedPost : p),
            contentPost: post.content,
        });
    }
    handleSavePost = async (post) => {
        try {
            const response = await editPost(post.id, this.state.contentPost, this.userInfo)
            console.log(response);
            if (response && response.errCode === 0) {
                const updatedPost = { ...post, isEditPost: !post.isEditPost, content: this.state.contentPost };
                this.setState({
                    listPosts: this.state.listPosts.map(p => p.id === post.id ? updatedPost : p),
                });
                toast.success(<div style={{ width: "300px", fontSize: "14px" }}><i className="fas fa-check-circle"></i> Edit post success!</div>, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            } else {
                toast.error(<div style={{ width: "300px", fontSize: "14px" }}><FontAwesomeIcon icon={faExclamationTriangle} /> Edit post failed!</div>, {
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
    handleCancelPost = (post) => {
        const updatedPost = { ...post, isEditPost: !post.isEditPost };
        this.setState({
            listPosts: this.state.listPosts.map(p => p.id === post.id ? updatedPost : p),
        });
    }
    handleDeletePost = async () => {
        try {
            const response = await deletePost(this.state.postToDeleteId, this.userInfo)
            console.log(response);
            if (response && response.errCode === 0) {
                toast.success(<div style={{ width: "300px", fontSize: "14px" }}><i className="fas fa-check-circle"></i> Delete post success!</div>, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                const newListPost = [...this.state.listPosts];
                newListPost.splice(this.state.postIndex, 1);
                this.setState({
                    listPosts: newListPost,
                    isConfirmModalOpen: false,
                    postToDeleteId: null,
                    postIndex: null
                });
            } else {
                toast.error(<div style={{ width: "300px", fontSize: "14px" }}><FontAwesomeIcon icon={faExclamationTriangle} /> Delete post failed!</div>, {
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
    openConfirmModal = (postId, postIndex) => {
        this.setState({
            isConfirmModalOpen: true,
            postToDeleteId: postId,
            postIndex: postIndex
        });
    }
    closeConfirmModal = () => {
        this.setState({
            isConfirmModalOpen: false,
            postToDeleteId: null,
            postIndex: null
        });
    }
    render() {
        const { listPosts, likePosts, listComments, isLiked, isOpenModalSubmission, users } = this.state
        return (
            <div className="col-md-8 col-lg-6 vstack gap-4" style={{ marginLeft: "-5px" }}>
                <Scrollbars style={{ height: "100vh" }}>
                    <Modal isOpen={this.state.isConfirmModalOpen} toggle={this.closeConfirmModal}>
                        <ModalHeader toggle={this.closeConfirmModal}>Confirm delete</ModalHeader>
                        <ModalBody>
                            Are you sure you want to delete this post?
                        </ModalBody>
                        <ModalFooter>
                            <Button color='primary' onClick={() => this.handleDeletePost()}>Yes</Button>
                            <Button color='secondary' onClick={this.closeConfirmModal}>No</Button>
                        </ModalFooter>
                    </Modal>
                    <div className="d-flex gap-2 mb-n3">
                        <div className="position-relative">
                            <div className="cardx border border-2 border-dashed h-150px px-4 px-sm-5 shadow-none d-flex align-items-center justify-content-center text-center">
                                <div>
                                    <a className="stretched-link btn btn-light rounded-circle icon-md" href="#!">
                                        <i className="bi bi-plus-circle"></i>
                                    </a>
                                    <h6 className="mt-2 mb-0 small">Post a Story</h6>
                                </div>
                            </div>
                        </div>
                        <div id="stories" className="storiesWrapper stories-square stories user-icon carousel scroll-enable stories user-icon carousel snapgram ">
                        </div>
                    </div>
                    <div className="cardx card card-body">
                        <div className="d-flex mb-3">
                            <div className="avatar avatar-xs me-2">
                                <Link to={`/profile/${this.userInfo.id}`} onClick={() => window.scrollTo(0, 0)}>
                                    <img className="avatar-img rounded-circle" src={this.userInfo.img_url} alt="Avatar" />
                                </Link>

                            </div>
                            <form className="w-100" >
                                <textarea className="form-control pe-4 border-0"
                                    style={{ cursor: "pointer" }}
                                    rows={2} data-autoresize placeholder="Share yours thoughts..."
                                    onClick={this.handleAddPostSubmission}></textarea>
                                <ModalPostSubmission
                                    isOpen={isOpenModalSubmission}
                                    toggleFromParent={this.togglePostSubmissionModal}
                                />
                            </form>
                        </div>
                        <div>
                            <ul className="nav nav-pills nav-stack small fw-normal">
                                <li className="nav-item">
                                    <a className="nav-link bg-light py-1 px-2 mb-0" href="#!" data-bs-toggle="modal" data-bs-target="#feedActionPhoto">
                                        <i className="bi bi-image-fill text-success pe-2"></i>
                                        Photo
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link bg-light py-1 px-2 mb-0" href="#!" data-bs-toggle="modal" data-bs-target="#feedActionVideo">
                                        <i className="bi bi-camera-reels-fill text-info pe-2"></i>
                                        Video
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    {listPosts && listPosts.map((post, index) => {
                        return (
                            <div className="cardx card mt-5" style={{ height: "auto", marginBottom: "-30px", marginRight: "5px" }}>

                                <div className="card-header border-0 pb-0">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <Link to={`/profile/${users[index]?.id}`} onClick={() => window.scrollTo(0, 0)}>
                                                <div className="avatar avatar-story me-2">
                                                    <a href="#!"> <img className="avatar-img rounded-circle" src={users[index]?.img_url} alt="Avatar" /> </a>
                                                </div>
                                            </Link>
                                            <div>
                                                <div className="nav nav-divider">
                                                    <h6 className="nav-item card-title mb-0"> <a href="#!" style={{ color: "black", textDecoration: "none" }}>{users[index]?.fullName}</a></h6>
                                                    {/* <span className="nav-item small">6:30am 14/6/2023</span> */}
                                                </div>
                                                <p className="mb-0 small"> {moment(`${post.createdAt}`).format('HH:mm DD/MM/YYYY')}. <i className="bi bi-globe-central-south-asia"></i></p>
                                            </div>

                                        </div>

                                        {this.userInfo.id === post.userID ? <div className="dropdown">
                                            <a className="text-secondary btn btn-secondary-soft-hover py-1 px-2" id="cardFeedAction" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="bi bi-three-dots"></i>
                                            </a>
                                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="cardFeedAction">
                                                <li onClick={() => this.handleEditPost(post)}><a className="dropdown-item" > <i className="bi bi-pencil-square"></i> Edit post</a></li>
                                                <li onClick={() => this.openConfirmModal(post.id, index)}><a className="dropdown-item" > <i className="bi bi-trash"></i> Delete post </a></li>
                                                <li><a className="dropdown-item" > <i className="bi bi-x-circle fa-fw pe-2"></i>Hide post</a></li>
                                            </ul>
                                        </div>
                                            :
                                            <div className="dropdown">
                                                <a className="text-secondary btn btn-secondary-soft-hover py-1 px-2" id="cardFeedAction" data-bs-toggle="dropdown" aria-expanded="false">
                                                    <i className="bi bi-three-dots"></i>
                                                </a>
                                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="cardFeedAction">
                                                    <li><a className="dropdown-item"> <i className="bi bi-bookmark fa-fw pe-2"></i>Save post</a></li>
                                                    <li><a className="dropdown-item"> <i className="bi bi-person-x fa-fw pe-2"></i>Unfollow <b>{users[index]?.fullName}</b></a></li>
                                                    <li><a className="dropdown-item"> <i className="bi bi-x-circle fa-fw pe-2"></i>Hide post</a></li>
                                                    <li><a className="dropdown-item"> <i className="bi bi-slash-circle fa-fw pe-2"></i>Block</a></li>
                                                    <li><hr className="dropdown-divider" /></li>
                                                    <li><a className="dropdown-item"> <i className="bi bi-flag fa-fw pe-2"></i>Report post</a></li>
                                                </ul>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className="card-body">
                                    {post.isEditPost ? <textarea
                                        style={{
                                            width: "100%",
                                            fontSize: "18px",
                                            outline: "none",
                                            border: "none",
                                            backgroundColor: "#f3f2f2"
                                        }}
                                        rows={5}
                                        value={this.state.contentPost}
                                        onChange={e => this.setState({ contentPost: e.target.value })} />
                                        : <p className="content">
                                            {post.content}
                                        </p>
                                    }
                                    <div>
                                        {post.isEditPost ? (<div style={{ marginBottom: "10px" }}>
                                            <button className='btn btn-success' onClick={() => this.handleSavePost(post)}>Save</button>
                                            <button style={{ marginLeft: "10px" }} className='btn btn-danger' onClick={() => this.handleCancelPost(post)}>Cancel</button>
                                        </div>) : ""}
                                    </div>
                                    {post.img_url && <img className="card-img" src={post.img_url} alt=" " />}
                                </div>
                                <ul className="nav nav-stack py-3 small card-footer">
                                    <li className="nav-item">
                                        {isLiked[index] ? (<a style={{ color: "blue" }}
                                            className="nav-link active" data-bs-container="body"
                                            data-bs-toggle="tooltip" data-bs-placement="top" data-bs-html="true"
                                            data-bs-custom-class="tooltip-text-start"
                                            onClick={() => this.handleLikeThisPost(index, post.id)}
                                        > <i className="bi bi-hand-thumbs-up-fill pe-1"></i>Liked ({likePosts[index] && (likePosts[index].length)})</a>)
                                            : (<a className="nav-link active" data-bs-container="body"
                                                data-bs-toggle="tooltip" data-bs-placement="top" data-bs-html="true"
                                                data-bs-custom-class="tooltip-text-start"
                                                onClick={() => this.handleLikeThisPost(index, post.id)}
                                            > <i className="bi bi-hand-thumbs-up-fill pe-1"></i>Liked ({likePosts[index] && (likePosts[index].length)})</a>)}
                                    </li>
                                    <li className="nav-item" onClick={() => this.handleAddNewComment(post)}>
                                        <a className="nav-link" > <i className="bi bi-chat-fill pe-1"></i>Comments ({listComments[index] && (listComments[index].length)})</a>
                                    </li>
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
                                    <li className="nav-item dropdown ms-sm-auto">
                                        <a className="nav-link mb-0" id="cardShareAction" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i className="bi bi-reply-fill flip-horizontal ps-1"></i>
                                            Share (3)
                                        </a>
                                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="cardShareAction">
                                            <li><a className="dropdown-item" href="#"> <i className="bi bi-envelope fa-fw pe-2"></i>Send via Direct Message</a></li>
                                            <li><a className="dropdown-item" href="#"> <i className="bi bi-bookmark-check fa-fw pe-2"></i>Bookmark </a></li>
                                            <li><a className="dropdown-item" href="#"> <i className="bi bi-link fa-fw pe-2"></i>Copy link to post</a></li>
                                            <li><a className="dropdown-item" href="#"> <i className="bi bi-share fa-fw pe-2"></i>Share post via …</a></li>
                                            <li><hr className="dropdown-divider" /></li>
                                            <li><a className="dropdown-item" href="#"> <i className="bi bi-pencil-square fa-fw pe-2"></i>Share to News Feed</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        )
                    })}
                </Scrollbars>
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

export default connect(mapStateToProps, mapDispatchToProps)(BlogCenter);
