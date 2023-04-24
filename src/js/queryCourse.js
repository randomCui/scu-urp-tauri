import {
    course_select_search_url,
    http_head,
    zhjwjs_search_url,
    zhjwjs_url
} from "../config/endPoint";

// const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
import {fetch, Body, ResponseType} from "@tauri-apps/api/http";
import {DesiredCourse} from "./selectCourse";
import config from "../config/webSessionEssential";

export default class CourseQuery {
    constructor() {
        this.cachedCourse = [];
    }

    async searchCourse(filter) {
        console.log(filter)
        return fetch(course_select_search_url, {
            headers: {
                "Accept-Language": "zh-CN,zh;q=0.9",
                "Cookie": config.JSESSIONID|| "",
                "User-Agent": http_head || ""
            },
            method: "POST",
            body: Body.form({
                kkxks: "",
                kch: filter.number.toString() || "",
                kcm: filter.name.toString() || "",
                skjs: filter.teacher.toString() || "",
                xq: "0",
                jc: "0",
                kclbdm: ""
            })
        }).then(res => {
            let json = res.data;
            console.log(json);
            let course_list = [];
            for (let course of json.rwRxkZlList) {
                course_list.push(new DesiredCourse(course));
            }
            this.cachedCourse = course_list;
            return course_list;
        });
    }

    async searchCourseAlt(filter) {
        let cookie;
        let zxjxjhh = await fetch(zhjwjs_url,{
            timeout: 5,
            responseType: ResponseType.Text,
        }).then(response => {
            console.log(response.headers);
            cookie = response.headers["set-cookie"].split(";")[0];
            return response.data
        }).then(text => {
            // console.log(text.match(/<option value="(.*?)"/)[1])
            return text.match(/<option value="(.*?)"/)[1];
        });
        return await fetch(zhjwjs_search_url, {
            headers: {
                "Accept-Language": "zh-CN,zh;q=0.9",
                "Cookie": cookie,
                "User-Agent": http_head
            },
            method: "POST",
            body: Body.form({
                zxjxjhh: zxjxjhh,
                kch: filter.number || "",
                kcm: filter.name || "",
                js: filter.teacher || "",
                kkxs: "",
                skxq: "",
                xq: "",
                jxl: "",
                jas: "",
                pageNum: "1",
                pageSize: "500",
                kclb: ""
            })
        }).then(res => {
            let json = res.data;
            console.log(json);
            let course_list = [];
            for (let course of json.list.records) {
                course['bkskyl'] = course['bkskrl'] - course['xss']
                course_list.push(new DesiredCourse(course));
            }
            this.cachedCourse = course_list;
            return course_list;
        });
    }

    async getCourseWithoutCache(course_info) {
        return await fetch(course_select_search_url, {
            headers: {
                "Accept-Language": "zh-CN,zh;q=0.9",
                "Cookie": config.JSESSIONID,
                "User-Agent": http_head
            },
            method: "POST",
            body: new URLSearchParams({
                kkxks: "",
                kch: course_info.number,
                kcm: course_info.name,
                skjs: course_info.teacher,
                xq: 0,
                jc: 0,
                kclbdm: ""
            })
        }).then(res => {
            return res.json();
        }).then(json => {
            console.log(json);
            let course_list = [];
            for (let course of json.rwRxkZlList) {
                course_list.push(new DesiredCourse(course));
            }
            return course_list.find(value => {
                return value.seqNumber === course_list.seqNumber;
            })
        });
    }

    getCachedCourse() {
        return this.cachedCourse;
    }

    getDesiredCourseByID(ID) {
        return this.cachedCourse.find((value) => {
            return value.ID === ID;
        });
    }

}
