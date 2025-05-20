import {defineStore} from 'pinia'

export const navHeight = defineStore('navHeight',{
	state:()=>{
		navHeight:0
	},
	actions:{
		setHeight(val){
			this.navHeight = val
		}
	}
})