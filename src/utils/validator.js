/**
 * 医疗常用校验器集合
 * 可直接用于 form-create validate 规则
 */

/**
 * 身份证号校验（支持15位/18位）
 * @returns {Object} form-create validate 规则
 *
 * @example
 * { type: 'input', field: 'idCard', title: '身份证号', validate: [idCardValidator()] }
 */
export function idCardValidator(message = '请输入正确的身份证号') {
  return {
    validator(rule, value) {
      if (!value) return true
      const reg15 = /^[1-9]\d{5}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}$/
      const reg18 = /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/
      return reg15.test(value) || reg18.test(value)
    },
    message,
    trigger: 'blur',
  }
}

/**
 * 手机号校验
 * @returns {Object} form-create validate 规则
 */
export function phoneValidator(message = '请输入正确的手机号') {
  return {
    validator(rule, value) {
      if (!value) return true
      return /^1[3-9]\d{9}$/.test(value)
    },
    message,
    trigger: 'blur',
  }
}

/**
 * 数值范围校验（通用）
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @param {string} label - 字段中文名（用于提示）
 * @returns {Object} form-create validate 规则
 *
 * @example
 * { type: 'InputNumber', field: 'temperature', title: '体温', validate: [rangeValidator(35, 42, '体温')] }
 */
export function rangeValidator(min, max, label = '数值') {
  return {
    validator(rule, value) {
      if (value === null || value === undefined || value === '') return true
      const num = Number(value)
      return !isNaN(num) && num >= min && num <= max
    },
    message: `${label}应在 ${min} ~ ${max} 之间`,
    trigger: 'blur',
  }
}

/**
 * 体温范围校验（35~42°C）
 */
export function temperatureValidator() {
  return rangeValidator(35, 42, '体温')
}

/**
 * 收缩压范围校验（60~260 mmHg）
 */
export function systolicValidator() {
  return rangeValidator(60, 260, '收缩压')
}

/**
 * 舒张压范围校验（30~160 mmHg）
 */
export function diastolicValidator() {
  return rangeValidator(30, 160, '舒张压')
}

/**
 * 脉搏/心率范围校验（20~250 次/分）
 */
export function pulseValidator() {
  return rangeValidator(20, 250, '脉搏')
}

/**
 * 呼吸频率范围校验（5~60 次/分）
 */
export function breathValidator() {
  return rangeValidator(5, 60, '呼吸频率')
}

/**
 * BMI 范围校验（10~80）
 */
export function bmiValidator() {
  return rangeValidator(10, 80, 'BMI')
}

/**
 * 日期先后校验（fieldA 应早于 fieldB）
 * @param {Function} getFormData - 获取表单数据的函数（通常传 () => fApi.form）
 * @param {string} otherField - 对比字段名
 * @param {string} label - 当前字段中文名
 * @param {string} otherLabel - 对比字段中文名
 * @returns {Object} form-create validate 规则
 *
 * @example
 * dateField({ field: 'admitDate', title: '入院日期', validate: [
 *   dateBeforeValidator(() => fApi.value.form, 'dischargeDate', '入院日期', '出院日期')
 * ]})
 */
export function dateBeforeValidator(getFormData, otherField, label = '开始日期', otherLabel = '结束日期') {
  return {
    validator(rule, value) {
      if (!value) return true
      const formData = getFormData() || {}
      const otherValue = formData[otherField]
      if (!otherValue) return true
      return new Date(value) <= new Date(otherValue)
    },
    message: `${label}不能晚于${otherLabel}`,
    trigger: 'change',
  }
}

/**
 * 日期先后校验（fieldA 应晚于 fieldB）
 */
export function dateAfterValidator(getFormData, otherField, label = '结束日期', otherLabel = '开始日期') {
  return {
    validator(rule, value) {
      if (!value) return true
      const formData = getFormData() || {}
      const otherValue = formData[otherField]
      if (!otherValue) return true
      return new Date(value) >= new Date(otherValue)
    },
    message: `${label}不能早于${otherLabel}`,
    trigger: 'change',
  }
}

/**
 * 必填校验快捷方式
 * @param {string} title - 字段标题
 * @param {string} trigger - 触发方式 'blur' | 'change'
 * @returns {Object} form-create validate 规则
 */
export function requiredValidator(title, trigger = 'blur') {
  return {
    required: true,
    message: `请输入${title}`,
    trigger,
  }
}

/**
 * 字符串长度校验
 * @param {number} max - 最大长度
 * @param {string} label - 字段中文名
 * @returns {Object} form-create validate 规则
 */
export function maxLengthValidator(max, label = '内容') {
  return {
    validator(rule, value) {
      if (!value) return true
      return String(value).length <= max
    },
    message: `${label}不能超过${max}个字符`,
    trigger: 'blur',
  }
}
