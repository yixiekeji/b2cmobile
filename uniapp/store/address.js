import {defineStore} from 'pinia'
import {getAllPCA} from '@/api/member.js'
export const address = defineStore('address',{
	state:()=>{
		addresses:[]
	},
	actions:{
		setAddress(){
			getAllPCA().then(res=>{
				if(res){
					console.log(res);
					this.addresses = res.data.data
				}
			})
		}
	}
})