/**
 * 格式化输出工具函数
 * 用于表单数据的展示格式化
 */

/**
 * 日期格式化
 * @param {string|number|Date} value - 日期值
 * @param {string} fmt - 格式模板，默认 'yyyy-MM-dd'
 * @returns {string} 格式化后的日期字符串
 *
 * @example
 * formatDate('2024-03-15T10:30:00') // => '2024-03-15'
 * formatDate('2024-03-15T10:30:00', 'yyyy-MM-dd HH:mm') // => '2024-03-15 10:30'
 */
export function formatDate(value, fmt = 'yyyy-MM-dd') {
  if (!value) return ''
  const date = value instanceof Date ? value : new Date(value)
  if (isNaN(date.getTime())) return String(value)

  const pad = (n) => String(n).padStart(2, '0')
  const map = {
    yyyy: date.getFullYear(),
    MM: pad(date.getMonth() + 1),
    dd: pad(date.getDate()),
    HH: pad(date.getHours()),
    mm: pad(date.getMinutes()),
    ss: pad(date.getSeconds()),
  }

  let result = fmt
  Object.keys(map).forEach((key) => {
    result = result.replace(key, map[key])
  })
  return result
}

/**
 * 数值精度格式化
 * @param {number|string} value - 数值
 * @param {number} digits - 小数位数，默认 1
 * @param {string} suffix - 后缀单位
 * @returns {string} 格式化后的字符串
 *
 * @example
 * formatNumber(36.555, 1) // => '36.6'
 * formatNumber(36.555, 1, '°C') // => '36.6°C'
 */
export function formatNumber(value, digits = 1, suffix = '') {
  if (value === null || value === undefined || value === '') return ''
  const num = Number(value)
  if (isNaN(num)) return String(value)
  return num.toFixed(digits) + suffix
}

/**
 * 血压格式化展示
 * @param {number|string} systolic - 收缩压
 * @param {number|string} diastolic - 舒张压
 * @returns {string} 如 '120/80 mmHg'
 */
export function formatBloodPressure(systolic, diastolic) {
  if (!systolic && !diastolic) return ''
  return `${systolic ?? '-'}/${diastolic ?? '-'} mmHg`
}

/**
 * 诊断编码格式化展示（编码 + 名称）
 * @param {string} code - ICD 编码
 * @param {string} name - 诊断名称
 * @returns {string} 如 '[J18.9] 肺炎'
 */
export function formatIcdCode(code, name) {
  if (!code && !name) return ''
  if (!code) return name
  if (!name) return code
  return `[${code}] ${name}`
}

/**
 * 多值拼接展示（逗号分隔值转中文顿号分隔）
 * @param {string|Array} value - 逗号分隔字符串或数组
 * @param {string} separator - 分隔符，默认 '、'
 * @returns {string}
 *
 * @example
 * formatMultiValue('reading,sport') // => 'reading、sport'
 * formatMultiValue(['男', '女']) // => '男、女'
 */
export function formatMultiValue(value, separator = '、') {
  if (!value) return ''
  if (Array.isArray(value)) return value.join(separator)
  return String(value).split(',').map((v) => v.trim()).join(separator)
}

/**
 * 住院天数计算
 * @param {string|Date} admitDate - 入院日期
 * @param {string|Date} dischargeDate - 出院日期
 * @returns {number|string} 天数（至少1天），无效输入返回 ''
 *
 * @example
 * calcHospitalDays('2024-03-01', '2024-03-05') // => 5
 */
export function calcHospitalDays(admitDate, dischargeDate) {
  if (!admitDate || !dischargeDate) return ''
  const start = new Date(admitDate)
  const end = new Date(dischargeDate)
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return ''
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
  return diff >= 0 ? diff + 1 : ''
}

/**
 * 空值占位展示
 * @param {*} value - 值
 * @param {string} placeholder - 占位符，默认 '—'
 * @returns {string}
 */
export function formatEmpty(value, placeholder = '—') {
  if (value === null || value === undefined || value === '') return placeholder
  return String(value)
}
