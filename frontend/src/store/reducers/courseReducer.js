const initialState = {
    arrLessons: [],
    arrCourses: [],
    arrVideos: [],
    isOpenModal: false,
    isOpenEditModal: false,
    isOpenModalLesson: false,
    isOpenEditModalLesson: false,
    courseId: 0,
    lessonId: 0,
};

const courseReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_ALL_COURSES":
            return { ...state, arrCourses: action.payload };
        case "SET_ALL_LESSONS":
            return { ...state, arrLessons: action.payload };
        case "SET_ALL_VIDEOS":
            return { ...state, arrVideos: action.payload };
        case "SET_OPEN_MODAL":
            return { ...state, isOpenModal: action.payload };
        case "SET_OPEN_EDIT_MODAL":
            return { ...state, isOpenEditModal: action.payload };
        case "SET_OPEN_MODAL_LESSON":
            return { ...state, isOpenModalLesson: action.payload };
        case "SET_OPEN_EDIT_MODAL_LESSON":
            return { ...state, isOpenEditModalLesson: action.payload };
        case "SET_COURSE_ID":
            return { ...state, courseId: action.payload };
        case "SET_LESSON_ID":
            return { ...state, lessonId: action.payload };
        default:
            return state;
    }
};

export default courseReducer;