<template>
  <form-create :option="props.option" :rule="formRule" v-model:api="modifyRecordFApi" />
</template>

<script setup>
import { ref, defineProps, watch, nextTick } from "vue";
import { deepClone } from "../utils/rule-helper.js";

const props = defineProps({
  rule: {
    type: Object,
    default: () => ({})
  },
  option: {
    type: Object,
    default: () => ({})
  },
  modifyData: {
    type: Object,
    default: () => ({ oldJson: '{}', newJson: '{}' })
  },
});

const modifyRecordFApi = ref();
const formRule = ref([]);

const transRule = (item) => {
  if (item.control) item.control = null;
  if (item.update) item.update = null;
  switch (item.type) {
    case "hidden":
      return null;
    case "dividerTitle":
      return { ...item };
    case "fragment":
      if (item.children) {
        item.children.forEach((childItem) => {
          let obj = transRule(childItem);
          if (obj) formRule.value.push(obj);
        });
      }
      return null;
    default:
      return Object.assign({ ...item }, { type: "modifyItem", _type: item.type });
  }
};

// 生成规则
const initRule = () => {
  formRule.value = [];
  const rule = deepClone(props.rule);
  rule.forEach((item) => {
    let obj = transRule(item);
    if (obj) formRule.value.push(obj);
  });
};

const setFormValue = () => {
  const api = modifyRecordFApi.value;
  if (!api) return;

  try {
    const oldObj = props.modifyData.oldObj || {};
    const newObj = props.modifyData.newObj || {};
    console.log(oldObj, newObj);
    let formData = {};

    for (let key in oldObj) {
      formData[key] = { old: oldObj[key], new: "" };
    }
    for (let key in newObj) {
      if (!formData[key]) {
        formData[key] = { old: "", new: newObj[key] };
      } else if (formData[key].old != newObj[key]) {
        formData[key].new = newObj[key];
      }
    }
    console.log(formData)
    if (formData) {
      api.coverValue(formData);
      api.reload();
    }

  } catch (err) {
    console.error('赋值失败', err);
  }
};

watch(() => props.rule, () => {
  initRule();
}, { immediate: true });

watch(() => props.modifyData, async () => {
  initRule();
  await nextTick();
  setFormValue();
}, { deep: true });

</script>