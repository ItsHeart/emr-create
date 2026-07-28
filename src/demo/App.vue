<template>
  <n-config-provider>
    <n-layout content-style="padding: 24px; max-width: 1400px; margin: 0 auto;">
      <n-h2>emr-create 组件库示例</n-h2>
      <n-tabs type="line" animated>
        <n-tab-pane name="basic" tab="基础表单">
          <BasicForm />
        </n-tab-pane>
        <n-tab-pane name="admission" tab="入院记录">
          <AdmissionForm />
        </n-tab-pane>
        <n-tab-pane name="linkage" tab="字段联动">
          <DynamicLinkage />
        </n-tab-pane>
        <n-tab-pane name="modify" tab="修改痕迹">
          <ModifyTrace />
        </n-tab-pane>
        <n-tab-pane name="remote" tab="远程数据">
          <RemoteData />
        </n-tab-pane>
        <n-tab-pane name="print" tab="打印预览">
          <PrintPreview />
        </n-tab-pane>
      </n-tabs>
    </n-layout>
  </n-config-provider>
</template>

<script setup>
import BasicForm from './BasicForm.vue'
import AdmissionForm from './AdmissionForm.vue'
import DynamicLinkage from './DynamicLinkage.vue'
import ModifyTrace from './ModifyTrace.vue'
import RemoteData from './RemoteData.vue'
import PrintPreview from './PrintPreview.vue'
</script>
