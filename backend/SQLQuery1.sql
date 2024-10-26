CREATE TABLE Users (
  id INT PRIMARY KEY,
  email NVARCHAR(100),
  password NVARCHAR(100),
  fullName NVARCHAR(100),
  address NVARCHAR(200),
  gender BIT,
  phoneNumber NVARCHAR(20),
  img_url NVARCHAR(200),
  role INT
);

CREATE TABLE Courses (
  id INT PRIMARY KEY,
  title NVARCHAR(100),
  description NVARCHAR(200),
  img_url NVARCHAR(200)
);

CREATE TABLE Lessons (
  id INT PRIMARY KEY,
  courseID INT,
  title NVARCHAR(100),
  description NVARCHAR(200),
  orderBy INT,
  FOREIGN KEY (courseID) REFERENCES Courses(id)
);

CREATE TABLE Videos (
  id INT PRIMARY KEY,
  lessonID INT,
  title NVARCHAR(100),
  description NVARCHAR(200),
  video_url NVARCHAR(200),
  duration NVARCHAR(10),
  orderBy INT,
  FOREIGN KEY (lessonID) REFERENCES Lessons(id)
);

CREATE TABLE Enrollments (
  id INT PRIMARY KEY,
  userID INT,
  courseID INT,
  date DATE,
  timeType NVARCHAR(2),
  FOREIGN KEY (userID) REFERENCES Users(id),
  FOREIGN KEY (courseID) REFERENCES Courses(id)
);

CREATE TABLE Progress (
  id INT PRIMARY KEY,
  userID INT,
  courseID INT,
  videoID INT,
  total_time INT,
  completed_time INT,
  completionPercentage INT,
  completed_videos INT,
  total_videos INT,
  FOREIGN KEY (userID) REFERENCES Users(id),
  FOREIGN KEY (courseID) REFERENCES Courses(id),
  FOREIGN KEY (videoID) REFERENCES Videos(id)
);

CREATE TABLE Posts (
  id INT PRIMARY KEY,
  userID INT,
  title NVARCHAR(100),
  content NVARCHAR(MAX),
  img_url NVARCHAR(200),
  date DATE,
  timeType NVARCHAR(2),
  FOREIGN KEY (userID) REFERENCES Users(id)
);

CREATE TABLE Comments (
  id INT PRIMARY KEY,
  postID INT,
  userID INT,
  content NVARCHAR(MAX),
  img_url NVARCHAR(200),
  date DATE,
  timeType NVARCHAR(2),
  FOREIGN KEY (postID) REFERENCES Post(id),
  FOREIGN KEY (userID) REFERENCES Users(id)
);

CREATE TABLE LikePosts (
  id INT PRIMARY KEY,
  userID INT,
  postID INT,
  FOREIGN KEY (userID) REFERENCES Users(id),
  FOREIGN KEY (postID) REFERENCES Post(id)
);
CREATE TABLE LikeComments (
  id INT PRIMARY KEY,
  userID INT,
  commentID INT,
  FOREIGN KEY (userID) REFERENCES Users(id),
  FOREIGN KEY (commentID) REFERENCES Comment(id)
);

INSERT INTO Users (id, email, password, fullName, address, gender, phoneNumber, img_url, role)
VALUES (1, 'admin@gmail.com', '123456', 'ADMIN', '123 Main St', 1, '0123456789', 'http://example.com/john.jpg', 1);

INSERT INTO Users (id, email, password, fullName, address, gender, phoneNumber, img_url, role)
VALUES (2, 'jane@example.com', 'abcdef', 'Jane Doe', '456 Second St', 0, '0987654321', 'http://example.com/jane.jpg', 0);

INSERT INTO Users (id, email, password, fullName, address, gender, phoneNumber, img_url, role)
VALUES (3, 'bob@example.com', 'password123', 'Bob Johnson', '789 Third St', 1, '0123456789', 'http://example.com/bob.jpg', 0);

