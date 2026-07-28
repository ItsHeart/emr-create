<template>
  <n-card title="远程数据加载示例">
    <n-alert type="info" style="margin-bottom: 16px">
      演示 useDictBatch 批量加载字典 + RemoteSelect 远程搜索
    </n-alert>

    <n-space vertical :size="12">
      <n-space :size="8">
        <n-button size="small" type="primary" @click="loadAllDicts" :loading="loading">
          加载字典
        </n-button>
        <n-tag v-if="dictLoaded" type="success" size="small">字典已加载</n-tag>
      </n-space>

      <form-create :option="option" :rule="rule" v-model:api="fApi" />
    </n-space>
  </n-card>
</template>

<script setup>
import { ref, shallowRef } from 'vue'
import {
  compactOption,
  divider,
  selectField,
  inputField,
  useDictBatch,
} from '../index.js'

const fApi = shallowRef()
const option = compactOption
const dictLoaded = ref(false)

// 模拟字典数据源
const mockDicts = {
  sex: [
    { label: '男', value: '1' },
    { label: '女', value: '2' },
  ],
  nation: [
    { label: '汉族', value: '01' },
    { label: '回族', value: '02' },
    { label: '藏族', value: '03' },
    { label: '维吾尔族', value: '04' },
  ],
  dept: [
    { label: '内科', value: 'internal' },
    { label: '外科', value: 'surgery' },
    { label: '儿科', value: 'pediatrics' },
  ],
}

// 模拟医生数据
const mockDoctors = [
  { id: 'd001', name: '王医生', dept: '内科' },
  { id: 'd002', name: '李医生', dept: '外科' },
  { id: 'd003', name: '张医生', dept: '儿科' },
  { id: 'd004', name: '赵医生', dept: '内科' },
]

// 使用 useDictBatch
const { loadDicts, getOptions, loading } = useDictBatch({
  fetcher: async (dictName) => {
    // 模拟网络请求
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockDicts[dictName] || []
  },
})

const rule = ref([
  divider('基本信息'),
  selectField({ field: 'sex', title: '性别', options: [] }),
  selectField({ field: 'nation', title: '民族', options: [] }),
  selectField({ field: 'dept', title: '科室', options: [] }),
  inputField({ field: 'remark', title: '备注' }),

  divider('主管医生（远程搜索）'),
  {
    type: 'remoteSelect',
    field: 'doctor',
    title: '医生',
    props: {
      multiple: false,
      fetchOptions: async (keyword) => {
        // 模拟远程搜索
        await new Promise((resolve) => setTimeout(resolve, 200))
        return mockDoctors
          .filter((d) => d.name.includes(keyword))
          .map((d) => ({ label: `${d.name}（${d.dept}）`, value: d.id }))
      },
    },
  },
])

const loadAllDicts = async () => {
  await loadDicts(['sex', 'nation', 'dept'])
  dictLoaded.value = true

  // 将字典注入到表单规则
  if (fApi.value) {
    fApi.value.updateOptions('sex', getOptions('sex'))
    fApi.value.updateOptions('nation', getOptions('nation'))
    fApi.value.updateOptions('dept', getOptions('dept'))
  }
}
</script>
