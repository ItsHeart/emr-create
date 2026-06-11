<template>
  <n-space>
    <n-text type="error" delete v-if="display.old && display.new">
      {{ display.old }}
    </n-text>
    <n-text v-if="display.old && !display.new">
      {{ display.old }}
    </n-text>
    <n-text type="success" v-if="display.new">
      {{ display.new }}
    </n-text>
    <n-text v-if="!display.old && !display.new" depth="3">
      —
    </n-text>
  </n-space>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  // modelValue: { old: string, new: string }
  modelValue: Object,
  formCreateInject: Object,
  // 用于字典翻译的选项列表
  options: Array,
  // 原始字段类型，用于判断是否需要字典翻译
  fieldType: String,
})

const display = computed(() => {
  const data = props.modelValue || { old: '', new: '' }
  const needTranslate =
    props.fieldType === 'select' ||
    props.fieldType === 'multipleSelect' ||
    props.fieldType === 'radio' ||
    (props.formCreateInject && props.formCreateInject.rule && (
      props.formCreateInject.rule._type === 'select' ||
      props.formCreateInject.rule._type === 'multipleSelect' ||
      props.formCreateInject.rule._type === 'radio'
    ))

  const opts = props.options ||
    (props.formCreateInject && props.formCreateInject.options) || []

  if (needTranslate && opts.length) {
    return {
      old: data.old ? translateValue(opts, data.old) : '',
      new: data.new ? translateValue(opts, data.new) : '',
    }
  }
  return data
})

function translateValue(options, value) {
  if (!value) return ''
  if (String(value).indexOf(',') !== -1) {
    return value
      .split(',')
      .map((v) => {
        const opt = options.find((o) => String(o.value) === String(v))
        return opt ? opt.label : v
      })
      .join(', ')
  }
  const opt = options.find((o) => String(o.value) === String(value))
  return opt ? opt.label : value
}
</script>
