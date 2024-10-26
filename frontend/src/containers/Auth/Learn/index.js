import React, { Component } from 'react';
import { connect } from 'react-redux';
import './style.scss'
import { getAllCourses } from '../../../services/courseService';
import { getAllLessons } from '../../../services/lessonService';
import { getAllVideos } from '../../../services/videoService';
import { getProgressOfCourse, createProgressOfCourse } from '../../../services/progress';
import { Link } from 'react-router-dom';
import moment, { duration } from 'moment';
import YouTube from 'react-youtube';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { ProgressBar } from 'react-bootstrap';
import Scrollbars from "react-custom-scrollbars";
class Learn extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: [false],
            course: {},
            lessons: [],
            allVideos: [],
            videoShow: '',
            videoTitleShow: '',
            videoCreatedAt: '',
            time: 0,
            timerId: null,
            listVideos: [],
            lesssonIndex: 0,
            videoIndexOfLesson: 0,
            videoId: 0,
            numberOfVideoCompleted: 0,
            percentCompletedState: 0
        }
        this.onPlay = this.onPlay.bind(this);
        this.onPause = this.onPause.bind(this);
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
        this.fetchData();
    }
    async fetchData() {
        try {

            const response = await getAllCourses(this.props.match.params.id);
            if (response && response.errCode === 0) {
                this.setState({ course: response.courses });
            }
            const responseOfGetProgress = await getProgressOfCourse(this.userInfo.id, this.props.match.params.id)
            this.setState({
                numberOfVideoCompleted: responseOfGetProgress.progress.length
            })
            const progressCompleted = responseOfGetProgress.progress
            console.log(this.state.numberOfVideoCompleted);
            const responseOfLesson = await getAllLessons(this.props.match.params.id);
            if (responseOfLesson && responseOfLesson.errCode === 0) {
                let arrOfListVideos = [];

                const arrLessons = responseOfLesson.lessons.sort((a, b) => a.orderBy - b.orderBy);
                const promises = arrLessons.map(async (lesson) => {

                    const responseVideosOfLesson = await getAllVideos(lesson.id);
                    const sortVideos = responseVideosOfLesson.videos.sort((a, b) => a.orderBy - b.orderBy);

                    // if (sortVideos.length != 0) {
                    //     arrOfListVideos = arrOfListVideos.concat(sortVideos)
                    // }

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
                                video.duration = timeString; // thời lượng của 1 video
                                arrOfListVideos.push(video)
                                return video;
                            });
                    });

                    const videos = await Promise.all(promises);
                    lesson.duration = this.sumTimes(videos);

                    lesson.listVideos = videos;
                    return lesson;
                });
                const lessons = await Promise.all(promises);
                lessons.totalTime = this.sumTimes(lessons);
                console.log(lessons);

                const listVideoCompleted = arrOfListVideos.filter(itemA => {
                    return progressCompleted.some(itemB => {
                        return itemB.videoID === itemA.id;
                    })
                })
                const timeCompleted = this.sumTimes(listVideoCompleted);

                const percentCompleted = Math.round(this.convertTimeToSeconds(timeCompleted) / this.convertTimeToSeconds(lessons.totalTime) * 100);
                const allvideo = lessons.reduce((total, lesson) => {
                    return total + lesson.listVideos.length
                }, 0)
                // console.log(arrOfListVideos[0].video_url);
                this.setState({
                    percentCompletedState: percentCompleted,
                    lessons: lessons,
                    videoShow: lessons[0].listVideos[0]?.video_url,
                    videoTitleShow: lessons[0].listVideos[0]?.title,
                    videoCreatedAt: lessons[0].listVideos[0]?.createdAt,
                    allVideos: allvideo,
                    listVideos: arrOfListVideos,
                    videoIndexOfLesson: 0,
                    lessonIndex: 0,
                    videoId: arrOfListVideos[0]?.id
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
    handleClick = (index) => {
        const copyState = [...this.state.isOpen];
        copyState[index] = !copyState[index]
        for (let i = 0; i < copyState.length; i++) {
            if (i !== index) {
                copyState[i] = false;
            }
        }
        this.setState({
            isOpen: copyState
        })
    }
    handleShowVideo = (video_url, videoTitle, videoCreatedAt, videoIndex, lessonIndex, videoId) => {
        clearInterval(this.state.timerId);
        this.setState({ timerId: null });
        this.setState({
            videoShow: video_url,
            videoTitleShow: videoTitle,
            videoCreatedAt: videoCreatedAt,
            time: 0,
            lessonIndex: lessonIndex,
            videoIndexOfLesson: videoIndex,
            videoId: videoId
        })
        const isActive = document.querySelector('.list-video_title.active')
        if (isActive) {
            isActive.classList.remove('active');
        }
        const videoTile = document.querySelectorAll('.list-video_title')
        if (videoTile && videoTile[videoIndex]) {
            videoTile[videoIndex].classList.add('active');
        }
    }
    onPlay() {
        console.log('play');
        const timerId = setInterval(() => {
            this.setState({ time: this.state.time + 1 });
        }, 1000);
        this.setState({ timerId });

    }

    onPause() {
        console.log('pause');
        clearInterval(this.state.timerId);
        this.setState({ timerId: null });
    }
    async componentDidUpdate(prevProps, prevState) {
        const { lessonIndex, videoIndexOfLesson, videoId } = this.state;
        var durationOfVideo = 100000;
        if (this.state.lessons[lessonIndex]?.listVideos && this.state.lessons[lessonIndex]?.listVideos[videoIndexOfLesson]?.duration) {
            durationOfVideo = this.convertTimeToSeconds(this.state.lessons[lessonIndex]?.listVideos[videoIndexOfLesson]?.duration)
        }
        const totalTime = this.convertTimeToSeconds(this.state.lessons.totalTime)

        const currentComplete = this.state.time / durationOfVideo * 100
        const completionPercent = Math.round((durationOfVideo / totalTime * 100) * 100)

        console.log(currentComplete, completionPercent);
        if (currentComplete >= 10 && currentComplete < 11) {
            try {
                const response = await createProgressOfCourse(
                    this.props.match.params.id,
                    this.userInfo.id,
                    videoId,
                    completionPercent)
                if (response && response.errCode === 0) {
                    toast.success(<div style={{ width: "300px", fontSize: "14px" }}><i className="fas fa-check-circle"></i> You have finished this video!</div>, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                    const responseOfGetProgress = await getProgressOfCourse(this.userInfo.id, this.props.match.params.id)

                    const listVideoCompleted = this.state.listVideos.filter(itemA => {
                        return responseOfGetProgress.progress.some(itemB => {
                            return itemB.videoID === itemA.id;
                        })
                    })
                    const timeCompleted = this.sumTimes(listVideoCompleted);

                    const percentCompleted = Math.round(this.convertTimeToSeconds(timeCompleted) / this.convertTimeToSeconds(this.state.lessons.totalTime) * 100);
                    this.setState({
                        numberOfVideoCompleted: responseOfGetProgress.progress.length,
                        percentCompletedState: percentCompleted
                    })
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
    render() {
        const { percentCompletedState, isOpen, course, lessons, allVideos, videoShow, videoTitleShow, videoCreatedAt, numberOfVideoCompleted, listVideos } = this.state
        const opts = {
            height: '600',
            width: '100%',
            playerVars: {
                autoplay: 1,
                controls: 1,
            },
        };
        // console.log(lessons);
        const progressBarStyle = {
            transform: `rotate(${(percentCompletedState / 100) * 180}deg)`,
        };
        return (
            <div className='learn'>
                <div className='learn_header d-flex'>
                    <div className='d-flex learn_header-left'>
                        <Link to='/home' onClick={() => window.scrollTo(0, 0)}>
                            <i className="bi bi-chevron-left"></i>
                        </Link>
                        <Link to='/home' onClick={() => window.scrollTo(0, 0)}>
                            <div style={{ marginLeft: "20px" }}>
                                <img src={`${process.env.PUBLIC_URL}/assets/img/logo-symbol.png`} height={30} width={30} />
                            </div>
                        </Link>
                        <h6 style={{ marginLeft: "10px", paddingTop: "4px" }}>{course.title}</h6>
                    </div>
                    <div className='d-flex learn_header-right'>
                        <div className="circle-wrap">
                            <div className="circle">
                                <div className="mask full-1" style={progressBarStyle}>
                                    <div className="fill-1" style={progressBarStyle}></div>
                                </div>
                                <div className="mask half">
                                    <div className="fill-1" style={progressBarStyle}></div>
                                </div>
                                <div className="inside-circle">{percentCompletedState}%</div>
                            </div>
                        </div>
                        <div className='abc'>
                            <div>
                                <i className="bi bi-book-half"></i>
                                <span>{numberOfVideoCompleted}/{allVideos} bài học</span>
                            </div>
                            <div>
                                <i className="bi bi-journal-bookmark"></i>
                                <span>Ghi chú</span>
                            </div>
                            <div>
                                <i className="bi bi-question-circle-fill"></i>
                                <span>Hướng dẫn</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='learn_body d-flex'>
                    <div className='col-9 learn_body-left'>
                        <YouTube videoId={videoShow} opts={opts}
                            onPlay={this.onPlay}
                            onPause={this.onPause} />
                        <div>
                            {this.state.time} seconds
                        </div>
                        <div className='learn_body-footer d-flex'>
                            <div className='learn_body-footer-title'>
                                <h4>{videoTitleShow}</h4>
                                <p style={{ fontSize: "14px" }}>Cập nhật {moment(`${videoCreatedAt}`).format('HH:mm DD/MM/YYYY')}.</p>
                            </div>
                            <div className='learn_body-note'>
                                <button><i className="bi bi-plus"></i> <span>Thêm ghi chú tại đây</span></button>
                            </div>
                        </div>
                    </div>
                    <div className='col-3 learn_body-right'>
                        <Scrollbars style={{ height: "780px" }}>
                            <h6 className='content-lesson'>Nội dung khóa học</h6>
                            {lessons && lessons.map((lesson, index) => {
                                var b = 0;
                                var c = 0;
                                if (index == 0) {
                                    if (lesson.listVideos.length < numberOfVideoCompleted) {
                                        b = lesson.listVideos.length
                                    } else {
                                        b = numberOfVideoCompleted
                                    }
                                } else {
                                    for (var i = 0; i <= index; i++) {
                                        c += lessons[i].listVideos.length;
                                    }
                                    if (c <= numberOfVideoCompleted) {
                                        b = lesson.listVideos.length
                                    } else {
                                        var d = 0;
                                        for (var i = 0; i < index; i++) {
                                            d += lessons[i].listVideos.length
                                        }
                                        if (numberOfVideoCompleted - d > 0) {
                                            b = numberOfVideoCompleted - d
                                        } else {
                                            b = 0
                                        }
                                    }
                                }

                                return (
                                    <div>
                                        <div className='learn_body-right-lesson mt-3'>
                                            <div className='learn_body-right-lesson-title d-flex' onClick={() => this.handleClick(index)}>
                                                <div className='col-11' style={{ lineHeight: "0.8" }}>
                                                    <h6>{index + 1} {lesson.title}</h6>
                                                    <div style={{ fontSize: "13px" }}>{b}/{lesson.listVideos && lesson.listVideos.length} | {lesson.duration}</div>
                                                </div>
                                                <div className='col-1' style={{ marginLeft: "13px" }}>
                                                    {isOpen[index] ? <i className="bi bi-chevron-up"></i> : <i className="bi bi-chevron-down"></i>}
                                                </div>
                                            </div>
                                        </div>
                                        {isOpen[index] && <div className='list-video'>
                                            {lesson.listVideos && lesson.listVideos.map((video, videoIndex) => {
                                                var a = 0;
                                                if (index != 0) {
                                                    for (var i = 0; i < index; i++) {
                                                        a += lessons[i].listVideos.length;
                                                    }
                                                }

                                                if (a + videoIndex + 1 < numberOfVideoCompleted + 1) {
                                                    return (
                                                        <div className='list-video_title d-flex' style={{ lineHeight: "0.8" }}
                                                            onClick={() => this.handleShowVideo(video.video_url, video.title, video.createdAt, videoIndex, index, video.id)}>
                                                            <div className='col-11'>
                                                                <h6>{videoIndex + 1} {video.title}</h6>
                                                                <div>
                                                                    <i class="bi bi-youtube" style={{ color: "red" }}></i> <span>{video.duration}</span>
                                                                </div>
                                                            </div>
                                                            <div className='col-1'>
                                                                <i style={{ color: "green" }} className="bi bi-check-circle-fill"></i>
                                                            </div>
                                                        </div>
                                                    )
                                                } else if (a + videoIndex + 1 == numberOfVideoCompleted + 1) {
                                                    return (
                                                        <div className='list-video_title d-flex' style={{ lineHeight: "0.8" }}
                                                            onClick={() => this.handleShowVideo(video.video_url, video.title, video.createdAt, videoIndex, index, video.id)}>
                                                            <div className='col-12'>
                                                                <h6>{videoIndex + 1} {video.title}</h6>
                                                                <div>
                                                                    <i class="bi bi-youtube" style={{ color: "red" }}></i> <span>{video.duration}</span>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    )
                                                }
                                                else {
                                                    return (
                                                        <div className='list-video_title-not-complete' style={{ lineHeight: "0.8" }}>
                                                            <h6>{videoIndex + 1} {video.title}</h6>
                                                            <div>
                                                                <i className="bi bi-youtube"></i> <span>{video.duration}</span>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            })}
                                        </div>}
                                    </div>
                                )
                            })}

                        </Scrollbars>
                    </div>
                </div>
                <div className='learn_footer'>
                    <div className='lesson_pre'>
                        <i className="bi bi-chevron-left"></i>
                        <span>BÀI TRƯỚC</span>
                    </div>
                    <div className='lesson_next'>
                        <span style={{ marginLeft: "5px" }}>BÀI TIẾP THEO</span>
                        <i className="bi bi-chevron-right"></i>
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

export default connect(mapStateToProps, mapDispatchToProps)(Learn);
