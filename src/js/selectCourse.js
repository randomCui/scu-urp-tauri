// const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

import {
  http_head,
  course_select_submit_url,
  course_select_entry_url,
  course_select_search_url,
  course_query_waiting_for_url,
  course_query_waiting_for_result_url
} from "../config/endPoint";

// const {courseList} = require("../../test/自由选课-查询微积分")

export class DesiredCourse {
  constructor(courseObject) {
    // courseObject = courseList.rwRxkZlList[0]
    this.ID = courseObject.id;  // 该课程在教务处的唯一排序号
    this.number = courseObject.kch;  // 课程号
    this.seqNumber = courseObject.kxh;  // 课序号
    this.semester = courseObject.zxjxjhh;  // 执行教学计划号?
    this.name = courseObject.kcm;  // 课程名
    this.teacher = courseObject.skjs;  // 授课教师

    this.campus = courseObject.kkxqm;
    this.building = courseObject.jxlm;
    this.classroom = courseObject.jasm;

    this.weekday = courseObject.skxq;
    this.startSection = courseObject.skjc;
    this.duringSection = courseObject.cxjc;

    this.capacity = courseObject.bkskrl;
    this.remain = courseObject.bkskyl;

    this.score = courseObject.xf;
    this.finalExamineType = courseObject.kslxmc;
    this.courseType = courseObject.kclbmc;
    this.teachFaculty = courseObject.kkxsjc;

    // this.UID = this.ID + '_' + this.subID + '_' + this.semester + '_' + this.name
    this.programPlanNumber = undefined;
    // this.token = undefined;

    this.triedTimes = 0;  // 重试次数
    this.lastSubmitStartTime = undefined;  // 最后提交时间
    this.lastSubmitFinishTime = undefined;  // 最后提交完成时间
    this.firstStartTime = undefined;  // 最初启动时间
    this.lastQueryTimeElapse = 0;

    // 四种状态
    this.status = "queuing";
    // pending (等待响应)
    // suspend (暂停)
    // waiting (等待下一次轮询)
    // submitted (提交成功)
    // success (选课成功)

    this.stopSignal = false;
    this.eventlog = [];

    this.interval = 1000;
    this.timeoutID = null;
  }

  /***************
   * 将该课程提交需要使用的json对象返回
   ***********************
   * dealType: 选课类型 <br>
   * kcIDs: 课程编号 <br>
   * kcms: 课程名 <br>
   * fajhh: 方案计划号(?) <br>
   * sj: (开课)时间 <br>
   * searchtj: 搜索条件 <br>
   * inputcode: 意义不明 <br>
   * tokenValue: 用于选课的token <br>
   *
   * @returns {{kcIds: string, inputcode: string, fajhh, sj: string, searchtj, kclbdm: string, dealType: number, kcms: string, tokenValue}}
   */
  makePost() {
    let make_kcIDs = () => {
      return [this.number, this.seqNumber, this.semester].join("@");
    };
    let make_kcms = () => {
      let convertedString = "";
      for (let char of this.name) {
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
      "searchtj": this.name,  // 搜索条件
      "kclbdm": "",
      "inputcode": ""
      // 'tokenValue': this.token,
    };
  }

  setProgramPlanNumber(programPlanNumber) {
    this.programPlanNumber = programPlanNumber;
  }

  updateStatus(occasion) {
    this.status = occasion;
    switch (occasion) {
      case "queuing":
        this.lastSubmitFinishTime = new Date();
        this.lastQueryTimeElapse = this.lastSubmitFinishTime - this.lastSubmitStartTime || 0;
        break;
      case "pending":
        this.lastSubmitStartTime = new Date();
        this.triedTimes += 1;
        break;
      case "submitted":
    }
  }

  toJSON() {
    return {
      ID: this.ID,
      name: this.name,
      number: this.number,
      seqNumber: this.seqNumber,
      teacher: this.teacher,
      semester: this.semester,
      campus: this.campus,
      building: this.building,
      classroom: this.classroom,
      weekday: this.weekday,
      startSection: this.startSection,
      duringSection: this.duringSection,
      capacity: this.capacity,
      remain: this.remain,
      lastQueryTimeElapse: this.lastQueryTimeElapse,
      status: this.status,
      triedTimes: this.triedTimes,
      eventlog: this.eventlog,
      score: this.score,
      finalExamineType: this.finalExamineType,
      courseType: this.courseType,
      teachFaculty: this.teachFaculty
    };
  }
}
