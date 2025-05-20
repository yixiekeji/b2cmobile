<template>
	<view class="invoiceCenter">
		<HeadNav nav-background-color="#f7f7f5" backImageUrl="1" textContent="发票中心" fontSize="15" fontWeight="600"
			style="z-index: 999999;position: relative;"></HeadNav>
		<!-- 发票类型 普通 | 增值 -->
		<view class="titleBox">发票类型</view>
		<view class="tabInvoice">
			<view @click="InvoiceType(1)"
				:style="[{color:state==1?'#1C9B64':'#999999'},{borderColor:state==1?'#1C9B64':'#999999'},{backgroundColor:state==1?'#1C9B6444':'#ffffff00'}]">普通发票</view>
			<view @click="InvoiceType(2)"
				:style="[{color:state==2?'#1C9B64':'#999999'},{borderColor:state==2?'#1C9B64':'#999999'},{backgroundColor:state==2?'#1C9B6444':'#ffffff00'}]">增值税专用发票
			</view>
		</view>
		<view class="lineBox"></view>
		<!-- 发票类型 公司 | 个人 -->
		<view class="titleBox">发票类型</view>
		<view class="tabInvoice">
			<view @click="ComOrInd('1')"
				:style="[{color:comOrInd==1?'#1C9B64':'#999999'},{borderColor:comOrInd==1?'#1C9B64':'#999999'},{backgroundColor:comOrInd==1?'#1C9B6444':'#ffffff00'}]">公司
			</view>
			<view @click="ComOrInd('2')"
				:style="[{color:comOrInd==2?'#1C9B64':'#999999'},{borderColor:comOrInd==2?'#1C9B64':'#999999'},{backgroundColor:comOrInd==2?'#1C9B6444':'#ffffff00'}]"
				v-if="state == 1&&(invoice == 'invoice'||invoice == 'jifeninvoice')">个人</view>
		</view>
		<!-- 发票详细内容 -->
		<view class="invoiceList">
			<view>
				<input type="text" placeholder="发票抬头" v-model="shopInvoice.invoiceTitle">
				<text v-if="flagTitle">{{flagTitleValue}}</text>
			</view>
			<view v-if="comOrInd==1">
				<input type="text" placeholder="纳税人识别码" v-model="shopInvoice.invoiceNum">
				<text v-if="flagNum">请输入纳税人识别码</text>
			</view>
			<view v-if="comOrInd==1">
				<input type="text" placeholder="注册地址" v-model="shopInvoice.invoiceAddress">
				<text v-if="flagAddress">请输入注册地址</text>
			</view>
			<view v-if="comOrInd==1">
				<input type="text" placeholder="注册电话" v-model="shopInvoice.invoicePhone">
				<text v-if="flagPhone">请输入注册电话</text>
			</view>
			<view v-if="comOrInd==1">
				<input type="text" placeholder="开户银行" v-model="shopInvoice.invoiceBank">
				<text v-if="flagBank">请输入开户行</text>
			</view>
			<view v-if="comOrInd==1">
				<input type="text" placeholder="银行账号" v-model="shopInvoice.invoiceCode">
				<text v-if="flagCode">请输入银行账号</text>
			</view>
		</view>
		<!-- 保存按钮 -->
		<view style="display: flex;">
			<view class="btnBox" @click="saveInvoice">保存</view>
			<view class="btnBox" @click="cancleInvoice" style="margin-left: 40rpx;" v-if="invoice == 'invoice'||invoice == 'jifeninvoice'">取消
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		reactive,
		ref
	} from "vue";
	import {
		onShow,
		onLoad,
		onPullDownRefresh,
		onReachBottom
	} from "@dcloudio/uni-app";
	import {
		order
	} from '@/store/order'
	import {
		shopInvoiceCreateOrUpdate,
		shopInvoiceList
	} from '@/api/shopInvoice.js'
	const state = ref('1')
	const comOrInd = ref('1') //公司个人标识
	const flagTitle = ref(false) //抬头提示文字
	const flagNum = ref(false) //识别码提示文字
	const flagAddress = ref(false) //地址提示文字
	const flagPhone = ref(false) //手机号提示文字
	const flagBank = ref(false) //银行提示文字
	const flagCode = ref(false) //银行账号提示文字
	const flagTitleValue = ref('请输入发票抬头')
	let shopInvoice = ref({
		id: '',
		invoiceTitle: '', //发票抬头
		invoiceNum: '', //发票识别码
		invoiceAddress: '', //发票地址
		invoicePhone: '', //发票手机号
		invoiceBank: '', //发票银行
		invoiceCode: '', //发票银行账号
	})
	let personal = ref({
		id: '',
		invoiceTitle: '', //发票抬头
		invoiceNum: '', //发票识别码
		invoiceAddress: '', //发票地址
		invoicePhone: '', //发票手机号
		invoiceBank: '', //发票银行
		invoiceCode: '', //发票银行账号
	})
	let shopInvoice1 = ref({
		id: '',
		invoiceTitle: '', //发票抬头
		invoiceNum: '', //发票识别码
		invoiceAddress: '', //发票地址
		invoicePhone: '', //发票手机号
		invoiceBank: '', //发票银行
		invoiceCode: '', //发票银行账号
	})
	let shopInvoice2 = ref({
		id: '',
		invoiceTitle: '', //发票抬头
		invoiceNum: '', //发票识别码
		invoiceAddress: '', //发票地址
		invoicePhone: '', //发票手机号
		invoiceBank: '', //发票银行
		invoiceCode: '', //发票银行账号
	})
	const invoice = ref('')

	// 判断发票类型————普通or专用
	function InvoiceType(val) {
		if (state.value != val) {
			if (val == 1) {
				shopInvoice.value = {
					...shopInvoice1.value
				}
				comOrInd.value = 1
			} else {
				shopInvoice.value = {
					...shopInvoice2.value
				}
				comOrInd.value = 1
			}
			state.value = val
			rules()
		}

	}
	// 判断发票用途————个人or公司
	function ComOrInd(comOrInds) {
		if (comOrInds != comOrInd.value) {
			if (comOrInds == 1) {
				rules()
				shopInvoice.value = {
					...shopInvoice1.value
				}
				comOrInd.value = comOrInds
			} else {
				rules()
				shopInvoice.value = {
					...personal.value
				}
				comOrInd.value = comOrInds
			}

		}
	}

	function rules() {

		flagTitle.value = false //抬头提示文字
		flagNum.value = false //识别码提示文字
		flagAddress.value = false //地址提示文字
		flagPhone.value = false //手机号提示文字
		flagBank.value = false //银行提示文字
		flagCode.value = false //银行账号提示文字
	}
	//获取详情
	function getDetails() {
		shopInvoiceList().then(res => {
			if (res.data.data.ordersInvoice1) {
				shopInvoice1.value = res.data.data.ordersInvoice1
				shopInvoice.value = res.data.data.ordersInvoice1
			}
			if (res.data.data.ordersInvoice2) {
				shopInvoice2.value = res.data.data.ordersInvoice2
			}
		})
	}

	function cancleInvoice() {
		
		if (invoice.value == 'invoice') {
			order().setInvoice({
				invoiceStatus: 0,
				invoiceId: '',
				invoiceTitle: ''
			})
			uni.redirectTo({
				url: "/pages/shoppingCart/confirmOrder"
			});
		}else if(invoice.value == 'jifeninvoice'){
			order().setInvoice({
				invoiceStatus: 0,
				invoiceId: '',
				invoiceTitle: ''
			})
			uni.redirectTo({
				url: "/pages/memberCenter/integralPage/confirmOrder"
			});
		}
	}
	// 点击保存按钮
	function saveInvoice() {
		if (comOrInd.value == 1) {
			//保存专用发票
			if (state.value == 2) {
				if (shopInvoice.value.invoiceTitle == '') {
					flagTitleValue.value = '请输入发票抬头'
					flagTitle.value = true
				} else if (shopInvoice.value.invoiceTitle.length < 2 || shopInvoice.value.invoiceTitle.length > 50) {
					flagTitleValue.value = '发票抬头最多50个字符，最少2个字符'
					flagTitle.value = true
				} else {
					flagTitle.value = false
				}
				// shopInvoice.value.invoiceTitle == '' ? flagTitle.value = true : flagTitle.value = false,
				shopInvoice.value.invoiceNum == '' ? flagNum.value = true : flagNum.value = false,
					shopInvoice.value.invoiceAddress == '' ? flagAddress.value = true : flagAddress.value = false,
					shopInvoice.value.invoicePhone == '' ? flagPhone.value = true : flagPhone.value = false,
					shopInvoice.value.invoiceBank == '' ? flagBank.value = true : flagBank.value = false,
					shopInvoice.value.invoiceCode == '' ? flagCode.value = true : flagCode.value = false
				if (shopInvoice.value.invoiceTitle != '' && shopInvoice.value.invoiceNum != '' && shopInvoice.value
					.invoiceAddress != '' && shopInvoice.value.invoicePhone != '' && shopInvoice.value.invoiceBank !=
					'' && shopInvoice.value.invoiceCode != '') {
					shopInvoice.value.state = state.value
					shopInvoiceCreateOrUpdate(
						shopInvoice.value
					).then(res => {
						uni.showToast({
							icon: 'none',
							duration: 3000,
							title: `保存成功`
						});
						if (invoice.value == 'invoice') {
							order().setInvoice({
								invoiceStatus: 3,
								invoiceId: res.data.data,
								invoiceTitle: shopInvoice.value.invoiceTitle
							})
							uni.redirectTo({
								url: "/pages/shoppingCart/confirmOrder"
							});
						}else if(invoice.value == 'jifeninvoice'){
							order().setInvoice({
								invoiceStatus: 3,
								invoiceId: res.data.data,
								invoiceTitle: shopInvoice.value.invoiceTitle
							})
							uni.redirectTo({
								url: "/pages/memberCenter/integralPage/confirmOrder"
							});
						}
						console.log(res);
					})
				}
				//保存增值发票
			} else if (state.value == 1) {
				if (shopInvoice.value.invoiceTitle == '') {
					flagTitleValue.value = '请输入发票抬头'
					flagTitle.value = true
				} else if (shopInvoice.value.invoiceTitle.length < 2 || shopInvoice.value.invoiceTitle.length > 50) {
					flagTitleValue.value = '发票抬头最多50个字符，最少2个字符'
					flagTitle.value = true
				} else {
					flagTitle.value = false
				}
					shopInvoice.value.invoiceNum == '' ? flagNum.value = true : flagNum.value = false
				if (shopInvoice.value.invoiceTitle != '' && shopInvoice.value.invoiceNum != '') {
					shopInvoice.value.state = state.value
					shopInvoiceCreateOrUpdate(
						shopInvoice.value
					).then(res => {
						uni.showToast({
							icon: 'none',
							duration: 3000,
							title: `保存成功`
						});
						console.log(res);
						if (invoice.value == 'invoice') {
							order().setInvoice({
								invoiceStatus: 1,
								invoiceId: res.data.data,
								invoiceTitle: shopInvoice.value.invoiceTitle
							})
							uni.redirectTo({
								url: "/pages/shoppingCart/confirmOrder"
							});
						}else if(invoice.value == 'jifeninvoice'){
							order().setInvoice({
								invoiceStatus: 1,
								invoiceId: res.data.data,
								invoiceTitle: shopInvoice.value.invoiceTitle
							})
							uni.redirectTo({
								url: "/pages/memberCenter/integralPage/confirmOrder"
							});
						}

					})
				}
			}
		} else {
			shopInvoice.value.invoiceTitle == '' ? flagTitle.value = true : flagTitle.value = false
			if (shopInvoice.value.invoiceTitle != '') {
				if (invoice.value == 'invoice') {
					order().setInvoice({
						invoiceStatus: 2,
						invoiceId: '',
						invoiceTitle: shopInvoice.value.invoiceTitle
					})
					uni.redirectTo({
						url: "/pages/shoppingCart/confirmOrder"
					});
				}else if(invoice.value == 'jifeninvoice'){
					order().setInvoice({
						invoiceStatus: 2,
						invoiceId: '',
						invoiceTitle: shopInvoice.value.invoiceTitle
					})
					uni.redirectTo({
						url: "/pages/memberCenter/integralPage/confirmOrder"
					});
				}
			}
		}
	}

	onLoad((options) => {
		if (options.invoice) {
			invoice.value = options.invoice
		}
		getDetails()
	})
