import { defineStore } from 'pinia'

export const useSchedulerStore = defineStore('ss', {
    state: () => {
        return {
            scheduledList: []
        }
    },

    actions: {
        increment() {

        },
    },
})