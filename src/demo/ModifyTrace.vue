<template>
  <n-card title="修改痕迹对比示例">
    <template #header-extra>
      <n-space :size="8">
        <n-button type="primary" size="small" @click="handleSave">保存（生成对比）</n-button>
        <n-button size="small" @click="handleReset">重置</n-button>
      </n-space>
    </template>

    <n-grid :cols="2" :x-gap="16">
      <n-gi>
        <n-h4>编辑表单</n-h4>
        <form-create :option="option" :rule="rule" v-model:api="fApi" />
      </n-gi>
      <n-gi>
        <n-h4>修改痕迹</n-h4>
        <ModifyRecord :option="option" :rule="rule" :modifyData="modifyData" />
      </n-gi>
    </n-grid>
  </n-card>
</template>

<script setup>
import { ref, shallowRef } from 'vue'
import {
  compactOption,
  divider,
  inputField,
  selectField,
  dateField,
} from '../index.js'
import ModifyRecord from '../components/ModifyRecord.vue'

const fApi = shallowRef()
const option = compactOption

const modifyData = ref({
  oldObj: {},
  newObj: {},
})

const rule = ref([
  divider('患者信息'),
  inputField({ field: 'name', title: '姓名', required: true }),
  selectField({
    field: 'sex',
    title: '性别',
    options: [
      { label: '男', value: '1' },
      { label: '女', value: '2' },
    ],
  }),
  dateField({ field: 'birthday', title: '出生日期' }),
  inputField({ field: 'address', title: '地址', span: 12 }),
  selectField({
    field: 'bloodType',
    title: '血型',
    options: [
      { label: 'A型', value: 'A' },
      { label: 'B型', value: 'B' },
      { label: 'AB型', value: 'AB' },
      { label: 'O型', value: 'O' },
    ],
  }),
])

const handleSave = () => {
  if (!fApi.value) return
  fApi.value.validate((valid) => {
    if (valid === true) {
      modifyData.value.oldObj = modifyData.value.newObj
      modifyData.value.newObj = { ...fApi.value.form }
    }
  })
}

const handleReset = () => {
  if (fApi.value) fApi.value.resetFields()
}
</script>
