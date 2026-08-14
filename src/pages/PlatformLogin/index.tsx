import { type FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SpaceBackground } from '../../components'

function PlatformLogin() {
  const navigate = useNavigate()
  const [platformUid, setPlatformUid] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checkingLogin, setCheckingLogin] = useState(true)

  // 页面加载时检查长期登录 Cookie 是否有效
  useEffect(() => {
    let cancelled = false
    async function checkLogin() {
      try {
        const res = await fetch('/api/platform/check-login', {
          credentials: 'include',
        })
        if (cancelled) return
        if (res.ok) {
          const data = await res.json()
          // Cookie 有效 → 直接跳到模块选择页
          navigate(`/login?sso_token=${encodeURIComponent(data.token)}`)
        } else {
          // Cookie 无效 → 显示登录表单
          setCheckingLogin(false)
        }
      } catch {
        // 网络错误也显示登录表单
        if (!cancelled) setCheckingLogin(false)
      }
    }
    checkLogin()
    return () => { cancelled = true }
  }, [navigate])

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    const uid = platformUid.trim()
    if (!uid) {
      setError('请输入学号')
      return
    }
    if (!password) {
      setError('请输入密码')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/platform/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platformUid: uid, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || '登录失败，请重试')
        return
      }

      // Login success — redirect to module selection page with SSO token
      navigate(`/login?sso_token=${encodeURIComponent(data.token)}`)
    } catch {
      setError('网络错误，请确认后端服务已启动')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = (hasError: boolean) => ({
    width: '100%',
    boxSizing: 'border-box' as const,
    height: 48,
    padding: '0 16px',
    fontSize: 16,
    borderRadius: 12,
    border: `1.5px solid ${hasError ? '#ff6b81' : 'rgba(163,178,255,0.25)'}`,
    background: 'rgba(255,255,255,0.06)',
    color: '#eef2ff',
    outline: 'none',
    transition: 'border-color .2s',
  })

  if (checkingLogin) {
    return (
      <main className="home" style={{ display: 'grid', placeItems: 'center' }}>
        <SpaceBackground variant="auth" />
        <p style={{ position: 'relative', zIndex: 2, color: '#b3bfe3', fontSize: 16 }}>
          ✦ 检查登录状态…
        </p>
      </main>
    )
  }

  return (
    <main className="home" style={{ display: 'grid', placeItems: 'center' }}>
      <SpaceBackground variant="auth" />

      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        maxWidth: 420,
        padding: '48px 40px',
        borderRadius: 24,
        border: '1px solid rgba(163,178,255,0.18)',
        background: 'rgba(18,24,64,0.62)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 24px 70px rgba(0,0,0,0.45), 0 0 80px rgba(109,91,208,0.16)',
        animation: 'riseIn 0.7s var(--ease-out) both',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <span style={{
            display: 'inline-block',
            width: 52,
            height: 52,
            lineHeight: '52px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, #8b7cf7, #4fc3e8)',
            color: '#fff',
            fontSize: 26,
            marginBottom: 16,
            boxShadow: '0 10px 28px rgba(139,124,247,0.4)',
          }} aria-hidden="true">✦</span>
          <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700, color: '#f2f5ff' }}>
            统一登录
          </h2>
          <p style={{ margin: 0, fontSize: 14, color: '#b3bfe3' }}>
            登录后即可进入四大探索模块
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          <label
            htmlFor="platformUid"
            style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#c6d0f0' }}
          >
            学号
          </label>
          <input
            id="platformUid"
            type="text"
            value={platformUid}
            onChange={(e) => { setPlatformUid(e.target.value); setError('') }}
            placeholder="例如：S2024001"
            autoFocus
            style={inputStyle(!!error && !platformUid.trim())}
          />

          <label
            htmlFor="password"
            style={{ display: 'block', marginTop: 16, marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#c6d0f0' }}
          >
            密码
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError('') }}
            placeholder="输入密码"
            style={inputStyle(!!error && !password)}
          />

          {error && (
            <p style={{ margin: '8px 0 0', fontSize: 13, color: '#ff8fa0' }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              height: 48,
              marginTop: 20,
              borderRadius: 12,
              border: 0,
              background: loading
                ? '#4a5485'
                : 'linear-gradient(135deg, #8b7cf7, #4fc3e8)',
              boxShadow: loading ? 'none' : '0 10px 26px rgba(139,124,247,0.35)',
              color: '#fff',
              fontSize: 16,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity .2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {loading ? '登录中…' : '登录'}
          </button>
        </form>

        <p style={{ margin: '20px 0 0', fontSize: 14, color: '#b3bfe3', textAlign: 'center' }}>
          没有账号？
          {' '}
          <Link to="/platform-register" style={{ color: '#a99bff', fontWeight: 600, textDecoration: 'none' }}>
            去注册
          </Link>
        </p>

        <p style={{
          margin: '16px 0 0',
          fontSize: 12,
          color: '#7d89b8',
          textAlign: 'center',
        }}>
          Token 有效期 5 分钟
        </p>
      </div>
    </main>
  )
}

export default PlatformLogin
