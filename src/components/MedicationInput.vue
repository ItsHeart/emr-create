<template>
  <n-space vertical :size="8" style="width: 100%">
    <div v-for="(row, index) in rows" :key="row._id" class="med-row">
      <n-space :size="6" :wrap="false" align="center">
        <n-input
          v-model:value="row.name"
          placeholder="药品名称"
          size="small"
          style="width: 180px"
          :disabled="props.disabled"
          @update:value="handleChange"
        />
        <n-input-number
          v-model:value="row.dose"
          placeholder="剂量"
          size="small"
          style="width: 90px"
          :show-button="false"
          :min="0"
          :disabled="props.disabled"
          @update:value="handleChange"
        />
        <n-select
          v-model:value="row.doseUnit"
          :options="doseUnits"
          placeholder="单位"
          size="small"
          style="width: 80px"
          :disabled="props.disabled"
          @update:value="handleChange"
        />
        <n-select
          v-model:value="row.frequency"
          :options="frequencyOptions"
          placeholder="频次"
          size="small"
          style="width: 110px"
          :disabled="props.disabled"
          @update:value="handleChange"
        />
        <n-select
          v-model:value="row.route"
          :options="routeOptions"
          placeholder="途径"
          size="small"
          style="width: 100px"
          :disabled="props.disabled"
          @update:value="handleChange"
        />
        <n-button
          size="small"
          quaternary
          type="error"
          :disabled="props.disabled || rows.length <= 1"
          @click="removeRow(index)"
        >
          删除
        </n-button>
      </n-space>
    </div>
    <n-button
      size="small"
      dashed
      :disabled="props.disabled"
      @click="addRow"
    >
      + 添加药品
    </n-button>
  </n-space>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  // Array<{name, dose, doseUnit, frequency, route}>
  modelValue: Array,
  disabled: Boolean,
  formCreateInject: Object,
  // 自定义剂量单位选项
  customDoseUnits: Array,
  // 自定义频次选项
  customFrequencies: Array,
  // 自定义途径选项
  customRoutes: Array,
})

const emit = defineEmits(['update:modelValue'])

let idCounter = 0
const genId = () => `med_${++idCounter}`

const defaultDoseUnits = [
  { label: 'mg', value: 'mg' },
  { label: 'g', value: 'g' },
  { label: 'ml', value: 'ml' },
  { label: '片', value: '片' },
  { label: '粒', value: '粒' },
  { label: '支', value: '支' },
  { label: '袋', value: '袋' },
]

const defaultFrequencies = [
  { label: 'qd（每日一次）', value: 'qd' },
  { label: 'bid（每日两次）', value: 'bid' },
  { label: 'tid（每日三次）', value: 'tid' },
  { label: 'qid（每日四次）', value: 'qid' },
  { label: 'q4h（每4小时）', value: 'q4h' },
  { label: 'q6h（每6小时）', value: 'q6h' },
  { label: 'q8h（每8小时）', value: 'q8h' },
  { label: 'q12h（每12小时）', value: 'q12h' },
  { label: 'prn（必要时）', value: 'prn' },
  { label: 'st（立即）', value: 'st' },
]

const defaultRoutes = [
  { label: '口服', value: '口服' },
  { label: '静脉滴注', value: '静脉滴注' },
  { label: '静脉推注', value: '静脉推注' },
  { label: '肌肉注射', value: '肌肉注射' },
  { label: '皮下注射', value: '皮下注射' },
  { label: '外用', value: '外用' },
  { label: '雾化吸入', value: '雾化吸入' },
]

const doseUnits = props.customDoseUnits || defaultDoseUnits
const frequencyOptions = props.customFrequencies || defaultFrequencies
const routeOptions = props.customRoutes || defaultRoutes

const createRow = (item = {}) => ({
  _id: genId(),
  name: item.name || '',
  dose: item.dose ?? null,
  doseUnit: item.doseUnit || null,
  frequency: item.frequency || null,
  route: item.route || null,
})

const rows = ref([createRow()])

const addRow = () => {
  rows.value.push(createRow())
  handleChange()
}

const removeRow = (index) => {
  rows.value.splice(index, 1)
  handleChange()
}

const handleChange = () => {
  const result = rows.value
    .filter((r) => r.name || r.dose || r.frequency || r.route)
    .map(({ _id, ...rest }) => rest)
  emit('update:modelValue', result)
}

watch(
  () => props.modelValue,
  (val) => {
    if (Array.isArray(val) && val.length) {
      rows.value = val.map((item) => createRow(item))
    }
  },
  { immediate: true, deep: true }
)
</script>

<style scoped>
.med-row {
  padding: 4px 0;
}
</style>
