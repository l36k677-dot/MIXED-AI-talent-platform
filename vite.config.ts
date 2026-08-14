import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api/platform': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      // 深海基地行为评分由 Node 服务(3000)提供，优先于 /api/assessment
      '/api/assessment/submit-level': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      // 深海基地智能体对话 / SSO 校验 / 关卡报告 由 Python 服务(8005)提供；
      // 不要指到 story-backend(8000)，那里没有这些路由（会 404 导致深海被门控）
      '/api/assessment': {
        target: 'http://localhost:8005',
        changeOrigin: true,
      },
      // 故事共创 / 统一登录等其余 API 由 story-backend(8000) 提供
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
