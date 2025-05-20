<template>
	<view class="confirmPage">
		<!-- 自定义导航栏 -->
		<HeadNav nav-background-color="#f7f7f5" backImageUrl="1" textContent="积分商城确认订单" fontSize="15" fontWeight="600"
			style="z-index: 999999;position: relative;"></HeadNav>
		<!-- 收获地址栏 -->
		<view class="addressDetail" v-if="addressFlag" @click="jumpAddress">
			<view style="display: flex;align-items: center;">
				<image src="@/static/member/position.png" class="addressImg"></image>
				<view class="fontBox">
					<view>{{addressed[0].name}} {{addressed[0].mobile}}</view>
					<text>{{addressed[0].addAll+addressed[0].addressInfo}}</text>
				</view>
			</view>
			<image src="@/static/shoppingCart/addressRignt.png" class="rightImg"></image>
		</view>
		<!-- 没有默认收货地址 -->
		<view class="noAddress" @click="jumpAddress" v-else>
			+ 添加收货地址
		</view>
		
		<view class="tabInvoice info" style="padding: 20rpx;">
			<view>测试环境，不发货！！！实际支付金额为0.1元，您可以放心支付和测试。</view>
		</view>
		
		<!-- 商品购买信息 -->
		<view class="goodsList">
			<view class="detailBox">
				<image v-if="details&&details.integral" :src="imageUrl+details.integral.image"></image>
				<view class="fontBox">
					<view class="font1">{{details.integral.name}}</view>
					<view class="font2" v-if="details.integralGoods.normName">{{details.integralGoods.normName}}</view>
					<view class="font3">
						<view></view>
						<text>x{{details.totalNumber}}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 商品金额运费及发票备注 -->
		<view class="goodsInformation">
			<view class="informationList">
				<view>需要积分</view>
				<text>{{details.integral.price*details.totalNumber}}</text>
			</view>
			<view class="informationList">
				<view>金额</view>
				<text>¥{{details.amount}}</text>
			</view>
			<view class="informationList">
				<view>运费</view>
				<text>¥{{details.logisticsFeeAmount}}</text>
			</view>
			<view class="informationList" @click="jumpInvoice">
				<view>开具发票</view>
				<view style="display: inline-block;color: #000;">
					{{invoiceInfo}}
					<image src="@/static/shoppingCart/addressRignt.png" class="rightImg"></image>
				</view>
			</view>
			<view class="informationList">
				<view>订单备注</view>
				<view class="taps" @click="addNotes">
					<text>{{notes==""?'无备注':notes}}</text>
					<image src="@/static/shoppingCart/addressRignt.png" class="rightImg"></image>
				</view>
			</view>
		</view>
		<!-- #ifndef MP -->
		<view class="tabInvoice" v-if="!isWeixin()">
			<view class="btn" :id="state==1?'select':''" @click="paystate('1')"
				:style="[{color:state==1?'#1C9B64':'#999999'},{borderColor:state==1?'#1C9B64':'#999999'}]">微信支付</view>
			<view class="btn" :id="state==2?'select':''" @click="paystate('2')"
				:style="[{color:state==2?'#1C9B64':'#999999'},{borderColor:state==2?'#1C9B64':'#999999'},]">支付宝
			</view>
		</view>
		<!-- #endif -->
		<!-- 合计提交订单 -->
		<view class="totleBox">
			<view class="totleFont">
				合计:<text
					class="text1">{{details.integral.price*details.totalNumber}}积分{{details.amount+details.logisticsFeeAmount==0?'':'+¥'+(details.amount+details.logisticsFeeAmount)}}</text><text
					class="text2">以实际支付金额为准</text>
			</view>
			<!-- 提交按钮 -->
			<button @click="confirmOrders">提交订单</button>
		</view>
		<!-- 订单备注弹框 -->
		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog ref="inputClose" mode="input" title="备注" :value="notes" placeholder="请输入内容"
				@confirm="confirm" @close="close"></uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="popups" :is-mask-click='false'>
			<view class="popup-content" style="height: 100rpx;line-height: 100rpx;color: #fff;"
				:class="{ 'popup-height': type === 'left' || type === 'right' }"><text class="text">订单提交中...</text>
			</view>
		</uni-popup>
		<view class="alipaysubmit" v-html="formContent"></view>
	</view>
