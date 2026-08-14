import './Telescope.css'

// ── 天文望远镜（纯 SVG 装饰） ───────────────────────────────
// 三脚架稳固站立；镜筒绕云台缓慢左右扫视（±5°），镜头带青色呼吸光，
// 云台/调焦旋钮点缀金、紫色。
// 装饰性元素：pointer-events: none + aria-hidden，不影响交互与读屏。

function Telescope() {
  return (
    <div className="telescope" aria-hidden="true">
      <svg viewBox="0 0 240 220" fill="none" role="presentation">
        <defs>
          <linearGradient id="tel-tube" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#eef1fd" />
            <stop offset="0.55" stopColor="#9aa7de" />
            <stop offset="1" stopColor="#5d6cb8" />
          </linearGradient>
          <radialGradient id="tel-lens" cx="0.35" cy="0.32" r="1">
            <stop offset="0" stopColor="#d9f7ff" />
            <stop offset="0.5" stopColor="#4fc3e8" />
            <stop offset="1" stopColor="#1d6fa8" />
          </radialGradient>
        </defs>

        {/* 地面阴影（锚定位置） */}
        <ellipse cx="120" cy="196" rx="78" ry="11" fill="#05081f" opacity="0.5" />

        {/* 三脚架（稳定不动） */}
        <path d="M116 100 L54 190" stroke="#5d6cb8" strokeWidth="7" strokeLinecap="round" />
        <path d="M124 100 L186 190" stroke="#5d6cb8" strokeWidth="7" strokeLinecap="round" />
        <path d="M120 100 L120 192" stroke="#4a5485" strokeWidth="7" strokeLinecap="round" />
        <path d="M84 156 L156 156" stroke="#4a5485" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
        <circle cx="54" cy="191" r="4" fill="#c3cff2" />
        <circle cx="186" cy="191" r="4" fill="#c3cff2" />
        <circle cx="120" cy="193" r="4" fill="#c3cff2" />

        {/* 云台（金色，暖色点缀） */}
        <circle cx="120" cy="98" r="11" fill="#ffd166" />
        <circle cx="120" cy="98" r="5" fill="#8b6b3a" />

        {/* 镜筒（向右上倾斜，朝向星空）：
            外层定姿态，内层 .telescope__tube 绕云台(120,98)左右扫视 */}
        <g transform="rotate(-17 120 66)">
          <g className="telescope__tube">
            {/* 寻星镜 */}
            <rect x="64" y="28" width="66" height="10" rx="5" fill="#c3cff2" />
            <rect x="88" y="38" width="5" height="10" fill="#9aa7de" />
            <rect x="116" y="38" width="5" height="10" fill="#9aa7de" />

            {/* 主镜筒 + 橙色装饰环带 */}
            <rect x="30" y="48" width="182" height="34" rx="17" fill="url(#tel-tube)" />
            <rect x="150" y="48" width="10" height="34" fill="#ffa56e" />

            {/* 调焦旋钮（紫色） */}
            <circle cx="98" cy="86" r="9" fill="#9d8cff" />
            <circle cx="98" cy="86" r="4" fill="#6d5bd0" />

            {/* 目镜 */}
            <rect x="14" y="55" width="20" height="20" rx="6" fill="#6d5bd0" />

            {/* 镜筒前环 + 物镜（青色呼吸光） */}
            <rect x="194" y="42" width="24" height="46" rx="10" fill="#3c468f" />
            <circle className="telescope__lens-glow" cx="214" cy="65" r="24" fill="#4fc3e8" opacity="0.35" />
            <circle cx="216" cy="65" r="17" fill="url(#tel-lens)" />
            <circle cx="211" cy="59" r="4" fill="#fff" opacity="0.85" />
          </g>
        </g>
      </svg>
    </div>
  )
}

export default Telescope
