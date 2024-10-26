import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { getAllCommentById, handleAddNewComment } from '../../../../services/commentService';
import { getAllUsers } from '../../../../services/userService';
import moment from 'moment';
import './style.scss'
import CommentForm from '../../Comment/comment'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap-icons/font/bootstrap-icons.css';
class ModalPost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: {},
            isCommentDisabled: true,
            message: '',
            contentComment: '',
            comment: {
                id: '',
                userID: '',
                content: '',
                createdAt: '',
            },
        };
    }
    componentDidMount() {
        if (this.props.isOpen) {
            this.fetchData();
            // this.getAllComment()
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.isOpen && !prevProps.isOpen) {
            this.fetchData();
            // this.getAllComment();
        }
    }

    fetchData = async () => {
        try {
            const auth = await getAllUsers(this.props.post.userID);
            if (auth && auth.errCode === 0) {
                this.setState({ auth: auth.users });
            }
        } catch (error) {
            console.log(error);
        }
    }
    handleOnIputComment = (e) => {
        this.setState({
            contentComment: e.target.value
        })
        if (e.target.value === "") {
            this.setState({
                isCommentDisabled: true
            })
        } else {
            this.setState({
                isCommentDisabled: false
            })
        }
    }
    handleAddNewComment = (contentComment) => {
        const { onAddNewComment } = this.props
        onAddNewComment(contentComment);
        this.setState({ contentComment: '' });

    }
    render() {
        const {
            isOpen,
            toggleFromParent,
            user,
            likePosts,
            isLiked,
            post,
            numberOfComment,
            listComments
        } = this.props;
        const {
            isCommentDisabled,
            message,
            contentComment,
        } = this.state;
        return (
            <Modal
                isOpen={isOpen}
                toggle={() => toggleFromParent()}
                className={'modal-post-container'}
                size='lg'
                centered
            >
                <ModalHeader toggle={() => toggleFromParent()}>
                    <div style={{ fontWeight: "400" }}>Post of</div>
                    <div style={{ marginLeft: "5px", fontWeight: "bold" }}>{this.state.auth.fullName}</div>
                </ModalHeader>
                <Scrollbars style={{ height: "72vh" }}>
                    <ModalBody>
                        <div className='modal-post-body'>
                            <div className="main-profile" style={{ marginTop: "-42px", padding: "10px" }}>
                                <div className="profile-main-body">
                                    <div className="row">
                                        <div className="mt-2" style={{ padding: "0 30px" }}>
                                            <div className=" d-flex mt-4">
                                                <div className="col-11 d-flex">
                                                    <div>
                                                        <img src={this.state.auth.img_url} alt="Admin" className="rounded-circle"
                                                            width="50" height={50} />
                                                    </div>
                                                    <div style={{ marginLeft: "8px" }}>
                                                        <div style={{ fontWeight: "bold" }} className="author">{this.state.auth.fullName}</div>
                                                        <div className="text-secondary">{moment(`${post.createdAt}`).format('HH:mm DD/MM/YYYY')}. <i className="fas fa-globe-asia"></i></div>
                                                    </div>
                                                </div>
                                                <div className=" col-1" style={{ fontSize: "30px", marginLeft: "50px" }}>
                                                    <i className="fas fa-ellipsis-h"></i>
                                                </div>
                                            </div>
                                            <div className="post-content">
                                                <div className="content">
                                                    {post.content}
                                                </div>
                                                <div className="image mt-3">
                                                    <img src={post.img_url} alt="Avatar" />
                                                </div>
                                                <div className="d-flex mt-3" style={{ justifyContent: "space-between" }}>
                                                    <div className="number-of-likes d-flex">
                                                        {likePosts && (likePosts.length >= 1 ? <div style={{ width: "35px", height: "35px", borderRadius: "50%", backgroundColor: "blue", justifyContent: "center", alignItems: "center", display: "flex" }}>
                                                            <i className="fas fa-thumbs-up" style={{ fontSize: "20px", color: "white" }}></i>
                                                        </div> : "")}
                                                        <div style={{ fontWeight: "600", marginTop: "6px", fontSize: "18px", marginLeft: "10px" }}>
                                                            {likePosts && (likePosts.length > 1 ? `${likePosts.length} likes` : likePosts.length ? `${likePosts.length} like` : "")}
                                                        </div>
                                                    </div>
                                                    <div className="number-of-comments">
                                                        <div style={{ fontWeight: "600", marginTop: "6px", fontSize: "18px", marginLeft: "10px" }}>
                                                            {numberOfComment > 1 ? `${numberOfComment} comments` : numberOfComment ? `${numberOfComment} comment` : ""}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="post-action" style={{ padding: "0 30px" }}>
                                                <hr />
                                                <div className="d-flex" style={{ justifyContent: "space-between", padding: "0 100px", marginTop: "-10px" }}>
                                                    {isLiked ? (<div className="like text-secondary" onClick={() => this.props.handleLikeThisPost()}>
                                                        <i className="fas fa-thumbs-up" style={{ color: "blue" }}></i> <span style={{ color: "blue" }}

                                                        >Like</span>
                                                    </div>) :
                                                        (<div className="like text-secondary" onClick={() => this.props.handleLikeThisPost()} >
                                                            <i className="fas fa-thumbs-up" ></i> Like
                                                        </div>)}
                                                    <div className="comment text-secondary">
                                                        <i className="fas fa-comment-alt"></i> Comment
                                                    </div>
                                                    <div className="share text-secondary">
                                                        <i className="fas fa-share"></i> Share
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="content-item" id="comments">
                                                <div className="d-flex">
                                                    <div className="row">
                                                        <div className="">
                                                            <h3>{numberOfComment > 1 ? `${numberOfComment} comments` : numberOfComment ? `${numberOfComment} comment` : ""}</h3>
                                                            {Array.isArray(listComments) && listComments.map((comment, index) => {
                                                                return <div>
                                                                    <CommentForm
                                                                        onSaveComment={this.props.onSaveComment}
                                                                        onDeleteComment={this.props.onDeleteComment}
                                                                        comment={comment}
                                                                        user={user}
                                                                        index={index} />
                                                                </div>
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                </Scrollbars>
                <ModalFooter>
                    <div className='media d-flex form-input-comment' style={{ width: "100%" }}>
                        <a className="pull-left" href="#"><img className="rounded-circle"
                            width="50" height={50}
                            src={user?.img_url} alt="" /></a>
                        <div className="input-comment">
                            <input className='input-comment__form' placeholder='Post a comment...'
                                value={contentComment} onChange={e => this.handleOnIputComment(e)}

                            />
                            <div className='d-flex' style={{ justifyContent: "space-between", marginTop: "30px" }}>
                                <div className='d-flex input-comment__icons'>
                                    <i className="fas fa-camera" style={{ color: "gray" }}></i>
                                    <i className="bi bi-emoji-heart-eyes-fill" style={{ color: "orange", marginTop: "-5px" }}></i>
                                    <i className="fas fa-gift" style={{ color: "red" }}></i>
                                    <i className="fas fa-sticky-note" style={{ color: "green" }}></i>
                                </div>
                                <button disabled={isCommentDisabled} style={{ outline: "none", border: "none" }} onClick={() => this.handleAddNewComment(this.state.contentComment)}>
                                    <i className="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </ModalFooter>
            </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalPost);
