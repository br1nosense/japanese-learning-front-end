<script lang="ts" setup>
interface SakuraPetal {
  id: number
  x: number
  y: number
  size: number
  rotation: number
  speed: number
  opacity: number
  blur: number
  color: string
}

const props = withDefaults(defineProps<{
  petalCount?: number
  enableAnimation?: boolean
  reducedMotion?: boolean
}>(), {
  petalCount: 20,
  enableAnimation: true,
  reducedMotion: false
})

// 性能检测
const isLowPerformanceDevice = ref(false)
const frameCount = ref(0)
const lastTime = ref(0)
const fps = ref(60)

const petals = ref<SakuraPetal[]>([])
const animationId = ref<number>()
const containerRef = ref<HTMLElement>()

// 樱花花瓣颜色数组 - 使用新的樱花色调
const petalColors = [
  '#f5f1f0', // 浅樱花色
  '#e8ddd9', // 淡樱花色
  '#d8c2be', // 中樱花色
  '#c8b2ae', // 标准樱花色
  '#b8a29e', // 深樱花色
  '#ffffff', // 白色
]

// 创建单个花瓣
function createPetal(id: number): SakuraPetal {
  return {
    id,
    x: Math.random() * window.innerWidth,
    y: -50 - Math.random() * 100,
    size: 8 + Math.random() * 12, // 8-20px
    rotation: Math.random() * 360,
    speed: 0.5 + Math.random() * 1.5, // 0.5-2px/frame
    opacity: 0.3 + Math.random() * 0.7, // 0.3-1
    blur: Math.random() * 3, // 0-3px 高斯模糊
    color: petalColors[Math.floor(Math.random() * petalColors.length)]
  }
}

// 检测设备性能
function detectPerformance() {
  // 检测是否为移动设备
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

  // 检测是否启用了减少动画偏好
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // 检测硬件加速支持
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  const hasWebGL = !!gl

  // 综合判断设备性能
  isLowPerformanceDevice.value = isMobile || prefersReducedMotion || !hasWebGL

  return {
    isMobile,
    prefersReducedMotion,
    hasWebGL,
    isLowPerformance: isLowPerformanceDevice.value
  }
}

// 获取自适应花瓣数量
function getAdaptivePetalCount(): number {
  const performance = detectPerformance()

  if (performance.prefersReducedMotion) return 0
  if (performance.isMobile) return Math.min(props.petalCount, 8)
  if (performance.isLowPerformance) return Math.min(props.petalCount, 12)

  return props.petalCount
}

// 初始化花瓣
function initPetals() {
  petals.value = []
  const adaptiveCount = getAdaptivePetalCount()

  for (let i = 0; i < adaptiveCount; i++) {
    petals.value.push(createPetal(i))
  }
}

// FPS监测
function measureFPS(currentTime: number) {
  frameCount.value++

  if (currentTime - lastTime.value >= 1000) {
    fps.value = Math.round((frameCount.value * 1000) / (currentTime - lastTime.value))
    frameCount.value = 0
    lastTime.value = currentTime

    // 如果FPS过低，减少花瓣数量
    if (fps.value < 30 && petals.value.length > 5) {
      petals.value = petals.value.slice(0, Math.floor(petals.value.length * 0.8))
    }
  }
}

// 更新花瓣位置
function updatePetals() {
  if (!props.enableAnimation) return

  petals.value.forEach(petal => {
    // 垂直下落
    petal.y += petal.speed

    // 水平漂移（模拟风的效果）
    petal.x += Math.sin(petal.y * 0.01) * 0.5

    // 旋转
    petal.rotation += 0.5 + Math.random() * 1

    // 如果花瓣落到底部，重新从顶部开始
    if (petal.y > window.innerHeight + 50) {
      petal.y = -50 - Math.random() * 100
      petal.x = Math.random() * window.innerWidth
      petal.rotation = Math.random() * 360
    }

    // 如果花瓣飘出左右边界，重新定位
    if (petal.x < -50) {
      petal.x = window.innerWidth + 50
    } else if (petal.x > window.innerWidth + 50) {
      petal.x = -50
    }
  })
}

