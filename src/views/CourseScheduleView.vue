<template>
  <el-row align="middle" style="margin-bottom: 10px">
    <el-col :offset="3" :span="4">
      <el-text size="large" tag="b">{{ isQuery ? "轮询中" : "暂停中" }}</el-text>
    </el-col>
    <el-col :span="6">
      <el-button-group>
        <el-button @click="refresh_remains_once" :disabled="isQuery">查询一次</el-button>
        <el-button @click="toggle_refresh">{{ isQuery ? "暂停" : "开始" }}</el-button>
      </el-button-group>
    </el-col>
    <el-col :span="6">
      <el-button :disabled="this.course_select_status !== 0" @click="convert_all_course_to_formal_state()">
        全部转换为正选课程
      </el-button>
      <el-popover
          placement="bottom"
          :width="300"
          trigger="hover"
          content="该课程非正选阶段选中"
          on
      >
        <template #reference>
          <el-icon>
            <Warning/>
          </el-icon>
        </template>
        <el-space direction="vertical" alignment="flex-start">
          <el-text v-if="this.course_select_status=== 1" tag="b" type="danger">
            当前非正选阶段
          </el-text>
          <el-text v-else-if="this.course_select_status=== 2" tag="b" type="danger">
            当前未登录
          </el-text>
          <el-text type="warning">
            非正选搜索只能代表学校开设了此课程
          </el-text>
          <el-text type="warning">
            并不一定代表你能够在正选中选择此课
          </el-text>
          <el-text>
            保险起见,需要在正选中重新检索
          </el-text>
          <el-text>
            确定能够选中后才能抢课
          </el-text>
        </el-space>
      </el-popover>
    </el-col>
  </el-row>
  <el-row align="middle" :gutter=20 style="margin-bottom: 20px">
    <el-col :span="8">
      <el-input
          readonly="readonly"
          v-model="startTimeStr"
          placeholder="本轮开始时间">
        <template #prepend>本轮开始时间</template>
      </el-input>
    </el-col>
    <el-col :span="8">
      <el-input readonly="readonly" v-model="lastQueryTimeConsume">
        <template #prepend>上次轮询用时</template>
        <template #append> ms</template>
      </el-input>
    </el-col>
    <el-col :span="8">
      <el-input
          v-model="interval"
          type="number"
          step="500"
          max="100000"
          min="1000"
          placeholder="轮询时间">
        <template #prepend>轮询时间</template>
        <template #append>ms</template>
      </el-input>
    </el-col>
  </el-row>
  <el-card
      class="lesson-card"
      v-bind:key="course.ID"
      v-for="course in course_list"
      body-style="padding: 0 20px"
      style="margin-bottom: 5px"
  >
    <el-collapse>
      <el-collapse-item>
        <template #title>
          <el-space spacer="|">
            <el-text tag="b" style="width: 10em" truncated>
              {{ course.name }}
            </el-text>
            <el-text>
              {{ course.number }}-{{ course.seqNumber }}
            </el-text>
            <el-text style="min-width:4em; max-width: 7em" type="primary" truncated>
              {{ course.teacher }}
            </el-text>
            <el-text style="min-width: 3em" :type="course.remain>0?'success':course.remain===0? 'warning' : 'danger'">
              {{ course.remain + "/" + course.capacity }}
            </el-text>
            <el-text v-if="canDoSubmit(course.ID)" type="info">
              {{ `已尝试${course.triedTimes}次` }}
            </el-text>
            <el-text v-if="canDoSubmit(course.ID)" type="primary">
              {{ `状态:${course.status}` }}
            </el-text>
            <el-popover
                placement="right"
                :width="200"
                trigger="hover"
                content="该课程非正选阶段选中"
            >
              <template #reference>
                <el-text v-if="!canDoSubmit(course.ID)">
                  <el-icon>
                    <Warning/>
                  </el-icon>
                  无法抢课
                </el-text>
              </template>
              <el-space direction="vertical" alignment="flex-start">
                <el-text type="warning">
                  该课程非正选阶段选择
                </el-text>
                <el-text type="warning">
                  无法加入选课列表
                </el-text>
                <el-button :disabled="course_select_status !== 0" @click="convert_course_to_official_state(course.ID)">
                  转换为正选课程
                </el-button>
              </el-space>
            </el-popover>


            <!--            <el-icon class="header-icon">-->
            <!--            <info-filled />-->
            <!--            </el-icon>-->
          </el-space>
        </template>
        <el-descriptions :column="3" border>
          <el-descriptions-item
              label="课程号"
              label-align="right"
              align="center"
              label-class-name="my-label"
              class-name="my-content"
          >{{ course.number }}
          </el-descriptions-item>
          <el-descriptions-item
              label="授课教师"
              label-align="right"
              align="center"
          >{{ course.teacher }}
          </el-descriptions-item>
          <el-descriptions-item
              label="学分"
              label-align="right"
              align="center"
          >{{ course.score }}
          </el-descriptions-item>
          <el-descriptions-item
              label="校区"
              label-align="right"
              align="center"
          >{{ course.campus }}
          </el-descriptions-item>
          <el-descriptions-item
              label="教室"
              label-align="right"
              align="center">
            {{ course.building + " " + course.classroom }}
          </el-descriptions-item>
          <el-descriptions-item
              label="上课时间"
              label-align="right"
              align="center">
            {{
              "星期" + integer_to_zh_cn[course.weekday] + "  " + course.startSection + "-" + (Number.parseInt(course.startSection) + Number.parseInt(course.duringSection))
            }}
          </el-descriptions-item>
          <el-descriptions-item
              label="学生数"
              label-align="right"
              align="center"
          > {{ course.capacity - course.remain }}
          </el-descriptions-item>
          <el-descriptions-item
              label="课容量"
              label-align="right"
              align="center"
          > {{ course.capacity }}
          </el-descriptions-item>
          <el-descriptions-item
              label="课程类别"
              label-align="right"
              align="center"
          > {{ course.courseType }}
          </el-descriptions-item>
          <el-descriptions-item
              label="期末"
              label-align="right"
              align="center"
          > {{ course.finalExamineType }}
          </el-descriptions-item>
          <el-descriptions-item
              label="开设学院"
              label-align="right"
              align="center"
          > {{ course.teachFaculty }}
          </el-descriptions-item>
          <el-descriptions-item
              label="备注"
              label-align="right"
              align="center"
          >
          </el-descriptions-item>
          <el-descriptions-item
              label="操作日志"
              label-align="right"
              align="center"
          >
            <el-scrollbar max-height="3em">
              <div v-for="log in course.eventlog" :key="log">{{ log }}</div>
            </el-scrollbar>
          </el-descriptions-item>
        </el-descriptions>
        <el-button @click="remove_course_from_list(course.ID)">移出抢课</el-button>
      </el-collapse-item>
    </el-collapse>
  </el-card>
  <!--  <ul>-->
  <!--    <li v-for="course in course_list" :key="course.ID">-->
  <!--      <div>-->
  <!--        <div>-->
  <!--          <h3>{{ course.name }}</h3>-->
  <!--          <p>{{ course.number }}-{{ course.seqNumber }}</p>-->
  <!--          <p>{{ course.teacher }}</p>-->
  <!--        </div>-->
  <!--        <div>-->
  <!--          <br>-->
  <!--          <p>{{ course.building + " " + course.classroom }}</p>-->
  <!--          <p>-->
  <!--            {{ "星期" + course.weekday + "  " + course.startSection + "到" + (Number.parseInt(course.startSection) + Number.parseInt(course.duringSection)) + "节"-->
  <!--            }}</p>-->
  <!--        </div>-->
  <!--        <div>-->
  <!--          <br>-->
  <!--          <p>总容量: {{ course.capacity }}</p>-->
  <!--          <p>课余量: {{ course.remain }}</p>-->
  <!--        </div>-->
  <!--        <div>-->
  <!--          <br>-->
  <!--          <p>上次轮询用时: {{ course.lastQueryTimeElapse }}ms</p>-->
  <!--          <p>状态: {{ course.status }}</p>-->
  <!--          <p>重试次数: {{ course.triedTimes }}</p>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--      <div class="log">-->
  <!--        <div v-for="log in course.eventlog" :key="log">{{ log }}</div>-->
  <!--      </div>-->
  <!--    </li>-->
  <!--  </ul>-->