</template>

<script setup>
	import {
		reactive,
		ref,
		nextTick
	} from "vue";
	import {
		ordersInfo,
		getCoupon
	} from '@/api/order.js'
	import {
		address,
		getMemberAddress
	} from '@/api/member.js'
	import {
		payindex,
		wxpayindex,
		xcxpayindex,
		apppayindex,
	} from '@/api/pay.js'
	import {
		ordersjifen,
		submitintegral
	} from '@/api/integralPage.js'
	import {
		onShow,
		onLoad,
		onPullDownRefresh,
		onReachBottom
	} from "@dcloudio/uni-app";
	import {
		order
	} from '@/store/order'
	let details = ref({})
	const addressFlag = ref(false)
	let addressed = ref([])
	const addressId = ref('')
	const invoice = ref('0')
	const notes = ref('')
	const invoiceId = ref('')
	const invoiceInfo = ref('')
	const money = ref('')
	const state = ref('1')
	const couponSn = ref('')
	const couponMoney = ref('')
	const orderSn = ref('')
	let payAmount = ref(0)
	const payMethod = ref('wxh5')
	let codes = ref('')
	const wxFlag = ref(false)


	// 获取商品详情数据
	function getDetails() {
		// alert(JSON.stringify(uni.getStorageSync("confims")))
		ordersjifen({
			integralId: order().order.productId,
			integralGoodsId: order().order.productGoodId,
			number: order().order.number,
			addressId: addressId.value
		}).then(res => {
			details.value = res.data.data
		})
	}

	function paystate(states) {
		state.value = states
	}
	// 获取地址
	function getAddress(id) {
		if (id == '00') {
			address().then(res => {
				console.log(res);
				if (res.data.data.length == 0) {
					addressFlag.value = false
				} else {
					addressed.value = res.data.data
					addressId.value = res.data.data[0].id
					order().setAddressId(addressId.value)
					addressed.value.length == 0 ? addressFlag.value = false : addressFlag.value = true
				}
				getDetails()
			})
		} else {
			// 获取地址
			getMemberAddress({
				id: id
			}).then(res => {
				addressed.value = []
				addressed.value.push(res.data.data)
				addressId.value = res.data.data.id
				order().setAddressId(addressId.value)
				addressed.value.length == 0 ? addressFlag.value = false : addressFlag.value = true
				getDetails()
			})

		}
	}
	const couponDialog = ref()

	function choosecoupon() {
		getList()
		couponDialog.value.open()
	}

	function closecoupon() {
		couponSn.value = ''
		couponMoney.value = ''
		order().setCouponSn('')
		couponDialog.value.close()
	}
	// 商品排序状态栏
	const tabs = reactive([{
			id: 2,
			name: '可用优惠券'
		},
		{
			id: 1,
			name: '不可用优惠券'
		}
	])
	const currentTab = ref(1) //当前排序方式
	const tabCurrent = ref('tabNum1')
	const statusBarHeight = ref(0) //排序状态栏高度
	const top = ref(0)
	const sort = ref(1)
	let list = ref([])
	const couponSns = ref('')
	const flag = ref(false)
	// 切换排序方式
	function swichMenu(val) {
		list.value = []
		currentTab.value = val
		tabCurrent.value = 'tabNum' + val
		getList()

	}
	//获取数据
	function getList() {
		getCoupon({
			canUse: currentTab.value
		}).then(res => {
			list.value = [...res.data.data]
		})
	}

	function exchange() {
		if (!couponSns.value) {
			uni.showToast({
				title: '请填写兑换码',
				duration: 2000,
				icon: 'none'
			});
			return
		}
		convertCoupon({
			couponSn: couponSns.value
		}).then(res => {
			console.log(res);
			if (res.data.success) {
				uni.showToast({
					title: '兑换成功',
					duration: 2000,
					icon: 'none'
				});
				couponSns.value = ''
				search()
			}
		})
	}

	function choosecoupons(val, money) {
		couponSn.value = val
		couponMoney.value = money
		order().setCouponSn(val)
		order().setCouponMoney(money)
		couponDialog.value.close()
	}

	function search() {
		list.value = []
		getList()
	}


	const popup = ref()
	// 添加订单备注
	function addNotes() {
		popup.value.open()
	}
	// 关闭订单备注框
	function close() {
		popup.value.close()
	}
	// 确认备注
	function confirm(value) {
		if (value.length > 50) {
			uni.showToast({
				icon: 'none',
				duration: 3000,
				title: '请将订单备注控制在50字以内'
			});
		} else {
			notes.value = value
			order().setRemarks(value)
			popup.value.close()
		}
		// 输入框的值

	}
	const popups = ref()
	//点击提交订单
	function confirmOrders() {
			
		if (addressId.value == '') {
			uni.showToast({
				icon: 'none',
				duration: 3000,
				title: '请选择收货地址'
			});
		} else {
			popups.value.open('center')
			
			submitintegral({
				addressId: addressId.value,
				invoiceStatus: invoice.value,
				payState: state.value,
				invoiceId: invoiceId.value,
				invoiceInfo: invoiceInfo.value,
				number: order().order.number,
				integralId: order().order.productId,
				integralGoodsId: order().order.productGoodId,
				remark: notes.value,
			}).then(res => {
				if (res.data.success) {
					if(details.value.amount != 0 || details.value.logisticsFeeAmount != 0){
						orderSn.value = res.data.data.ordersSn
						payment()
					}else{
						uni.navigateTo({
							url: "/pages/shoppingCart/paySuccess?price=" +
								(details.value.amount + details.value
									.logisticsFeeAmount) + '&jifen=' + (details
									.value.integral.price * details.value
									.totalNumber)
						})
						popups.value.close('center')
					}
				
				} else {
					popups.value.close('center')
				}
			})

		}

	}




	let formContent = ref('')

	function payment() {
		// if (!throttle(2000)&&flagPay) {
		// 	return
		// }
		/*支付宝 h5网页支付，不支沙箱测试  uniapp的h5支付未做封装，核心原理是跳转到支付宝网页进行支付宝支付，根据支付宝官方，后台返回的数据唤醒支付宝（注意普通浏览器和微信内置浏览器的区别,因为微信浏览器不支持唤起支付宝）*/

		if (!isWeixin()) {
			console.log(1234)
			payindex({
				optionsRadios: state.value == 1 ? 'wxh5' : 'alipay',
				orderPaySn: orderSn.value
			}).then(res => {
				if (!res.data.success && res.data.message.indexOf('out_trade_no已经在其他合单中使用过') != -1) {
					payment()
					return
				}
				//#ifdef H5
				if (!isWeixin()) { //检测是否是微信环境
					if (state.value == '2') {
						//后端给的form表单，也是唤起支付宝的关键
						formContent.value = res.data.data.paytext; // 记得data中声明该变量
						nextTick(() => {
							//这里就是提交表单唤起支付宝，中括号中的name名称，要与后端给的form表单name名称一致，
							document.forms['punchout_form'].submit()
						});
					} else {
						window.location.href = res.data.data.mwebUrl
					}

				}
				//#endif
				//#ifdef APP-PLUS
				console.log(payMethod.value, orderSn.value)
				apppayindex({
					optionsRadios: state.value == 1 ? 'wxpay' : 'alipay',
					orderPaySn: orderSn.value
				}).then(res => {
					console.log(res);
					if (!res.data.success && res.data.message.indexOf('out_trade_no已经在其他合单中使用过') != -
						1) {
						payment()
						return
					}
					if (res.data.success) {
						uni.requestPayment({
							provider: state.value == 1 ? 'wxpay' : 'alipay',
							orderInfo: res.data.data,
							success: (e) => {
								console.log('支付成功')
								uni.navigateTo({
									url: "/pages/shoppingCart/paySuccess?price=" +
										(details.value.amount + details.value
											.logisticsFeeAmount) + '&jifen=' + (details
											.value.integral.price * details.value
											.totalNumber)
								})
							},
							fail: (err) => {
								console.log(err);
								uni.navigateTo({
									url: "/pages/memberCenter/myOrder/myOrder?orderState=1"
								})
							}
						})
					}
				})

				return
				//#endif
			})
		} else {
			// if (uni.getSystemInfoSync().platform != 'mp-weixin') {
			// #ifndef MP-WEIXIN
			if (getUrlValue('code')) {
				wxpayindex({
					code: getUrlValue('code'),
					describe: '商品',
					orderPaySn: getUrlValue('orderSn'),
				}).then(res => {
					if (!res.data.success && res.data.message.indexOf('out_trade_no已经在其他合单中使用过') != -1) {
						payment()
						return
					}
					wxH5Pay2(res.data.data, payAmount.value)
				})
			} else {
				let local = encodeURIComponent((window.location.href.split('#')[0].indexOf('?') == -1 ?
						window.location.href.split('#')[0] : window.location.href.split('#')[0].split(
							'?')[0]) +
					'#/pages/shoppingCart/confirmOrder?orderSn=' + orderSn.value)
				let appid = "wx42a59bbf508e718d"
				window.location.href =
					"https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
					appid +
					"&redirect_uri=" +
					local +
					"&response_type=code&scope=snsapi_base&state=1#wechat_redirect"

			}
			// orderSn.value = window.location.href.split('#')[1].split('?')[1].split('=')[1]

			//#endif
			// } else {
			// #ifdef MP-WEIXIN
			uni.login({
				provider: 'weixin',
				success(res) {
					console.log(res);
					if (res.code) {
						//code: 用户登录凭证（有效期五分钟）使用 code 可以换取 openid、unionid、session_key 等核心信息
						codes.value = res.code
						xcxpayindex({
							code: res.code,
							orderPaySn: orderSn.value,
						}).then(result => {
							if (!result.data.success && result.data.message.indexOf(
									'out_trade_no已经在其他合单中使用过') != -1) {
								console.log('11111', result);
								payment()
								return
							} else if (!result.data.success) {
								setTimeout(() => {
									uni.navigateTo({
										url: "/pages/memberCenter/myOrder/myOrder?orderState=0"
									})
									popups.value.close('center')
								}, 1000)
							}
							console.log(result.data.data);
							wx.requestPayment({
								'timeStamp': result.data.data.timeStamp, //后端返回的时间戳
								'nonceStr': result.data.data.nonceStr, //后端返回的随机字符串
								'package': result.data.data.package, //后端返回的prepay_id
								'signType': 'MD5', //后端签名算法,根据后端来,后端MD5这里即为MD5
								'paySign': result.data.data.paySign, //后端返回的签名
								success(res) {
									console.log('用户支付扣款成功', res)
									uni.navigateTo({
										url: "/pages/shoppingCart/paySuccess?price=" +
											(details.value.amount + details.value
												.logisticsFeeAmount) + '&jifen=' + (details
												.value.integral.price * details.value
												.totalNumber)
									})
								},
								fail(res) {
									console.log('用户支付扣款失败', res)
									uni.navigateTo({
										url: "/pages/memberCenter/myOrder/myOrder?orderState=1"
									})
								}
							})
						})
					} else {
						console.log('登录失败！' + res.errMsg)
					}
				}
			})


			//#endif
			// }

		}
	}

	function wxH5Pay2(data, ok, no, cancel) {
		let onBridgeReady = (params) => {
			window.WeixinJSBridge.invoke(
				'getBrandWCPayRequest', {
					'appId': params.appid, // 公众号名称，由商户传入
					'timeStamp': params.timeStamp, // 时间戳，自1970年以来的秒数
					'nonceStr': params.nonceStr, // 随机串
					'package': params.package,
					'signType': 'MD5', // 微信签名方式：
					'paySign': params.sign // 微信签名
				},
				function(res) {
					if (res.err_msg == "get_brand_wcpay_request:ok") {
						// ok && ok();

						// alert ("微信支付成功！");  
						uni.navigateTo({
							url: "/pages/shoppingCart/paySuccess?price=" +
								(details.value.amount + details.value
									.logisticsFeeAmount) + '&jifen=' + (details
									.value.integral.price * details.value
									.totalNumber)
						})
					} else if (res.err_msg == "get_brand_wcpay_request:cancel") {
						// cancel && cancel();

						// alert ("用户取消支付！"); 
						window.location.href = window.location.href.split('#')[0] +
							'#/pages/memberCenter/myOrder/myOrder?orderState=1'
					} else {
						// no && no();
						// alert ("支付失败！");  
						uni.navigateTo({
							url: "/pages/memberCenter/myOrder/myOrder?orderState=1"
						})
					}
					//console.log(res)
					//callback && callback(res)
				}
			)
		}
		if (typeof window.WeixinJSBridge === 'undefined') {
			if (document.addEventListener) {
				document.addEventListener('WeixinJSBridgeReady', function() {
					onBridgeReady(data)
				}, false)
			} else if (document.attachEvent) {
				document.attachEvent('WeixinJSBridgeReady', function() {
					onBridgeReady(data)
				})
				document.attachEvent('onWeixinJSBridgeReady', function() {
					onBridgeReady(data)
				})
			}
		} else {
			onBridgeReady(data)
		}
	}

	//判断是否是微信浏览器
	function isWeixin() {
		// #ifdef MP-WEIXIN
		return true;
		//#endif
		// #ifdef H5
		let ua = window.navigator.userAgent.toLowerCase()

		if (ua.match(/MicroMessenger/i) == 'micromessenger') {

			return true;

		}

		return false;
		//#endif
		// #ifdef APP-PLUS

		return false

		//#endif
	}
	//跳转到收货地址
	function jumpAddress() {
		uni.redirectTo({
			url: "/pages/memberCenter/address/address?order=jifenorder"
		});
	}
	//跳转到发票
	function jumpInvoice() {
		uni.redirectTo({
			url: "/pages/memberCenter/invoice/alertInvoice?invoice=jifeninvoice"
		});
	}

	function getUrlValue(value) {
		// 从第一个?开始，且不包括#之后，并截取掉?的部分
		var query = location.search.substring(1);
		// 从#开始的部分，并转换成数组
		var hash = location.hash.split("?");
		// query和hash均没有参数
		if (!query && hash.length < 2) {
			return ''
		}
		// 先取query部分的参数进行匹配
		var vars = query.split("&")
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=")
			if (pair[0] == value) {
				return pair[1]
			}
		}
		// query没有参数，或者有参数但没找到，则取hash部分的参数
		if (!hash[1]) {
			return ''
		}
		vars = hash[1].split("&")
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=")
			if (pair[0] == value) {
				return pair[1]
			}
		}
		return ''
	}

	onLoad((options) => {
		if (order().order.addressId != '') {
			getAddress(order().order.addressId)
		} else {
			getAddress('00')
		}
		couponSn.value = order().order.couponSn ? order().order.couponSn : ''
		couponMoney.value = order().order.couponMoney ? order().order.couponMoney : ''
		invoice.value = order().order.invoice.invoiceStatus ? order().order.invoice.invoiceStatus : ''
		invoiceId.value = order().order.invoice.invoiceId ? order().order.invoice.invoiceId : ''
		invoiceInfo.value = order().order.invoice.invoiceTitle ? order().order.invoice.invoiceTitle : ''
		notes.value = order().order.remarks ? order().order.remarks : ''
		//#ifdef H5
		wxFlag.value = !isWeixin()
		//#endif
		orderSn.value = order().order.orderSn

		if (getUrlValue('code')) {
			payment()
		}
	})
