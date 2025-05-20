import App from './App'
import HeadNav from "./components/navbar/index.vue";
import * as Pinia from 'pinia'

import {
	createSSRApp
} from 'vue'

export function createApp() {
	const app = createSSRApp(App)
	// 创建pinia实例
	const pinia = Pinia.createPinia()
	// 使用pinia
	app.use(pinia)
	app.config.globalProperties.imageUrl = 'http://img.yixiekeji.com:8080/b2cimage'
	app.component("HeadNav", HeadNav);
	return {
		app,
		Pinia
	}
}
