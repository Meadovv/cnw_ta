export const setAllCourses = (courses) => {
    return {
        type: "SET_ALL_COURSES",
        payload: courses,
    };
};

export const setAllLessons = (lessons) => {
    return {
        type: "SET_ALL_LESSONS",
        payload: lessons,
    };
};
export const setAllVideos = (videos) => {
    return {
        type: "SET_ALL_VIDEOS",
        payload: videos,
    };
};

export const setOpenModal = (isOpen) => {
    return {
        type: "SET_OPEN_MODAL",
        payload: isOpen,
    };
};

export const setOpenEditModal = (isOpen) => {
    return {
        type: "SET_OPEN_EDIT_MODAL",
        payload: isOpen,
    };
};

export const setOpenModalLesson = (isOpen) => {
    return {
        type: "SET_OPEN_MODAL_LESSON",
        payload: isOpen,
    };
};

export const setOpenEditModalLesson = (isOpen) => {
    return {
        type: "SET_OPEN_EDIT_MODAL_LESSON",
        payload: isOpen,
    };
};

export const setCourseId = (id) => {
    return {
        type: "SET_COURSE_ID",
        payload: id,
    };
};
export const setLessonId = (id) => {
    return {
        type: "SET_LESSON_ID",
        payload: id,
    };
};