</script>

<style lang="scss" scoped>
	.confirmPage {
		width: 750rpx;
		// height: 100vh;
		padding: 18rpx 18rpx 200rpx 18rpx;
		box-sizing: border-box;
		position: relative;
		overflow: auto;

		.noData {
			margin-top: 50rpx;
			font-size: 22rpx;
			color: gray;
			text-align: center;

			image {
				width: 190rpx;
				height: 190rpx;
			}
		}

		.rightImg {
			width: 14rpx;
			height: 18rpx;
			// margin-left: 124rpx;
		}

		.addressDetail {
			width: 714rpx;
			height: 146rpx;
			background: #FFFFFF;
			border-radius: 24rpx;
			padding-right: 30rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.addressImg {
				width: 44rpx;
				height: 44rpx;
				margin-left: 20rpx;
			}

			.fontBox {
				width: 460rpx;
				margin-left: 14rpx;
				line-height: 46rpx;

				view {
					font-weight: 600;
					font-size: 32rpx;
				}

				text {
					font-size: 28rpx;
					color: #999999;
				}
			}
		}

		.noAddress {
			width: 714rpx;
			height: 146rpx;
			background: #FFFFFF;
			border-radius: 24rpx;
			line-height: 146rpx;
			text-align: center;
			color: #1C9B64;
			font-size: 32rpx;
			font-weight: 600;
		}

		.goodsList {
			padding: 24rpx 19rpx;
			box-sizing: border-box;
			width: 714rpx;
			background: #FFFFFF;
			border-radius: 24rpx;
			margin-top: 16rpx;

			.detailBox {
				display: flex;
				align-items: center;

				image {
					margin: 16rpx 0;
					width: 160rpx;
					height: 160rpx;
				}

				.fontBox {
					margin-left: 20rpx;
					width: 480rpx;

					.font1 {
						line-clamp: 1;
						overflow: hidden; //超出文本隐藏
						text-overflow: ellipsis; ///超出部分省略号显示
						display: -webkit-box; //弹性盒模型
						-webkit-box-orient: vertical; //上下垂直
						-webkit-line-clamp: 1; //自定义行数
						font-size: 30rpx;
					}

					.font2 {
						width: 270rpx;
						height: 36rpx;
						background: #F5F5F7;
						border-radius: 10rpx;
						font-size: 24rpx;
						line-height: 36rpx;
						text-align: center;
						color: #999999;
						margin-top: 18rpx;
						margin-bottom: 26rpx;
					}

					.font3 {
						display: flex;
						justify-content: space-between;
						align-items: center;

						view {
							font-weight: 600;
							font-size: 34rpx;
							color: #DC3A2F;

							text {
								font-size: 24rpx;
								color: #DC3A2F;
							}
						}

						text {
							font-size: 26rpx;
							color: #999999;
						}
					}
				}
			}
		}

		.goodsInformation {
			width: 714rpx;
			height: 500rpx;
			background: #FFFFFF;
			border-radius: 24rpx;
			margin-top: 16rpx;

			.informationList {
				display: flex;
				justify-content: space-between;
				height: 100rpx;
				align-items: center;
				padding: 24rpx 20rpx;
				box-sizing: border-box;
				font-size: 28rpx;

				view {
					color: #999999;
				}

				.taps {
					color: black;

					image {
						margin-left: 10rpx;
					}
				}
			}
		}

		.totleBox {
			width: 750rpx;
			height: 140rpx;
			background-color: white;
			display: flex;
			justify-content: space-between;
			align-items: center;
			position: fixed;
			bottom: 0;
			left: 0;

			.totleFont {
				font-size: 26rpx;
				margin: 27rpx 20rpx;
				display: flex;
				align-items: center;
				width: 520rpx;

				.text1 {
					font-weight: 600;
					font-size: 36rpx;
					color: #1C9B64;
					margin: 0 10rpx;
				}

				.text2 {
					font-size: 24rpx;
					color: #999999;
				}
			}

			button {
				width: 166rpx;
				height: 68rpx;
				background: #1C9B64;
				border-radius: 24rpx;
				font-size: 24rpx;
				color: white;
				line-height: 66rpx;
			}
		}

		.tabInvoice {
			font-size: 26rpx;
			color: #999999;
			margin-top: 18rpx;
			display: flex;
			background-color: #fff;
			border-radius: 24rpx;
			padding: 20rpx 0;

			.btn {
				margin-left: 20rpx;
				width: 210rpx;
				height: 54rpx;
				border: 2rpx solid #999999;
				border-radius: 10rpx;
				text-align: center;
				line-height: 54rpx;
			}
		}
		.tabInvoice.info{
			color: #333333;
		}

		.couponDialog {
			height: 1000rpx;
			border-radius: 24rpx 24rpx 0 0;
			background: #F5F5F7;

			.title {
				width: 100%;
				display: flex;
				justify-content: space-between;
				// margin: 30rpx 0 43rpx 0;
				border-radius: 24rpx 24rpx 0 0;
				height: 100rpx;
				align-items: center;
				background-color: #fff;
				// >view {
				// 	width: 130rpx;
				// }

				>view:nth-child(2) {
					color: #010002;
					text-align: center;
					font-family: PingFang SC;
					font-size: 36rpx;
					font-style: normal;
					font-weight: 600;
					line-height: normal;
				}

				.uni-icons {
					float: right;
					padding-right: 28rpx;
				}
			}

			.top-menu-view {
				padding: 0 26rpx;
				box-sizing: border-box;
				display: flex;
				justify-content: space-evenly;
				position: sticky;
				position: -webkit-sticky;
				top: 0rpx;
				white-space: nowrap;
				width: 100%;
				background-color: #FFFFFF;
				height: 89rpx;
				line-height: 89rpx;

				.menu-topic-view {
					display: inline-block;
					white-space: nowrap;
					height: 89rpx;
					position: relative;
				}

				.menu-topic-text {
					font-size: 30rpx;
					color: #88888C;
					padding: 10rpx 30rpx;
					position: relative;
				}

				.menu-topic-bottom {
					position: absolute;
					bottom: 0;
					right: 0;
					left: 0;
					margin: auto;
					width: 20rpx;
					height: 8rpx;
					border-radius: 4rpx 4rpx 4rpx 4rpx;
				}

				.menu-topic-bottom-color {
					width: 80rpx;
					height: 8rpx;
					border-radius: 4rpx 4rpx 4rpx 4rpx;
				}

				.menu-topic-act .menu-topic-bottom {
					display: flex;
					justify-content: center;
				}

				.menu-topic-act .menu-topic-bottom-color {
					background: #000;
				}

				.menu-topic-act .menu-topic-text {
					color: #000;
					font-weight: 600;
				}
			}

			.couponSn {
				width: 692rpx;
				height: 87rpx;
				margin: 0 auto;
				margin-top: 24rpx;
				position: relative;
				background: #FFFFFF;
				border-radius: 44rpx 44rpx 44rpx 44rpx;

				input {
					width: 480rpx;
					height: 87rpx;
					margin-left: 20rpx;
				}

				button {
					position: absolute;
					right: 7rpx;
					top: 7rpx;
					width: 174rpx;
					height: 73rpx;
					background: #1C9B64;
					border-radius: 47rpx 47rpx 47rpx 47rpx;
					font-size: 32rpx;
					color: #FFFFFF;
					display: flex;
					align-items: center;
					justify-content: center;
					z-index: 999;
				}
			}


			.couponsContent {
				width: 692rpx;
				height: 178rpx;
				background: #FFFFFF;
				box-shadow: 0rpx 8rpx 8rpx 0rpx rgba(0, 0, 0, 0.12);
				border-radius: 16rpx;
				margin: 0 auto;
				margin-top: 24rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 24rpx;
				box-sizing: border-box;
				overflow: hidden;
				position: relative;

				>view:nth-child(1) {
					>view {
						height: 42rpx;
						font-weight: 600;
						font-size: 30rpx;
						color: #333333;
						line-height: 42rpx;

						>text {
							font-size: 22rpx;
							color: #999999;
							margin-left: 6rpx;
							font-weight: normal;
							line-height: 42rpx;
						}
					}

					>text {
						font-weight: 400;
						font-size: 22rpx;
						color: #999999;
					}
				}

				>view:nth-child(2) {
					color: #DC3A2F;

					>view {
						font-weight: 600;
						font-size: 62rpx;

						>text {
							font-size: 29rpx;
						}
					}

					>text {
						font-weight: 400;
						font-size: 24rpx;
					}
				}

				.couponsPos {
					width: 72rpx;
					height: 38rpx;
					background: #1C9B64;
					border-radius: 16rpx 0rpx 16rpx 0rpx;
					font-size: 22rpx;
					color: #FFFFFF;
					position: absolute;
					left: 0;
					top: 0;
					overflow: hidden;
					text-align: center;
					line-height: 38rpx;
				}

				.mark {
					width: 100%;
					height: 100%;
					background-color: #ffffff99;
					position: absolute;
					top: 0;
					left: 0;
					z-index: 9;
				}

				image {
					width: 155rpx;
					height: 116rpx;
					position: absolute;
					right: 0;
					bottom: 0;
					opacity: 1;
					z-index: 91;
				}
			}
		}
	}

	#select {
		position: relative;
		text-align: center;
		color: #1C9B64;
		background-color: #fff;
		box-shadow: 0px 2px 7px 0px rgba(85, 110, 97, 0.35);
		border-radius: 5px;
		border: 1px solid #1C9B64;
	}

	#select:before {
		content: '';
		position: absolute;
		right: 0;
		bottom: 0;
		border: 10px solid #1C9B64;
		border-top-color: transparent;
		border-left-color: transparent;
	}

	#select:after {
		content: '';
		width: 4px;
		height: 6px;
		position: absolute;
		right: 4px;
		bottom: 3px;
		border: 2px solid #fff;
		border-top-color: transparent;
		border-left-color: transparent;
		transform: rotate(45deg);
	}
</style>