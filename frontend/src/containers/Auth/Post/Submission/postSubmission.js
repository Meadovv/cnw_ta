import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import ModalPostSubmission from './modalPostSubmission';
import './style.scss'
class PostSubmission extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenModal: false,
        };
        this.handleAddPostSubmission = this.handleAddPostSubmission.bind(this);
        this.togglePostSubmissionModal = this.togglePostSubmissionModal.bind(this);
    }

    handleAddPostSubmission() {
        this.setState({
            isOpenModal: true,
        });
    }

    togglePostSubmissionModal() {
        this.setState(prevState => ({
            isOpenModal: !prevState.isOpenModal,
        }));
    }
    render() {
        const userInfo = this.props.userInfo
        return (
            <div className="main-profile" style={{ marginTop: "-42px", padding: "10px" }}>
                <div className="profile-main-body">
                    <div className="row">
                        <div className="card">
                            <div className="card-body d-flex mt-4">
                                <div className="col-1 offset-1">
                                    <img src={userInfo?.img_url} alt="Avatar" className="rounded-circle"
                                        width="75" height={75} />
                                </div>
                                <div className="inputPassword mt-3 col-9">
                                    <input id="post" type="text" name="post" placeholder="Hey Lê Văn Do, what are you thinking?" className="form-control"
                                        onClick={this.handleAddPostSubmission} />
                                </div>
                                <ModalPostSubmission
                                    isOpen={this.state.isOpenModal}
                                    toggleFromParent={this.togglePostSubmissionModal}
                                />
                            </div>
                            <div className="col-8 offset-2 d-flex text-secondary" style={{ justifyContent: "space-between", fontSize: "20px", fontWeight: "500", marginBottom: "10px" }}>
                                <div>
                                    <i className="fas fa-video" style={{ color: "red" }}></i> Live video
                                </div>
                                <div>
                                    <i className="fas fa-images" style={{ color: "green" }}></i> Image/Video
                                </div>
                                <div>
                                    <i className="fas fa-grin-hearts" style={{ color: "orange" }}></i> Feeling/Activity
                                </div>
                            </div>
                            <div className="d-flex mt-5">
                                <div className="col-6 offset-1 posts" style={{ fontWeight: "bold", marginTop: "5px" }}>
                                    Posts
                                </div>
                                <div className="d-flex col-5 managePosts">
                                    <div className="d-flex col-12">
                                        <div className="col-4 filter">
                                            <i className="fas fa-sliders-h"></i> Filter
                                        </div>
                                        <div className="col-5 filter" style={{ marginLeft: "10px" }}>
                                            <i className="fas fa-cog"></i> Manage posts
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className="d-flex option-view">
                                <div className="col-5 offset-1 view active">
                                    <i className="fas fa-bars"></i> View by list
                                </div>
                                <div className="d-flex col-5 view">
                                    <i className="fas fa-th-large "></i> Grid view
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
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostSubmission);
