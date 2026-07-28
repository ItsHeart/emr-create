<template>
  <n-space vertical :size="8" style="width: 100%">
    <n-grid :cols="24" :x-gap="8" :y-gap="6">
      <!-- 体温 -->
      <n-gi :span="6">
        <n-input-number
          v-model:value="data.temperature"
          :min="35"
          :max="42"
          :precision="1"
          :show-button="false"
          :disabled="props.disabled"
          placeholder="体温"
          size="small"
          style="width: 100%"
          @update:value="handleChange"
        >
          <template #suffix>°C</template>
        </n-input-number>
      </n-gi>
      <!-- 脉搏 -->
      <n-gi :span="6">
        <n-input-number
          v-model:value="data.pulse"
          :min="20"
          :max="250"
          :show-button="false"
          :disabled="props.disabled"
          placeholder="脉搏"
          size="small"
          style="width: 100%"
          @update:value="handleChange"
        >
          <template #suffix>次/分</template>
        </n-input-number>
      </n-gi>
      <!-- 呼吸 -->
      <n-gi :span="6">
        <n-input-number
          v-model:value="data.breath"
          :min="5"
          :max="60"
          :show-button="false"
          :disabled="props.disabled"
          placeholder="呼吸"
          size="small"
          style="width: 100%"
          @update:value="handleChange"
        >
          <template #suffix>次/分</template>
        </n-input-number>
      </n-gi>
      <!-- 血压 -->
      <n-gi :span="6">
        <n-space :size="4" :wrap="false">
          <n-input-number
            v-model:value="data.systolic"
            :min="60"
            :max="260"
            :show-button="false"
            :disabled="props.disabled"
            placeholder="收缩压"
            size="small"
            style="width: 80px"
            @update:value="handleChange"
          />
          <span>/</span>
          <n-input-number
            v-model:value="data.diastolic"
            :min="30"
            :max="160"
            :show-button="false"
            :disabled="props.disabled"
            placeholder="舒张压"
            size="small"
            style="width: 80px"
            @update:value="handleChange"
          />
          <span>mmHg</span>
        </n-space>
      </n-gi>
    </n-grid>
    <!-- 异常提示 -->
    <n-space v-if="warnings.length" :size="4">
      <n-tag v-for="w in warnings" :key="w" size="small" type="warning">{{ w }}</n-tag>
    </n-space>
  </n-space>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  // { temperature, pulse, breath, systolic, diastolic }
  modelValue: Object,
  disabled: Boolean,
  formCreateInject: Object,
})

const emit = defineEmits(['update:modelValue'])

const data = ref({
  temperature: null,
  pulse: null,
  breath: null,
  systolic: null,
  diastolic: null,
})

const warnings = computed(() => {
  const list = []
  const d = data.value
  if (d.temperature !== null && d.temperature >= 37.3) list.push('发热')
  if (d.temperature !== null && d.temperature < 36) list.push('体温偏低')
  if (d.pulse !== null && d.pulse > 100) list.push('心动过速')
  if (d.pulse !== null && d.pulse < 60) list.push('心动过缓')
  if (d.breath !== null && d.breath > 20) list.push('呼吸急促')
  if (d.systolic !== null && d.systolic >= 140) list.push('收缩压偏高')
  if (d.diastolic !== null && d.diastolic >= 90) list.push('舒张压偏高')
  if (d.systolic !== null && d.systolic < 90) list.push('血压偏低')
  return list
})

const handleChange = () => {
  emit('update:modelValue', { ...data.value })
}

watch(
  () => props.modelValue,
  (val) => {
    if (val && typeof val === 'object') {
      data.value = {
        temperature: val.temperature ?? null,
        pulse: val.pulse ?? null,
        breath: val.breath ?? null,
        systolic: val.systolic ?? null,
        diastolic: val.diastolic ?? null,
      }
    }
  },
  { immediate: true, deep: true }
)
</script>
