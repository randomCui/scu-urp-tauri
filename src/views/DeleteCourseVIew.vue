<template>
  <div>
    <ul>
      <li></li>
    </ul>
    <input @click="deleteCourse(114514)" type="button" value="删除">
  </div>
</template>

<script>
export default {
  name: "DeleteCourseVIew",
  data(){
    return{
      courseExisted: [],
    }
  },
  methods:{
    deleteCourse(id){
      // window.ipc.invoke("delete_course",id)
    }
  }
};
</script>

<style scoped>

</style>