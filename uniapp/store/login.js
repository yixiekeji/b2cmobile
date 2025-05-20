import {defineStore} from 'pinia'
import {dologin,logout,dologinPhone} from '@/api/login.js'

export const login = defineStore('login',{
	state:()=>({
		token:uni.getStorageSync("token")
	}),
	actions:{
		doLogin(val){
			return new Promise((resolve,reject)=>{
				dologin(val).then(res=>{
					if(res){
						this.token = res.data.data.token
						uni.setStorageSync("token", res.data.data.token)
						resolve()
						
					}else{
						reject()
					}
				}).catch(error=>{
					reject()
				})
			})
			
		},
		doLoginPhone(val){
			return new Promise((resolve,reject)=>{
				dologinPhone(val).then(res=>{
					if(res){
						this.token = res.data.data.token
						uni.setStorageSync("token", res.data.data.token)
						resolve()
						
					}else{
						reject()
					}
				}).catch(error=>{
					reject()
				})
			})
			
		},
		loginOut(){
			return new Promise((resolve,reject)=>{
				logout().then(res=>{
					if(res){
						this.token = ''
						uni.removeStorageSync("token")
						resolve()
					}else{
						reject()
					}
				}).catch(error=>{
					reject()
				})
			})
		},
		setToken(val){
			this.token = val
		},
	}
})