import { useEffect, useRef } from 'react'

// 滚动显现（可重播）：容器内带 [data-reveal] 的元素每次进入视口都重放入场动画。
// 进入视口 → 加 .is-visible 播放；完全离开视口（上/下边缘都出屏）→ 移除类复位。
// 复位只发生在元素完全不可见时，因此不会出现闪烁；再次进入时动画重新播放。
// deps 变化时（如登录状态检查完成后卡片才渲染出来）重新扫描一次。
export function useReveal(deps: readonly unknown[] = []) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    // 观察所有 [data-reveal]（含已 is-visible 的），才能在其离开视口时复位
    const targets = root.querySelectorAll<HTMLElement>('[data-reveal]')

    if (targets.length === 0) return

    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'))
      return
    }

    // 减少动态效果偏好：直接常显，不做重播
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement
          if (entry.isIntersecting) {
            // 每次进入视口都（重新）触发入场动画
            el.classList.add('is-visible')
          } else if (!reduceMotion) {
            const rect = entry.boundingClientRect
            // 只有完全滚出视口（上方或下方）才复位，避免滚动途中可见区域内闪烁
            if (rect.top >= window.innerHeight || rect.bottom <= 0) {
              el.classList.remove('is-visible')
            }
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )

    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return ref
}
