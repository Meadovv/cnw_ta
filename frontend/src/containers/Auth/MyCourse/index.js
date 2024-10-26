import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAllUsersEnrollment } from '../../../services/enrollmentCourse';
import { getAllCourses } from '../../../services/courseService';
import { getProgressOfCourse } from '../../../services/progress';
import { getAllLessons } from '../../../services/lessonService';
import { getAllVideos } from '../../../services/videoService';
import { Link } from 'react-router-dom';
import moment from 'moment';
import './style.scss'
class MyCourses extends Component {
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
        const { listCoursesRegister, isLoading } = this.state
        const courseComplete = listCoursesRegister.filter((course) => {
            return course.percentCompleted === 100
        }).length
        if (this.state.isLoading) {
            return (
                <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div class="spinner"> </div>
                </div>
            )
        }
        return (
            <div style={{ marginTop: "80px" }}>
                <div className="CourseList">
                    <main>
                        <section className="home-cl section-padding">
                            <section className="popular-location section-padding">
                                <div className="container">
                                    <h3 style={{ fontWeight: "800" }}>Khóa học của tôi</h3>
                                    <p>Bạn đã hoàn thành <b>{courseComplete}/{listCoursesRegister.length}</b> khóa học.</p>
                                    <div className="row course-list mt-3">
                                        {listCoursesRegister && listCoursesRegister.map((course, index) => {
                                            return (
                                                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6 mt-4">
                                                    <div className="single-location mb-20">
                                                        <div className="location-img">
                                                            <img src={course.img_url} alt="" />
                                                        </div>

                                                        <div className="location-details">
                                                            {course.percentCompleted ?
                                                                <Link to={`/learn/${course.id}`} onClick={() => window.scrollTo(0, 0)}>
                                                                    <a className="location-btn">Tiếp tục học</a>
                                                                </Link>
                                                                :
                                                                <Link to={`/learn/${course.id}`} onClick={() => window.scrollTo(0, 0)}>
                                                                    <a className="location-btn">Bắt đầu học</a>
                                                                </Link>
                                                            }

                                                        </div>
                                                    </div>
                                                    <h6 style={{ marginTop: "-10px", fontWeight: "700" }}>{course.title}</h6>
                                                    <div style={{ fontSize: "14px" }}>Ngày đăng kí: {moment(`${course.createdAt}`).format('DD/MM/YYYY')}.</div>
                                                    {course.percentCompleted ? <div className="progress-container">
                                                        <progress className="progress-bar" value={course.percentCompleted} max="100" style={{ width: "100%" }}></progress>
                                                        <span className="progress-value"><b>{course.percentCompleted}%</b></span>
                                                    </div> : <div style={{ fontSize: "14px", color: "orange" }}>Bạn chưa học khóa này</div>}
                                                </div>
                                            )
                                        })}
                                        <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6 mt-4">
                                            <div className="single-location mb-20">
                                                <div className="location-img-add">
                                                    <div style={{ height: "250px", background: "white" }}>
                                                        <Link to="/home" onClick={() => window.scrollTo(0, 0)}>
                                                            <a className="stretched-link btn btn-light rounded-circle icon-md pt-5" style={{ justifyContent: "center", display: "flex" }}>
                                                                <i className="bi bi-plus-circle"></i>
                                                            </a>
                                                            <div style={{ justifyContent: "center", display: "flex", marginTop: "90px" }}>
                                                                <button className="add-course-btn">Thêm khóa học</button>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                </div>

                                                <div className="location-details">
                                                    {/* {course.percentCompleted ?
                                                                <Link to={`/learn/${course.id}`}>
                                                                    <a className="location-btn">Tiếp tục học</a>
                                                                </Link>
                                                                :
                                                                <Link to={`/learn/${course.id}`}>
                                                                    <a className="location-btn">Bắt đầu học</a>
                                                                </Link>
                                                            } */}

                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </section>
                        </section>
                    </main>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        userIsLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyCourses);