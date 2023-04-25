<template>
  <el-card v-if="!stateStore.isLogin" class="box-card">
    <template #header>
      <div class="card-header">
        <span>登录教务</span>
        <!--        <el-button class="button" text>Operation button</el-button>-->
      </div>
    </template>
    <el-form :model="loginInfo" label-width="120px">
      <el-form-item label="学号">
        <el-input v-model="loginInfo.studentID" clearable/>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="loginInfo.password" clearable show-password/>
      </el-form-item>
      <el-form-item label="验证码">
        <el-input v-model="loginInfo.captcha" clearable>
          <template #append>
            <el-image :src="captchaUrl" @click="refreshCaptcha" style="height:2em;width:6em"/>
          </template>
        </el-input>
      </el-form-item>
      <el-button type="primary" @click="onLoginButtonPressed">登录</el-button>
    </el-form>
  </el-card>
  <el-text type="success" v-else>
    已登录
  </el-text>
  <!--  <div style="display: flex;justify-content: center;align-content: center">-->
  <!--    <div v-if="!isLogin" class="login-plate">-->
  <!--      <h3>账号登陆</h3>-->
  <!--      <form class="login-wrapper" style="display: grid">-->
  <!--        <input v-model="studentID" class="account-input" placeholder="学号" type="text" maxlength="13">-->
  <!--        <input v-model="password" class="password-input" placeholder="密码" type="password">-->
  <!--        <div style="display: flex; flex-direction: row; justify-content: center">-->
  <!--          <input v-model="captcha" class="captcha-input" placeholder="验证码" type="text" maxlength="4">-->
  <!--          <img alt="Captcha image" :src="captchaUrl" @click="refreshCaptcha">-->
  <!--        </div>-->
  <!--        <div class="login-btn" @click="onLoginButtonPressed">-->
  <!--          <div>-->
  <!--            登录-->
  <!--          </div>-->
  <!--        </div>-->
  <!--      </form>-->
  <!--    </div>-->
  <!--    <div v-else>-->
  <!--      <h2>已经登陆过了</h2>-->
  <!--    </div>-->
  <!--  </div>-->
</template>

<script setup>
import {useStateStore} from "../store/urpStateStore.js";

const stateStore = useStateStore();
</script>
<script>
import {init_urp_login, login_info_file, post_login_info, refresh_captcha} from "../js/urpLogin";

export default {
  name: "LoginView",
  data() {
    return {
      captchaUrl: undefined,
      loginInfo: {
        studentID: "",
        password: "",
        captcha: "",
      },
      isLogin: false,
    };
  },
  mounted() {
    const stateStore = useStateStore();
    this.isLogin = stateStore.isLogin;
    init_urp_login().then(data => {
      // console.log(data)
      this.captchaUrl = URL.createObjectURL(new Blob([Uint8Array.from(data)], {type: "image/jpeg"}));
    });
    login_info_file({op: 'read'}).then(res => {
      if (res.status === "success") {
        this.loginInfo.password = res.password
        this.loginInfo.studentID = res.studentID
      }
    })
  },
  methods: {
    onLoginButtonPressed() {
      console.log(this.loginInfo);
      post_login_info({
        student_id: this.loginInfo.studentID,
        password: this.loginInfo.password,
        captcha: this.loginInfo.captcha
      }).then(res => {
            console.log(res);
            if (res.status === 'success') {
              ElMessage.success(res.message);
              state.isLogin = true
            } else if (res.status === "failed") {
              ElMessage.error(res.message);
              this.isLogin = false
              init_urp_login().then(res => {
                this.captchaUrl = URL.createObjectURL(new Blob([Uint8Array.from(res)], {type: "image/jpeg"}));
              });
            }
          }
      )
      // window.ipc.invoke("post_login_info", JSON.stringify({
      //   student_id: this.loginInfo.studentID,
      //   password: this.loginInfo.password,
      //   captcha: this.loginInfo.captcha
      // })).then(res => {
      //   console.log(res);
      //   if(res.status==='success'){
      //     ElMessage.success(res.message);
      //     this.isLogin = true
      //   }else if(res.status === "failed") {
      //     if(res.message.includes("captcha")){
      //       ElMessage.error("验证码错误");
      //     }
      //     if(res.message.includes("null")){
      //       ElMessage.error("未知错误");
      //     }
      //     if(res.message.includes("Credentials")){
      //       ElMessage.error("密码错误");
      //     }
      //     this.isLogin = false
      //     window.ipc.invoke("init_urp_login").then(res => {
      //       this.captchaUrl = URL.createObjectURL(new Blob([res], { type: "image/jpeg" }));
      //     });
      //   }
      // });
    },
    async refreshCaptcha() {
      refresh_captcha().then(data => {
        this.captchaUrl = URL.createObjectURL(new Blob([Uint8Array.from(data)], {type: "image/jpeg"}));
      });
    },
  }
};
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.box-card {
  width: 480px;
}

</style>