</template>

<script>
import {
  Warning,
} from "@element-plus/icons-vue";
import {useCourseStore} from "../store/courseStore.js";
import CourseQuery from "../js/queryCourse.js";
import {isFormalSelectionTime} from "../js/urpLogin.js";

export default {
  name: "CourseScheduleView",
  components: {
    Warning
  },
  data() {
    return {
      isQuery: false,
      queryIntervalSeq: undefined,
      interval: 1000,
      startTime: undefined,
      lastQueryStartTime: undefined,
      lastQuerySuccessTime: undefined,
      lastQueryTimeConsume: undefined,
      course_list: [],
      startTimeStr: undefined,
      integer_to_zh_cn: {
        0: "日",
        1: "一",
        2: "二",
        3: "三",
        4: "四",
        5: "五",
        6: "六",
        7: "日",
      },
      Warning: Warning,
      course_select_status: 0,
      query_worker: new CourseQuery()
    };
  },
  mounted() {
    this.refresh_pending_list();
    this.refresh_course_select_status();
  },
  methods: {
    refresh_remains_once() {
      this.isQuery = true;
      // window.ipc.invoke("refresh_remains").then(() => {
      //   this.isQuery = false;
      // });
    },
    toggle_refresh() {
      if (!this.isQuery) {
        this.isQuery = true;
        this.trigger_refresh_once();
      } else {
        this.isQuery = false;
        clearTimeout(this.queryIntervalSeq);
      }
    },
    async trigger_refresh_once() {
      this.startTime = new Date();
      this.startTimeStr = `${this.startTime.getHours()}:${this.startTime.getMinutes()}:${this.startTime.getSeconds()}`;
      this.refresh_pending_list();
      this.lastQueryStartTime = new Date().getTime();
      // Promise.allSettled();
      // await window.ipc.invoke("refresh_remains").then(() => {
      //   this.lastQuerySuccessTime = new Date().getTime();
      //   this.lastQueryTimeConsume =  this.lastQuerySuccessTime-this.lastQueryStartTime;
      // });
      this.queryIntervalSeq = setTimeout(async () => {
        await this.trigger_refresh_once();
        if (!this.isQuery) {
          return;
        }
      }, this.interval);
    },
    refresh_pending_list() {
      const ss = useCourseStore()
      this.course_list = ss.scheduleListAll;
      console.log(this.course_list);
    },
    canDoSubmit(course_ID) {
      /* 判断课程是否正选加入 */
      return !course_ID.includes("-")
    },
    async refresh_course_select_status() {
      isFormalSelectionTime().then(res =>{
        this.course_select_status = res.status;
      })
      // window.ipc.invoke("is_official_course_selection_time").then(res=>{
      //   res = JSON.parse(res)
      //   this.course_select_status = res.status;
      //   return res.status
      // });

    },
    remove_course_from_list(uid) {
      const ss = useCourseStore()
      ss.removeCourseFromSchedule(uid);
      this.course_list = ss.scheduleListAll;
    },
    convert_course_to_official_state(uid) {
      const ss = useCourseStore()
      let match = ss.getCourseByUID(uid);
      this.query_worker.searchCourse({
        name: match.name || "",
        teacher: match.teacher || "",
        number: match.number || "",
      }).then(
          courseList => {
            ss.removeCourseFromSchedule(uid);
            ss.addCourseToSchedule(courseList[0])
          }
      )
    },
    convert_all_course_to_formal_state() {
      const ss = useCourseStore();
      for (let course of ss.scheduleListAll) {
        if (this.canDoSubmit(course.ID)) {
          continue;
        }
        this.convert_course_to_official_state(course.ID);
      }
    }
  },
  computed: {}
};
</script>

<script setup>
const store = useCourseStore();
</script>

<style scoped>
ul {
  list-style-type: disclosure-open;
  margin-bottom: 5em;
}

li > div {
  display: flex;
  flex-direction: row;
  list-style-type: square;
  justify-content: space-around;
}

li > div.log {
  display: flex;
  flex-direction: column;
  max-height: 6em;
  overflow-y: scroll;
}

li > div > div {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

</style>
