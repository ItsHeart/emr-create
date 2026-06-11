<template>
  <n-space vertical style="width: 100%">
    <n-input
      v-model:value="data"
      type="textarea"
      :rows="props.rows || 3"
      :placeholder="props.placeholder || ''"
      :disabled="props.disabled"
      @input="changeInput"
    />
    <n-space size="small">
      <slot name="actions" :disabled="props.disabled" />
      <n-button
        size="tiny"
        :focusable="false"
        v-for="template in templates"
        :key="template.id || template.name"
        @click="chooseTemplate(template.value)"
        :disabled="props.disabled"
      >
        {{ template.name }}
      </n-button>
    </n-space>
  </n-space>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  modelValue: String,
  disabled: Boolean,
  rows: Number,
  placeholder: String,
  // form-create 注入
  formCreateInject: Object,
  // 模板列表：[{ name: '模板名', value: '模板内容', id?: string }]
  templates: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

const data = ref(props.modelValue || '')

const templates = computed(() => props.templates || [])

const changeInput = (val) => {
  emit('update:modelValue', val)
}

const chooseTemplate = (value) => {
  data.value = value
  emit('update:modelValue', value)
}

watch(
  () => props.modelValue,
  (val) => {
    data.value = val || ''
  }
)

// 暴露方法供外部调用（如通过 ref 注入内容）
defineExpose({
  appendValue(val) {
    const current = data.value || ''
    data.value = current ? `${current}\n${val}` : val
    emit('update:modelValue', data.value)
  },
  setValue(val) {
    data.value = val
    emit('update:modelValue', val)
  },
})
</script>
