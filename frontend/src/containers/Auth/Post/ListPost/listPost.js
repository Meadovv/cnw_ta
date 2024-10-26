import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Spinner from "react-bootstrap/Spinner";
import { getAllPostById, getAllLikesOfPost, handleLikePost, editPost, deletePost } from '../../../../services/postService';
import { getAllCommentById, handleDeleteComment, handleAddNewComment, handleEditComment } from '../../../../services/commentService';
import { getAllUsers } from '../../../../services/userService';
import './style.scss'
import moment from 'moment';
import ModalPost from '../ModalPost/modalPost';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
class ListPost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // userData: this.props.userInfo,
            isConfirmModalOpen: false,
            postToDeleteId: null,
            postIndex: null,
            listPosts: [],
            listComments: [],
            likePosts: [],
            isLiked: [],
            contentPost: "",
            userInfomation: "",
            post: {
                id: "",
                content: "",
                img_url: "",
                createdAt: "",
                isOpenModalComment: false,
                isEditPost: false,
            },
        };
        this.postContentRef = React.createRef();
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
    userID = this.props.userID
    componentDidMount() {
        // let isMounted = true;
        const fetchData = async () => {
            const data = await getAllPostById(this.userID);
            const responseOfUser = await getAllUsers(this.userID)
            this.setState({
                listPosts: data.posts,
                userInfomation: responseOfUser.users
            });
            if (true) {
                let commentsArray = [];
                let likePostsArray = [];
                let isLikedArray = [];
                for (let i = 0; i < data.posts.length; i++) {
                    const response = await getAllCommentById(data.posts[i].id);
                    const comments = response.comments;
                    commentsArray.push(comments);

                    const responseOfLikePost = await getAllLikesOfPost(data.posts[i].id);
                    const likeposts = responseOfLikePost.likes;

                    if (data.posts[i].id === 9) {
                        console.log(likeposts);
                    }
                    likePostsArray.push(likeposts);

                    const userIsLiked = likeposts.some(item => item?.userID === this.userInfo.id);
                    isLikedArray.push(userIsLiked)
                }
                this.setState({
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
        const userInfo = this.userInfo
        const { userInfomation } = this.state
        return (
            <div className="main-profile" style={{ marginTop: "-42px", padding: "10px" }}>
                <div className="profile-main-body">
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
                    <div className="row">
                        {this.state.listPosts.length > 0 ? (
                            this.state.listPosts.map((post, index) => {
                                return (
                                    <div className="card mt-2" style={{ padding: "0 30px" }}>
                                        <div className="card-body d-flex mt-4">
                                            <div className="col-11 d-flex">
                                                <div>
                                                    <img src={userInfomation?.img_url} alt="Admin" className="rounded-circle"
                                                        width="50" height={50} />
                                                </div>
                                                <div style={{ marginLeft: "8px" }}>
                                                    <div style={{ fontWeight: "bold" }} className="author">{userInfomation?.fullName}</div>
                                                    <div className="text-secondary">{moment(`${post.createdAt}`).format('HH:mm DD/MM/YYYY')}. <i className="bi bi-globe-central-south-asia"></i></div>
                                                </div>
                                            </div>
                                            {this.userInfo.id === post.userID ? <div className="dropdown col-1">
                                                <a style={{ fontSize: "30px" }} className="text-secondary btn btn-secondary-soft-hover py-1 px-2" id="cardFeedAction" data-bs-toggle="dropdown" aria-expanded="false">
                                                    <i className="bi bi-three-dots"></i>
                                                </a>
                                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="cardFeedAction">
                                                    <li onClick={() => this.handleEditPost(post)}><a className="dropdown-item"> <i className="bi bi-pencil-square"></i> Edit post</a></li>
                                                    <li onClick={() => this.openConfirmModal(post.id, index)}><a className="dropdown-item"> <i className="bi bi-trash"></i> Delete post </a></li>
                                                    <li><a className="dropdown-item"> <i className="bi bi-x-circle fa-fw pe-2"></i>Hide post</a></li>
                                                </ul>

                                            </div>
                                                :
                                                <div className="dropdown col-1">
                                                    <a style={{ fontSize: "30px" }} className="text-secondary btn btn-secondary-soft-hover py-1 px-2" id="cardFeedAction" data-bs-toggle="dropdown" aria-expanded="false">
                                                        <i className="bi bi-three-dots"></i>
                                                    </a>
                                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="cardFeedAction">
                                                        <li><a className="dropdown-item"> <i className="bi bi-bookmark fa-fw pe-2"></i>Save post</a></li>
                                                        <li><a className="dropdown-item"> <i className="bi bi-person-x fa-fw pe-2"></i>Unfollow lori ferguson </a></li>
                                                        <li><a className="dropdown-item"> <i className="bi bi-x-circle fa-fw pe-2"></i>Hide post</a></li>
                                                        <li><a className="dropdown-item"> <i className="bi bi-slash-circle fa-fw pe-2"></i>Block</a></li>
                                                        <li><hr className="dropdown-divider" /></li>
                                                        <li><a className="dropdown-item"> <i className="bi bi-flag fa-fw pe-2"></i>Report post</a></li>
                                                    </ul>
                                                </div>
                                            }
                                        </div>
                                        <div className="post-content">
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
                                                : <div className="content">
                                                    {post.content}
                                                </div>
                                            }
                                            <div>
                                                {post.isEditPost ? (<div style={{ marginBottom: "10px" }}>
                                                    <button className='btn btn-success' onClick={() => this.handleSavePost(post)}>Save</button>
                                                    <button style={{ marginLeft: "10px" }} className='btn btn-danger' onClick={() => this.handleCancelPost(post)}>Cancel</button>
                                                </div>) : ""}
                                            </div>
                                            <div className="image mt-3">
                                                {post.img_url && <img className="card-img" src={post.img_url} alt=" " />}
                                            </div>
                                            <div className="d-flex mt-3" style={{ justifyContent: "space-between" }}>
                                                <div className="number-of-likes d-flex">
                                                    {this.state.likePosts[index] && (this.state.likePosts[index].length >= 1 ? <div style={{ width: "35px", height: "35px", borderRadius: "50%", backgroundColor: "blue", justifyContent: "center", alignItems: "center", display: "flex" }}>
                                                        <i className="fas fa-thumbs-up" style={{ fontSize: "20px", color: "white" }}></i>
                                                    </div> : "")}
                                                    <div style={{ fontWeight: "600", marginTop: "6px", fontSize: "18px", marginLeft: "10px" }}>
                                                        {this.state.likePosts[index] && (this.state.likePosts[index].length > 1 ? `${this.state.likePosts[index].length} likes` : this.state.likePosts[index].length ? `${this.state.likePosts[index].length} like` : "")}
                                                    </div>
                                                </div>
                                                <div className="number-of-comments">
                                                    <div style={{ fontWeight: "600", marginTop: "6px", fontSize: "18px", marginLeft: "10px" }}>
                                                        {this.state.listComments[index] && (this.state.listComments[index].length > 1 ? `${this.state.listComments[index].length} comments` : this.state.listComments[index].length ? `${this.state.listComments[index].length} comment` : "")}
                                                    </div>
                                                    <ModalPost
                                                        isOpen={post.isOpenModalComment}
                                                        toggleFromParent={() => this.toggleCommentModal(post)}
                                                        user={userInfo}
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
                                            </div>
                                        </div>
                                        <div className="post-action" style={{ padding: "0 30px" }}>
                                            <hr />
                                            <div className="d-flex" style={{ justifyContent: "space-between", padding: "0 100px", marginTop: "-10px" }}>
                                                {this.state.isLiked[index] ? (<div className="like text-secondary" onClick={() => this.handleLikeThisPost(index, post.id)}>
                                                    <i className="fas fa-thumbs-up" style={{ color: "blue" }}></i> <span style={{ color: "blue" }}>Like</span>
                                                </div>) :
                                                    (<div className="like text-secondary" onClick={() => this.handleLikeThisPost(index, post.id)}>
                                                        <i className="fas fa-thumbs-up" ></i> Like
                                                    </div>)}
                                                <div className="comment text-secondary" onClick={() => this.handleAddNewComment(post)}>
                                                    <i className="fas fa-comment-alt"></i> Comment
                                                </div>
                                                <div className="share text-secondary">
                                                    <i className="fas fa-share"></i> Share
                                                </div>
                                            </div>
                                            <hr style={{ marginTop: "9px" }} />
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center">
                                <Spinner animation="border" variant="primary" />
                            </div>
                        )}
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

export default connect(mapStateToProps, mapDispatchToProps)(ListPost);
