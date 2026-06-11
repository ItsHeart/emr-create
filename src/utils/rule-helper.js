/**
 * 规则辅助工具函数
 * 用于快速构建 form-create rule 的常见配置
 */

/**
 * 为字段添加后缀单位
 * @param {string} suffix - 后缀文字，如 'kg', 'cm', 'mmHg'
 * @returns {Object} form-create rule 的 suffix 配置
 *
 * @example
 * { type: 'InputNumber', field: 'weight', title: '体重', ...buildSuffix('kg') }
 */
export function buildSuffix(suffix) {
  return {
    suffix: () => suffix,
  }
}

/**
 * 为必填字段标签添加红色样式
 * @param {string} title - 字段标题
 * @returns {Object} 带红色标签的 title 配置
 *
 * @example
 * { type: 'input', field: 'name', ...buildRedLabel('姓名') }
 */
export function buildRedLabel(title) {
  return {
    title: {
      title,
      style: 'color: red',
    },
  }
}

/**
 * 创建隐藏字段规则
 * @param {string} field - 字段名
 * @param {*} value - 默认值
 * @returns {Object} form-create rule
 */
export function hiddenField(field, value = '') {
  return {
    type: 'hidden',
    field,
    value,
  }
}

/**
 * 创建分区标题规则
 * @param {string} title - 标题文字
 * @param {number} span - 栅格跨度，默认 24
 * @returns {Object} form-create rule
 */
export function divider(title, span = 24) {
  return {
    type: 'dividerTitle',
    props: { title },
    col: { span },
  }
}

/**
 * 创建 select 字段规则
 * @param {Object} config - 配置项
 * @param {string} config.field - 字段名
 * @param {string} config.title - 标题
 * @param {Array} config.options - 选项列表 [{label, value}]
 * @param {boolean} config.required - 是否必填
 * @param {number} config.span - 栅格跨度
 * @param {Object} config.props - 额外 props
 * @returns {Object} form-create rule
 */
export function selectField({ field, title, options = [], required = false, span, props = {} }) {
  const rule = {
    type: 'select',
    field,
    title,
    options,
    props: { clearable: true, ...props },
  }
  if (required) {
    Object.assign(rule, buildRedLabel(title))
    rule.validate = [{ required: true, message: `请选择${title}`, trigger: 'change' }]
  }
  if (span) {
    rule.col = { span }
  }
  return rule
}

/**
 * 创建 input 字段规则
 * @param {Object} config - 配置项
 * @param {string} config.field - 字段名
 * @param {string} config.title - 标题
 * @param {boolean} config.required - 是否必填
 * @param {number} config.span - 栅格跨度
 * @param {Object} config.props - 额外 props
 * @returns {Object} form-create rule
 */
export function inputField({ field, title, required = false, span, props = {} }) {
  const rule = {
    type: 'input',
    field,
    title,
    props,
  }
  if (required) {
    Object.assign(rule, buildRedLabel(title))
    rule.validate = [{ required: true, message: `请输入${title}`, trigger: 'blur' }]
  }
  if (span) {
    rule.col = { span }
  }
  return rule
}

/**
 * 创建 InputNumber 字段规则
 * @param {Object} config - 配置项
 * @param {string} config.field - 字段名
 * @param {string} config.title - 标题
 * @param {string} config.suffix - 后缀单位
 * @param {number} config.min - 最小值
 * @param {number} config.max - 最大值
 * @param {number} config.span - 栅格跨度
 * @returns {Object} form-create rule
 */
export function numberField({ field, title, suffix, min = 0, max, span }) {
  const rule = {
    type: 'InputNumber',
    field,
    title,
    props: { min, showButton: false },
  }
  if (max !== undefined) rule.props.max = max
  if (suffix) Object.assign(rule, buildSuffix(suffix))
  if (span) rule.col = { span }
  return rule
}

/**
 * 创建日期字段规则
 * @param {Object} config - 配置项
 * @param {string} config.field - 字段名
 * @param {string} config.title - 标题
 * @param {boolean} config.required - 是否必填
 * @param {string} config.type - 日期类型 'date' | 'datetime'，默认 'date'
 * @param {number} config.span - 栅格跨度
 * @returns {Object} form-create rule
 */
export function dateField({ field, title, required = false, type = 'date', span }) {
  const rule = {
    type: 'DatePicker',
    field,
    title,
    props: {
      type,
      clearable: true,
      valueFormat: type === 'datetime' ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd',
    },
  }
  if (required) {
    Object.assign(rule, buildRedLabel(title))
    rule.validate = [{ required: true, message: `请选择${title}`, trigger: 'change' }]
  }
  if (span) rule.col = { span }
  return rule
}

/**
 * 创建 multipleSelect 字段规则（逗号分隔存储）
 * @param {Object} config - 配置项
 * @param {string} config.field - 字段名
 * @param {string} config.title - 标题
 * @param {Array} config.options - 选项列表
 * @param {number} config.span - 栅格跨度
 * @returns {Object} form-create rule
 */
export function multipleSelectField({ field, title, options = [], span }) {
  const rule = {
    type: 'multipleSelect',
    field,
    title,
    options,
  }
  if (span) rule.col = { span }
  return rule
}

/**
 * 创建模板文本域规则
 * @param {Object} config - 配置项
 * @param {string} config.field - 字段名
 * @param {string} config.title - 标题
 * @param {Array} config.templates - 模板列表
 * @param {number} config.rows - 行数
 * @param {number} config.span - 栅格跨度
 * @returns {Object} form-create rule
 */
export function templateTextField({ field, title, templates = [], rows = 3, span = 24 }) {
  return {
    type: 'templateText',
    field,
    title,
    props: { templates, rows },
    col: { span },
  }
}
