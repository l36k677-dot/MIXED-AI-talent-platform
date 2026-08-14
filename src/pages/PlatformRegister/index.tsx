import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SpaceBackground } from '../../components'

function PlatformRegister() {
  const navigate = useNavigate()
  const [platformUid, setPlatformUid] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleRegister(e: FormEvent) {
    e.preventDefault()
    const uid = platformUid.trim()
    const name = username.trim()

    if (!uid) { setError('请输入学号'); return }
    if (!/^S\d{7}$/.test(uid)) { setError('学号格式不正确，应为 S 加7位数字，例如 S2024001'); return }
    if (!name) { setError('请输入用户名'); return }
    if (!password || password.length < 8 || !/(?=.*[A-Za-z])(?=.*\d)/.test(password)) { setError('密码至少需要8位，且需包含字母和数字'); return }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/platform/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platformUid: uid, username: name, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || '注册失败，请重试')
        return
      }

      // Register success — go to login page
      navigate('/platform-login')
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
        boxShadow: '0 24px 70px rgba(0,0,0,0.45), 0 0 80px rgba(45,180,210,0.14)',
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
            background: 'linear-gradient(135deg, #4fc3e8, #48d6a4)',
            color: '#fff',
            fontSize: 26,
            marginBottom: 16,
            boxShadow: '0 10px 28px rgba(79,195,232,0.38)',
          }} aria-hidden="true">✦</span>
          <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700, color: '#f2f5ff' }}>
            注册账号
          </h2>
          <p style={{ margin: 0, fontSize: 14, color: '#b3bfe3' }}>
            创建一个新账号，即可开始探索
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister}>
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
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#8693c4' }}>格式：S + 7位数字，例如 S2024001</p>

          <label
            htmlFor="username"
            style={{ display: 'block', marginTop: 16, marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#c6d0f0' }}
          >
            用户名
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError('') }}
            placeholder="你的名字或昵称"
            style={inputStyle(!!error && !username.trim())}
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
            placeholder="至少8位，需包含字母和数字"
            style={inputStyle(!!error && (!password || password.length < 8 || !/(?=.*[A-Za-z])(?=.*\d)/.test(password)))}
          />
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#8693c4' }}>至少8位，需包含字母和数字</p>

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
                ? '#3f5570'
                : 'linear-gradient(135deg, #4fc3e8, #48d6a4)',
              boxShadow: loading ? 'none' : '0 10px 26px rgba(79,195,232,0.32)',
              color: '#062029',
              fontSize: 16,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity .2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {loading ? '注册中…' : '注册'}
          </button>
        </form>

        <p style={{ margin: '20px 0 0', fontSize: 14, color: '#b3bfe3', textAlign: 'center' }}>
          已有账号？
          {' '}
          <Link to="/platform-login" style={{ color: '#a99bff', fontWeight: 600, textDecoration: 'none' }}>
            去登录
          </Link>
        </p>
      </div>
    </main>
  )
}

export default PlatformRegister
