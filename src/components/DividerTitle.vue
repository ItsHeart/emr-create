<template>
  <n-divider title-placement="left" :style="props.style || 'margin: 6px 0'">
    {{ props.title }}
  </n-divider>
</template>

<script setup>
const props = defineProps({
  title: String,
  style: String,
  formCreateInject: Object,
})
</script>
