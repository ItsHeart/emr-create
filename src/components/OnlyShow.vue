<template>
  <n-text :depth="props.depth || 1">
    {{ displayValue }}
  </n-text>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: [String, Number],
  suffix: String,
  depth: Number,
  formCreateInject: Object,
})

const displayValue = computed(() => {
  const val = props.modelValue
  if (val === null || val === undefined || val === '') return '—'
  return props.suffix ? `${val} ${props.suffix}` : val
})
</script>
