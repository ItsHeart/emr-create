import { ref } from 'vue'

/**
 * 表单打印组合式 API
 * @param {Object} options - 配置项
 * @param {string} options.title - 打印标题
 * @param {string} options.orientation - 纸张方向 'portrait' | 'landscape'，默认 'portrait'
 * @param {string} options.pageSize - 纸张大小，默认 'A4'
 * @returns {Object}
 *
 * @example
 * const { printForm, printHTML, printing } = useFormPrint({ title: '入院记录' })
 * // 打印表单 DOM
 * printForm(document.querySelector('.form-container'))
 */
export function useFormPrint(options = {}) {
  const {
    title = '',
    orientation = 'portrait',
    pageSize = 'A4',
  } = options

  const printing = ref(false)

  /**
   * 获取打印样式
   */
  function getPrintStyles() {
    return `
      @page {
        size: ${pageSize} ${orientation};
        margin: 15mm;
      }
      body {
        font-family: 'SimSun', 'Microsoft YaHei', serif;
        font-size: 12pt;
        line-height: 1.6;
        color: #000;
      }
      .print-title {
        text-align: center;
        font-size: 18pt;
        font-weight: bold;
        margin-bottom: 20px;
      }
      .print-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        font-size: 10pt;
        color: #666;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      td, th {
        border: 1px solid #000;
        padding: 6px 8px;
      }
      .no-print {
        display: none !important;
      }
    `
  }

  /**
   * 打印指定 DOM 元素
   * @param {HTMLElement} el - 要打印的 DOM 元素
   * @param {Object} extraOptions - 额外选项
   * @param {string} extraOptions.title - 覆盖标题
   * @param {string} extraOptions.header - 页眉内容
   */
  function printForm(el, extraOptions = {}) {
    if (!el) {
      console.warn('[emr-create] printForm: 未找到要打印的元素')
      return
    }
  
    const printTitle = extraOptions.title || title
    printing.value = true
  
    // 创建隐藏 iframe 进行打印，避免 document.write 的 XSS 风险
    const iframe = document.createElement('iframe')
    iframe.style.position = 'fixed'
    iframe.style.right = '0'
    iframe.style.bottom = '0'
    iframe.style.width = '0'
    iframe.style.height = '0'
    iframe.style.border = '0'
    document.body.appendChild(iframe)
  
    const doc = iframe.contentDocument || iframe.contentWindow.document
  
    // 构建样式
    const style = doc.createElement('style')
    style.textContent = getPrintStyles()
    doc.head.appendChild(style)
  
    // 构建标题
    if (printTitle) {
      const titleEl = doc.createElement('div')
      titleEl.className = 'print-title'
      titleEl.textContent = printTitle
      doc.body.appendChild(titleEl)
    }
  
    // 构建页眉
    if (extraOptions.header) {
      const headerEl = doc.createElement('div')
      headerEl.className = 'print-header'
      headerEl.textContent = extraOptions.header
      doc.body.appendChild(headerEl)
    }
  
    // 克隆内容（安全复制 DOM 节点）
    const contentClone = el.cloneNode(true)
    doc.body.appendChild(contentClone)
  
    const cleanup = () => {
      printing.value = false
      document.body.removeChild(iframe)
    }
  
    // 等待渲染后打印
    iframe.onload = () => {
      iframe.contentWindow.focus()
      iframe.contentWindow.print()
      setTimeout(cleanup, 500)
    }
  
    // 兜底：如果 onload 不触发
    setTimeout(() => {
      if (printing.value) {
        iframe.contentWindow.focus()
        iframe.contentWindow.print()
        cleanup()
      }
    }, 1000)
  }
  
  /**
   * 打印 HTML 字符串
   * @param {string} html - HTML 内容
   * @param {Object} extraOptions - 额外选项
   */
  function printHTML(html, extraOptions = {}) {
    const container = document.createElement('div')
    container.innerHTML = html
    document.body.appendChild(container)
    printForm(container, extraOptions)
    document.body.removeChild(container)
  }

  /**
   * 将表单数据生成表格 HTML
   * @param {Object} formData - 表单数据
   * @param {Array} fields - 字段配置 [{field, title}]
   * @param {number} cols - 每行列数，默认 2
   * @returns {string} HTML 字符串
   */
  function formDataToTable(formData, fields, cols = 2) {
    let html = '<table>'
    for (let i = 0; i < fields.length; i += cols) {
      html += '<tr>'
      for (let j = 0; j < cols; j++) {
        const fieldConfig = fields[i + j]
        if (fieldConfig) {
          const value = formData[fieldConfig.field] ?? ''
          html += `<td style="width:15%;font-weight:bold;background:#f5f5f5">${fieldConfig.title}</td>`
          html += `<td>${value}</td>`
        } else {
          html += '<td></td><td></td>'
        }
      }
      html += '</tr>'
    }
    html += '</table>'
    return html
  }

  return {
    printing,
    printForm,
    printHTML,
    formDataToTable,
  }
}
