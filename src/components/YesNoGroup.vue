<template>
  <n-radio-group
    v-model:value="data"
    :disabled="props.disabled"
    size="small"
    @update:value="handleChange"
  >
    <n-radio-button
      v-for="opt in options"
      :key="opt.value"
      :value="opt.value"
    >
      {{ opt.label }}
    </n-radio-button>
  </n-radio-group>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  modelValue: [String, Number],
  disabled: Boolean,
  formCreateInject: Object,
  // 选项列表，默认 是/否/未知
  options: {
    type: Array,
    default: () => [
      { label: '是', value: '1' },
      { label: '否', value: '0' },
      { label: '未知', value: '9' },
    ],
  },
  withUnknown: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const data = ref(props.modelValue ?? null)

const options = computed(() => {
  if (props.options && props.options.length) return props.options
  const base = [
    { label: '是', value: '1' },
    { label: '否', value: '0' },
  ]
  if (props.withUnknown) {
    base.push({ label: '未知', value: '9' })
  }
  return base
})

const handleChange = (val) => {
  emit('update:modelValue', val)
}

watch(
  () => props.modelValue,
  (val) => {
    data.value = val ?? null
  }
)
</script>
