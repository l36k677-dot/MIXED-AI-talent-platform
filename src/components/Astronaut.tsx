import './Astronaut.css'

// ── 漂浮宇航员（纯 SVG 装饰） ───────────────────────────────
// 配色取自平台太空主题色板：白色航天服 + 紫色胸控面板 + 金色面罩 + 淡蓝靴子，
// 冷色调为主、少量暖色点缀（面罩/腰带/星芒）。带上下漂浮 + 微旋转动画。
// 装饰性元素：pointer-events: none + aria-hidden，不影响交互与读屏。

function Astronaut() {
  return (
    <div className="astro" aria-hidden="true">
      <svg viewBox="0 0 200 260" fill="none" role="presentation">
        <defs>
          <linearGradient id="astro-visor" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff6d8" />
            <stop offset="0.45" stopColor="#ffd166" />
            <stop offset="0.8" stopColor="#ff9a56" />
            <stop offset="1" stopColor="#e0703a" />
          </linearGradient>
          <linearGradient id="astro-suit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#d5ddf6" />
          </linearGradient>
          <linearGradient id="astro-pack" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8b98d8" />
            <stop offset="1" stopColor="#4a5485" />
          </linearGradient>
          <linearGradient id="astro-panel" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#b3a6ff" />
            <stop offset="1" stopColor="#6d5bd0" />
          </linearGradient>
        </defs>

        {/* 安全绳（连回"母舰"，虚线缓荡） */}
        <path
          d="M126 26 C 152 4, 186 22, 194 60"
          stroke="#4fc3e8"
          strokeOpacity="0.5"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="2 7"
        />

        {/* 星星点缀（金色星芒 + 两颗小白星，错峰闪烁） */}
        <path className="astro__star" d="M22 30 L25 41 L36 44 L25 47 L22 58 L19 47 L8 44 L19 41 Z" fill="#ffd166" />
        <circle className="astro__star" cx="168" cy="118" r="2.5" fill="#fff" style={{ animationDelay: '0.9s' }} />
        <circle className="astro__star" cx="30" cy="152" r="2" fill="#dbe6ff" style={{ animationDelay: '1.7s' }} />

        {/* 背包（身体后方） */}
        <rect x="112" y="98" width="52" height="94" rx="18" fill="url(#astro-pack)" />
        <rect x="120" y="108" width="36" height="8" rx="4" fill="#c3cff2" opacity="0.5" />

        {/* 双腿（漂浮弯曲姿态） */}
        <path d="M82 168 C 72 188, 58 202, 48 216" stroke="#e4eafb" strokeWidth="26" strokeLinecap="round" />
        <path d="M118 168 C 128 188, 142 202, 152 216" stroke="#e4eafb" strokeWidth="26" strokeLinecap="round" />

        {/* 靴子 */}
        <g transform="rotate(-14 50 214)">
          <rect x="28" y="202" width="44" height="26" rx="13" fill="#9fb2ec" />
        </g>
        <g transform="rotate(14 150 214)">
          <rect x="128" y="202" width="44" height="26" rx="13" fill="#9fb2ec" />
        </g>

        {/* 手臂：左手举过头，绕肩部(64,108)轻轻摆动招手；右手自然下垂 */}
        <g className="astro__arm">
          <path d="M64 108 C 54 96, 46 86, 42 76" stroke="#e4eafb" strokeWidth="22" strokeLinecap="round" />
          <circle cx="42" cy="72" r="12" fill="#dbe6ff" />
        </g>
        <path d="M136 108 C 146 124, 148 136, 148 150" stroke="#e4eafb" strokeWidth="22" strokeLinecap="round" />
        <circle cx="148" cy="154" r="12" fill="#dbe6ff" />

        {/* 身体 */}
        <rect x="60" y="96" width="80" height="80" rx="32" fill="url(#astro-suit)" />

        {/* 胸前控制面板 */}
        <rect x="76" y="114" width="48" height="40" rx="11" fill="url(#astro-panel)" />
        <circle cx="88" cy="130" r="4" fill="#ffd166" />
        <circle cx="100" cy="130" r="4" fill="#4fd4e8" />
        <circle cx="112" cy="130" r="4" fill="#fff" opacity="0.85" />
        <rect x="88" y="140" width="24" height="5" rx="2.5" fill="#fff" opacity="0.5" />

        {/* 腰带（金色卡扣） */}
        <rect x="66" y="162" width="68" height="11" rx="5.5" fill="#c3cff2" />
        <rect x="90" y="160" width="20" height="15" rx="4" fill="#ffd166" />

        {/* 头盔 + 金色面罩 */}
        <circle cx="100" cy="64" r="40" fill="url(#astro-suit)" />
        <circle cx="100" cy="66" r="28" fill="url(#astro-visor)" />
        <path d="M80 52 A 24 24 0 0 1 120 52" stroke="#fff" strokeOpacity="0.7" strokeWidth="4" strokeLinecap="round" />
        <path d="M72 44 A 34 34 0 0 1 96 26" stroke="#fff" strokeOpacity="0.5" strokeWidth="5" strokeLinecap="round" />
      </svg>
    </div>
  )
}

export default Astronaut
