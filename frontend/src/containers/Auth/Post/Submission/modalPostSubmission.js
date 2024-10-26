import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { handleAddNewPost } from '../../../../services/postService';
import { Scrollbars } from 'react-custom-scrollbars';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import './style.scss'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
class ModalPostSubmission extends Component {

    constructor(props) {
        super(props);
        this.state = {
            content: '',
            img_url: '',
            isPostDisabled: true,
            message: '',
        };
    }

    componentDidMount() {
        this.checkPostInput();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.content !== this.state.content || prevState.img_url !== this.state.img_url) {
            this.checkPostInput();
        }
    }

    componentWillUnmount() {
        this.setState({
            content: '',
            img_url: '',
            isPostDisabled: true,
            message: '',
        });
    }

    checkPostInput() {
        const { content, img_url } = this.state;
        const isPostDisabled = content.trim().length === 0 && img_url.trim().length === 0;
        this.setState({ isPostDisabled });
    }

    handlePost = async () => {
        const { content, img_url } = this.state;
        const userData = this.props.userInfo
        const userID = userData.id;
        try {
            const response = await handleAddNewPost(userID, content, img_url);
            if (response && response.errCode === 0) {
                this.setState({
                    message: response.message,
                    content: '',
                    img_url: ''
                });
                this.props.toggleFromParent();
                toast.success(<div style={{ width: "300px", fontSize: "14px" }}><i className="fas fa-check-circle"></i> Add new post success!</div>, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            }
            if (response && response.errCode !== 0) {
                this.setState({ message: response.message });
                toast.error(<div style={{ width: "300px", fontSize: "14px" }}><FontAwesomeIcon icon={faExclamationTriangle} /> Add new post failed!</div>, {
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
    render() {
        const { isOpen, toggleFromParent } = this.props;
        const { content, img_url, isPostDisabled, message } = this.state;
        const userData = this.props.userInfo;
        return (
            <Modal
                isOpen={isOpen}
                toggle={() => toggleFromParent()}
                className={'modal-postSubmission-container'}
                size='lg'
                centered
            >
                <ModalHeader toggle={() => toggleFromParent()}>
                    Create a new post
                </ModalHeader>
                <Scrollbars style={{ height: "70vh" }}>
                    <ModalBody>
                        <div className='modal-postSubmisson-body'>
                            <div className="main-profile" style={{ marginTop: "-20px" }}>
                                <div className="profile-main-body">
                                    <div className="row">
                                        <div style={{ padding: "0 20px" }}>
                                            <div>
                                                <div className="d-flex">
                                                    <div>
                                                        <img src={userData?.img_url} alt="Avatar" className="rounded-circle"
                                                            width="50" height={50} />
                                                    </div>
                                                    <div style={{ marginLeft: "8px" }}>
                                                        <div style={{ fontWeight: "bold" }} className="author">{userData?.fullName}</div>
                                                        <div className="public-icon"><i className="fas fa-globe-asia"></i>  Public  <i className="fas fa-caret-down"></i></div>
                                                    </div>
                                                </div>
                                                <div className='postSubmission-content'>
                                                    <textarea className=" mt-3" name="description" placeholder={`Hey ${userData?.fullName}, What are you thinking?`}
                                                        value={content} onChange={e => this.setState({ content: e.target.value })}></textarea>
                                                    <input className='form-control' placeholder='Input your image link...'
                                                        value={img_url} onChange={e => this.setState({ img_url: e.target.value })} />
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
                    <div className='d-flex add-post'>
                        <div className='col-9 text-secondary' style={{ display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "500", cursor: "pointer" }}>
                            Add to your post</div>
                        <div className='postSubmission-icons col-3'>
                            <i className="fas fa-images" style={{ color: "green" }}></i>
                            <i className="fas fa-user" style={{ color: "blue" }}></i>
                            <i className="fas fa-grin-hearts" style={{ color: "orange" }}></i>
                            <i className="fas fa-map-marker-alt" style={{ color: "red" }}></i>
                            <i className="fas fa-flag" style={{ color: "blue" }}></i>
                            <i className="fas fa-ellipsis-h" style={{ color: "gray" }}></i>
                        </div>
                    </div>
                    <button className='btn btn-primary' style={{ width: "100%", fontWeight: "bold" }} onClick={this.handlePost} disabled={isPostDisabled}>
                        Post
                    </button>
                </ModalFooter>
            </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalPostSubmission);
