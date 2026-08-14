import { useEffect, useMemo, useRef, type CSSProperties } from 'react'
import Astronaut from './Astronaut'
import Telescope from './Telescope'
import './SpaceBackground.css'

// ── 宇宙星空背景 ─────────────────────────────────────────────
// 纯 CSS/SVG 动画（无 canvas），pointer-events: none，不影响页面交互。
// 随机量用 mulberry32 在 useMemo 内一次成型（重渲染不跳动），
// 种子取自 Math.random：每次访问天空中的流星/飞船排布都不同。
// 动画全部 infinite 循环 + 负延迟：每个元素从循环的随机相位起步，
// 流星约每 1~2 秒就有一颗划过，飞船隔十几秒一趟，持续不断。

// mulberry32 —— 极简的确定性伪随机数发生器
function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// 生成随机种子（每次访问不同，单次挂载内稳定）
function randomSeed(): number {
  return Math.floor(Math.random() * 0x7fffffff)
}

interface Star {
  id: number
  top: number
  left: number
  size: number
  delay: number
  duration: number
  opacity: number
  min: number
  max: number
}

function makeStars(
  count: number,
  seed: number,
  sizeRange: [number, number],
  opacityRange: [number, number],
  durRange: [number, number],
): Star[] {
  const rand = mulberry32(seed)
  return Array.from({ length: count }, (_, i) => {
    const opacity = opacityRange[0] + rand() * (opacityRange[1] - opacityRange[0])
    const duration = durRange[0] + rand() * (durRange[1] - durRange[0])
    return {
      id: i,
      top: rand() * 100,
      left: rand() * 100,
      size: sizeRange[0] + rand() * (sizeRange[1] - sizeRange[0]),
      delay: -rand() * duration,
      duration,
      opacity,
      min: Math.round(opacity * 0.35 * 100) / 100,
      max: Math.round(Math.min(opacity * 1.25, 1) * 100) / 100,
    }
  })
}

interface Meteor {
  id: number
  top: number
  left: number
  angle: number
  dx: number
  dy: number
  duration: number
  delay: number
  scale: number
  opacity: number
  len: number
  head: string
  tail: string
  glow: string
}

// 流星配色：3 颗银白、1 颗金色、1 颗青色
const METEOR_PALETTES = [
  { head: '#ffffff', tail: 'rgba(191, 224, 255, 0.55)', glow: 'rgba(180, 210, 255, 0.9)' },
  { head: '#ffffff', tail: 'rgba(191, 224, 255, 0.55)', glow: 'rgba(180, 210, 255, 0.9)' },
  { head: '#fff2d0', tail: 'rgba(255, 214, 128, 0.55)', glow: 'rgba(255, 202, 110, 0.85)' },
  { head: '#ffffff', tail: 'rgba(191, 224, 255, 0.55)', glow: 'rgba(180, 210, 255, 0.9)' },
  { head: '#e9fbff', tail: 'rgba(150, 226, 255, 0.5)', glow: 'rgba(130, 215, 255, 0.8)' },
]

function makeMeteors(): Meteor[] {
  const rand = mulberry32(randomSeed())
  return METEOR_PALETTES.map((p, i) => {
    const duration = 6.5 + rand() * 4.5 // 6.5~11s 一轮
    const angle = 30 + rand() * 22 // 30°~52°，均向右下飞
    const dx = 36 + rand() * 28 // vmin
    return {
      id: i,
      ...p,
      top: 3 + rand() * 34,
      left: 6 + rand() * 70,
      angle,
      dx,
      // dy = dx·tanθ：保证亮头方向与飞行方向完全同轴
      dy: Math.round(dx * Math.tan((angle * Math.PI) / 180)),
      duration: Math.round(duration * 10) / 10,
      delay: -(Math.round(rand() * duration * 10) / 10),
      scale: 0.65 + rand() * 0.7,
      opacity: 0.55 + rand() * 0.45,
      len: 120 + rand() * 70,
    }
  })
}

interface Ship {
  id: number
  primary: boolean
  top: string
  width: string
  angle: number
  x: number
  y: number
  duration: number
  delay: number
  opacity: number
}

