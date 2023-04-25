import {defineStore} from 'pinia'

export const useStateStore = defineStore('scu-urp-tauri-stateStore', {
    state: () => {
        return {
            isLogin: false,
            JSessionID: "",
            tokenValue: "",
        }
    },

    actions: {

    },
})