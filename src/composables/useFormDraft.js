import { ref, onMounted, onBeforeUnmount } from 'vue'
import { saveDraft, loadDraft, removeDraft } from '../utils/storage.js'

/**
 * 表单草稿自动保存/恢复
 * @param {Object} options - 配置项
 * @param {string} options.key - 草稿标识（必传）
 * @param {Object} options.fApi - form-create API 的 ref
 * @param {number} options.interval - 自动保存间隔（毫秒），默认 30000（30秒）
 * @param {number} options.maxAge - 草稿最大有效时间（毫秒），默认 7天
 * @param {string} options.storage - 存储类型 'local' | 'session'
 * @param {boolean} options.autoSave - 是否开启自动保存，默认 true
 * @param {boolean} options.saveOnClose - 页面关闭时保存，默认 true
 * @returns {Object}
 *
 * @example
 * const { fApi } = useFormCreate({ rule, option })
 * const { hasDraft, restoreDraft, clearDraft, saveNow } = useFormDraft({
 *   key: 'admission_' + patientId,
 *   fApi,
 * })
 */
export function useFormDraft(options = {}) {
  const {
    key,
    fApi,
    interval = 30000,
    maxAge = 7 * 24 * 60 * 60 * 1000,
    storage = 'local',
    autoSave = true,
    saveOnClose = true,
  } = options

  if (!key) {
    console.warn('[emr-create] useFormDraft 需要传入 key')
  }

  const hasDraft = ref(false)
  let timer = null

  const storageOptions = { storage, maxAge }

  /**
   * 立即保存当前表单数据为草稿
   */
  function saveNow() {
    if (!fApi || !fApi.value) return
    const data = { ...fApi.value.form }
    saveDraft(key, data, storageOptions)
  }

  /**
   * 恢复草稿到表单
   * @returns {boolean} 是否成功恢复
   */
  function restoreDraft() {
    if (!fApi || !fApi.value) return false
    const data = loadDraft(key, storageOptions)
    if (data) {
      fApi.value.coverValue(data)
      hasDraft.value = false
      return true
    }
    return false
  }

  /**
   * 清除草稿
   */
  function clearDraft() {
    removeDraft(key, storageOptions)
    hasDraft.value = false
  }

  /**
   * 检查是否有可用草稿
   */
  function checkDraft() {
    const data = loadDraft(key, storageOptions)
    hasDraft.value = data !== null
    return data
  }

  // 自动保存定时器
  function startAutoSave() {
    if (!autoSave || !interval) return
    timer = setInterval(() => {
      saveNow()
    }, interval)
  }

  function stopAutoSave() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  // 页面关闭前保存
  function handleBeforeUnload() {
    saveNow()
  }

  onMounted(() => {
    checkDraft()
    startAutoSave()
    if (saveOnClose) {
      window.addEventListener('beforeunload', handleBeforeUnload)
    }
  })

  onBeforeUnmount(() => {
    stopAutoSave()
    if (saveOnClose) {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  })

  return {
    hasDraft,
    saveNow,
    restoreDraft,
    clearDraft,
    checkDraft,
  }
}
