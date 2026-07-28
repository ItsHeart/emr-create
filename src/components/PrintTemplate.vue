<template>
  <div class="print-template" ref="printRef">
    <!-- 页眉 -->
    <div v-if="props.header || $slots.header" class="print-header">
      <slot name="header">
        <span>{{ props.header }}</span>
      </slot>
    </div>

    <!-- 标题 -->
    <div v-if="props.title" class="print-title">
      {{ props.title }}
    </div>

    <!-- 主体内容 -->
    <div class="print-body">
      <slot />
    </div>

    <!-- 页脚 -->
    <div v-if="props.footer || $slots.footer" class="print-footer">
      <slot name="footer">
        <span>{{ props.footer }}</span>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  formCreateInject: Object,
  // 打印标题
  title: {
    type: String,
    default: '',
  },
  // 页眉内容
  header: {
    type: String,
    default: '',
  },
  // 页脚内容
  footer: {
    type: String,
    default: '',
  },
  // 纸张大小
  pageSize: {
    type: String,
    default: 'A4',
  },
  // 纸张方向
  orientation: {
    type: String,
    default: 'portrait',
  },
})

const printRef = ref(null)

/**
 * 获取打印区域 DOM（供 useFormPrint 使用）
 */
function getPrintElement() {
  return printRef.value
}

defineExpose({
  getPrintElement,
})
</script>

<style scoped>
.print-template {
  padding: 20px;
  background: #fff;
}
.print-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
  font-size: 12px;
  color: #666;
  margin-bottom: 12px;
}
.print-title {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
}
.print-body {
  min-height: 100px;
}
.print-footer {
  margin-top: 20px;
  padding-top: 8px;
  border-top: 1px solid #eee;
  font-size: 12px;
  color: #666;
  display: flex;
  justify-content: space-between;
}

@media print {
  .print-template {
    padding: 0;
  }
  .print-header,
  .print-footer {
    border-color: #000;
    color: #000;
  }
}
</style>
