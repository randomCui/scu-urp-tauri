import config from "@/config/webSessionEssential"
import { delete_course_entry_url, delete_course_submit_url, http_head } from "@/config/config";
import { parse } from "node-html-parser"
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

export async function deleteCourse(desiredCourse){
  await fetch(delete_course_entry_url,{
    headers: {
      "Accept-Language": "zh-CN,zh;q=0.9",
      "Cookie": config.JSESSIONID,
      "User-Agent": http_head
    },
  }).then(res=>{
    return res.text();
  }).then(text=>{
    let root = parse(text)
    console.log(root.querySelector("#tokenValue").getAttribute("value"))
    let tokenValue = root.querySelector("#tokenValue").getAttribute("value")
    console.log(root.querySelectorAll("table>tbody>tr"))
    for(let elem of root.querySelectorAll("table>tbody>tr")){
      let tds = elem.querySelectorAll("td")
      let quitData = tds[0].querySelector('i').getAttribute("onclick").match(/quitSel\((\'.*?\'),(\'.*?\'),(\'.*?\')\)/sg)
      console.log(quitData)
      let courseInfo = {
        'number': tds[2].innerText,
        'name': tds[3].innerText,
        'score': Number.parseFloat(tds[4].innerText),
        'teacher': tds[7]
      }
      console.log(courseInfo)
    }
    return "success"
  })

  // await fetch(delete_course_submit_url,{
  //   headers: {
  //     "Accept-Language": "zh-CN,zh;q=0.9",
  //     "Cookie": config.JSESSIONID,
  //     "User-Agent": http_head
  //   },
  //   method: "POST",
  //   body: new URLSearchParams({
  //     kch: filter.number || "",
  //     kcm: filter.name || "",
  //   })
}