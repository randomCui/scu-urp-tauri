// export const domain = "http://202.115.47.141:4523/m1/2497359-0-default";
// export const domain = "http://192.168.31.196:4523/m1/2497359-0-default";
export const domain = "http://127.0.0.1:4523/m1/2497359-0-default";
// 教务系统登录入口
export const jwc_entry_url = domain + "/login";
// 教务系统验证码获取
export const jwc_captcha_url = domain + "/img/captcha.jpg";
// 教务系统登录验证
export const jwc_jc = domain + "/j_spring_security_check";
// 教务系统首页
export const jwc_home = domain;
// 教务系统自由选课提交接口
export const course_select_submit_url = domain + "/student/courseSelect/selectCourse/checkInputCodeAndSubmit";
// 教务系统测试提交url
export const test_submit_url = "http://localhost:5000/curriculum/submit";
// 教务系统自由选课搜索api
export const course_select_search_url = domain + "/student/courseSelect/freeCourse/courseList";
// 教务系统选课页面
export const course_select_entry_url = domain + "/student/courseSelect/courseSelect/index";

export const curriculum_query_url = domain + "/student/courseSelect/thisSemesterCurriculum/callback";

export const course_select_result_query_url = domain + "/student/courseSelect/selectResult/query";

export const course_query_waiting_for_url = domain + "/student/courseSelect/selectCourses/waitingfor";

export const course_query_waiting_for_result_url = domain + "/student/courseSelect/selectResult/query";

export const delete_course_entry_url = domain + "/student/courseSelect/quitCourse/index";

export const delete_course_submit_url = domain + "/student/courseSelect/delCourse/deleteOne";

export const http_head = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/14.0.835.163 Safari/535.1";

export const zhjwjs_url = "http://zhjwjs.scu.edu.cn/teacher/personalSenate/giveLessonInfo/thisSemesterClassSchedule/indexPublic";
export const zhjwjs_search_url = "http://zhjwjs.scu.edu.cn/teacher/personalSenate/giveLessonInfo/thisSemesterClassSchedule/getCourseArragementPublic";
