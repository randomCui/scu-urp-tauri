import config from "@/config/webSessionEssential";
import {
  course_query_waiting_for_result_url,
  course_query_waiting_for_url,
  course_select_entry_url,
  course_select_search_url, course_select_submit_url,
  // course_select_submit_url,
  http_head,
  test_submit_url
} from "@/config/config";

const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));


export class CourseScheduler {
  constructor() {
    this.cookie = config.JSESSIONID;
    this.tokenValue = config.tokenValue;
    this.programPlanNumber = null;
    this.pendingList = [];
  }

  addCourse(DesiredCourseObj) {
    this.pendingList.push(DesiredCourseObj);
    console.log(this.pendingList);
  }

  rmCourse(ID) {
    let index = this.pendingList.findIndex(value => {
      return value.ID === ID;
    });
    this.pendingList.splice(index, 1);
    console.log(this.pendingList);
  }

  async refreshRemain() {
    console.log(config);
    let course_number_set = new Set();
    // 计算课序号集合，减少查询次数
    for (let course of this.pendingList.filter(value => {
      return value.status === "queuing";
    })) {
      course_number_set.add(course.number);
    }
    for (let course_number of course_number_set.values()) {
      await fetch(course_select_search_url, {
        method: "POST",
        headers: {
          "Cookie": config.JSESSIONID,
          "User-Agent": http_head
        },
        body: new URLSearchParams({
          kkxks: "",
          kch: course_number,
          kcm: "",
          skjs: "",
          xq: 0,
          jc: 0,
          kclbdm: ""
        })
      }).then(res => {
        return res.json();
      }).then(async json => {
        for (let course of json["rwRxkZlList"]) {
          console.log(course);
          let matched_course = this.pendingList.find(value => {
            return value.ID === course.id;
          });
          if (!matched_course) {
            continue;
          }
          matched_course.updateStatus("pending");
          console.log("匹配第一个");
          matched_course.remain = course["bkskyl"];
          if (matched_course.remain > 0) {
            matched_course.updateStatus("submitted");
            await this.submitCourse(matched_course);
          } else {
            matched_course.updateStatus("queuing");
          }
        }
      });
    }
  }

  async submitCourse(course) {
    // 先拿到tokenValue和方案计划号
    await fetch(course_select_entry_url, {
      headers: {
        "Cookie": config.JSESSIONID,
        "User-Agent": http_head
      }
    }).then(response => {
      return response.text();
    }).then(text => {
      this.tokenValue = text.match(/id="tokenValue" value="(.*?)"/)[1];
      this.programPlanNumber = text.match(/fajhh=(.*?)'/)[1];
      // console.log(text.match(/fajhh=(.*?)'/))
    });

    // 正式应使用course_select_submit_url
    console.log(this.makePost(course));
    console.log(this.makePost(course).toString());
    await fetch(course_select_submit_url, {
      method: "POST",
      headers: {
        "Cookie": config.JSESSIONID,
        "User-Agent": http_head
      },
      body: new URLSearchParams(this.makePost(course))
    }).then(response => {
      return response.json();
    }).then(json => {
      console.log(json);
      if (json["result"] === "ok") {
        course.updateStatus("success");
        course.eventlog.unshift("已提交 成功 正在查询选课结果");
        this.queryWaitingFor(course);
      } else {
        course.updateStatus("suspend");
        course.eventlog.unshift("已提交 未成功 自动暂停");
      }
    });
  }

  async queryWaitingFor(course) {
    let queryPost = this.makePost(course);
    delete queryPost.tokenValue;
    delete queryPost.inputcode;
    let queryPayload = await fetch(course_query_waiting_for_url, {
      method: "POST",
      headers: {
        "Cookie": config.JSESSIONID,
        "User-Agent": http_head
      },
      body: new URLSearchParams(queryPost)
    }).then(response => {
      return response.text();
    }).then(text => {
      return {
        "kcNum": text.match(/var kcNum = "(.*?)"/)[1],
        "redisKey": text.match(/var redisKey = "(.*?)"/)[1]
      };
    });
    setTimeout(this.queryWaitingForResult.bind(this), 1000, course, queryPayload, 0);
  }

  async queryWaitingForResult(course, payload, retry) {
    if (retry > 10) {
      console.log("可能出现问题");
      course.updateStatus("suspend");
      course.eventlog.push("尝试查询是否选中超时 已自动暂停");
      return;
    }
    let isFinish = false;

    await fetch(course_query_waiting_for_result_url, {
      method: "POST",
      headers: {
        "Cookie": config.JSESSIONID,
        "User-Agent": http_head
      },
      body: new URLSearchParams(payload)
    }).then(response => {
      return response.json();
    }).then(json => {
      if (json["isFinish"] === true) {
        console.log(json["result"]);
        isFinish = true;
        course.eventlog.unshift(json["result"]);
      } else {
        course.eventlog.unshift(`第${retry}次查询无结果`);
      }
    });

    if (isFinish)
      return;

    setTimeout(this.queryWaitingForResult.bind(this), 1000, course, payload, retry + 1);
  }

  get_pending_list() {
    return this.pendingList;
  }

  makePost(course) {
    let make_kcIDs = () => {
      return [course.number, course.seqNumber, course.semester].join("@");
    };
    let make_kcms = () => {
      let convertedString = "";
      for (let char of (course.name + "(" + course.number + "_" + course.seqNumber + ")")) {
        convertedString += char.charCodeAt(0).toString(10) + ",";
      }
      return convertedString;
    };
    return {
      "dealType": 5,
      "kcIds": make_kcIDs(),
      "kcms": make_kcms(),
      "fajhh": this.programPlanNumber,
      "sj": "0_0",
      // 'searchtj': course.name,  // 搜索条件
      "kkxsh": "",
      "kclbdm": "",
      "inputcode": "",
      "tokenValue": this.tokenValue
    };
  }

}
