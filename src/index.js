/**
 * emr-create
 * 基于 @form-create/naive-ui 的医疗表单增强组件库
 */

// 组件
import TemplateText from './components/TemplateText.vue'
import DividerTitle from './components/DividerTitle.vue'
import MultipleSelect from './components/MultipleSelect.vue'
import RemoteSelect from './components/RemoteSelect.vue'
import ModifyItem from './components/ModifyItem.vue'
import OnlyShow from './components/OnlyShow.vue'
import ReadItem from './components/ReadItem.vue'
import ConditionalGroup from './components/ConditionalGroup.vue'

// 预设配置
export { createOption, compactOption, mediumOption, wideOption } from './presets/option.js'

// 工具函数
export {
  buildSuffix,
  buildRedLabel,
  hiddenField,
  divider,
  selectField,
  inputField,
  numberField,
  dateField,
  multipleSelectField,
  templateTextField,
} from './utils/rule-helper.js'

export { translateDict, createDictTranslator, findOption } from './utils/dict.js'

// 组合式 API
export { useFormCreate } from './composables/useFormCreate.js'

// 导出组件
export {
  TemplateText,
  DividerTitle,
  MultipleSelect,
  RemoteSelect,
  ModifyItem,
  OnlyShow,
  ReadItem,
  ConditionalGroup,
}

/**
 * 组件名称映射表
 */
const componentMap = {
  templateText: TemplateText,
  dividerTitle: DividerTitle,
  multipleSelect: MultipleSelect,
  remoteSelect: RemoteSelect,
  ModifyItem: ModifyItem,
  onlyShow: OnlyShow,
  ReadItem: ReadItem,
  conditionalGroup: ConditionalGroup,
}

/**
 * Vue 插件安装方法
 * 自动注册所有自定义组件到 form-create
 *
 * @param {Object} app - Vue app 实例
 * @param {Object} options - 配置项
 * @param {Object} options.formCreate - form-create 实例（必传）
 * @param {Object} options.components - 自定义组件名称覆盖 { 原名: 新名 }
 *
 * @example
 * import formCreate from '@form-create/naive-ui'
 * import EmrCreate from 'emr-create'
 *
 * app.use(formCreate)
 * app.use(EmrCreate, { formCreate })
 */
function install(app, options = {}) {
  const { formCreate, components: nameOverrides = {} } = options

  if (!formCreate) {
    console.warn(
      '[emr-create] 请传入 formCreate 实例：app.use(EmrCreate, { formCreate })'
    )
    return
  }

  // 注册所有自定义组件到 form-create
  Object.entries(componentMap).forEach(([name, component]) => {
    const finalName = nameOverrides[name] || name
    formCreate.component(finalName, component)
  })
}

// 默认导出插件
export default {
  install,
  version: '1.0.0',
}
