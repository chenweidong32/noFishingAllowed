<script setup lang="ts">
import { reactive, onBeforeMount } from 'vue';
import { ElMessage } from 'element-plus'
// chrome.identity.launchWebAuthFlow(
//   {
//     interactive: true,
//     url:
//       `https://github.com/login/oauth/authorize` +
//       `?client_id=55e294602d71eb006dc505540cf0614d6b3c7f35` +
//       `&redirect_uri=https://ekgmcbpgglflmgcfajnglpbcbdccnnje.chromiumapp.org/github_cb` +
//       `&scope=user.email`,
//   },
//   (a) => {
//     console.log(a)
//   }
// )
interface FORM {
  // Time: Array<Date>
  cycle: Array<number>
  urls: string | Array<string>
  startTime: string
  endTime: string
}
const form = reactive<FORM>({
  startTime: '',
  endTime: '',
  cycle:[] ,
  urls: ''
});
const initTime = async () => {
  const { time } = await chrome.storage.sync.get();

  form.startTime = time[0]
  form.endTime = time[1]
}
const initCycle = async () => {
  const { cycle } = await chrome.storage.sync.get();
  form.cycle = cycle
}
const initUrl = async () => {
  const { urls } = await chrome.storage.sync.get();
  form.urls = urls.join('\n')
}
onBeforeMount(async () => {
  await initTime()
  await initUrl()
  await initCycle()
})
const cycleArr = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

const setStorage = async () => {
  try {
    let urls = form.urls
    if (typeof form.urls === 'string') {
      urls = form.urls.replace(/\r/g, "").split("\n").filter((item: string) => item !== '')
    }
    const time = [form.startTime, form.endTime]
    console.log( typeof form.cycle)
    await chrome.storage.sync.set({ time: time, urls: urls, cycle: Array.from(Object.values(form.cycle)) });
    console.log(await chrome.storage.sync.get())
    ElMessage({
      showClose: true,
      message: '成功！',
      type: 'success',
    })
  } catch (error: any) {
    ElMessage({
      showClose: true,
      message: error.msg,
      type: 'error',
    })
  }

}

</script>

<template>
  <el-card class="h-[400px]">
    <el-form :model="form">
      <el-form-item label="上班时间">
        <!-- <el-time-picker v-model="form.Time" is-range range-separator="至" start-placeholder="上班时间"
          end-placeholder="下班时间" /> -->
        <el-time-select v-model="form.startTime" start="00:00" step="00:30" end="23:59" placeholder="上班时间" />
      </el-form-item>
      <el-form-item label="下班时间">
        <el-time-select v-model="form.endTime" start="00:00" step="00:30" end="23:59" placeholder="下班时间" />
      </el-form-item>
      <el-form-item label="禁用周期">
        <el-select v-model="form.cycle" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="4" class="w-full"
          placeholder="请选择">
          <el-option v-for="(item, index) in cycleArr" :key="item" :label="item" :value="index + 1" />
        </el-select>
      </el-form-item>
      <el-form-item label="禁用网址">
        <el-input v-model="form.urls" :rows="4" type="textarea" placeholder="Please input" />
      </el-form-item>

      <el-form-item>
        <div class="flex items-center justify-end w-full">
          <el-button type="primary" round @click="setStorage()">确认</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style scoped></style>
