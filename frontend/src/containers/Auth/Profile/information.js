import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './style.scss';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as actions from "../../../store/actions";
import { editUserProfileService, getAllUsers } from '../../../services/userService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const Information = (props) => {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');
    const [updatedUserData, setUpdatedUserData] = useState('');
    const [userInfomation, setUserInformation] = useState('');
    const navigate = useNavigate();
    
    const userData = JSON.parse(localStorage.getItem("persist:user"));
    const userInfo = JSON.parse(userData.userInfo);
    const userID = props.userID;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await getAllUsers(userID);
                if (response && response.errCode === 0) {
                    setUserInformation(response.users);
                    setUpdatedUserData(response.users);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchUserData();
    }, [userID]);

    const openConfirmModal = () => setIsConfirmModalOpen(true);
    const closeConfirmModal = () => setIsConfirmModalOpen(false);

    const handleEditClick = () => setIsEditing(true);

    const handleChangeAvatar = async () => {
        const response = await editUserProfileService(updatedUserData);
        if (response && response.errCode === 0) {
            toast.success("Change avatar successful!", {
                position: "top-center",
                autoClose: 5000,
                theme: "colored",
            });
            props.updateUser(updatedUserData);
            const responseOfUser = await getAllUsers(userID);
            setUserInformation(responseOfUser.users);
            setIsConfirmModalOpen(false);
        } else {
            toast.error("Change avatar failed!", {
                position: "top-center",
                autoClose: 5000,
                theme: "light",
            });
        }
    };

    const handleSaveClick = async () => {
        const result = await editUserProfileService(updatedUserData);
        setMessage(result.message);
        if (result && result.errCode === 0) {
            toast.success("User update successful!", {
                position: "top-center",
                autoClose: 5000,
                theme: "colored",
            });
            props.updateUser(updatedUserData);
            const responseOfUser = await getAllUsers(userID);
            setUserInformation(responseOfUser.users);
            setIsEditing(false);
        } else {
            toast.error("User update failed!", {
                position: "top-center",
                autoClose: 5000,
                theme: "light",
            });
        }
    };

    const handleCancelClick = () => {
        setUpdatedUserData(userInfo);
        setIsEditing(false);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUpdatedUserData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSelectChange = (event) => {
        const { name, value } = event.target;
        setUpdatedUserData(prevState => ({
            ...prevState,
            [name]: value === "true"
        }));
    };

    return (
        <div className="main-profile">
            <div className="profile-main-body">
                <div className="row gutters-sm">
                    <div className="col-md-4 mb-3">
                        <div className="card">
                            {userInfomation && (
                                <div className="card-body">
                                    <div className="d-flex flex-column align-items-center text-center">
                                        <div className='d-flex avatar-profile' style={{ position: "relative" }}>
                                            <img src={userInfomation.img_url} alt="Avatar" className="rounded-circle" width="150" height={150} />
                                            {userInfomation.id === userInfo.id &&
                                                <i onClick={openConfirmModal} className="bi bi-camera-fill"></i>
                                            }
                                        </div>
                                        <Modal isOpen={isConfirmModalOpen} toggle={closeConfirmModal}>
                                            <ModalHeader toggle={closeConfirmModal}>Change image profile</ModalHeader>
                                            <ModalBody>
                                                <input
                                                    className='form-control'
                                                    name='img_url'
                                                    value={updatedUserData?.img_url || ''}
                                                    onChange={handleInputChange}
                                                    placeholder='Enter your image link...'
                                                />
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button color='primary' onClick={handleChangeAvatar}>Save</Button>
                                                <Button color='secondary' onClick={closeConfirmModal}>Cancel</Button>
                                            </ModalFooter>
                                        </Modal>
                                        <div className='mt-3'>
                                            <h4>{userInfomation.fullName}</h4>
                                            <p className="text-secondary mb-1 mt-4">Full Stack Developer</p>
                                            <p className="text-muted font-size-sm">Bay Area, San Francisco, CA</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Các phần còn lại của component */}
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    userInfo: state.user.userInfo
});

const mapDispatchToProps = dispatch => ({
    updateUser: (userInfor) => dispatch(actions.updateUser(userInfor)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Information);
