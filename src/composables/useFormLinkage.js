import { watch, onBeforeUnmount } from 'vue'

/**
 * 字段联动逻辑声明式管理
 * @param {Object} options - 配置项
 * @param {Object} options.fApi - form-create API 的 ref
 * @param {Array} options.linkages - 联动规则数组
 * @returns {Object}
 *
 * @example
 * const { fApi } = useFormCreate({ rule, option })
 * const { addLinkage, removeLinkage } = useFormLinkage({
 *   fApi,
 *   linkages: [
 *     {
 *       watch: 'marriage',                    // 监听字段
 *       handler(value, api) {                 // 联动处理
 *         if (value === '1') {
 *           api.hidden(false, 'spouseName')
 *         } else {
 *           api.hidden(true, 'spouseName')
 *         }
 *       }
 *     },
 *     {
 *       watch: ['height', 'weight'],          // 监听多个字段
 *       handler(values, api) {
 *         const [h, w] = values
 *         if (h && w) {
 *           const bmi = (w / ((h / 100) ** 2)).toFixed(1)
 *           api.setValue('bmi', Number(bmi))
 *         }
 *       }
 *     }
 *   ]
 * })
 */
export function useFormLinkage(options = {}) {
  const { fApi, linkages = [] } = options

  const stopWatchers = []

  /**
   * 添加一条联动规则
   * @param {Object} linkage - 联动配置
   * @param {string|Array<string>} linkage.watch - 监听的字段名（单个或数组）
   * @param {Function} linkage.handler - 联动处理函数 (value|values, fApi) => void
   * @param {boolean} linkage.immediate - 是否立即执行一次，默认 false
   */
  function addLinkage(linkage) {
    const { watch: watchFields, handler, immediate = false } = linkage

    if (!fApi || !watchFields || !handler) return

    const fields = Array.isArray(watchFields) ? watchFields : [watchFields]
    const isMulti = Array.isArray(watchFields)

    const stopper = watch(
      () => {
        if (!fApi.value) return null
        if (isMulti) {
          return fields.map((f) => fApi.value.getValue(f))
        }
        return fApi.value.getValue(fields[0])
      },
      (newVal) => {
        if (newVal === null || !fApi.value) return
        handler(newVal, fApi.value)
      },
      { immediate, deep: true }
    )

    stopWatchers.push(stopper)
    return stopper
  }

  /**
   * 移除所有联动
   */
  function removeAll() {
    stopWatchers.forEach((stop) => stop())
    stopWatchers.length = 0
  }

  /**
   * 移除指定联动
   * @param {Function} stopper - addLinkage 返回的停止函数
   */
  function removeLinkage(stopper) {
    if (typeof stopper === 'function') {
      stopper()
      const idx = stopWatchers.indexOf(stopper)
      if (idx > -1) stopWatchers.splice(idx, 1)
    }
  }

  // 初始化传入的联动规则
  linkages.forEach((linkage) => addLinkage(linkage))

  onBeforeUnmount(() => {
    removeAll()
  })

  return {
    addLinkage,
    removeLinkage,
    removeAll,
  }
}
