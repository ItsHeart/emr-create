<template>
  <n-text>
    {{ displayValue }}
  </n-text>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: [String, Number],
  formCreateInject: Object,
  // 也可以直接传 options
  options: Array,
  // 原始字段类型
  fieldType: String,
})

const displayValue = computed(() => {
  const val = props.modelValue
  if (val === null || val === undefined || val === '') return '—'

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
    return translateValue(opts, String(val))
  }
  return val
})

function translateValue(options, value) {
  if (!value) return '—'
  if (value.indexOf(',') !== -1) {
    return value
      .split(',')
      .map((v) => {
        const opt = options.find((o) => String(o.value) === v.trim())
        return opt ? opt.label : v
      })
      .join(', ')
  }
  const opt = options.find((o) => String(o.value) === value)
  return opt ? opt.label : value
}
</script>
