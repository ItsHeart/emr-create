<template>
  <div v-show="visible" style="width: 100%">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: [String, Number, Boolean, Array],
  formCreateInject: Object,
  // 控制显示的条件值，可以是单个值或数组
  showWhen: [String, Number, Boolean, Array],
  // 反转条件：当值不等于 showWhen 时显示
  inverse: {
    type: Boolean,
    default: false,
  },
})

const visible = computed(() => {
  const current = props.modelValue
  const condition = props.showWhen

  if (condition === undefined || condition === null) return true

  let match = false
  if (Array.isArray(condition)) {
    match = condition.includes(current)
  } else {
    match = current === condition || String(current) === String(condition)
  }

  return props.inverse ? !match : match
})
</script>
