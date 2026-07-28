<template>
  <n-card title="入院记录示例（综合）">
    <template #header-extra>
      <n-space :size="8">
        <n-button type="primary" size="small" @click="handleSave">保存</n-button>
        <n-button size="small" @click="handleReset">重置</n-button>
        <n-button size="small" @click="handleLoad">模拟加载</n-button>
      </n-space>
    </template>
    <form-create :option="option" :rule="rule" v-model:api="fApi" />
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
  yesNoField,
  buildSuffix,
  phoneValidator,
  idCardValidator,
} from '../index.js'

const fApi = shallowRef()
const option = compactOption

const rule = ref([
  divider('患者基本信息'),
  inputField({ field: 'name', title: '姓名', required: true }),
  selectField({
    field: 'sex',
    title: '性别',
    required: true,
    options: [
      { label: '男', value: '1' },
      { label: '女', value: '2' },
    ],
  }),
  {
    type: 'input',
    field: 'age',
    title: '年龄',
    props: { placeholder: '岁' },
    ...buildSuffix('岁'),
  },
  {
    type: 'input',
    field: 'idCard',
    title: '身份证号',
    validate: [idCardValidator()],
  },
  {
    type: 'input',
    field: 'phone',
    title: '联系电话',
    validate: [phoneValidator()],
  },
  selectField({
    field: 'marriage',
    title: '婚姻状况',
    options: [
      { label: '未婚', value: '1' },
      { label: '已婚', value: '2' },
      { label: '丧偶', value: '3' },
      { label: '离婚', value: '4' },
    ],
  }),

  divider('入院信息'),
  dateField({ field: 'admitDate', title: '入院日期', required: true, type: 'datetime' }),
  selectField({
    field: 'admitDept',
    title: '入院科室',
    required: true,
    options: [
      { label: '内科', value: 'internal' },
      { label: '外科', value: 'surgery' },
      { label: '妇产科', value: 'obstetrics' },
      { label: '儿科', value: 'pediatrics' },
      { label: '急诊科', value: 'emergency' },
    ],
  }),
  inputField({ field: 'bedNo', title: '床号' }),
  inputField({ field: 'hospitalNo', title: '住院号' }),

  divider('病史'),
  yesNoField({ field: 'allergyHistory', title: '过敏史', required: true }),
  inputField({ field: 'allergyDetail', title: '过敏详情' }),
  yesNoField({ field: 'surgeryHistory', title: '手术史' }),
  yesNoField({ field: 'familyHistory', title: '家族病史' }),

  divider('生命体征'),
  {
    type: 'vitalSigns',
    field: 'vitalSigns',
    title: '生命体征',
    col: { span: 24 },
  },

  divider('初步诊断'),
  {
    type: 'icdCodeSelect',
    field: 'diagnosis',
    title: '诊断',
    props: {
      multiple: true,
      fetchOptions: async (keyword) => {
        // 模拟 ICD 数据
        const mockData = [
          { code: 'J18.9', name: '肺炎', pinyin: 'fy' },
          { code: 'I10', name: '原发性高血压', pinyin: 'gxy' },
          { code: 'E11.9', name: '2型糖尿病', pinyin: 'tnb' },
          { code: 'K29.5', name: '慢性胃炎', pinyin: 'wy' },
          { code: 'J45.9', name: '哮喘', pinyin: 'xc' },
        ]
        return mockData.filter(
          (item) => item.name.includes(keyword) || item.pinyin.includes(keyword) || item.code.includes(keyword)
        )
      },
    },
    col: { span: 24 },
  },

  divider('医嘱'),
  {
    type: 'medicationInput',
    field: 'medications',
    title: '用药医嘱',
    col: { span: 24 },
  },

  divider('签名'),
  {
    type: 'signaturePad',
    field: 'doctorSignature',
    title: '医师签名',
    props: { width: 300, height: 100 },
    col: { span: 12 },
  },
])

const handleSave = () => {
  if (!fApi.value) return
  fApi.value.validate((valid) => {
    if (valid === true) {
      console.log('入院记录数据:', { ...fApi.value.form })
    }
  })
}

const handleReset = () => {
  if (fApi.value) fApi.value.resetFields()
}

const handleLoad = () => {
  fApi.value.coverValue({
    name: '李四',
    sex: '1',
    age: '56',
    idCard: '110101196801011234',
    phone: '13912345678',
    marriage: '2',
    admitDate: '2024-03-15 09:30:00',
    admitDept: 'internal',
    bedNo: '12',
    hospitalNo: 'ZY20240315001',
    allergyHistory: '1',
    allergyDetail: '青霉素过敏',
    surgeryHistory: '0',
    familyHistory: '9',
    vitalSigns: {
      temperature: 38.2,
      pulse: 88,
      breath: 18,
      systolic: 135,
      diastolic: 85,
    },
    diagnosis: ['J18.9', 'I10'],
    medications: [
      { name: '头孢克肟', dose: 100, doseUnit: 'mg', frequency: 'bid', route: '口服' },
      { name: '氨溴索', dose: 30, doseUnit: 'mg', frequency: 'tid', route: '口服' },
    ],
  })
}
</script>