// 飞船：一艘近景大船、一艘远景小船；都沿右上巡航
// y/x = tan(|angle|)，机头与航向严格一致
function makeShips(): Ship[] {
  const rand = mulberry32(randomSeed())
  const d1 = 26 + Math.round(rand() * 8) // 26~34s 一趟
  const d2 = 42 + Math.round(rand() * 10) // 42~52s 一趟
  return [
    {
      id: 0,
      primary: true,
      top: `${14 + rand() * 12}%`,
      width: 'clamp(64px, 8vw, 118px)',
      angle: -23,
      x: 150,
      y: -64,
      duration: d1,
      delay: -Math.round(rand() * d1 * 10) / 10,
      opacity: 1,
    },
    {
      id: 1,
      primary: false,
      top: `${52 + rand() * 14}%`,
      width: 'clamp(40px, 5vw, 74px)',
      angle: -34,
      x: 125,
      y: -84,
      duration: d2,
      delay: -Math.round(rand() * d2 * 10) / 10,
      opacity: 0.85,
    },
  ]
}

interface Sparkle {
  id: number
  top: number
  left: number
  size: number
  delay: number
  duration: number
}

function makeSparkles(): Sparkle[] {
  const rand = mulberry32(randomSeed())
  return Array.from({ length: 4 }, (_, i) => {
    const duration = 3.2 + rand() * 2.6
    return {
      id: i,
      top: 10 + rand() * 74,
      left: 8 + rand() * 78,
      size: 9 + rand() * 9,
      duration: Math.round(duration * 10) / 10,
      delay: -(Math.round(rand() * duration * 10) / 10),
    }
  })
}

interface SpaceBackgroundProps {
  /** home：星球更大更居中；auth：星球退到角落，画面更安静 */
  variant?: 'home' | 'auth'
  /** 滚动视差：星空场景随滚动轻微上移，与前景内容形成深度差 */
  parallax?: boolean
}

// 分区色调层数量（与 CSS 中 .space-bg__tone--a/b/c 对应）
const TONE_COUNT = 3

