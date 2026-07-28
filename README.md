# emr-create

基于 [@form-create/naive-ui](https://github.com/xaboy/form-create) 的医疗表单增强组件库，提供开箱即用的自定义组件、表单配置预设和工具函数。

## 特性

- 🧩 **14 个自定义组件** — 模板文本、分区标题、多选存储、远程搜索、修改痕迹、只读展示、条件分组、生命体征、ICD 诊断选择、药品录入、手写签名、是否未知三态、打印模板
- ⚙️ **配置预设** — `createOption` 工厂函数，快速生成 form-create 全局配置
- 🛠️ **规则辅助** — 一行代码创建 input / select / number / date / yesNo / icd 等字段规则
- 🔗 **组合式 API** — `useFormCreate` / `useFormDraft` / `useFormPrint` / `useFormLinkage` / `useDictBatch`
- ✅ **医疗校验器** — 身份证、手机号、体温、血压、脉搏、日期先后等 13 个开箱即用校验器
- 🖨️ **格式化工具** — 日期、血压、ICD 编码、住院天数等展示格式化
- 💾 **草稿暂存** — 基于 localStorage 的表单数据防丢失
- 📖 **字典翻译** — 通用的值→标签翻译工具
- 📦 **按需引入** — 支持 `emr-create/components`、`emr-create/utils`、`emr-create/composables` 子路径导入
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

const rule = ref([
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
])
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
| `VitalSigns` | vitalSigns | 生命体征录入（体温/脉搏/呼吸/血压），超出正常范围自动预警 |
| `IcdCodeSelect` | icdCodeSelect | ICD 诊断编码选择器，防抖远程搜索 + 编码/名称双列展示 |
| `MedicationInput` | medicationInput | 药品医嘱录入，多行「药名/剂量/单位/频次/途径」，值为数组 |
| `SignaturePad` | signaturePad | Canvas 手写签名板，支持撤销/清除/触屏，值为 Base64 图片 |
| `YesNoGroup` | yesNoGroup | 是/否/未知 三态单选按钮组（值 `'1'`/`'0'`/`'9'`） |
| `PrintTemplate` | printTemplate | 病历打印模板容器，提供页眉/标题/页脚插槽 |

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

### VitalSigns

生命体征录入，值为对象 `{ temperature, pulse, breath, systolic, diastolic }`，超出正常范围时字段旁自动显示预警标签：

```js
{
  type: 'vitalSigns',
  field: 'vitalSigns',
  title: '生命体征',
  col: { span: 24 },
}
```

### IcdCodeSelect

ICD 诊断编码远程搜索选择器（输入防抖 300ms），下拉项以「编码 + 名称」双列渲染：

```js
{
  type: 'icdCodeSelect',
  field: 'diagnosis',
  title: '出院诊断',
  props: {
    // 方式一：自定义搜索函数，返回 [{ code, name }] 结构
    fetchOptions: async (keyword) => api.searchIcd(keyword),
    // 方式二：URL 模式
    // url: '/api/icd/search',
    codeField: 'code',      // 编码字段名，默认 'code'
    nameField: 'name',      // 名称字段名，默认 'name'
    multiple: false,
  },
}
```

### MedicationInput

药品医嘱录入，值为数组 `[{ name, dose, doseUnit, frequency, route }]`，支持动态增删行：

```js
{
  type: 'medicationInput',
  field: 'medications',
  title: '出院带药',
  col: { span: 24 },
}
```

### SignaturePad

Canvas 手写签名，值为 Base64 PNG 图片，支持鼠标/触屏书写。通过 ref 可调用 `clear()`、`undo()`、`isEmpty()`：

```js
{
  type: 'signaturePad',
  field: 'doctorSign',
  title: '医师签名',
  col: { span: 24 },
}
```

### YesNoGroup

是/否/未知 三态按钮组，值约定 `'1'` 是 / `'0'` 否 / `'9'` 未知（推荐直接使用 `yesNoField` 规则函数）：

```js
{
  type: 'yesNoGroup',
  field: 'allergyHistory',
  title: '过敏史',
  props: {
    withUnknown: true,  // 是否包含「未知」选项，默认 true
  },
}
```

### PrintTemplate

病历打印模板容器，提供 `header` / `title` / `footer` 等插槽，配合 `useFormPrint` 使用；通过 ref 可调用 `getPrintElement()` 获取打印区域 DOM。

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
  yesNoField,
  icdField,
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
| `yesNoField({ field, title, required?, span?, withUnknown? })` | 是/否/未知三态 | `yesNoField({ field: 'allergyHistory', title: '过敏史' })` |
| `icdField({ field, title, required?, multiple?, span?, fetchOptions })` | ICD 诊断选择 | `icdField({ field: 'diagnosis', title: '诊断', fetchOptions: searchIcd })` |
| `buildSuffix(suffix)` | 后缀单位 | `{ ...buildSuffix('kg') }` |
| `buildRedLabel(title)` | 红色标签 | `{ ...buildRedLabel('姓名') }` |

## 医疗校验器

所有校验器返回 form-create `validate` 规则对象，可直接放入规则的 `validate` 数组：

```js
import { idCardValidator, temperatureValidator } from 'emr-create'

{
  type: 'input',
  field: 'idCard',
  title: '身份证号',
  validate: [idCardValidator()],
}

{ type: 'InputNumber', field: 'temperature', title: '体温', validate: [temperatureValidator()] }
```

| 校验器 | 说明 |
|--------|------|
| `idCardValidator(message?)` | 身份证号（15 位 / 18 位） |
| `phoneValidator(message?)` | 手机号 |
| `rangeValidator(min, max, label?)` | 通用数值范围 |
| `temperatureValidator()` | 体温 35~42 °C |
| `systolicValidator()` | 收缩压 60~260 mmHg |
| `diastolicValidator()` | 舒张压 30~160 mmHg |
| `pulseValidator()` | 脉搏 20~250 次/分 |
| `breathValidator()` | 呼吸频率 5~60 次/分 |
| `bmiValidator()` | BMI 10~80 |
| `dateBeforeValidator(getFormData, otherField, label?, otherLabel?)` | 当前日期不能晚于另一字段 |
| `dateAfterValidator(getFormData, otherField, label?, otherLabel?)` | 当前日期不能早于另一字段 |
| `requiredValidator(title, trigger?)` | 必填快捷方式 |
| `maxLengthValidator(max, label?)` | 字符串最大长度 |

日期先后校验示例（与规则辅助函数配合）：

```js
const rule = dateField({ field: 'admitDate', title: '入院日期' })
rule.validate = [
  dateBeforeValidator(() => fApi.value.form, 'dischargeDate', '入院日期', '出院日期'),
]
```

## 格式化工具

```js
import { formatDate, formatBloodPressure, formatIcdCode, calcHospitalDays } from 'emr-create'

formatDate('2024-03-15T10:30:00')                  // => '2024-03-15'
formatDate(Date.now(), 'yyyy-MM-dd HH:mm')          // => '2024-03-15 10:30'
formatNumber(36.555, 1, '°C')                       // => '36.6°C'
formatBloodPressure(120, 80)                        // => '120/80 mmHg'
formatIcdCode('J18.9', '肺炎')                       // => '[J18.9] 肺炎'
formatMultiValue('头痛,发热')                        // => '头痛、发热'
calcHospitalDays('2024-03-01', '2024-03-05')        // => 5
formatEmpty(null)                                   // => '—'
```

| 函数 | 说明 |
|------|------|
| `formatDate(value, fmt?)` | 日期格式化，默认 `'yyyy-MM-dd'` |
| `formatNumber(value, digits?, suffix?)` | 数值精度 + 后缀单位 |
| `formatBloodPressure(systolic, diastolic)` | 血压 `120/80 mmHg` |
| `formatIcdCode(code, name)` | 诊断 `[编码] 名称` |
| `formatMultiValue(value, separator?)` | 逗号分隔值/数组 → 顿号拼接 |
| `calcHospitalDays(admitDate, dischargeDate)` | 住院天数（首尾当天均计） |
| `formatEmpty(value, placeholder?)` | 空值占位，默认 `'—'` |

## 草稿暂存

基于 localStorage / sessionStorage 的表单数据防丢失（存储前缀 `emr-create-draft:`）：

```js
import { saveDraft, loadDraft, removeDraft, hasDraft, getDraftTime } from 'emr-create'

saveDraft('admission_001', fApi.value.formData())

const draft = loadDraft('admission_001', { maxAge: 24 * 60 * 60 * 1000 })  // 24小时内有效
if (draft) fApi.value.coverValue(draft)

removeDraft('admission_001')     // 删除草稿
hasDraft('admission_001')        // 是否存在
getDraftTime('admission_001')    // 保存时间戳
```

更推荐使用 `useFormDraft` 自动完成定时保存与恢复，见下方组合式 API。

## 组合式 API

### useFormCreate

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

### useFormDraft 草稿自动保存

```js
import { useFormDraft } from 'emr-create'

const { hasDraft, saveNow, restoreDraft, clearDraft, checkDraft } = useFormDraft({
  key: 'admission_' + patientId,  // 草稿标识（必传）
  fApi,                           // form-create API 的 ref
  interval: 30000,                // 自动保存间隔，默认 30 秒
  maxAge: 7 * 24 * 3600 * 1000,   // 草稿有效期，默认 7 天
  storage: 'local',               // 'local' | 'session'
  autoSave: true,                 // 定时自动保存
  saveOnClose: true,              // 页面关闭时保存
})

// 检测到草稿后提示用户恢复
if (hasDraft.value) {
  restoreDraft()  // 恢复草稿到表单
}
clearDraft()      // 提交成功后清除草稿
```

### useFormPrint 表单打印

采用隐藏 iframe 安全打印，不弹新窗口、不污染当前页面：

```js
import { useFormPrint } from 'emr-create'

const { printing, printForm, printHTML, formDataToTable } = useFormPrint({
  title: '入院记录',
  orientation: 'portrait',  // 'portrait' | 'landscape'
  pageSize: 'A4',
})

// 打印指定 DOM 区域（如 PrintTemplate 的 getPrintElement()）
printForm(printRef.value.getPrintElement())

// 表单数据转打印表格
const html = formDataToTable(fApi.value.formData(), fieldLabels)
```

### useFormLinkage 字段联动

```js
import { useFormLinkage } from 'emr-create'

const { addLinkage, removeAll } = useFormLinkage({
  fApi,
  linkages: [
    {
      watch: 'marriage',                // 监听单个字段
      handler(value, api) {
        api.hidden(value !== '1', 'spouseName')
      },
    },
    {
      watch: ['height', 'weight'],      // 监听多个字段，自动计算 BMI
      handler([h, w], api) {
        if (h && w) api.setValue('bmi', Number((w / ((h / 100) ** 2)).toFixed(1)))
      },
      immediate: true,                  // 是否立即执行一次
    },
  ],
})
```

### useDictBatch 字典批量加载

```js
import { useDictBatch } from 'emr-create'

const { loading, optionsMap, loadDict, loadDicts, getOptions, clearCache, refreshDict } = useDictBatch({
  fetcher: async (name) => {
    const res = await fetch(`/api/dict/${name}`)
    return res.json()  // => [{ label, value }]
  },
  cache: true,  // 内存缓存，同名字典不重复请求
})

// 批量加载
await loadDicts(['sex', 'education', 'marriage'])

// 注入到规则
selectField({ field: 'sex', title: '性别', options: getOptions('sex') })
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

## 按需引入

除主入口外，支持子路径导入，只引用需要的部分：

```js
// 仅引入组件（需自行通过 formCreate.component() 注册）
import { VitalSigns, IcdCodeSelect } from 'emr-create/components'

// 仅引入工具函数（规则辅助/校验器/格式化/草稿/字典）
import { inputField, idCardValidator, formatDate, saveDraft } from 'emr-create/utils'

// 仅引入组合式 API
import { useFormCreate, useFormDraft } from 'emr-create/composables'
```

## 开发

```bash
# 安装依赖
pnpm i

# 启动 demo
pnpm run dev

# 构建
pnpm run build
```

Demo 包含 6 个 Tab 场景：基础表单、入院记录（综合示例）、修改痕迹、动态联动、远程数据、打印预览。


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
