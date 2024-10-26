import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './style.scss'
import { getAllCourses } from '../../../services/courseService';
import { getAllLessons } from '../../../services/lessonService';
import { getAllVideos } from '../../../services/videoService';
import { enrrollmentCourse, getAllUsersEnrollment } from '../../../services/enrollmentCourse';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
class EnrollmentCourse extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: [false],
            course: {},
            lessons: [],
            videosOfLesson: [],
            allVideos: []
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
    sumTimesOfCourse(arr) {
        const totalSeconds = arr.reduce((total, time) => {
            const [minutes, seconds] = time.duration.split(':').map(Number);
            return total + minutes * 60 + seconds;
        }, 0);

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours === 0) {
            return `${minutes} phút`;
        } else {
            return `${hours} giờ ${String(minutes).padStart(2, '0')} phút`;
        }
    }
    componentDidMount() {
        this.fetchData();
    }
    handleEnrollmentCourse = async () => {
        const response = await enrrollmentCourse(this.props.match.params.id, this.userInfo.id);
        console.log(response);
        if (response && response.errCode === 0) {
            toast.success(<div style={{ width: "300px", fontSize: "14px" }}><i className="fas fa-check-circle"></i> Register course success!</div>, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            this.props.history.push(`/learn/${this.props.match.params.id}`);
        } else if (response && response.errCode === 1) {
            toast.info(<div style={{ width: "300px", fontSize: "14px" }}><i className="bi bi-info-circle"></i> You have already register this course!</div>, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

        } else {
            toast.error(<div style={{ width: "300px", fontSize: "14px" }}><FontAwesomeIcon icon={faExclamationTriangle} /> Register course failed!</div>, {
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

    }
    async fetchData() {
        try {
            // const responseOfUserRegister = await getAllUsersEnrollment(this.props.match.params.id)
            // const isRegister = responseOfUserRegister.usersOfRegister.some(item => item?.userID === this.userInfo.id);
            // if (isRegister) {
            //     this.props.history.push(`/learn/${this.props.match.params.id}`);
            // } else {
            const response = await getAllCourses(this.props.match.params.id);
            if (response && response.errCode === 0) {
                this.setState({ course: response.courses });
            }
            const responseOfLesson = await getAllLessons(this.props.match.params.id);
            if (responseOfLesson && responseOfLesson.errCode === 0) {
                const arrLessons = responseOfLesson.lessons.sort((a, b) => a.orderBy - b.orderBy);
                const promises = arrLessons.map(async (lesson) => {
                    const responseVideosOfLesson = await getAllVideos(lesson.id);
                    const sortVideos = responseVideosOfLesson.videos.sort((a, b) => a.orderBy - b.orderBy);
                    const promises = sortVideos.map((video) => {
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
                                video.duration = timeString;
                                return video;
                            });
                    });
                    const videos = await Promise.all(promises);
                    lesson.duration = this.sumTimes(videos);

                    lesson.listVideos = videos;
                    return lesson;
                });
                const lessons = await Promise.all(promises);

                lessons.totalTime = this.sumTimesOfCourse(lessons);
                console.log(lessons);
                const allvideo = lessons.reduce((total, lesson) => {
                    return total + lesson.listVideos.length
                }, 0)
                this.setState({
                    lessons: lessons,
                    allVideos: allvideo
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
    handleClick = (index) => {
        const copyState = [...this.state.isOpen];
        copyState[index] = !copyState[index]
        this.setState({
            isOpen: copyState
        })
    }
    render() {
        const { isOpen, course, lessons, allVideos } = this.state
        return (
            <div className='row course-detail' style={{ width: "100%", marginTop: "56px" }}>
                <div className='col-7 offset-1 pt-5' >
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                    <h5 className='mt-5'>Nội dung khóa học</h5>
                    <div>
                        <span><b>{lessons ? lessons.length : '0'}</b> chương</span>
                        <span><b>{allVideos}</b> bài học</span>
                        <span>thời lượng <b>{lessons.totalTime}</b></span>
                    </div>
                    {lessons && lessons.map((lesson, index) => {
                        return (
                            <div>
                                <div className='course-title-detail mt-3' onClick={() => this.handleClick(index)}>
                                    <div className='row d-flex'>
                                        <div className='col-10 d-flex'>
                                            {isOpen[index] ? <i className="bi bi-dash"></i> : <i className="bi bi-plus"></i>}
                                            <h6 style={{ paddingLeft: "10px", paddingTop: "5px" }}>{index + 1}. {lesson.title}</h6>
                                        </div>
                                        <div className='col-2' style={{ fontSize: "14px" }}>
                                            {lesson.listVideos ? (`${lesson.listVideos.length} bài học`) : "0 bài học"}
                                        </div>
                                    </div>
                                </div>
                                {isOpen[index] && <div className='list-lession-of-course'>
                                    {lesson.listVideos && lesson.listVideos.map((video) => {
                                        return (
                                            <div className='lesson'>
                                                <div className='col-11 d-flex' style={{ paddingLeft: "40px" }}>
                                                    <i className="bi bi-youtube"></i>
                                                    <p style={{ paddingLeft: "10px", paddingTop: "14px" }} className='text-secondary'>{video.title}</p>
                                                </div>
                                                <div className='col-1'>
                                                    {video.duration}
                                                </div>
                                            </div>
                                        )
                                    })}

                                </div>}

                            </div>
                        )
                    })}

                    <h5 style={{ marginTop: "40px" }}>Yêu cầu</h5>
                    <div>
                        <i className="bi bi-check-lg"></i>
                        <span>Máy vi tính kết nối internet (Windows, Ubuntu hoặc MacOS)</span>
                    </div>
                    <div>
                        <i className="bi bi-check-lg"></i>
                        <span>Ý thức tự học cao, trách nhiệm cao, kiên trì bền bỉ không ngại cái khó</span>
                    </div>
                    <div>
                        <i className="bi bi-check-lg"></i>
                        <span>Không được nóng vội, bình tĩnh học, làm bài tập sau mỗi bài học</span>
                    </div>
                    <div>
                        <i className="bi bi-check-lg"></i>
                        <span>Khi học nếu có khúc mắc hãy tham gia hỏi/đáp tại group FB: Học lập trình web (fullstack.edu.vn)</span>
                    </div>
                    <div>
                        <i className="bi bi-check-lg"></i>
                        <span>Bạn không cần biết gì hơn nữa, trong khóa học tôi sẽ chỉ cho bạn những gì bạn cần phải biết</span>
                    </div>
                </div>

                <div className='col-4 p-4'>
                    <iframe width="450" style={{ borderRadius: "10px" }} height="315" src="https://www.youtube.com/embed/0SJE9dYdpps"
                        title="YouTube video player"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen>
                    </iframe>
                    <div style={{ width: "450px" }} className='course-detail-right-body mt-3'>
                        <h2 style={{ color: "#f05123", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "400" }}>Miễn phí</h2>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <button className='enrollment' onClick={this.handleEnrollmentCourse}>ĐĂNG KÝ HỌC</button>
                        </div>
                        <div className='col-6 offset-4 mt-3'>
                            <div><i className="bi bi-water"></i><span>Trình độ cơ bản</span></div>
                            <div><i className="bi bi-film"></i><span>Tổng <b>{allVideos}</b> bài học</span></div>
                            <div><i className="bi bi-clock-fill"></i><span>Thời lượng <b>{lessons.totalTime}</b></span></div>
                            <div><i className="bi bi-film"></i><span> Học mọi lúc mọi nơi</span></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(EnrollmentCourse);
