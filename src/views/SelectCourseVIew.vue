<template>
  <el-card
      body-style="padding: 10px 20px 0"
  >
    <template #header>
      <div style="display:flex; justify-content: space-between; align-items: center">
        <span>搜索课程</span>
        <el-radio-group size="small" v-model="search_mode" style="justify-self: end">
          <el-radio-button label="简单搜索"/>
          <el-radio-button label="复杂搜索"/>
          <el-radio-button label="隐藏"/>
        </el-radio-group>
      </div>
    </template>
    <el-form
        v-model="search_filter"
        v-if="search_mode === '复杂搜索'"
        label-position="left"
        label-width="5em"
        v-loading="isLoading"
    >
      <el-row justify="space-around">
        <el-col :span="12">
          <el-form-item label="课程名">
            <el-input v-model="search_filter.name"/>
          </el-form-item>
          <el-form-item label="课程号">
            <el-input v-model="search_filter.number"/>
          </el-form-item>
          <el-form-item label="授课教师">
            <el-input v-model="search_filter.teacher"/>
          </el-form-item>
        </el-col>
        <el-col style="display: flex;align-content: center" :span="8">
          <el-form-item style="justify-self: right">
            <el-button-group>
              <el-button style="width: 7em" @click="search('full', 'formal')">搜索</el-button>
              <el-button style="width: 7em" @click="search('full', 'alt')">非正选搜索</el-button>
            </el-button-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form
        v-model="search_filter"
        :inline="true"
        v-else-if="search_mode === '简单搜索'"
        label-position="left"
        label-width="5em"
        v-loading="isLoading"
    >
      <el-row justify="space-around">
        <el-col :span="12">
          <el-form-item label="课程名">
            <el-input v-model="search_filter.name"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-button-group>
              <el-button @click="search('simple', 'formal')">搜索</el-button>
              <el-button @click="search('simple', 'alt')">非正选搜索</el-button>
            </el-button-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
  <el-card
      class="lesson-card"
      :class="{active: course_selected.has(course.ID)}"
      v-bind:key="course.ID"
      v-for="course in courses"
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
            <el-button size="small" @click.stop="toggleSelection(course.ID)">
              {{ course_selected.has(course.ID) ? "移除抢课" : "添加抢课" }}
            </el-button>
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
        </el-descriptions>
      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>

<script>
import {fetch, Body} from '@tauri-apps/api/http';
import {course_select_search_url, http_head} from '../config/endPoint.js';
import {DesiredCourse} from "../js/selectCourse.js";
import {useCourseStore} from "../store/courseStore.js";
import CourseQuery from "../js/queryCourse.js";
import config from "../config/webSessionEssential.js";

export default {
  name: "SelectCourseVIew",
  data() {
    return {
      search_mode: "简单搜索",
      courses: [],
      search_filter: {
        name: "",
        teacher: "",
        number: ""
      },
      course_selected: new Set(),
      integer_to_zh_cn: {
        1: "一",
        2: "二",
        3: "三",
        4: "四",
        5: "五"
      },
      queryWorker: new CourseQuery(),
      isLoading: false,
    }
  },
  mounted() {
    const store = useCourseStore();
    this.courses = store.searchCacheList;
    this.course_selected = store.scheduledSet;
  },
  methods: {
    async search(search_mode, channel) {
      if (
          (this.search_filter.name === undefined || this.search_filter.name === "") &&
          (this.search_filter.teacher === undefined || this.search_filter.teacher === "") &&
          (this.search_filter.number === undefined || this.search_filter.number === "")
      ) {
        ElMessage.error('搜索条件不能为空')
        return;
      }
      this.isLoading = true;
      switch (channel) {
        case "formal":
          await this.searchFormal(search_mode);
          this.isLoading = false;
          break;
        case "alt":
          await this.altSearch(search_mode);
          this.isLoading = false;
          break;
      }
    },
    async searchFormal(search_mode) {
      if (search_mode === "simple") {
        let simple_filter = JSON.parse(JSON.stringify(this.search_filter))
        simple_filter.teacher = "";
        simple_filter.number = "";
        await this.queryWorker.searchCourse(simple_filter).then(
            courseList => this.sync_search_result_to_local(courseList)
        )
      } else {
        await this.queryWorker.searchCourse(this.search_filter).then(
            courseList => this.sync_search_result_to_local(courseList)
        )
      }
    },

    async altSearch(search_mode) {
      if (search_mode === "simple") {
        let simple_filter = JSON.parse(JSON.stringify(this.search_filter))
        simple_filter.teacher = "";
        simple_filter.number = "";
        await this.queryWorker.searchCourseAlt(simple_filter).then(
            courseList => this.sync_search_result_to_local(courseList)
        )
      } else {
        await this.queryWorker.searchCourseAlt(this.search_filter).then(
            courseList => this.sync_search_result_to_local(courseList)
        )
      }
    },

    toggleSelection(uid) {
      const store = useCourseStore()
      if (this.course_selected.has(uid)) {
        this.course_selected.delete(uid);
        store.removeCourseFromSchedule(uid);
      } else {
        this.course_selected.add(uid);
        store.addCourseToSchedule(this.courses.filter(value => {
          return value.ID === uid
        })[0]);
      }
      this.course_selected = store.scheduledSet;
    },

    sync_search_result_to_local(courseList) {
      this.courses = courseList.sort((a, b) => {
        if (+a.number - +b.number === 0) {
          return +a.seqNumber - +b.seqNumber;
        } else {
          return +a.number - +b.number;
        }
      });
      const store = useCourseStore();
      store.searchCacheList = this.courses;
      this.course_selected = store.scheduledSet;
    }
  },
};

</script>

<style scoped>
ul {
  list-style-type: disclosure-open;
}

li > div {
  display: flex;
  flex-direction: row;
  list-style-type: square;
  justify-content: space-around;
}

li > div > div {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.active {
  background: linear-gradient(90deg, #42b98350 15px, #00000000 15px);
}

.lesson-card > div {
  padding: 0 20px
}
</style>
