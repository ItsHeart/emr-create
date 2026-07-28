import { ref, reactive } from 'vue'

/**
 * 批量字典加载 + 缓存
 * @param {Object} options - 配置项
 * @param {Function} options.fetcher - 字典加载函数 (dictName) => Promise<Array<{label, value}>>
 * @param {boolean} options.cache - 是否启用内存缓存，默认 true
 * @returns {Object}
 *
 * @example
 * const { loadDicts, getOptions, optionsMap, loading } = useDictBatch({
 *   fetcher: async (name) => {
 *     const res = await fetch(`/api/dict/${name}`)
 *     return res.json()
 *   }
 * })
 *
 * // 批量加载
 * await loadDicts(['sex', 'education', 'marriage'])
 *
 * // 获取选项
 * getOptions('sex') // => [{label: '男', value: '1'}, ...]
 *
 * // 注入到 form-create 规则
 * selectField({ field: 'sex', title: '性别', options: getOptions('sex') })
 */
export function useDictBatch(options = {}) {
  const { fetcher, cache = true } = options

  if (!fetcher) {
    console.warn('[emr-create] useDictBatch 需要传入 fetcher 函数')
  }

  const loading = ref(false)
  const optionsMap = reactive({})
  const cacheMap = new Map()

  /**
   * 加载单个字典
   * @param {string} dictName - 字典名称
   * @returns {Promise<Array>} 选项列表
   */
  async function loadDict(dictName) {
    // 已加载过直接返回
    if (optionsMap[dictName]) {
      return optionsMap[dictName]
    }
    // 内存缓存
    if (cache && cacheMap.has(dictName)) {
      const cached = cacheMap.get(dictName)
      optionsMap[dictName] = cached
      return cached
    }

    try {
      const result = await fetcher(dictName)
      const opts = Array.isArray(result) ? result : result?.data || []
      optionsMap[dictName] = opts
      if (cache) {
        cacheMap.set(dictName, opts)
      }
      return opts
    } catch (e) {
      console.error(`[emr-create] 字典 "${dictName}" 加载失败:`, e)
      optionsMap[dictName] = []
      return []
    }
  }

  /**
   * 批量加载字典（并发请求）
   * @param {Array<string>} dictNames - 字典名称数组
   * @returns {Promise<Object>} { dictName: options }
   */
  async function loadDicts(dictNames = []) {
    if (!dictNames.length) return {}
    loading.value = true
    try {
      const results = await Promise.all(dictNames.map((name) => loadDict(name)))
      const map = {}
      dictNames.forEach((name, i) => {
        map[name] = results[i]
      })
      return map
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取已加载的字典选项
   * @param {string} dictName - 字典名称
   * @returns {Array} 选项列表，未加载返回空数组
   */
  function getOptions(dictName) {
    return optionsMap[dictName] || []
  }

  /**
   * 清除缓存
   * @param {string} dictName - 指定字典名，不传则清空全部
   */
  function clearCache(dictName) {
    if (dictName) {
      cacheMap.delete(dictName)
      delete optionsMap[dictName]
    } else {
      cacheMap.clear()
      Object.keys(optionsMap).forEach((key) => delete optionsMap[key])
    }
  }

  /**
   * 刷新字典（清除缓存后重新加载）
   * @param {string} dictName - 字典名称
   */
  async function refreshDict(dictName) {
    clearCache(dictName)
    return loadDict(dictName)
  }

  return {
    loading,
    optionsMap,
    loadDict,
    loadDicts,
    getOptions,
    clearCache,
    refreshDict,
  }
}
