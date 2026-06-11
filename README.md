# emr-create

基于 [@form-create/naive-ui](https://github.com/xaboy/form-create) 的医疗表单增强组件库，提供开箱即用的自定义组件、表单配置预设和工具函数。

## 特性

- 🧩 **8 个自定义组件** — 模板文本、分区标题、多选存储、远程搜索、修改痕迹、只读展示、条件分组
- ⚙️ **配置预设** — `createOption` 工厂函数，快速生成 form-create 全局配置
- 🛠️ **规则辅助** — 一行代码创建 input / select / number / date 等字段规则
- 🔗 **组合式 API** — `useFormCreate` 封装验证、提交、隐藏、差异对比等常用操作
- 📖 **字典翻译** — 通用的值→标签翻译工具
- 🎯 **Vue 插件** — 一行代码注册所有组件到 form-create

## 安装

```bash
npm install emr-create @form-create/naive-ui naive-ui vue
```

## 快速开始

```js
import { createApp } from 'vue'
import naive from 'naive-ui'
import formCreate from '@form-create/naive-ui'
import EmrCreate from 'emr-create'

const app = createApp(App)
app.use(naive)
app.use(formCreate)
app.use(EmrCreate, { formCreate })
app.mount('#app')
```

然后在你的组件中使用：

```vue
<template>
  <form-create :option="option" :rule="rule" v-model:api="fApi" />
</template>

<script setup>
import { ref } from 'vue'
import { compactOption, divider, inputField, selectField } from 'emr-create'

const fApi = ref(null)
const option = compactOption

const rule = [
  divider('基本信息'),
  inputField({ field: 'name', title: '姓名', required: true }),
  selectField({
    field: 'sex',
    title: '性别',
    required: true,
    options: [
      { label: '男', value: '1' },
      { label: '女', value: '2' },
    ],
  }),
]
</script>
```

## 组件

| 组件名 | Rule Type | 说明 |
|--------|-----------|------|
| `templateText` | templateText | 带模板按钮的文本域，支持通过 props 传入模板列表，点击一键填入 |
| `dividerTitle` | dividerTitle | 表单分区标题，用于视觉分隔不同字段组 |
| `multipleSelect` | multipleSelect | 多选选择器，值以逗号分隔字符串存储，兼容后端 |
| `remoteSelect` | remoteSelect | 远程搜索选择器，支持传入 `fetchOptions` 函数或 `url` 配置 |
| `ModifyItem` | ModifyItem | 修改痕迹对比展示，自动翻译字典值（old 删除线 + new 绿色） |
| `onlyShow` | onlyShow | 只读文本展示 |
| `ReadItem` | ReadItem | 只读展示 + 自动字典翻译 |
| `conditionalGroup` | conditionalGroup | 条件分组，根据绑定值控制内部内容的显示/隐藏 |

### TemplateText

```js
{
  type: 'templateText',
  field: 'remark',
  title: '备注',
  props: {
    templates: [
      { name: '正常', value: '各项正常' },
      { name: '异常', value: '需进一步检查' },
    ],
    rows: 4,
  },
  col: { span: 24 },
}
```

提供 `actions` 插槽用于自定义额外按钮。通过 ref 可调用 `appendValue(val)` 和 `setValue(val)` 方法。

### MultipleSelect

值格式：逗号分隔字符串（如 `"1,2,3"`），自动与数组互转。

```js
{
  type: 'multipleSelect',
  field: 'symptoms',
  title: '症状',
  options: [
    { label: '头痛', value: 'headache' },
    { label: '发热', value: 'fever' },
  ],
}
```

### RemoteSelect

```js
{
  type: 'remoteSelect',
  field: 'diagnosis',
  title: '诊断',
  props: {
    fetchOptions: async (keyword) => {
      const res = await api.searchDiagnosis(keyword)
      return res.map(item => ({ label: item.name, value: item.code }))
    },
    multiple: true,
  },
}
```

或使用 URL 模式：

```js
{
  type: 'remoteSelect',
  field: 'diagnosis',
  title: '诊断',
  props: {
    url: '/api/diagnosis/search',
    labelField: 'name',
    valueField: 'code',
  },
}
```

### ConditionalGroup

根据绑定值条件性显示内容：

```js
{
  type: 'conditionalGroup',
  props: {
    showWhen: ['1', '2'],  // 当值为 '1' 或 '2' 时显示
  },
  children: [/* 子规则 */],
}
```

## 预设配置

```js
import { createOption, compactOption, mediumOption, wideOption } from 'emr-create'

// 内置预设
compactOption  // 4列紧凑布局 (labelWidth: 80px, cols: 6)
mediumOption   // 3列中等布局 (labelWidth: 100px, cols: 8)
wideOption     // 单列宽布局 (labelWidth: 140px, cols: 24)

// 自定义
const myOption = createOption({
  labelWidth: '120px',
  cols: 12,
  size: 'medium',
  gutter: [12, 8],
})
```

### createOption 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| labelWidth | string | '80px' | 标签宽度 |
| labelAlign | string | 'left' | 标签对齐 |
| size | string | 'small' | 组件尺寸 |
| cols | number | 6 | 栅格跨度 |
| gutter | Array | [8, 6] | 行间距 |
| showSubmit | boolean | false | 显示提交按钮 |
| showReset | boolean | false | 显示重置按钮 |
| inputNumberMin | number | 0 | InputNumber 最小值 |
| clearable | boolean | true | select/date 可清空 |

## 规则辅助函数

```js
import {
  divider,
  hiddenField,
  inputField,
  selectField,
  numberField,
  dateField,
  multipleSelectField,
  templateTextField,
  buildSuffix,
  buildRedLabel,
} from 'emr-create'
```

| 函数 | 说明 | 示例 |
|------|------|------|
| `divider(title, span?)` | 分区标题 | `divider('基本信息')` |
| `hiddenField(field, value?)` | 隐藏字段 | `hiddenField('id')` |
| `inputField({ field, title, required?, span?, props? })` | 输入框 | `inputField({ field: 'name', title: '姓名', required: true })` |
| `selectField({ field, title, options, required?, span? })` | 下拉选择 | 见上方示例 |
| `numberField({ field, title, suffix?, min?, max?, span? })` | 数字输入 | `numberField({ field: 'age', title: '年龄', suffix: '岁' })` |
| `dateField({ field, title, required?, type?, span? })` | 日期选择 | `dateField({ field: 'birthday', title: '出生日期' })` |
| `multipleSelectField({ field, title, options, span? })` | 多选 | 见上方示例 |
| `templateTextField({ field, title, templates?, rows?, span? })` | 模板文本 | 见上方示例 |
| `buildSuffix(suffix)` | 后缀单位 | `{ ...buildSuffix('kg') }` |
| `buildRedLabel(title)` | 红色标签 | `{ ...buildRedLabel('姓名') }` |

## 组合式 API

```js
import { useFormCreate } from 'emr-create'

const {
  fApi,        // ref - form-create API 实例
  rule,        // ref - 表单规则
  option,      // ref - 表单配置
  loading,     // ref - 加载状态

  coverValue,  // (data) => void - 批量覆盖值
  getValue,    // (field) => value - 获取字段值
  setValue,    // (field, value) => void - 设置字段值
  resetFields, // () => void - 重置表单
  getFormData, // () => object - 获取全部数据

  validate,    // () => Promise<formData> - 验证（Promise 化）
  submitForm,  // (submitFn, extraData?) => Promise - 验证+提交
  setHidden,   // (fields, hidden) => void - 批量隐藏/显示
  setDisabled, // (fields, disabled) => void - 批量禁用/启用
  getDiff,     // (initialData) => diffObj - 获取变更差异
} = useFormCreate({
  rule: myRule,
  option: compactOption,
})
```

### submitForm 用法

```js
const save = async () => {
  try {
    await submitForm(
      (data) => api.save(data),
      { visitId: '12345' }  // 额外附加数据
    )
    message.success('保存成功')
  } catch (e) {
    message.error(e.message)
  }
}
```

### getDiff 用法

```js
// 加载初始数据
const initialData = await api.load(id)
coverValue(initialData)

// 保存时获取变更
const diff = getDiff(initialData)
// => { name: { old: '张三', new: '李四' }, age: { old: 25, new: 26 } }
```

## 字典工具

```js
import { translateDict, createDictTranslator, findOption } from 'emr-create'

// 单次翻译
const sexOptions = [{ label: '男', value: '1' }, { label: '女', value: '2' }]
translateDict(sexOptions, '1')      // => '男'
translateDict(sexOptions, '1,2')    // => '男, 女'

// 创建全局翻译器
const transDic = createDictTranslator({
  sex: sexOptions,
  education: [{ label: '本科', value: '1' }],
})
transDic('sex', '1')  // => '男'
```

## 开发

```bash
# 安装依赖
pnpm install

# 启动 demo
pnpm dev

# 构建库
pnpm build
```

## 发布

```bash
pnpm build
npm publish
```

## 浏览器支持

支持所有现代浏览器，与 Vue 3 和 Naive UI 的浏览器支持范围一致。

## 依赖关系

| 依赖 | 类型 | 最低版本 |
|------|------|---------|
| vue | peer | >=3.3.0 |
| @form-create/naive-ui | peer | >=3.1.0 |
| naive-ui | peer | >=2.34.0 |

## License

[MIT](./LICENSE) © ItsHeart
