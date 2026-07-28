<template>
  <n-card title="字段联动示例">
    <n-alert type="info" style="margin-bottom: 16px">
      演示：婚姻状况选择"已婚"时显示配偶信息；身高体重变化时自动计算 BMI
    </n-alert>
    <form-create :option="option" :rule="rule" v-model:api="fApi" />
  </n-card>
</template>

<script setup>
import { ref, shallowRef, watch } from 'vue'
import {
  compactOption,
  divider,
  inputField,
  selectField,
  numberField,
  yesNoField,
  buildSuffix,
  useFormLinkage,
} from '../index.js'

const fApi = shallowRef()
const option = compactOption

const rule = ref([
  divider('个人信息'),
  inputField({ field: 'name', title: '姓名', required: true }),
  selectField({
    field: 'marriage',
    title: '婚姻状况',
    options: [
      { label: '未婚', value: '0' },
      { label: '已婚', value: '1' },
      { label: '离异', value: '2' },
    ],
  }),
  // 配偶信息（默认隐藏）
  inputField({ field: 'spouseName', title: '配偶姓名' }),
  inputField({ field: 'spousePhone', title: '配偶电话' }),

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

  divider('病史'),
  yesNoField({ field: 'smoking', title: '吸烟史' }),
  inputField({ field: 'smokingDetail', title: '吸烟量' }),
])

// 使用 useFormLinkage 管理联动
useFormLinkage({
  fApi,
  linkages: [
    {
      watch: 'marriage',
      handler(value, api) {
        const isMarried = value === '1'
        api.hidden(!isMarried, 'spouseName')
        api.hidden(!isMarried, 'spousePhone')
      },
      immediate: true,
    },
    {
      watch: ['height', 'weight'],
      handler(values, api) {
        const [height, weight] = values
        if (height && weight) {
          const bmi = (weight / Math.pow(height / 100, 2)).toFixed(1)
          api.setValue('bmi', Number(bmi))
        }
      },
    },
    {
      watch: 'smoking',
      handler(value, api) {
        api.hidden(value !== '1', 'smokingDetail')
      },
      immediate: true,
    },
  ],
})
</script>