function SpaceBackground({ variant = 'home', parallax = false }: SpaceBackgroundProps) {
  const stars = useMemo(
    () => ({
      far: makeStars(95, 7, [1, 1.6], [0.22, 0.55], [3.2, 7.5]),
      mid: makeStars(56, 21, [1.4, 2.2], [0.4, 0.85], [2.4, 5.8]),
      near: makeStars(22, 42, [2, 3.2], [0.6, 1], [1.8, 4.6]),
    }),
    [],
  )
  const sparkles = useMemo(makeSparkles, [])
  const meteors = useMemo(makeMeteors, [])
  const ships = useMemo(makeShips, [])

  const sceneRef = useRef<HTMLDivElement | null>(null)
  const rootRef = useRef<HTMLDivElement | null>(null)

  // 滚动视差 + 分区色调：
  // · 场景层整体缓慢上移，三层星尘按各自 data-depth 差速漂移，形成深度视差；
  // · 检测与视口中心最近的 [data-space-section] 区块，切换背景色调层。
  useEffect(() => {
    if (!parallax) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const apply = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const scene = sceneRef.current
        if (scene) {
          // 上限封顶，超长页面也不会无限漂移
          const y = Math.min(window.scrollY, 1500)
          scene.style.transform = `translate3d(0, ${(-y * 0.055).toFixed(2)}px, 0)`
          scene.querySelectorAll<HTMLElement>('[data-depth]').forEach((el) => {
            const k = Number(el.dataset.depth ?? 0)
            el.style.transform = `translate3d(0, ${(-y * k).toFixed(2)}px, 0)`
          })
        }
        // 分区色调：页面无 data-space-section 时保持默认底色。
        // 分页模式下同一时间只有一个区块在 DOM 中，色调由区块的
        // data-space-tone 属性指定（缺省时退回按索引取模）。
        const sections = document.querySelectorAll<HTMLElement>('[data-space-section]')
        if (sections.length > 0) {
          const mid = window.innerHeight / 2
          let active = 0
          let best = Infinity
          sections.forEach((s, i) => {
            const rect = s.getBoundingClientRect()
            const dist = Math.abs((rect.top + rect.bottom) / 2 - mid)
            if (dist < best) {
              best = dist
              active = Number(s.dataset.spaceTone ?? i)
            }
          })
          rootRef.current?.setAttribute('data-tone', String(active % TONE_COUNT))
        }
      })
    }
    apply()
    window.addEventListener('scroll', apply, { passive: true })
    window.addEventListener('resize', apply, { passive: true })
    return () => {
      window.removeEventListener('scroll', apply)
      window.removeEventListener('resize', apply)
      cancelAnimationFrame(raf)
    }
  }, [parallax])

  const renderStars = (list: Star[], layerClass: string, depth: number) => (
    <div className={`space-bg__stars ${layerClass}`}>
      {/* 内层承接滚动视差位移，外层继续做摇曳动画，两者互不冲突 */}
      <div className="space-bg__stars-inner" data-depth={depth}>
        {list.map((s) => (
          <span
            key={s.id}
            className="space-bg__star"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
              opacity: s.opacity,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
              ['--tw-min']: s.min,
              ['--tw-max']: s.max,
            } as CSSProperties}
          />
        ))}
      </div>
    </div>
  )

  return (
    <div className={`space-bg space-bg--${variant}`} ref={rootRef} aria-hidden="true">
      {/* 场景层（随滚动视差） */}
      <div className="space-bg__scene" ref={sceneRef}>
        {/* 银河斜带 */}
        <div className="space-bg__milkyway" />

        {/* 星云光晕 */}
        <div className="space-bg__nebula space-bg__nebula--violet" />
        <div className="space-bg__nebula space-bg__nebula--teal" />
        <div className="space-bg__nebula space-bg__nebula--coral" />

        {/* 三层星尘：远(小暗) → 中 → 近(大亮)，整层缓慢摇曳；内层随滚动差速漂移 */}
        {renderStars(stars.far, 'space-bg__stars--far', 0.03)}
        {renderStars(stars.mid, 'space-bg__stars--mid', 0.06)}
        {renderStars(stars.near, 'space-bg__stars--near', 0.1)}

        {/* 十字星芒 */}
        {sparkles.map((sp) => (
          <span
            key={sp.id}
            className="space-bg__sparkle"
            style={{
              top: `${sp.top}%`,
              left: `${sp.left}%`,
              animationDelay: `${sp.delay}s`,
              animationDuration: `${sp.duration}s`,
              ['--sp-size']: `${sp.size}px`,
            } as CSSProperties}
          />
        ))}

        {/* 极光（地平线光带） */}
        <div className="space-bg__aurora space-bg__aurora--teal" />
        <div className="space-bg__aurora space-bg__aurora--violet" />

        {/* 星球：地球(带月亮) / 紫气巨行星 / 冰星(细环)
           （土星已移除：左上角黄色星球挡住首页文字） */}
        <div className="space-bg__planet space-bg__planet--earth">
          <span className="space-bg__moon" />
        </div>
        <div className="space-bg__planet space-bg__planet--gas" />
        <div className="space-bg__planet space-bg__planet--ice" />

        {/* 首页装饰层：宇航员 + 望远镜融入背景，整层随滚动视差缓慢漂移（仅 home 变体） */}
        {variant === 'home' && (
          <div className="space-bg__hero-decor" data-depth={0.05}>
            <Astronaut />
            <Telescope />
          </div>
        )}
      </div>

      {/* 分区色调层：随滚动在区块间平滑交叉过渡（data-tone 由 JS 设置） */}
      <div className="space-bg__tone space-bg__tone--a" />
      <div className="space-bg__tone space-bg__tone--b" />
      <div className="space-bg__tone space-bg__tone--c" />

      {/* 流星：亮头朝飞行方向，负延迟散布在各循环相位 */}
      {meteors.map((m) => (
        <span
          key={m.id}
          className="space-bg__meteor"
          style={{
            top: `${m.top}%`,
            left: `${m.left}%`,
            ['--m-angle']: `${m.angle}deg`,
            ['--m-dx']: `${m.dx}vmin`,
            ['--m-dy']: `${m.dy}vmin`,
            ['--m-duration']: `${m.duration}s`,
            ['--m-delay']: `${m.delay}s`,
            ['--m-scale']: m.scale,
            ['--m-opacity']: m.opacity,
            ['--m-len']: `${m.len}px`,
            ['--m-head']: m.head,
            ['--m-tail']: m.tail,
            ['--m-glow']: m.glow,
          } as CSSProperties}
        />
      ))}

      {/* 飞船：机头朝右（SVG 朝向），rotate 角 = 航向角，无限巡航 */}
      {ships.map((s) => (
        <span
          key={s.id}
          className={`space-bg__ship${s.primary ? ' space-bg__ship--primary' : ' space-bg__ship--distant'}`}
          style={{
            top: s.top,
            width: s.width,
            opacity: s.opacity,
            ['--fly-angle']: `${s.angle}deg`,
            ['--fly-x']: `${s.x}vmin`,
            ['--fly-y']: `${s.y}vmin`,
            ['--fly-duration']: `${s.duration}s`,
            ['--fly-delay']: `${s.delay}s`,
          } as CSSProperties}
        >
          <span className="space-bg__ship-sway">
            <span className="space-bg__ship-glow" />
            <span className="space-bg__ship-trail" />
            <span className="space-bg__ship-flame" />
            {/* 引擎偶尔喷出的小粒子（错峰） */}
            <span className="space-bg__ship-puff" />
            <span className="space-bg__ship-puff" style={{ animationDelay: '1.8s' }} />
            <span className="space-bg__ship-puff" style={{ animationDelay: '3.6s' }} />
            <svg className="space-bg__ship-svg" viewBox="0 0 240 110" fill="none" role="presentation">
              <defs>
                <linearGradient id={`sp-body-${s.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#f8faff" />
                  <stop offset="0.52" stopColor="#aab8ff" />
                  <stop offset="1" stopColor="#5866b8" />
                </linearGradient>
                <linearGradient id={`sp-nose-${s.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#ffe08a" />
                  <stop offset="1" stopColor="#ff9a56" />
                </linearGradient>
                <linearGradient id={`sp-fin-${s.id}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#ffb37e" />
                  <stop offset="1" stopColor="#f2624e" />
                </linearGradient>
                <radialGradient id={`sp-window-${s.id}`} cx="0.36" cy="0.3" r="1">
                  <stop offset="0" stopColor="#d9f7ff" />
                  <stop offset="0.55" stopColor="#5cc8ee" />
                  <stop offset="1" stopColor="#13548a" />
                </radialGradient>
              </defs>

              {/* 尾翼（两片） */}
              <path d="M70 33 L40 10 Q36 19 46 29 L62 40 Z" fill={`url(#sp-fin-${s.id})`} />
              <path d="M70 77 L40 100 Q36 91 46 81 L62 70 Z" fill={`url(#sp-fin-${s.id})`} />

              {/* 引擎尾板 */}
              <rect x="40" y="29" width="16" height="52" rx="8" fill="#3c468f" />
              <rect x="40" y="29" width="7" height="52" rx="4" fill="#aab7ff" opacity="0.55" />

              {/* 机身胶囊 */}
              <rect x="50" y="33" width="104" height="44" rx="22" fill={`url(#sp-body-${s.id})`} />
              <rect x="60" y="38" width="86" height="11" rx="5.5" fill="#fff" opacity="0.35" />
              <rect x="60" y="65" width="86" height="7" rx="3.5" fill="#2c3580" opacity="0.3" />
              <path
                d="M74 48 l1.8 3.8 3.8 1.8 -3.8 1.8 -1.8 3.8 -1.8 -3.8 -3.8 -1.8 3.8 -1.8 Z"
                fill="#fff"
                opacity="0.8"
              />

              {/* 橙色环带 */}
              <rect x="136" y="33" width="13" height="44" rx="6.5" fill={`url(#sp-fin-${s.id})`} />

              {/* 金色鼻锥（机头朝右） */}
              <path d="M149 33 C 174 33 192 42 207 55 C 192 68 174 77 149 77 Z" fill={`url(#sp-nose-${s.id})`} />
              <path d="M151 36 C 172 36 188 43 202 54 L 151 54 Z" fill="#fff" opacity="0.3" />

              {/* 舷窗 */}
              <circle cx="92" cy="55" r="12.5" fill="#122048" stroke="#cdd6ff" strokeWidth="2.5" />
              <circle cx="92" cy="55" r="9" fill={`url(#sp-window-${s.id})`} />
              <circle cx="88.5" cy="51.5" r="2.6" fill="#fff" opacity="0.9" />
              <circle cx="120" cy="55" r="8.5" fill="#122048" stroke="#cdd6ff" strokeWidth="2" />
              <circle cx="120" cy="55" r="6" fill={`url(#sp-window-${s.id})`} />
            </svg>
            <span className="space-bg__ship-blink" />
          </span>
        </span>
      ))}
    </div>
  )
}

export default SpaceBackground