INSERT INTO Courses (id, title, description, img_url)
VALUES (1, 'Learn HTML', 'Learn the basics of HTML and web design', 'http://example.com/html.jpg');

INSERT INTO Courses (id, title, description, img_url)
VALUES (2, 'Learn CSS', 'Learn the basics of CSS and styling', 'http://example.com/css.jpg');

INSERT INTO Courses (id, title, description, img_url)
VALUES (3, 'Learn JavaScript', 'Learn the basics of JavaScript', 'http://example.com/js.jpg');

INSERT INTO Lessons (id, courseID, title, description, orderBy)
VALUES (1, 1, 'Introduction to HTML', 'This lesson covers the basics of HTML syntax and structure.', 1);

INSERT INTO Lessons (id, courseID, title, description, orderBy)
VALUES (2, 1, 'HTML Tags and Elements', 'This lesson covers the most commonly used HTML tags and elements.', 2);

INSERT INTO Lessons (id, courseID, title, description, orderBy)
VALUES (3, 1, 'HTML Forms', 'This lesson covers how to create HTML forms for user input.', 3);

INSERT INTO Videos (id, lessonID, title, description, video_url, duration, orderBy)
VALUES (1, 1, 'HTML Basics', 'This video covers the basics of HTML syntax and structure.', 'http://example.com/html_basics.mp4', '00:10:00', 1);

INSERT INTO Videos (id, lessonID, title, description, video_url, duration, orderBy)
VALUES (2, 1, 'HTML Elements', 'This video covers the most commonly used HTML tags and elements.', 'http://example.com/html_elements.mp4', '00:15:00', 2);

INSERT INTO Videos (id, lessonID, title, description, video_url, duration, orderBy)
VALUES (3, 1, 'HTML Forms', 'This video covers how to create HTML forms for user input.', 'http://example.com/html_forms.mp4', '00:20:00', 3);

INSERT INTO Enrollments (id, userID, courseID, date, timeType)
VALUES (1, 1, 2, '2022-04-01', 'AM');

INSERT INTO Enrollments (id, userID, courseID, date, timeType)
VALUES (2, 2, 1, '2022-04-02', 'PM');

INSERT INTO Enrollments (id, userID, courseID, date, timeType)
VALUES (3, 1, 3, '2022-04-03', 'AM');

INSERT INTO Enrollments (id, userID, courseID, date, timeType)
VALUES (4, 2, 1, '2022-04-04', 'PM');

INSERT INTO Progress (id, userID, courseID, videoID, total_time, completed_time, completionPercentage, completed_videos, total_videos)
VALUES (1, 1, 2, 1, 600, 300, 50, 1, 3);

INSERT INTO Progress (id, userID, courseID, videoID, total_time, completed_time, completionPercentage, completed_videos, total_videos)
VALUES (2, 2, 1, 2, 900, 450, 50, 1, 3);

INSERT INTO Progress (id, userID, courseID, videoID, total_time, completed_time, completionPercentage, completed_videos, total_videos)
VALUES (3, 1, 3, 3, 1200, 600, 50, 1, 3);

INSERT INTO Progress (id, userID, courseID, videoID, total_time, completed_time, completionPercentage, completed_videos, total_videos)
VALUES (4, 2, 1, 1, 600, 600, 100, 3, 3);

INSERT INTO Posts (id, userID, title, content, img_url, date, timeType)
VALUES (1, 1, 'My first post', 'This is my first post on this website!', 'http://example.com/image1.jpg', '2022-04-01', 'AM');

INSERT INTO Posts (id, userID, title, content, img_url, date, timeType)
VALUES (2, 2, 'My second post', 'This is my second post on this website!', 'http://example.com/image2.jpg', '2022-04-02', 'PM');

INSERT INTO Posts (id, userID, title, content, img_url, date, timeType)
VALUES (3, 1, 'My third post', 'This is my third post on this website!', 'http://example.com/image3.jpg', '2022-04-03', 'AM');

