<template>
  <n-select
    v-model:value="data"
    filterable
    clearable
    remote
    :multiple="props.multiple !== false"
    :options="remoteOptions"
    :loading="loading"
    :disabled="props.disabled"
    :placeholder="props.placeholder || '请输入搜索'"
    style="width: 100%"
    @search="handleSearch"
    @update:value="handleUpdateValue"
  />
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  modelValue: [String, Array],
  disabled: Boolean,
  placeholder: String,
  multiple: {
    type: Boolean,
    default: true,
  },
  // form-create 注入
  formCreateInject: Object,
  // 远程搜索函数，接收 keyword 返回 Promise<Array<{label, value}>>
  fetchOptions: Function,
  // 或者直接传 URL + 解析配置
  url: String,
  labelField: {
    type: String,
    default: 'label',
  },
  valueField: {
    type: String,
    default: 'value',
  },
})

const emit = defineEmits(['update:modelValue'])

const data = ref(props.multiple !== false ? [] : null)
const remoteOptions = ref([])
const loading = ref(false)

const handleSearch = async (keyword) => {
  if (!keyword) {
    remoteOptions.value = []
    return
  }
  loading.value = true
  try {
    if (props.fetchOptions) {
      remoteOptions.value = await props.fetchOptions(keyword)
    } else if (props.url) {
      const response = await fetch(`${props.url}?keyword=${encodeURIComponent(keyword)}`)
      const result = await response.json()
      const list = Array.isArray(result) ? result : result.data || []
      remoteOptions.value = list.map((item) => ({
        label: item[props.labelField],
        value: item[props.valueField],
      }))
    }
  } catch (e) {
    console.error('[emr-create RemoteSelect]', e)
    remoteOptions.value = []
  } finally {
    loading.value = false
  }
}

const handleUpdateValue = (value) => {
  if (props.multiple !== false) {
    emit('update:modelValue', Array.isArray(value) ? value.join(',') : value)
  } else {
    emit('update:modelValue', value)
  }
}

watch(
  () => props.modelValue,
  (val) => {
    if (props.multiple !== false) {
      data.value = val ? (typeof val === 'string' ? val.split(',') : val) : []
    } else {
      data.value = val || null
    }
  },
  { immediate: true }
)
</script>
