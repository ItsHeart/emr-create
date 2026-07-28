/**
 * emr-create/utils 子路径导出
 * 按需引入：import { inputField, idCardValidator } from 'emr-create/utils'
 */

export {
  buildSuffix,
  buildRedLabel,
  hiddenField,
  divider,
  selectField,
  inputField,
  numberField,
  dateField,
  multipleSelectField,
  templateTextField,
  yesNoField,
  icdField,
  deepClone,
} from './rule-helper.js'

export { translateDict, createDictTranslator, findOption } from './dict.js'

export {
  idCardValidator,
  phoneValidator,
  rangeValidator,
  temperatureValidator,
  systolicValidator,
  diastolicValidator,
  pulseValidator,
  breathValidator,
  bmiValidator,
  dateBeforeValidator,
  dateAfterValidator,
  requiredValidator,
  maxLengthValidator,
} from './validator.js'

export {
  formatDate,
  formatNumber,
  formatBloodPressure,
  formatIcdCode,
  formatMultiValue,
  calcHospitalDays,
  formatEmpty,
} from './formatter.js'

export {
  saveDraft,
  loadDraft,
  removeDraft,
  hasDraft,
  getDraftTime,
} from './storage.js'
