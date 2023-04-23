<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
  >
    <el-menu-item index="0">LOGO</el-menu-item>
    <div class="flex-grow" />
    <el-menu-item index="1">
      Processing Center
    </el-menu-item>
    <el-menu-item index="2">
      Workspace
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "PageHeader"
};
</script>

<style scoped>
.flex-grow {
  flex-grow: 1;
}
</style>