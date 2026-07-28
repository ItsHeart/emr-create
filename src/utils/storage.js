/**
 * 表单草稿暂存工具
 * 基于 localStorage / sessionStorage 实现表单数据防丢失
 */

const PREFIX = 'emr-create-draft:'

/**
 * 保存表单草稿
 * @param {string} key - 草稿标识（如表单名 + 患者ID）
 * @param {Object} data - 表单数据
 * @param {Object} options - 配置
 * @param {string} options.storage - 存储类型 'local' | 'session'，默认 'local'
 *
 * @example
 * saveDraft('admission_001', { name: '张三', age: 45 })
 */
export function saveDraft(key, data, options = {}) {
  const { storage = 'local' } = options
  try {
    const store = storage === 'session' ? sessionStorage : localStorage
    const payload = {
      data,
      timestamp: Date.now(),
    }
    store.setItem(PREFIX + key, JSON.stringify(payload))
  } catch (e) {
    console.warn('[emr-create] 草稿保存失败:', e)
  }
}

/**
 * 读取表单草稿
 * @param {string} key - 草稿标识
 * @param {Object} options - 配置
 * @param {string} options.storage - 存储类型
 * @param {number} options.maxAge - 最大有效时间（毫秒），超时返回 null
 * @returns {Object|null} 表单数据，不存在或过期返回 null
 *
 * @example
 * const draft = loadDraft('admission_001')
 * if (draft) fApi.coverValue(draft)
 */
export function loadDraft(key, options = {}) {
  const { storage = 'local', maxAge } = options
  try {
    const store = storage === 'session' ? sessionStorage : localStorage
    const raw = store.getItem(PREFIX + key)
    if (!raw) return null

    const payload = JSON.parse(raw)
    if (maxAge && Date.now() - payload.timestamp > maxAge) {
      removeDraft(key, options)
      return null
    }
    return payload.data
  } catch (e) {
    console.warn('[emr-create] 草稿读取失败:', e)
    return null
  }
}

/**
 * 删除表单草稿
 * @param {string} key - 草稿标识
 * @param {Object} options - 配置
 */
export function removeDraft(key, options = {}) {
  const { storage = 'local' } = options
  try {
    const store = storage === 'session' ? sessionStorage : localStorage
    store.removeItem(PREFIX + key)
  } catch (e) {
    // ignore
  }
}

/**
 * 检查草稿是否存在
 * @param {string} key - 草稿标识
 * @param {Object} options - 配置
 * @returns {boolean}
 */
export function hasDraft(key, options = {}) {
  return loadDraft(key, options) !== null
}

/**
 * 获取草稿保存时间
 * @param {string} key - 草稿标识
 * @param {Object} options - 配置
 * @returns {number|null} 时间戳
 */
export function getDraftTime(key, options = {}) {
  const { storage = 'local' } = options
  try {
    const store = storage === 'session' ? sessionStorage : localStorage
    const raw = store.getItem(PREFIX + key)
    if (!raw) return null
    return JSON.parse(raw).timestamp
  } catch (e) {
    return null
  }
}
