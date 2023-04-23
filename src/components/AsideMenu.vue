<template>
  <el-menu
    default-active="1"
    class="el-menu-vertical-demo"
  >
    <router-link to="/login">
      <el-menu-item index="/login">
        <el-icon>
          <location />
        </el-icon>
        <span>登录</span>
      </el-menu-item>
    </router-link>
    <router-link to="/select-course">
      <el-menu-item index="2">
        <el-icon>
          <icon-menu />
        </el-icon>
        <span>选课</span>
      </el-menu-item>
    </router-link>
    <router-link to="/course-scheduler">
      <el-menu-item index="3">
        <el-icon>
          <document />
        </el-icon>
        <span>抢课</span>
      </el-menu-item>
    </router-link>
    <router-link to="/delete-course">
      <el-menu-item index="4" disabled>
        <el-icon>
          <delete />
        </el-icon>
        <span>删除课程</span>
      </el-menu-item>
    </router-link>
    <router-link to="/about">
      <el-menu-item index="5">
        <el-icon>
          <help />
        </el-icon>
        <span>关于</span>
      </el-menu-item>
    </router-link>
  <router-link to="/">
    <el-menu-item index="6">
      <el-icon>
        <setting />
      </el-icon>
      <span>设置</span>
    </el-menu-item>
  </router-link>
  </el-menu>
</template>

<script>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
  Delete,
  Help,
} from "@element-plus/icons-vue";

export default {
  name: "AsideMenu",
  components: {
    Document,
    IconMenu,
    Location,
    Setting,
    Delete,
    Help,
  }
};
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>