</script>

<style lang="scss" scoped>
	.invoiceCenter {
		width: 750rpx;
		height: 100%;
		padding: 0 34rpx;
		box-sizing: border-box;

		.titleBox {
			font-weight: 600;
			font-size: 28rpx;
			margin-top: 44rpx;
		}

		.tabInvoice {
			font-size: 24rpx;
			color: #999999;
			margin-top: 18rpx;
			display: flex;

			view {
				margin-left: 20rpx;
				width: 210rpx;
				height: 54rpx;
				border: 2rpx solid #999999;
				border-radius: 10rpx;
				text-align: center;
				line-height: 54rpx;
			}
		}

		.lineBox {
			width: 682rpx;
			height: 1rpx;
			background-color: #CACACC;
			margin-top: 56rpx;
		}

		.invoiceList {
			width: 682rpx;
			margin-top: 32rpx;

			view {
				width: 682rpx;
				height: 110rpx;

				input {
					width: 682rpx;
					height: 72rpx;
					background: #FFFFFF;
					border-radius: 10rpx;
					padding-left: 20rpx;
					box-sizing: border-box;
				}

				text {
					font-size: 14rpx;
					color: red;
				}
			}

		}

		.btnBox {
			width: 150rpx;
			height: 60rpx;
			background-color: #1C9B64;
			border-radius: 5px;
			margin-top: 60rpx;
			font-size: 24rpx;
			color: white;
			text-align: center;
			line-height: 60rpx;
		}
	}
</style>