<template>
    <div class="common-layout">
      <el-container>
        <el-header>
          <PageHeader></PageHeader>
        </el-header>
        <el-container>
          <el-aside width="8em">
            <AsideMenu/>
          </el-aside>
          <el-container>
            <el-main>
              <router-view />
            </el-main>
            <el-footer>
              <PageFooter/>
            </el-footer>
          </el-container>
        </el-container>
      </el-container>
    </div>
</template>

<script>
import AsideMenu from "./components/AsideMenu.vue";
import PageHeader from "./components/PageHeader.vue";
import PageFooter from "./components/PageFooter.vue";
export default {
  components :{
    PageFooter,
    PageHeader,
    AsideMenu
  }
}
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
