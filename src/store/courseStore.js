import {defineStore} from 'pinia'

export const useCourseStore = defineStore('scu-urp-tauri-courseStore', {
    state: () => {
        return {
            searchCacheList: [],
            scheduleListAll: [],
            scheduledSet: new Set(),
        }
    },

    actions: {
        removeCourseFromSchedule(uid) {
            this.scheduleListAll.splice(
                this.scheduleListAll.findIndex(value => {
                    return value.ID === uid
                }),
                1)
            this.scheduledSet.delete(uid);
        },
        addCourseToSchedule(course){
            this.scheduleListAll.push(course);
            this.scheduledSet = this.scheduleListAll.reduce((set, course) => {
                set.add(course.ID);
                return set;
            }, new Set())
        }
    },
})