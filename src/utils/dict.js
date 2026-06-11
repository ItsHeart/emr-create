/**
 * 字典翻译工具函数
 */

/**
 * 根据字典选项列表翻译值为标签
 * @param {Array} options - 选项列表 [{label, value}]
 * @param {string|number} value - 要翻译的值
 * @returns {string} 翻译后的标签文字
 *
 * @example
 * const sexOptions = [{ label: '男', value: '1' }, { label: '女', value: '2' }]
 * translateDict(sexOptions, '1') // => '男'
 * translateDict(sexOptions, '1,2') // => '男, 女'
 */
export function translateDict(options, value) {
  if (value === null || value === undefined || value === '') return ''
  const str = String(value)

  if (str.indexOf(',') !== -1) {
    return str
      .split(',')
      .map((v) => {
        const opt = options.find((o) => String(o.value) === v.trim())
        return opt ? opt.label : v
      })
      .join(', ')
  }

  const opt = options.find((o) => String(o.value) === str)
  return opt ? opt.label : str
}

/**
 * 创建字典翻译器（柯里化）
 * @param {Object} dictMap - 字典映射表 { dictName: [{label, value}] }
 * @returns {Function} (dictName, value) => string
 *
 * @example
 * const dictMap = {
 *   sex: [{ label: '男', value: '1' }, { label: '女', value: '2' }],
 *   education: [{ label: '本科', value: '1' }, { label: '硕士', value: '2' }],
 * }
 * const transDic = createDictTranslator(dictMap)
 * transDic('sex', '1') // => '男'
 */
export function createDictTranslator(dictMap) {
  return (dictName, value) => {
    const options = dictMap[dictName]
    if (!options) {
      console.warn(`[emr-create] 字典 "${dictName}" 未找到`)
      return String(value ?? '')
    }
    return translateDict(options, value)
  }
}

/**
 * 从选项列表中查找值对应的选项对象
 * @param {Array} options - 选项列表
 * @param {string|number} value - 值
 * @returns {Object|undefined} 匹配的选项对象
 */
export function findOption(options, value) {
  if (!options || !options.length) return undefined
  return options.find((o) => String(o.value) === String(value))
}
