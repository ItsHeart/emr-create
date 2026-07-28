<template>
  <n-select
    v-model:value="data"
    filterable
    clearable
    remote
    :multiple="props.multiple"
    :options="remoteOptions"
    :loading="loading"
    :disabled="props.disabled"
    :placeholder="props.placeholder || '输入诊断名称/拼音首字母搜索'"
    :render-label="renderLabel"
    style="width: 100%"
    @search="handleSearch"
    @update:value="handleUpdateValue"
  />
</template>

<script setup>
import { ref, watch, h } from 'vue'

const props = defineProps({
  modelValue: [String, Array],
  disabled: Boolean,
  placeholder: String,
  multiple: {
    type: Boolean,
    default: false,
  },
  formCreateInject: Object,
  // 远程搜索函数：(keyword) => Promise<Array<{code, name, pinyin?}>>
  fetchOptions: Function,
  // 或直接传 URL
  url: String,
  // 字段映射
  codeField: {
    type: String,
    default: 'code',
  },
  nameField: {
    type: String,
    default: 'name',
  },
  pinyinField: {
    type: String,
    default: 'pinyin',
  },
})

const emit = defineEmits(['update:modelValue'])

const data = ref(props.multiple ? [] : null)
const remoteOptions = ref([])
const loading = ref(false)

// 自定义渲染：编码 + 名称双列
const renderLabel = (option) => {
  return h('div', { style: 'display:flex;justify-content:space-between;align-items:center' }, [
    h('span', {}, option.name),
    h('span', { style: 'color:#999;font-size:12px;margin-left:12px' }, option.code),
  ])
}

let searchTimer = null

const handleSearch = (keyword) => {
  if (!keyword) {
    remoteOptions.value = []
    return
  }
  // 防抖
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(async () => {
    loading.value = true
    try {
      let list = []
      if (props.fetchOptions) {
        list = await props.fetchOptions(keyword)
      } else if (props.url) {
        const response = await fetch(`${props.url}?keyword=${encodeURIComponent(keyword)}`)
        const result = await response.json()
        list = Array.isArray(result) ? result : result.data || []
      }
      remoteOptions.value = list.map((item) => ({
        label: item[props.nameField],
        value: item[props.codeField],
        code: item[props.codeField],
        name: item[props.nameField],
        pinyin: item[props.pinyinField] || '',
      }))
    } catch (e) {
      console.error('[emr-create IcdCodeSelect]', e)
      remoteOptions.value = []
    } finally {
      loading.value = false
    }
  }, 300)
}

const handleUpdateValue = (value) => {
  emit('update:modelValue', value)
}

watch(
  () => props.modelValue,
  (val) => {
    if (props.multiple) {
      data.value = Array.isArray(val) ? val : val ? val.split(',') : []
    } else {
      data.value = val || null
    }
  },
  { immediate: true }
)
</script>
