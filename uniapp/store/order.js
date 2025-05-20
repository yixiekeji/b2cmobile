import {defineStore} from 'pinia'

export const order = defineStore('order',{
	state:()=>({
		order:{
			remarks:'',
			addressId:'',
			invoiceStatus:'0',
			invoice:{},
			orderSn:'',
			couponSn:'',
			couponMoney:'',
			productId:'',
			productGoodId:'',
			number:'',
			money:''
		}
	}),
	actions:{
		setRemarks(val){
			this.order.remarks = val
		},
		setCouponSn(val){
			this.order.couponSn = val
		},
		setCouponMoney(val){
			this.order.couponMoney = val
		},
		setAddressId(val){
			this.order.addressId = val
		},
		setInvoiceStatus(val){
			this.order.invoiceStatus = val
		},
		setInvoice(val){
			this.order.invoice = val
		},
		setOrderSn(val){
			this.order.orderSn = val
		},
		setProductId(val){
			this.order.productId = val
		},
		setProductGoodId(val){
			this.order.productGoodId = val
		},
		setNumber(val){
			this.order.number = val
		},
		setMoney(val){
			this.order.money = val
		},
		resize(){
			this.order = {}
			this.order.remarks = ''
			this.order.addressId = ''
			this.order.orderSn = ''
			this.order.invoiceStatus = '0'
			this.order.invoice = {}
			this.order.invoiceId = ''
			this.order.couponSn = ''
			this.order.couponMoney = ''
			this.order.productId = ''
			this.order.productGoodId = ''
			this.order.number = ''
			this.order.money = ''
		}
	}
})