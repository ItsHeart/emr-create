/**
 * 表单全局配置工厂函数
 *
 * @param {Object} config - 自定义配置
 * @param {string} config.labelWidth - 标签宽度，默认 '80px'
 * @param {string} config.labelAlign - 标签对齐方式，默认 'left'
 * @param {string} config.size - 组件尺寸，默认 'small'
 * @param {number} config.cols - 栅格列数（1~24），默认 6
 * @param {Array} config.gutter - 行间距 [水平, 垂直]，默认 [8, 6]
 * @param {boolean} config.showSubmit - 是否显示提交按钮，默认 false
 * @param {boolean} config.showReset - 是否显示重置按钮，默认 false
 * @param {number} config.inputNumberMin - InputNumber 最小值，默认 0
 * @param {boolean} config.inputNumberShowButton - InputNumber 是否显示按钮，默认 false
 * @param {boolean} config.clearable - select/DatePicker 是否可清空，默认 true
 * @returns {Object} form-create option 配置
 */
export function createOption(config = {}) {
  const {
    labelWidth = '80px',
    labelAlign = 'left',
    size = 'small',
    cols = 6,
    gutter = [8, 6],
    showSubmit = false,
    showReset = false,
    inputNumberMin = 0,
    inputNumberShowButton = false,
    clearable = true,
  } = config

  return {
    form: {
      labelWidth,
      labelAlign,
      size,
    },
    row: {
      gutter,
    },
    submitBtn: showSubmit,
    resetBtn: showReset,
    global: {
      '*': {
        col: {
          span: cols,
        },
      },
      NInputNumber: {
        props: {
          min: inputNumberMin,
          showButton: inputNumberShowButton,
        },
      },
      NSelect: {
        props: {
          clearable,
        },
      },
      NDatePicker: {
        props: {
          clearable,
        },
      },
    },
  }
}

/**
 * 预设配置 - 紧凑4列布局（适用于常规表单）
 */
export const compactOption = createOption()

/**
 * 预设配置 - 3列布局（适用于内容稍多的表单）
 */
export const mediumOption = createOption({ labelWidth: '100px', cols: 8 })

/**
 * 预设配置 - 单列布局（适用于详情/随访类表单）
 */
export const wideOption = createOption({ labelWidth: '140px', cols: 24 })
