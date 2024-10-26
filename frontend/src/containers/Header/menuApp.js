export const adminMenu = [
    { //hệ thống
        name: 'menu.admin.user',
        menus: [
            { name: 'menu.admin.manage-user.user', link: '/system/user-manage' },
            { name: 'menu.admin.manage-user.progress', link: '/system/user-progress' }
        ]
    },
    { //hệ thống
        name: 'menu.admin.course',
        menus: [
            { name: 'menu.admin.manage-course.course', link: '/system/course-manage' },
            { name: 'menu.admin.manage-course.lesson', link: '/system/lesson-manage' },
            { name: 'menu.admin.manage-course.video', link: '/system/video-manage' }
        ]
    },
    { //hệ thống
        name: 'menu.admin.post',
        menus: [
            { name: 'menu.admin.manage-post.post', link: '/system/post-manage' },
            { name: 'menu.admin.manage-post.comment', link: '/system/comment-manage' },
        ]
    }
];

export const userMenu = [
    { //hệ thống
        name: 'menu.admin.user',
        menus: [
            { name: 'menu.admin.manage-user.user', link: '/system/user-manage' },
            { name: 'menu.admin.manage-user.progress', link: '/system/product-manage' }
        ]
    },
    { //hệ thống
        name: 'menu.admin.course',
        menus: [
            { name: 'menu.admin.manage-course.course', link: '' },
            { name: 'menu.admin.manage-course.lesson', link: '' },
            { name: 'menu.admin.manage-course.video', link: '' }
        ]
    },
    { //hệ thống
        name: 'menu.admin.post',
        menus: [
            { name: 'menu.admin.manage-post.post', link: '' },
            { name: 'menu.admin.manage-post.comment', link: '' },
        ]
    }
];