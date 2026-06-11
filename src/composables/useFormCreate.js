import { ref, shallowRef } from 'vue'

/**
 * form-create 表单组合式 API
 * 封装常用操作，简化表单管理
 *
 * @param {Object} options - 配置项
 * @param {Array} options.rule - 表单规则
 * @param {Object} options.option - 表单全局配置
 * @param {Function} options.onSuccess - 保存成功回调
 * @param {Function} options.onError - 验证失败回调
 * @returns {Object}
 *
 * @example
 * const { fApi, rule, option, validate, coverValue, resetFields, getFormData } = useFormCreate({
 *   rule: medicalRecordRule,
 *   option: compactOption,
 * })
 */
export function useFormCreate(options = {}) {
  const fApi = ref(null)
  const rule = ref(options.rule || [])
  const option = ref(options.option || {})
  const loading = ref(false)

  /**
   * 批量覆盖表单值（适合加载数据场景）
   * @param {Object} data - 表单数据对象
   */
  function coverValue(data) {
    if (fApi.value) {
      fApi.value.coverValue(data)
    }
  }

  /**
   * 获取单个字段值
   * @param {string} field - 字段名
   * @returns {*}
   */
  function getValue(field) {
    if (fApi.value) {
      return fApi.value.getValue(field)
    }
    return undefined
  }

  /**
   * 设置单个字段值
   * @param {string} field - 字段名
   * @param {*} value - 值
   */
  function setValue(field, value) {
    if (fApi.value) {
      fApi.value.setValue(field, value)
    }
  }

  /**
   * 重置表单
   */
  function resetFields() {
    if (fApi.value) {
      fApi.value.resetFields()
    }
  }

  /**
   * 获取完整表单数据
   * @returns {Object}
   */
  function getFormData() {
    if (fApi.value) {
      return { ...fApi.value.form }
    }
    return {}
  }

  /**
   * 表单验证，返回 Promise
   * @returns {Promise<Object>} resolve 时返回表单数据，reject 时返回错误信息
   */
  function validate() {
    return new Promise((resolve, reject) => {
      if (!fApi.value) {
        reject(new Error('form-create API 未初始化'))
        return
      }
      fApi.value.validate((valid) => {
        if (valid === true) {
          resolve(getFormData())
        } else {
          const message = valid?.[0]?.[0]?.message || '表单验证失败'
          reject(new Error(message))
        }
      })
    })
  }

  /**
   * 验证并提交表单
   * @param {Function} submitFn - 提交函数，接收表单数据，返回 Promise
   * @param {Object} extraData - 额外附加数据
   * @returns {Promise}
   */
  async function submitForm(submitFn, extraData = {}) {
    loading.value = true
    try {
      const formData = await validate()
      const result = await submitFn({ ...formData, ...extraData })
      loading.value = false
      return result
    } catch (error) {
      loading.value = false
      throw error
    }
  }

  /**
   * 隐藏/显示指定字段
   * @param {string|Array<string>} fields - 字段名或字段名数组
   * @param {boolean} hidden - 是否隐藏
   */
  function setHidden(fields, hidden = true) {
    if (!fApi.value) return
    const fieldList = Array.isArray(fields) ? fields : [fields]
    fieldList.forEach((field) => {
      fApi.value.hidden(hidden, field)
    })
  }

  /**
   * 禁用/启用指定字段
   * @param {string|Array<string>} fields - 字段名或字段名数组
   * @param {boolean} disabled - 是否禁用
   */
  function setDisabled(fields, disabled = true) {
    if (!fApi.value) return
    const fieldList = Array.isArray(fields) ? fields : [fields]
    fieldList.forEach((field) => {
      fApi.value.disabled(disabled, field)
    })
  }

  /**
   * 获取表单变更（对比初始数据和当前数据）
   * @param {Object} initialData - 初始数据
   * @returns {Object} { field: { old, new } }
   */
  function getDiff(initialData = {}) {
    const current = getFormData()
    const diff = {}
    Object.keys(current).forEach((key) => {
      const oldVal = initialData[key] ?? ''
      const newVal = current[key] ?? ''
      if (String(oldVal) !== String(newVal)) {
        diff[key] = { old: oldVal, new: newVal }
      }
    })
    return diff
  }

  return {
    fApi,
    rule,
    option,
    loading,
    coverValue,
    getValue,
    setValue,
    resetFields,
    getFormData,
    validate,
    submitForm,
    setHidden,
    setDisabled,
    getDiff,
  }
}
