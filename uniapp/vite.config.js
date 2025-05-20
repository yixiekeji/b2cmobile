import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
 
export default defineConfig({
	plugins: [
		uni()
	],
	server: {
		port: 5173,
		proxy: {
			'/prod-api': {
				// target: 'http://b2c.yixiekeji.com/', // 目标服务 
				target: 'http://39.105.110.151:8041/',
				changeOrigin: true,
				rewrite: path => path.replace(/^\/prod-api/, ''),
			}
		}
	}
})