INSERT INTO Comments (id, postID, userID, content, img_url, date, timeType)
VALUES (1, 1, 2, 'Great post, thanks for sharing!', 'http://example.com/avatar1.jpg', '2022-04-01', 'AM');

INSERT INTO Comments (id, postID, userID, content, img_url, date, timeType)
VALUES (2, 2, 1, 'I really enjoyed reading this post.', 'http://example.com/avatar2.jpg', '2022-04-02', 'PM');

INSERT INTO Comments (id, postID, userID, content, img_url, date, timeType)
VALUES (3, 3, 2, 'Thanks for sharing, this was really helpful!', 'http://example.com/avatar3.jpg', '2022-04-03', 'AM');

INSERT INTO LikePosts (id, userID, postID)
VALUES (1, 1, 2);

INSERT INTO LikePosts (id, userID, postID)
VALUES (2, 2, 1);

INSERT INTO LikePosts (id, userID, postID)
VALUES (3, 1, 3);

INSERT INTO LikeComments (id, userID, commentID)
VALUES (1, 1, 2);

INSERT INTO LikeComments (id, userID, commentID)
VALUES (2, 2, 1);

INSERT INTO LikeComments (id, userID, commentID)
VALUES (3, 1, 3);

-- Thêm ràng buộc khóa ngoại và tùy chọn xóa cho bảng Users

ALTER TABLE Enrollments
ADD CONSTRAINT FK_Enrollments_Users
FOREIGN KEY (userID)
REFERENCES Users(id)
ON DELETE CASCADE;

ALTER TABLE Progress
ADD CONSTRAINT FK_Progress_Users
FOREIGN KEY (userID)
REFERENCES Users(id)
ON DELETE CASCADE;

ALTER TABLE Posts
ADD CONSTRAINT FK_Posts_Users
FOREIGN KEY (userID)
REFERENCES Users(id)
ON DELETE CASCADE;

ALTER TABLE Comments
ADD CONSTRAINT FK_Comments_Users
FOREIGN KEY (userID)
REFERENCES Users(id)
ON DELETE CASCADE;

ALTER TABLE LikePosts
ADD CONSTRAINT FK_LikePosts_Users
FOREIGN KEY (userID)
REFERENCES Users(id)
ON DELETE CASCADE;

ALTER TABLE LikeComments
ADD CONSTRAINT FK_LikeComments_Users
FOREIGN KEY (userID)
REFERENCES Users(id)
ON DELETE CASCADE;


-- Thêm ràng buộc khóa ngoại và tùy chọn xóa cho bảng Posts

ALTER TABLE Comments
ADD CONSTRAINT FK_Comments_Posts
FOREIGN KEY (postID)
REFERENCES Posts(id)
ON DELETE CASCADE;

ALTER TABLE LikePosts
ADD CONSTRAINT FK_LikePosts_Posts
FOREIGN KEY (postID)
REFERENCES Posts(id)
ON DELETE CASCADE;


-- Thêm ràng buộc khóa ngoại và tùy chọn xóa cho bảng Comments

ALTER TABLE LikeComments
ADD CONSTRAINT FK_LikeComments_Comments
FOREIGN KEY (commentID)
REFERENCES Comments(id)
ON DELETE CASCADE;

-- Thêm ràng buộc khóa ngoại và tùy chọn xóa cho bảng Courses

ALTER TABLE Enrollments
ADD CONSTRAINT FK_Enrollments_Courses
FOREIGN KEY (courseID)
REFERENCES Courses(id)
ON DELETE CASCADE;

ALTER TABLE Progress
ADD CONSTRAINT FK_Progress_Courses
FOREIGN KEY (courseID)
REFERENCES Courses(id)
ON DELETE CASCADE;

ALTER TABLE Lessons
ADD CONSTRAINT FK_Lessons_Courses
FOREIGN KEY (courseID)
REFERENCES Courses(id)
ON DELETE CASCADE;


-- Thêm ràng buộc khóa ngoại và tùy chọn xóa cho bảng Lessons

