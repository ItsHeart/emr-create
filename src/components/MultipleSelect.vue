<template>
  <n-select
    v-model:value="data"
    multiple
    filterable
    clearable
    :options="options"
    :disabled="props.disabled"
    :placeholder="props.placeholder || '请选择'"
    style="width: 100%"
    @update:value="handleUpdateValue"
  />
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  modelValue: String,
  disabled: Boolean,
  placeholder: String,
  // form-create 注入
  formCreateInject: Object,
  // 也可以直接传 options
  options: Array,
})

const emit = defineEmits(['update:modelValue'])

const options = computed(() => {
  return props.options || (props.formCreateInject && props.formCreateInject.options) || []
})

const data = ref([])

const handleUpdateValue = (value) => {
  emit('update:modelValue', value.join(','))
}

watch(
  () => props.modelValue,
  (val) => {
    data.value = val ? val.split(',') : []
  },
  { immediate: true }
)
</script>
