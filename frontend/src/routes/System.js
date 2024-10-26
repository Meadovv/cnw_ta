import React from 'react';
import { useSelector } from "react-redux";
import { Route, Routes, Navigate, Outlet } from 'react-router-dom';
import UserManage from '../containers/System/Users/UserManage';
import UserProgress from '../containers/System/Users/UserProgress';
import CourseManage from '../containers/System/Courses/CourseManage';
import LessonManage from '../containers/System/Courses/LessonManage';
import VideoManage from '../containers/System/Courses/VideoManage';
import PostManage from '../containers/System/Posts/PostManage';
import CommentManage from '../containers/System/Posts/CommentManage';
import HeaderAdmin from '../containers/Header/HeaderAdmin';
import Sidebar from '../containers/Sidebar';

const System = () => {
    const systemMenuPath = useSelector(state => state.app.systemMenuPath);
    const adminIsLoggedIn = useSelector(state => state.admin.isLoggedIn);

    return (
        <div className="system-container">
            {adminIsLoggedIn && <HeaderAdmin />}
            {adminIsLoggedIn && <Sidebar />}
            <div className="system-list">
                <Routes>
                    <Route path="/" element={<Outlet />}>
                        <Route path="user-manage" element={<UserManage />} />
                        <Route path="user-progress" element={<UserProgress />} />
                        <Route path="course-manage" element={<CourseManage />} />
                        <Route path="lesson-manage" element={<LessonManage />} />
                        <Route path="video-manage" element={<VideoManage />} />
                        <Route path="post-manage" element={<PostManage />} />
                        <Route path="comment-manage" element={<CommentManage />} />
                        {/* Điều hướng về `systemMenuPath` khi không có route phù hợp */}
                        <Route path="*" element={<Navigate to={systemMenuPath} />} />
                    </Route>
                </Routes>
            </div>
        </div>
    );
};

export default System;
