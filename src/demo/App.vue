<template>
  <n-config-provider>
    <n-layout content-style="padding: 24px; max-width: 1200px; margin: 0 auto;">
      <n-h1>emr-create Demo</n-h1>
      <n-card title="基本表单示例" style="margin-bottom: 16px">
        <n-space style="margin-bottom: 12px">
          <n-button type="primary" size="small" @click="handleSave">保存</n-button>
          <n-button size="small" @click="handleReset">重置</n-button>
          <n-button size="small" @click="handleLoad">模拟加载数据</n-button>
        </n-space>
        <form-create :option="option" :rule="rule" v-model:api="fApi" />
      </n-card>

      <n-card title="表单数据" v-if="formData">
        <n-code :code="JSON.stringify(formData, null, 2)" language="json" />
      </n-card>
    </n-layout>
  </n-config-provider>
</template>

<script setup>
import { ref } from 'vue'
import {
  compactOption,
  divider,
  inputField,
  selectField,
  numberField,
  dateField,
  multipleSelectField,
  templateTextField,
  buildSuffix,
  useFormCreate,
} from '../index.js'

const fApi = ref(null)
const formData = ref(null)

const option = compactOption

const rule = [
  divider('基本信息'),
  inputField({ field: 'name', title: '姓名', required: true }),
  dateField({ field: 'birthday', title: '出生日期', required: true }),
  selectField({
    field: 'sex',
    title: '性别',
    required: true,
    options: [
      { label: '男', value: '1' },
      { label: '女', value: '2' },
    ],
  }),
  inputField({ field: 'mobile', title: '手机号' }),
  selectField({
    field: 'education',
    title: '学历',
    options: [
      { label: '小学', value: '1' },
      { label: '初中', value: '2' },
      { label: '高中', value: '3' },
      { label: '大学', value: '4' },
      { label: '研究生', value: '5' },
    ],
  }),
  multipleSelectField({
    field: 'hobbies',
    title: '爱好',
    options: [
      { label: '阅读', value: 'reading' },
      { label: '运动', value: 'sport' },
      { label: '音乐', value: 'music' },
      { label: '旅行', value: 'travel' },
    ],
  }),

  divider('体格检查'),
  {
    type: 'InputNumber',
    field: 'height',
    title: '身高',
    ...buildSuffix('cm'),
  },
  {
    type: 'InputNumber',
    field: 'weight',
    title: '体重',
    ...buildSuffix('kg'),
  },
  numberField({ field: 'bmi', title: 'BMI', suffix: 'kg/m²' }),

  divider('备注'),
  templateTextField({
    field: 'remark',
    title: '备注',
    templates: [
      { name: '正常模板', value: '各项指标正常，无需特殊处理。' },
      { name: '异常模板', value: '发现异常，需要进一步检查。请于一周后复诊。' },
    ],
  }),
]

const handleSave = () => {
  if (!fApi.value) return
  fApi.value.validate((valid) => {
    if (valid === true) {
      formData.value = { ...fApi.value.form }
    } else {
      formData.value = { error: valid[0][0].message }
    }
  })
}

const handleReset = () => {
  if (fApi.value) {
    fApi.value.resetFields()
    formData.value = null
  }
}

const handleLoad = () => {
  if (fApi.value) {
    fApi.value.coverValue({
      name: '张三',
      birthday: '1990-01-15',
      sex: '1',
      mobile: '13800138000',
      education: '4',
      hobbies: 'reading,sport',
      height: 175,
      weight: 70,
      bmi: 22.9,
      remark: '患者一般情况良好。',
    })
  }
}
</script>
