import {
  course_select_search_url,
  http_head,
  zhjwjs_search_url,
  zhjwjs_url
} from "@/config/config";

const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
import { DesiredCourse } from "@/js/selectCourse";
import config from "@/config/webSessionEssential";

export default class CourseQuery {
  constructor() {
    this.cachedCourse = [];
  }

  async searchCourse(filter) {
    return await fetch(course_select_search_url, {
      headers: {
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cookie": config.JSESSIONID,
        "User-Agent": http_head
      },
      method: "POST",
      body: new URLSearchParams({
        kkxks: "",
        kch: filter.number || "",
        kcm: filter.name || "",
        skjs: filter.teacher || "",
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
      this.cachedCourse = course_list;
      return course_list;
    });
  }

  async searchCourseAlt(filter) {
    let cookie;
    let zxjxjhh = await fetch(zhjwjs_url).then(response => {
      cookie = response.headers.get("set-cookie").split(";")[0];
      return response.text();
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
      body: new URLSearchParams({
        zxjxjhh: zxjxjhh,
        kch: filter.number || "",
        kcm: filter.name || "",
        js: filter.teacher || "",
        kkxs: "",
        skxq: "",
        xq: "",
        jxl: "",
        jas: "",
        pageNum: 1,
        pageSize: 500,
        kclb: ""
      })
    }).then(res => {
      return res.json();
    }).then(json => {
      console.log(json);
      let course_list = [];
      for (let course of json.list.records) {
        course['bkskyl'] = course['bkskrl']-course['xss']
        course_list.push(new DesiredCourse(course));
      }
      this.cachedCourse = course_list;
      return course_list;
    });
  }
  async getCourseWithoutCache(course_info){
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
