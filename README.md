<div align="center">

# 🩺 emr-create

### 医疗表单增强组件库 · 基于 `@form-create/naive-ui`

**病历表单：从手写 300 行 rule，到一个 `vitalSigns` 字段搞定**

<br/>

![version](https://img.shields.io/badge/version-1.0.3-2080f0?style=for-the-badge)
![license](https://img.shields.io/badge/license-Commercial%20Use%20Requires%20Payment-d03050?style=for-the-badge)
![Vue](https://img.shields.io/badge/Vue-3.x-42b883?style=for-the-badge&logo=vuedotjs&logoColor=white)
![Naive UI](https://img.shields.io/badge/Naive_UI-2.x-18a058?style=for-the-badge)
![form-create](https://img.shields.io/badge/form_create-3.x-f7b500?style=for-the-badge)

![Components](https://img.shields.io/badge/Components-14-0ea5e9?style=for-the-badge)
![Validators](https://img.shields.io/badge/Validators-13-8b5cf6?style=for-the-badge)
![Composables](https://img.shields.io/badge/Composables-5-06b6d4?style=for-the-badge)
![Formatters](https://img.shields.io/badge/Formatters-7-14b8a6?style=for-the-badge)

![stars](https://img.shields.io/github/stars/ItsHeart/emr-create?style=for-the-badge&color=f59e0b)
![updated](https://img.shields.io/github/last-commit/ItsHeart/emr-create?style=for-the-badge&color=64748b)
![issues](https://img.shields.io/github/issues/ItsHeart/emr-create?style=for-the-badge&color=22c55e)

<br/>

[快速开始](#quick-start) · [组件](#components) · [校验器](#validators) · [组合式 API](#composables) · [Demo](#demo) · [商业授权](#license)

</div>

> [!IMPORTANT]
> **许可已变更**：本项目不再使用 MIT 许可。非商业使用免费，**商业使用必须事先取得付费商业授权**。
> 完整条款见 [LICENSE](./LICENSE)，场景对照见 [许可与商业授权](#license)。

---

<a id="toc"></a>
## 📌 目录

| | | | |
|:--|:--|:--|:--|
| [特性](#features) | [为什么用它](#why) | [安装](#install) | [快速开始](#quick-start) |
| [组件（14 个）](#components) | [预设配置](#presets) | [规则辅助函数](#rule-helpers) | [医疗校验器](#validators) |
| [格式化工具](#formatters) | [草稿暂存](#draft) | [组合式 API](#composables) | [字典工具](#dict) |
| [按需引入](#subpath) | [Demo 演示](#demo) | [开发](#dev) | [依赖与兼容性](#compat) |
| [许可与商业授权](#license) | [致谢](#credits) | | |

---

<a id="features"></a>
## ✨ 特性

| | |
|:--|:--|
| 🧩 **14 个自定义组件** | 模板文本、分区标题、多选存储、远程搜索、修改痕迹、只读展示、条件分组、生命体征、ICD 诊断选择、药品录入、手写签名、是否未知三态、打印模板 |
| ⚙️ **配置预设** | `createOption` 工厂函数，快速生成 form-create 全局配置 |
| 🛠️ **规则辅助** | 一行代码创建 input / select / number / date / yesNo / icd 等字段规则 |
| 🔗 **组合式 API** | `useFormCreate` / `useFormDraft` / `useFormPrint` / `useFormLinkage` / `useDictBatch` |
| ✅ **医疗校验器** | 身份证、手机号、体温、血压、脉搏、日期先后等 13 个开箱即用校验器 |
| 🖨️ **格式化工具** | 日期、血压、ICD 编码、住院天数等展示格式化 |
| 💾 **草稿暂存** | 基于 localStorage 的表单数据防丢失 |
| 📖 **字典翻译** | 通用的值 → 标签翻译工具 |
| 📦 **按需引入** | 支持 `emr-create/components`、`emr-create/utils`、`emr-create/composables` 子路径导入 |
| 🎯 **Vue 插件** | 一行代码注册所有组件到 form-create |

<a id="why"></a>
## 🆚 为什么用它

| 你要做的病历表单 | 手写 form-create 规则 | 用 emr-create |
|:--|:--|:--|
| 生命体征（体温 / 脉搏 / 呼吸 / 血压）+ 超范围预警 | 4 个字段 + 4 段校验 + 自写预警样式 | 一个 `vitalSigns` 字段，预警内置 |
| 修改痕迹对比（旧值删除线 + 新值高亮 + 字典翻译） | 自己写 diff 逻辑与字典映射 | `ModifyItem` + `getDiff()` |
| ICD 诊断编码远程搜索 | 防抖 + loading + 双列渲染自己拼 | `icdField({ fetchOptions })` |
| 出院带药多行录入 | 数组套数组，字段名易错 | `medicationInput` 动态增删行 |
| 体温 35~42 ℃ / 收缩压 60~260 等校验 | 每个字段重复抄正则与提示语 | 13 个校验器直接放 `validate` 数组 |
| 表单防丢失草稿 | 定时器 + 存储 key + 恢复弹窗 | `useFormDraft({ key, fApi })` |
| 病历打印 | 新开窗口、样式串页 | `useFormPrint` 隐藏 iframe 安全打印 |

---

<a id="install"></a>
## 📦 安装

```bash
npm install emr-create @form-create/naive-ui naive-ui vue
```

```bash
pnpm add emr-create @form-create/naive-ui naive-ui vue
```

<a id="quick-start"></a>
## 🚀 快速开始

**Step 1 · 注册插件**

```js title="src/main.js"
import { createApp } from 'vue'
import naive from 'naive-ui'
import formCreate from '@form-create/naive-ui'
import EmrCreate from 'emr-create'

const app = createApp(App)
app.use(naive)
app.use(formCreate)
app.use(EmrCreate, { formCreate })   // 一次注册 14 个组件
app.mount('#app')
```

**Step 2 · 写规则**

```vue title="AdmissionForm.vue"
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

> [!TIP]
> 不想注册插件？也可以只引入需要的组件，用 `formCreate.component()` 手动注册，见 [按需引入](#subpath)。

---

<a id="components"></a>
## 🧩 组件（14 个）

注册后即可在 rule 中通过 `type` 使用。点击每个组件展开查看完整示例。

| 组件名 | Rule Type | 一句话说明 |
|:--|:--|:--|
| `templateText` | `templateText` | 带模板按钮的文本域，点击一键填入 |
| `dividerTitle` | `dividerTitle` | 表单分区标题，视觉分隔字段组 |
| `multipleSelect` | `multipleSelect` | 多选，值以逗号分隔字符串存储，兼容后端 |
| `remoteSelect` | `remoteSelect` | 远程搜索选择器，支持 `fetchOptions` 或 `url` |
| `ModifyItem` | `ModifyItem` | 修改痕迹对比，自动翻译字典（旧删除线 + 新绿色） |
| `onlyShow` | `onlyShow` | 只读文本展示 |
| `ReadItem` | `ReadItem` | 只读展示 + 自动字典翻译 |
| `conditionalGroup` | `conditionalGroup` | 条件分组，按绑定值控制内部内容显示 |
| `VitalSigns` | `vitalSigns` | 生命体征录入，超范围自动预警 |
| `IcdCodeSelect` | `icdCodeSelect` | ICD 诊断编码选择器，防抖搜索 + 编码/名称双列 |
| `MedicationInput` | `medicationInput` | 药品医嘱多行录入，值为数组 |
| `SignaturePad` | `signaturePad` | Canvas 手写签名，值为 Base64 图片 |
| `YesNoGroup` | `yesNoGroup` | 是 / 否 / 未知 三态单选组 |
| `PrintTemplate` | `printTemplate` | 病历打印模板容器，页眉/标题/页脚 props + 主体插槽 |

### 📝 录入类

<details>
<summary><b>TemplateText</b> — 模板文本域</summary>

<br/>

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

</details>

<details>
<summary><b>MultipleSelect</b> — 逗号分隔多选</summary>

<br/>

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

</details>

<details>
<summary><b>RemoteSelect</b> — 远程搜索选择器</summary>

<br/>

**方式一：自定义搜索函数**

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

**方式二：URL 模式**

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

</details>

<details>
<summary><b>VitalSigns</b> — 生命体征录入</summary>

<br/>

值为对象 `{ temperature, pulse, breath, systolic, diastolic }`，超出正常范围时字段旁自动显示预警标签。

```js
{
  type: 'vitalSigns',
  field: 'vitalSigns',
  title: '生命体征',
  col: { span: 24 },
}
```

</details>

<details>
<summary><b>IcdCodeSelect</b> — ICD 诊断编码选择</summary>

<br/>

远程搜索（输入防抖 300ms），下拉项以「编码 + 名称」双列渲染。

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

</details>

<details>
<summary><b>MedicationInput</b> — 药品医嘱录入</summary>

<br/>

值为数组 `[{ name, dose, doseUnit, frequency, route }]`，支持动态增删行。

```js
{
  type: 'medicationInput',
  field: 'medications',
  title: '出院带药',
  col: { span: 24 },
}
```

</details>

<details>
<summary><b>SignaturePad</b> — 手写签名板</summary>

<br/>

值为 Base64 PNG 图片，支持鼠标 / 触屏书写。通过 ref 可调用 `clear()`、`undo()`、`isEmpty()`。

```js
{
  type: 'signaturePad',
  field: 'doctorSign',
  title: '医师签名',
  col: { span: 24 },
}
```

</details>

<details>
<summary><b>YesNoGroup</b> — 是/否/未知三态</summary>

<br/>

值约定 `'1'` 是 / `'0'` 否 / `'9'` 未知（推荐直接使用 `yesNoField` 规则函数）。

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

</details>

### 👁 展示类

<details>
<summary><b>DividerTitle</b> / <b>OnlyShow</b> / <b>ReadItem</b> / <b>ModifyItem</b></summary>

<br/>

| 组件 | 用途 | 关键 props | 说明 |
|:--|:--|:--|:--|
| `dividerTitle` | 分区标题 | `title` | 视觉分隔不同字段组，推荐用 `divider()` |
| `onlyShow` | 只读文本 | `suffix`、`depth` | 直接展示值，空值显示 `—` |
| `ReadItem` | 只读 + 字典翻译 | `options`、`fieldType` | `fieldType` 为 `select` / `multipleSelect` / `radio` 时自动翻译值 |
| `ModifyItem` | 修改痕迹 | `options`、`fieldType` | 值形如 `{ old, new }`，旧值删除线 + 新值绿色 |

```js
// 分区标题（等价于 divider('基本信息')）
{ type: 'dividerTitle', props: { title: '基本信息' }, col: { span: 24 } }

// 只读展示，带后缀单位
{ type: 'onlyShow', field: 'patientNo', title: '住院号', props: { suffix: '床' } }

// 只读 + 字典翻译
{
  type: 'ReadItem',
  field: 'sex',
  title: '性别',
  props: { fieldType: 'select', options: [{ label: '男', value: '1' }] },
}

// 修改痕迹：值就是 { old, new } 对象
{
  type: 'ModifyItem',
  field: 'name',
  title: '姓名',
  value: { old: '张三', new: '李四' },
}
```

> [!TIP]
> 逐个字段手写 `ModifyItem` 规则很麻烦，仓库另提供了 `ModifyRecord.vue`：传入原表单的 `rule` / `option` 与 `{ oldObj, newObj }`，它会自动把每条规则转换成痕迹展示（Demo 的「修改痕迹」Tab 就是这么用的）。该组件目前**未从主入口导出**，需按路径引用：
>
> ```js
> import ModifyRecord from 'emr-create/src/components/ModifyRecord.vue'
> ```

</details>

### 🧱 分组与打印

<details>
<summary><b>ConditionalGroup</b> / <b>PrintTemplate</b></summary>

<br/>

**ConditionalGroup** — 根据绑定值条件性显示内容：

```js
{
  type: 'conditionalGroup',
  props: {
    showWhen: ['1', '2'],  // 当值为 '1' 或 '2' 时显示
  },
  children: [/* 子规则 */],
}
```

**PrintTemplate** — 病历打印模板容器：`title` / `header` / `footer` / `pageSize` / `orientation` 为 props，另提供 `header`、`footer` 与默认（主体）插槽；通过 ref 调用 `getPrintElement()` 交给 `useFormPrint` 打印。

```vue title="PrintDemo.vue"
<script setup>
import { ref } from 'vue'
import { PrintTemplate, useFormPrint } from 'emr-create'

const printRef = ref(null)
const { printing, printForm } = useFormPrint({ title: '入院记录' })

const handlePrint = () => printForm(printRef.value.getPrintElement())
</script>

<template>
  <PrintTemplate
    ref="printRef"
    title="入院记录"
    header="XX市人民医院"
    footer="打印时间：2026-10-09"
    page-size="A4"
    orientation="portrait"
  >
    <!-- 主体内容走默认插槽 -->
    <n-descriptions :column="2" label-placement="left">
      <n-descriptions-item label="姓名">张三</n-descriptions-item>
    </n-descriptions>
  </PrintTemplate>
  <n-button :loading="printing" @click="handlePrint">打印</n-button>
</template>
```

</details>

---

<a id="presets"></a>
## ⚙️ 预设配置

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
|:--|:--|:--|:--|
| `labelWidth` | string | `'80px'` | 标签宽度 |
| `labelAlign` | string | `'left'` | 标签对齐 |
| `size` | string | `'small'` | 组件尺寸 |
| `cols` | number | `6` | 栅格跨度 |
| `gutter` | Array | `[8, 6]` | 行间距 |
| `showSubmit` | boolean | `false` | 显示提交按钮 |
| `showReset` | boolean | `false` | 显示重置按钮 |
| `inputNumberMin` | number | `0` | InputNumber 最小值 |
| `clearable` | boolean | `true` | select/date 可清空 |

<a id="rule-helpers"></a>
## 🛠️ 规则辅助函数

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
|:--|:--|:--|
| `divider(title, span?)` | 分区标题 | `divider('基本信息')` |
| `hiddenField(field, value?)` | 隐藏字段 | `hiddenField('id')` |
| `inputField({ field, title, required?, span?, props? })` | 输入框 | `inputField({ field: 'name', title: '姓名', required: true })` |
| `selectField({ field, title, options, required?, span? })` | 下拉选择 | 见 [快速开始](#quick-start) |
| `numberField({ field, title, suffix?, min?, max?, span? })` | 数字输入 | `numberField({ field: 'age', title: '年龄', suffix: '岁' })` |
| `dateField({ field, title, required?, type?, span? })` | 日期选择 | `dateField({ field: 'birthday', title: '出生日期' })` |
| `multipleSelectField({ field, title, options, span? })` | 多选 | 见 [MultipleSelect](#components) |
| `templateTextField({ field, title, templates?, rows?, span? })` | 模板文本 | 见 [TemplateText](#components) |
| `yesNoField({ field, title, required?, span?, withUnknown? })` | 是/否/未知三态 | `yesNoField({ field: 'allergyHistory', title: '过敏史' })` |
| `icdField({ field, title, required?, multiple?, span?, fetchOptions })` | ICD 诊断选择 | `icdField({ field: 'diagnosis', title: '诊断', fetchOptions: searchIcd })` |
| `buildSuffix(suffix)` | 后缀单位 | `{ ...buildSuffix('kg') }` |
| `buildRedLabel(title)` | 红色标签 | `{ ...buildRedLabel('姓名') }` |

<a id="validators"></a>
## ✅ 医疗校验器

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
|:--|:--|
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

<details>
<summary>日期先后校验示例（与规则辅助函数配合）</summary>

<br/>

```js
const rule = dateField({ field: 'admitDate', title: '入院日期' })
rule.validate = [
  dateBeforeValidator(() => fApi.value.form, 'dischargeDate', '入院日期', '出院日期'),
]
```

</details>

<a id="formatters"></a>
## 🖨️ 格式化工具

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
|:--|:--|
| `formatDate(value, fmt?)` | 日期格式化，默认 `'yyyy-MM-dd'` |
| `formatNumber(value, digits?, suffix?)` | 数值精度 + 后缀单位 |
| `formatBloodPressure(systolic, diastolic)` | 血压 `120/80 mmHg` |
| `formatIcdCode(code, name)` | 诊断 `[编码] 名称` |
| `formatMultiValue(value, separator?)` | 逗号分隔值/数组 → 顿号拼接 |
| `calcHospitalDays(admitDate, dischargeDate)` | 住院天数（首尾当天均计） |
| `formatEmpty(value, placeholder?)` | 空值占位，默认 `'—'` |

<a id="draft"></a>
## 💾 草稿暂存

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

> [!TIP]
> 更推荐使用 `useFormDraft` 自动完成定时保存与恢复，见 [组合式 API](#composables)。

---

<a id="composables"></a>
## 🔗 组合式 API

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

<details>
<summary><b>submitForm</b> 用法</summary>

<br/>

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

</details>

<details>
<summary><b>getDiff</b> 用法（输出结构即 `ModifyItem` 的值结构）</summary>

<br/>

```js
// 加载初始数据
const initialData = await api.load(id)
coverValue(initialData)

// 保存时获取变更
const diff = getDiff(initialData)
// => { name: { old: '张三', new: '李四' }, age: { old: 25, new: 26 } }
```

</details>

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

<a id="dict"></a>
## 📖 字典工具

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

<a id="subpath"></a>
## 📦 按需引入

除主入口外，支持子路径导入，只引用需要的部分：

```js
// 仅引入组件（需自行通过 formCreate.component() 注册）
import { VitalSigns, IcdCodeSelect } from 'emr-create/components'

// 仅引入工具函数（规则辅助/校验器/格式化/草稿/字典）
import { inputField, idCardValidator, formatDate, saveDraft } from 'emr-create/utils'

// 仅引入组合式 API
import { useFormCreate, useFormDraft } from 'emr-create/composables'
```

> [!NOTE]
> `deepClone(source)` 只从 `emr-create/utils` 导出，主入口 `emr-create` 未导出。

---

<a id="demo"></a>
## 🎬 Demo 演示

仓库内置可运行 Demo，`pnpm run dev` 后浏览器打开终端给出的地址即可，共 6 个 Tab：

| Tab | 演示内容 |
|:--|:--|
| **基础表单** | 规则辅助函数（input / select / number / date / multipleSelect / templateText）+ `compactOption` + `buildSuffix` |
| **入院记录** | 多分区布局、身份证与手机号校验、`yesNoField` 三态、`medicationInput` 出院带药、`signaturePad` 医师签名 |
| **字段联动** | `useFormLinkage`：婚姻状况→配偶字段显隐、身高体重→自动算 BMI、吸烟史→吸烟量显隐 |
| **修改痕迹** | `ModifyRecord` 组件，左右双栏实时对比两次保存快照 |
| **远程数据** | `useDictBatch` 批量加载字典 + `remoteSelect` 远程搜索医生 |
| **打印预览** | `PrintTemplate` + `useFormPrint` 隐藏 iframe 打印 |

<a id="dev"></a>
## 🧪 开发

```bash
# 安装依赖
pnpm i

# 启动 demo
pnpm run dev

# 构建
pnpm run build
```

<a id="compat"></a>
## 🌐 依赖与兼容性

支持所有现代浏览器，与 Vue 3 和 Naive UI 的浏览器支持范围一致。

| 依赖 | 类型 | 最低版本 |
|:--|:--|:--|
| `vue` | peer | `>=3.3.0` |
| `@form-create/naive-ui` | peer | `>=3.1.0` |
| `naive-ui` | peer | `>=2.34.0` |

---

<a id="license"></a>
## 📜 许可与商业授权

本项目采用 **「非商业使用免费 + 商业使用付费授权」** 双轨协议，完整条款见 [LICENSE](./LICENSE)。

> [!WARNING]
> 本项目**不再是 MIT 许可**。MIT 允许免费商用，本协议不允许——判断标准是「使用场景是否属于商业使用」，而不是「公司是否付费买了你的系统」。

### 场景对照

| 你的场景 | 能否免费 | 需要做什么 |
|:--|:--|:--|
| 个人学习、技术研究、本地跑 Demo | ✅ 免费 | 保留 LICENSE 与版权声明 |
| 课堂教学、技术分享、博客示例 | ✅ 免费 | 保留声明，注明来源与仓库链接 |
| 完全公开、无商业目的的开源项目 | ✅ 免费 | 保留声明，README 注明来源 |
| 医院 HIS / EMR、企业内部生产系统 | 💰 **需付费授权** | 使用前取得商业授权 |
| 对外提供 SaaS / 网站 / 小程序（含广告引流） | 💰 **需付费授权** | 使用前取得商业授权 |
| 交付客户、招投标、项目验收 | 💰 **需付费授权** | 使用前取得商业授权 |
| 把本库（含改版）作为组件库/模板/教材再分发 | 🚫 **不允许** | 需另行书面许可 |

### 免费版与付费版的区别

代码功能**完全一致**，付费获得的是：合法的商用使用权、书面授权文件，以及商业授权协议中约定的范围（授权主体、项目数、部署环境、有效期等）。本协议不推定授予任何商业权利。

<details>
<summary><b>常见问题</b></summary>

<br/>

**Q：我们公司内部系统不对外卖，算商业使用吗？**
A：算。企业、医院、政府、事业单位的内部业务系统与生产环境均属于商业使用（LICENSE 第 1.2(a) 条）。

**Q：我已经在用 1.0.3 之前的 MIT 版本，会被追诉吗？**
A：以 MIT 许可分发的历史副本，其 MIT 授权在该副本已取得的范围内依法继续有效；但升级版本、重新获取或此后新增的使用适用本协议（LICENSE 第 10.1 条）。

**Q：付费授权怎么买、多少钱？**
A：通过仓库 [Issues](https://github.com/ItsHeart/emr-create/issues) 与作者联系，具体范围与费用以双方签署的商业授权协议为准。

**Q：能不能豁免我的开源项目？**
A：符合非商业定义的项目本身即免费；如边界情况需要书面豁免，同样通过 Issues 申请。

</details>

<a id="credits"></a>
## 🙏 致谢

- [xaboy/form-create](https://github.com/xaboy/form-create) — 动态表单引擎
- [Naive UI](https://www.naiveui.com/) — Vue 3 组件库
- 所有提交 Issue 与 PR 的使用者

---

<div align="center">

**emr-create** · 由 [ItsHeart](https://github.com/ItsHeart) 维护

非商业使用免费 · 商业使用需付费授权 · [LICENSE](./LICENSE)

Built with ❤️ for 医疗信息化

</div>
