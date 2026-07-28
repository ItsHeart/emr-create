<template>
  <n-card title="打印预览示例">
    <template #header-extra>
      <n-button type="primary" size="small" @click="handlePrint" :loading="printing">
        打印
      </n-button>
    </template>

    <PrintTemplate
      ref="printRef"
      title="入院记录"
      header="XX市人民医院"
      footer="打印时间：2024-03-15"
    >
      <n-descriptions bordered :column="2" label-placement="left" size="small">
        <n-descriptions-item label="姓名">{{ data.name }}</n-descriptions-item>
        <n-descriptions-item label="性别">{{ data.sex === '1' ? '男' : '女' }}</n-descriptions-item>
        <n-descriptions-item label="年龄">{{ data.age }} 岁</n-descriptions-item>
        <n-descriptions-item label="住院号">{{ data.hospitalNo }}</n-descriptions-item>
        <n-descriptions-item label="入院日期">{{ data.admitDate }}</n-descriptions-item>
        <n-descriptions-item label="入院科室">{{ data.admitDept }}</n-descriptions-item>
        <n-descriptions-item label="床号">{{ data.bedNo }}</n-descriptions-item>
        <n-descriptions-item label="过敏史">{{ data.allergy || '无' }}</n-descriptions-item>
      </n-descriptions>

      <n-h4 style="margin-top: 16px">初步诊断</n-h4>
      <n-p>{{ data.diagnosis || '待补充' }}</n-p>

      <n-h4>病程记录</n-h4>
      <n-p>{{ data.record || '患者入院后完善相关检查，目前一般情况可。' }}</n-p>
    </PrintTemplate>
  </n-card>
</template>

<script setup>
import { ref } from 'vue'
import { useFormPrint } from '../index.js'
import PrintTemplate from '../components/PrintTemplate.vue'

const printRef = ref(null)

const { printForm, printing } = useFormPrint({
  title: '入院记录',
  orientation: 'portrait',
})

const data = ref({
  name: '王五',
  sex: '1',
  age: '45',
  hospitalNo: 'ZY20240315002',
  admitDate: '2024-03-15 10:00',
  admitDept: '心内科',
  bedNo: '08',
  allergy: '磺胺类药物',
  diagnosis: '1. 冠心病 2. 高血压3级',
  record: '患者因"反复胸闷气短3年，加重1周"入院。入院后完善心电图、心脏彩超等检查，目前给予抗血小板、调脂、降压等对症治疗。',
})

const handlePrint = () => {
  const el = printRef.value?.getPrintElement()
  if (el) {
    printForm(el)
  }
}
</script>