// 动画循环
function animate(currentTime: number = performance.now()) {
  if (!props.enableAnimation || props.reducedMotion) return

  // 性能监测
  measureFPS(currentTime)

  // 在低性能设备上降低更新频率
  if (isLowPerformanceDevice.value && frameCount.value % 2 !== 0) {
    animationId.value = requestAnimationFrame(animate)
    return
  }

  updatePetals()
  animationId.value = requestAnimationFrame(animate)
}

// 处理窗口大小变化
function handleResize() {
  // 重新调整花瓣位置，避免超出边界
  petals.value.forEach(petal => {
    if (petal.x > window.innerWidth) {
      petal.x = Math.random() * window.innerWidth
    }
  })
}

// 组件挂载时启动动画
onMounted(() => {
  // 延迟初始化，避免阻塞页面渲染
  nextTick(() => {
    detectPerformance()
    initPetals()

    if (props.enableAnimation && !props.reducedMotion && petals.value.length > 0) {
      // 延迟启动动画，确保页面已完全加载
      setTimeout(() => {
        lastTime.value = performance.now()
        animate()
      }, 100)
    }

    window.addEventListener('resize', handleResize)

    // 监听减少动画偏好设置变化
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    mediaQuery.addEventListener('change', (e) => {
      if (e.matches && animationId.value) {
        cancelAnimationFrame(animationId.value)
        animationId.value = undefined
      }
    })
  })
})

// 组件卸载时清理动画
onUnmounted(() => {
  if (animationId.value) {
    cancelAnimationFrame(animationId.value)
  }
  window.removeEventListener('resize', handleResize)
})

// 监听动画开关
watch(() => props.enableAnimation, (newVal) => {
  if (newVal && !animationId.value) {
    animate()
  } else if (!newVal && animationId.value) {
    cancelAnimationFrame(animationId.value)
    animationId.value = undefined
  }
})
</script>

<template>
  <div
    ref="containerRef"
    class="sakura-animation fixed inset-0 pointer-events-none z-0 overflow-hidden"
    :class="{ 'animation-paused': !enableAnimation }"
  >
    <div
      v-for="petal in petals"
      :key="petal.id"
      class="sakura-petal absolute"
      :style="{
        left: `${petal.x}px`,
        top: `${petal.y}px`,
        width: `${petal.size}px`,
        height: `${petal.size}px`,
        transform: `rotate(${petal.rotation}deg)`,
        opacity: petal.opacity,
        filter: `blur(${petal.blur}px)`,
        backgroundColor: petal.color,
      }"
    />
  </div>
</template>

<style scoped>
.sakura-animation {
  will-change: auto;
  contain: layout style paint;
  transform: translateZ(0); /* 启用硬件加速 */
}

.sakura-petal {
  border-radius: 50% 0 50% 0;
  will-change: transform;
  contain: layout style paint;
  transform: translateZ(0); /* 启用硬件加速 */
  backface-visibility: hidden; /* 优化3D变换 */
  perspective: 1000px; /* 启用3D上下文 */
}

.sakura-petal::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 0 50% 0 50%;
  background-color: inherit;
  transform: rotate(45deg);
  opacity: 0.8;
}

/* 性能优化：在低性能设备上减少动画复杂度 */
@media (prefers-reduced-motion: reduce) {
  .sakura-petal {
    animation: none;
    transform: none !important;
  }
}

/* 移动端优化 */
@media (max-width: 768px) {
  .sakura-animation {
    /* 在移动端减少花瓣数量以提高性能 */
    opacity: 0.7;
  }
}

/* 暂停动画状态 */
.animation-paused .sakura-petal {
  animation-play-state: paused;
}
</style>
