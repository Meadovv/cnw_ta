import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from "../../store/actions";
import { Link } from 'react-router-dom';

// import { AppBar, Toolbar, Typography } from '@mui/material';

import './D_header_user.scss';
import { getAllUsersEnrollment } from '../../services/enrollmentCourse';
import { getAllCourses } from '../../services/courseService';
import { getProgressOfCourse } from '../../services/progress';
import { getAllLessons } from '../../services/lessonService';
import { getAllVideos } from '../../services/videoService';
import moment from 'moment';
class userHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listCourses: [],
            listCoursesRegister: [],
            isLoading: true
        }
    }
    userData = JSON.parse(localStorage.getItem("persist:user"));
    userInfo = JSON.parse(this.userData.userInfo);
    sumTimes(arr) {
        const totalSeconds = arr.reduce((total, time) => {
            const [minutes, seconds] = time.duration.split(':').map(Number);
            return total + minutes * 60 + seconds;
        }, 0);

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours === 0) {
            return `${minutes}:${String(seconds).padStart(2, '0')}`;
        } else {
            return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    }
    convertTimeToSeconds(timeString) {
        const timeArray = timeString?.split(':').reverse();
        let seconds = 0;
        for (let i = 0; i < timeArray?.length; i++) {
            seconds += parseInt(timeArray[i], 10) * Math.pow(60, i);
        }
        return seconds;
    }
    componentDidMount() {
        this.fetchDataOfCourse();
    }
    async fetchDataOfCourse() {
        try {
            const response = await getAllCourses('ALL');
            // if (response && response.errCode === 0) {
            //     this.setState({ listCourses: response.courses });
            // }
            const arrListCourses = response.courses
            for (let i = 0; i < response.courses.length; i++) {
                let arrListVideos = []
                const responseOfEnroll = await getAllUsersEnrollment(response.courses[i].id);
                const userEnroll = responseOfEnroll.usersOfRegister;
                const userIsRegister = userEnroll.some(item => item?.userID === this.userInfo.id)
                arrListCourses[i].isRegister = userIsRegister

                const responseOfGetProgress = await getProgressOfCourse(this.userInfo.id, response.courses[i].id)
                const progressCompleted = responseOfGetProgress.progress
                // this.setState({
                //     numberOfVideoCompleted: responseOfGetProgress.progress.length
                // })

                const responseOfLesson = await getAllLessons(response.courses[i].id);
                if (responseOfLesson && responseOfLesson.errCode === 0) {
                    const arrLessons = responseOfLesson.lessons
                    const promises = arrLessons.map(async (lesson) => {
                        const responseVideosOfLesson = await getAllVideos(lesson.id);
                        const arrVideos = responseVideosOfLesson.videos;

                        const promises = arrVideos.map((video) => {
                            const videoId = video.video_url;
                            const apiKey = process.env.REACT_APP_API_Key_Youtube;
                            const url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${apiKey}`;
                            return fetch(url)
                                .then(response => response.json())
                                .then(data => {
                                    const duration = data.items[0].contentDetails.duration;
                                    const timeRegex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
                                    const match = duration.match(timeRegex);
                                    let timeString = '';

                                    if (match) {
                                        const hours = parseInt(match[1]) || 0;
                                        const minutes = parseInt(match[2]) || 0;
                                        const seconds = parseInt(match[3]) || 0;
                                        if (hours > 0) {
                                            timeString += hours.toString().padStart(2, '0') + ':';
                                        }
                                        timeString += minutes.toString().padStart(2, '0') + ':';
                                        timeString += seconds.toString().padStart(2, '0');
                                    }
                                    video.duration = timeString; // thời lượng của 1 video
                                    arrListVideos.push(video)
                                    return video;
                                });
                        });
                        const videos = await Promise.all(promises);
                        lesson.duration = this.sumTimes(videos);
                        return lesson;
                    })
                    const lessons = await Promise.all(promises);
                    const totalTime = this.sumTimes(lessons);
                    const listVideoCompleted = arrListVideos.filter(itemA => {
                        return progressCompleted.some(itemB => {
                            return itemB.videoID === itemA.id;
                        })
                    })
                    // console.log(listVideoCompleted);
                    const timeCompleted = this.sumTimes(listVideoCompleted);

                    const percentCompleted = Math.round(this.convertTimeToSeconds(timeCompleted) / this.convertTimeToSeconds(totalTime) * 100);

                    arrListCourses[i].percentCompleted = percentCompleted

                }
                arrListCourses[i].listVideos = arrListVideos
            }
            const arrListCourseRegister = arrListCourses.filter((course) => {
                return course.isRegister === true
            })
            this.setState({
                listCoursesRegister: arrListCourseRegister,
                isLoading: false
            })
        } catch (error) {
            console.log(error);
        }
    }
    render() {
        const { processLogout, userInfo } = this.props;
        const { listCoursesRegister } = this.state;
        console.log(listCoursesRegister);
        return (
            <div className="headerUser">
                <div id="headerUser-left">
                    <Link to="/home">
                        <div id="headerUser-left-logo">
                            <img src={`${process.env.PUBLIC_URL}/assets/img/logo-symbol.png`} alt='avatar' style={{ height: "40px", borderRadius: "50%" }} />
                            <div id='headerUser-left-logo-p'>
                                CodeCrush
                            </div>
                        </div>
                    </Link>
                </div>

                <div id="headerUser-center">
                    <ul id="headerUser-nav">
                        <Link to="/home" onClick={() => window.scrollTo(0, 0)}>
                            <li ><a >HOME</a></li>
                        </Link>
                        <Link to='/blog' onClick={() => window.scrollTo(0, 0)}>
                            <li ><a >BLOG</a></li>
                        </Link>
                        <Link to='/aboutus'>
                            <li><a >ABOUT US</a></li>
                        </Link>
                    </ul>
                </div>

                <div id='headerUser-right'>
                    <ul id='headerUser-right-nav'>
                        {this.userData.isLoggedIn ? <div>
                            <div className="dropdown">
                                {/* style={{ fontSize: "13px", fontWeight: "600",color: "#ff652f"  }} */}
                                {/* background: linear-gradient(83.84deg, #0088FF -6.87%, #A033FF 26.54%, #FF5C87 58.58%);
                                background-clip: text;color: "#ff652f"
                                color: transparent; */}
                                <div style={{fontSize: "13px", fontWeight: "600", color: "#ff652f"}} className="btn-myCourse-header btn btn-secondary-soft-hover py-1 px-2" id="cardFeedAction" data-bs-toggle="dropdown" aria-expanded="false">
                                    Khóa học của tôi
                                </div>

                                <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardFeedAction" style={{ width: "400px" }}>
                                    <div className='dropdown-item d-flex' style={{ justifyContent: "space-between" }}>
                                        <div style={{ fontWeight: "bold", color: "black" }}>Khóa học của tôi</div>
                                        <Link to="/mycourses" onClick={() => window.scrollTo(0, 0)}>
                                            <div style={{ fontSize: "12px", color: "orange", cursor: "pointer" }}>Xem tất cả</div>
                                        </Link>
                                    </div>
                                    <div><hr className="dropdown-divider" /></div>
                                    {listCoursesRegister && listCoursesRegister.map((course) => {
                                        return (
                                            <Link to={`/learn/${course.id}`} onClick={() => window.scrollTo(0, 0)}>
                                                <div className="dropdown-item">
                                                    <div className='d-flex course-item'>
                                                        <img src={course.img_url} width={110} height={60} style={{ borderRadius: "5px" }} />
                                                        <div style={{ marginLeft: "10px" }}>
                                                            <div style={{ fontSize: "15px", color: "black", fontWeight: "600" }}> {course.title}</div>
                                                            <div style={{ fontSize: "14px", marginTop: "3px" }}>Ngày đăng kí: {moment(`${course.createdAt}`).format('DD/MM/YYYY')}.</div>
                                                            {course.percentCompleted ? <div className="progress-container">
                                                                <progress className="progress-bar" value={course.percentCompleted} max="100"></progress>
                                                                <span className="progress-value">{course.percentCompleted}%</span>
                                                            </div> : <div style={{ fontSize: "14px", color: "orange" }}>Bạn chưa học khóa này</div>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        )
                                    })}
                                    {this.state.isLoading &&
                                        <div style={{ justifyContent: "center", display: "flex" }}>
                                            <div className="spinner"></div>
                                        </div>
                                    }
                                </div>
                            </div>
                            <li>
                                <div className="dropdown">
                                    <a className="text-secondary btn btn-secondary-soft-hover py-1 px-2" id="cardFeedAction" data-bs-toggle="dropdown" aria-expanded="false">
                                        <img className="headerUser-right-avt rounded-circle" src={userInfo?.img_url} alt='avatar' width={40} height={40} />
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="cardFeedAction">
                                        <Link to={`/profile/${this.userInfo?.id}`} onClick={() => window.scrollTo(0, 0)}>
                                            <li><div className="dropdown-item d-flex">
                                                <div>
                                                    <img className="headerUser-right-avt rounded-circle" src={userInfo?.img_url} alt='avatar' width={40} height={40} />
                                                </div>
                                                <div style={{ marginLeft: "10px" }}>
                                                    <div style={{ fontWeight: "500" }}>
                                                        {userInfo?.fullName}
                                                    </div>
                                                    <div style={{ fontSize: "12px", fontWeight: "300" }}>{userInfo?.email}</div>
                                                </div>
                                            </div>
                                            </li>
                                        </Link>

                                        <div style={{ marginTop: "25px" }}>
                                            <Link to={`/profile/${this.userInfo?.id}`} onClick={() => window.scrollTo(0, 0)}>
                                                <a className="dropdown-item" style={{ height: "40px", borderBottom: "1px solid rgb(213, 219, 225)", paddingTop: "10px", borderTop: "1px solid rgb(213, 219, 225)" }}> Trang cá nhân</a>
                                            </Link>
                                        </div>
                                        <div>
                                            <Link to="/changepassword">
                                                <a className="dropdown-item" style={{ height: "40px", borderBottom: "1px solid rgb(213, 219, 225)", paddingTop: "10px" }}> Thay đổi mật khẩu</a>
                                            </Link>
                                        </div>
                                        <div>
                                            <Link to="/login">
                                                <a className="dropdown-item" onClick={processLogout} style={{ cursor: "pointer", height: "40px", paddingTop: "10px" }}> Đăng xuất</a>
                                            </Link>
                                        </div>

                                    </ul>
                                </div>
                            </li>
                        </div> :
                            <div>
                                <Link to="/login">
                                    <div>Login</div>
                                </Link>
                            </div>
                        }
                    </ul>
                </div >
            </div >

        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(userHeader);
