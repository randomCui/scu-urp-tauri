import {
    course_select_entry_url,
    http_head,
    jwc_captcha_url,
    jwc_entry_url,
    jwc_home,
    jwc_jc
} from "../config/endPoint.js";
import {useStateStore} from "../store/urpStateStore.js";
import {Body, fetch, ResponseType} from "@tauri-apps/api/http";
import {readLoginInfo, saveLoginInfo} from "./rememberMe.js";
import md5 from "md5";
// import { readTextFile, BaseDirectory } from '@tauri-apps/api/fs';

export let refresh_captcha = async () => {
    const stateStore = useStateStore();
    return await fetch(jwc_captcha_url, {
        headers: {
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Cookie": stateStore.JSessionID,
            "User-Agent": http_head
        },
        responseType: ResponseType.Binary,
    })
        .then(res => {
            // console.log(res.data)
            return res.data;
        });
};

export let init_urp_login = async () => {
    const stateStore = useStateStore();
    // electron的ipc不能直接返回blob,因此这里返回arrayBuffer后再在渲染进程中组装成blob
    return await fetch(jwc_entry_url, {
        headers: {
            "User-Agent": http_head
        },
        responseType: ResponseType.Text
    }).then(response => {
        // console.log(response)
        // console.log(response.headers["set-cookie"]);
        // eslint-disable-next-line no-import-assign
        stateStore.JSessionID = response.headers["set-cookie"].split(";")[0];
        console.log(stateStore.JSessionID);
        return response.data
    }).then(text => {
        let regexp = /id="tokenValue" name="tokenValue" value="(.*?)"/ium;
        // eslint-disable-next-line no-import-assign
        stateStore.tokenValue = text.match(regexp)[1];
        console.log(stateStore.tokenValue);

        // globalCurriculum.updateCookie(globalCookie);
        // globalCourseScheduler.updateCookie(globalCookie);
        // globalCourseDeleter.updateCookie(globalCookie);

        return fetch(jwc_captcha_url, {
            headers: {
                "Cookie": stateStore.JSessionID,
                "User-Agent": http_head
            },
            responseType: ResponseType.Binary,
        });
    }).then(response => {
        console.log("获取验证码成功");
        return response.data;
    });
};


export let post_login_info = async (data) => {
    let {student_id, password, captcha} = data;
    // console.log(student_id, password, captcha);
    await saveLoginInfo(student_id, password);
    const stateStore = useStateStore();
    let post_data = {
        "j_username": student_id.toString(),
        "j_password": md5(password),
        "j_captcha": captcha,
        "tokenValue": stateStore.tokenValue
    };
    return await fetch(jwc_jc, {
        method: "POST",
        headers: {
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Cookie": stateStore.JSessionID,
            "User-Agent": http_head
        },
        body: Body.form(post_data),
        responseType: ResponseType.Text,
    }).then((response) => {
        if (response.data.includes("选课管理")) {
            console.log("登陆成功");
            // eslint-disable-next-line no-import-assign
            stateStore.isLogin = true;

            return {
                "status": "success",
                "message": "登陆成功"
            };
        } else {
            // let url = new URL(response.url);
            // let errorCode = url.searchParams.get("errorCode");
            console.log("登陆失败");
            let reason = ""
            if (response.data.includes("验证码")) {
                reason = "验证码错误"
            }
            if (response.data.includes("用户密码错误")) {
                reason = "账号密码错误"
            }
            if(response.data.includes("token校验")){
                reason = "token校验失败"
            }
            return {
                "status": "failed",
                "message": "登陆失败:" + reason
            };
        }
    });
};

export let login_info_file = async (data) => {
    switch (data.op) {
        case "write":
            await saveLoginInfo(data.student_ID, data.password);
            return {status: "success"};
        case "read":
            let result = await readLoginInfo();
            // console.log(result);
            return result;
    }
};

let urp_login_state = () => {
    console.log(isLogin);
    return JSON.stringify(isLogin);
};

export async function isFormalSelectionTime(){
    const stateStore = useStateStore();
    return await fetch(course_select_entry_url,{
        headers: {
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Cookie": stateStore.JSessionID,
            "User-Agent": http_head
        },
        responseType: ResponseType.Text,
    }).then(text=>{
        if (text.data.includes("非选课")) {
            return { status: 1 };
        } else {
            return { status: 0 };
        }
    })
}