ALTER TABLE Videos
ADD CONSTRAINT FK_Videos_Lessons
FOREIGN KEY (lessonID)
REFERENCES Lessons(id)
ON DELETE CASCADE;

-- Thêm ràng buộc khóa ngoại và tùy chọn xóa cho bảng Videos

ALTER TABLE Progress
ADD CONSTRAINT FK_Progress_Videos
FOREIGN KEY (videoID)
REFERENCES Videos(id)
ON DELETE CASCADE;

-- ALTER TABLE "Enrollments"
-- ADD CONSTRAINT "FK_Enrollments_Users"
-- FOREIGN KEY ("userID")
-- REFERENCES "Users" ("id")
-- ON DELETE CASCADE;

-- ALTER TABLE "Progress"
-- ADD CONSTRAINT "FK_Progress_Users"
-- FOREIGN KEY ("userID")
-- REFERENCES "Users" ("id")
-- ON DELETE CASCADE;

-- ALTER TABLE "Posts"
-- ADD CONSTRAINT "FK_Posts_Users"
-- FOREIGN KEY ("userID")
-- REFERENCES "Users" ("id")
-- ON DELETE CASCADE;

-- ALTER TABLE "Comments"
-- ADD CONSTRAINT "FK_Comments_Users"
-- FOREIGN KEY ("userID")
-- REFERENCES "Users" ("id")
-- ON DELETE CASCADE;

-- ALTER TABLE "LikePosts"
-- ADD CONSTRAINT "FK_LikePosts_Users"
-- FOREIGN KEY ("userID")
-- REFERENCES "Users" ("id")
-- ON DELETE CASCADE;

-- ALTER TABLE "LikeComments"
-- ADD CONSTRAINT "FK_LikeComments_Users"
-- FOREIGN KEY ("userID")
-- REFERENCES "Users" ("id")
-- ON DELETE CASCADE;

-- ALTER TABLE "Comments"
-- ADD CONSTRAINT "FK_Comments_Posts"
-- FOREIGN KEY ("postID")
-- REFERENCES "Posts" ("id")
-- ON DELETE CASCADE;

-- ALTER TABLE "LikePosts"
-- ADD CONSTRAINT "FK_LikePosts_Posts"
-- FOREIGN KEY ("postID")
-- REFERENCES "Posts" ("id")
-- ON DELETE CASCADE;

-- ALTER TABLE "LikeComments"
-- ADD CONSTRAINT "FK_LikeComments_Comments"
-- FOREIGN KEY ("commentID")
-- REFERENCES "Comments" ("id")
-- ON DELETE CASCADE;

-- ALTER TABLE "Enrollments"
-- ADD CONSTRAINT "FK_Enrollments_Courses"
-- FOREIGN KEY ("courseID")
-- REFERENCES "Courses" ("id")
-- ON DELETE CASCADE;

-- ALTER TABLE "Progress"
-- ADD CONSTRAINT "FK_Progress_Courses"
-- FOREIGN KEY ("courseID")
-- REFERENCES "Courses" ("id")
-- ON DELETE CASCADE;

-- ALTER TABLE "Lessons"
-- ADD CONSTRAINT "FK_Lessons_Courses"
-- FOREIGN KEY ("courseID")
-- REFERENCES "Courses" ("id")
-- ON DELETE CASCADE;

-- ALTER TABLE "Videos"
-- ADD CONSTRAINT "FK_Videos_Lessons"
-- FOREIGN KEY ("lessonID")
-- REFERENCES "Lessons" ("id")
-- ON DELETE CASCADE;

-- ALTER TABLE "Progress"
-- ADD CONSTRAINT "FK_Progress_Videos"
-- FOREIGN KEY ("videoID")
-- REFERENCES "Videos" ("id")
-- ON DELETE CASCADE;

ALTER TABLE "Progresses"
ADD CONSTRAINT unique_progress UNIQUE ("courseID", "videoID", "userID");