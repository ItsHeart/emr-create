<template>
  <n-space vertical :size="8" style="width: 100%">
    <div
      class="signature-container"
      :style="{ width: props.width + 'px', height: props.height + 'px' }"
    >
      <canvas
        ref="canvasRef"
        :width="props.width"
        :height="props.height"
        :style="{ cursor: props.disabled ? 'not-allowed' : 'crosshair' }"
        @mousedown="startDraw"
        @mousemove="drawing"
        @mouseup="endDraw"
        @mouseleave="endDraw"
        @touchstart.prevent="startDrawTouch"
        @touchmove.prevent="drawingTouch"
        @touchend="endDraw"
      />
      <div v-if="!hasContent && !props.disabled" class="signature-placeholder">
        请在此处签名
      </div>
    </div>
    <n-space :size="8">
      <n-button size="tiny" :disabled="props.disabled || !canUndo" @click="undo">
        撤销
      </n-button>
      <n-button size="tiny" :disabled="props.disabled || !hasContent" @click="clear">
        清除
      </n-button>
    </n-space>
  </n-space>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  // Base64 图片字符串
  modelValue: String,
  disabled: Boolean,
  formCreateInject: Object,
  width: {
    type: Number,
    default: 400,
  },
  height: {
    type: Number,
    default: 150,
  },
  lineWidth: {
    type: Number,
    default: 2,
  },
  lineColor: {
    type: String,
    default: '#000000',
  },
  backgroundColor: {
    type: String,
    default: '#ffffff',
  },
})

const emit = defineEmits(['update:modelValue'])

const canvasRef = ref(null)
const hasContent = ref(false)
const canUndo = ref(false)
const isDrawing = ref(false)

let ctx = null
let paths = [] // 存储所有笔画路径用于撤销
let currentPath = []

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  ctx = canvas.getContext('2d')
  ctx.lineWidth = props.lineWidth
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.strokeStyle = props.lineColor

  // 恢复已有签名
  if (props.modelValue) {
    restoreImage(props.modelValue)
  }
})

function getPos(e) {
  const rect = canvasRef.value.getBoundingClientRect()
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  }
}

function startDraw(e) {
  if (props.disabled) return
  isDrawing.value = true
  const pos = getPos(e)
  currentPath = [pos]
  ctx.beginPath()
  ctx.moveTo(pos.x, pos.y)
}

function drawing(e) {
  if (!isDrawing.value || props.disabled) return
  const pos = getPos(e)
  currentPath.push(pos)
  ctx.lineTo(pos.x, pos.y)
  ctx.stroke()
}

function endDraw() {
  if (!isDrawing.value) return
  isDrawing.value = false
  if (currentPath.length > 1) {
    paths.push([...currentPath])
    canUndo.value = true
    hasContent.value = true
    emitValue()
  }
  currentPath = []
}

// 触摸事件支持
function startDrawTouch(e) {
  const touch = e.touches[0]
  startDraw(touch)
}

function drawingTouch(e) {
  const touch = e.touches[0]
  drawing(touch)
}

function undo() {
  if (!paths.length) return
  paths.pop()
  redraw()
  canUndo.value = paths.length > 0
  hasContent.value = paths.length > 0
  emitValue()
}

function clear() {
  paths = []
  canUndo.value = false
  hasContent.value = false
  redraw()
  emit('update:modelValue', '')
}

function redraw() {
  const canvas = canvasRef.value
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  // 填充背景
  ctx.fillStyle = props.backgroundColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = props.backgroundColor

  paths.forEach((path) => {
    if (path.length < 2) return
    ctx.beginPath()
    ctx.moveTo(path[0].x, path[0].y)
    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(path[i].x, path[i].y)
    }
    ctx.stroke()
  })
}

function emitValue() {
  if (!hasContent.value) {
    emit('update:modelValue', '')
    return
  }
  const dataURL = canvasRef.value.toDataURL('image/png')
  emit('update:modelValue', dataURL)
}

function restoreImage(base64) {
  if (!base64 || !ctx) return
  const img = new Image()
  img.onload = () => {
    ctx.drawImage(img, 0, 0)
    hasContent.value = true
  }
  img.src = base64
}

watch(
  () => props.modelValue,
  (val) => {
    if (!val && hasContent.value) {
      clear()
    } else if (val && !hasContent.value) {
      restoreImage(val)
    }
  }
)

defineExpose({
  clear,
  undo,
  isEmpty: () => !hasContent.value,
})
</script>

<style scoped>
.signature-container {
  position: relative;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
}
.signature-container canvas {
  display: block;
}
.signature-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ccc;
  font-size: 14px;
  pointer-events: none;
  user-select: none;
}
</style>
