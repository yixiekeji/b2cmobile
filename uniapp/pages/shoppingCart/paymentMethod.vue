<template>
	<view class="content">
		<!-- 自定义导航栏 -->
		<HeadNav nav-background-color="#F5F5F7" backImageUrl="1" textContent="在线支付" fontWeight="600" fontSize="15">
		</HeadNav>
		<view class="orderDetail">
			<view>订单</view>
			<view>订单金额</view>
			<view>{{orders.ordersType == '2' ? orders.integral+'积分+':''}}￥{{orders.moneyOrder}}</view>
			<view class="detailData">
				<view>订单编号</view>
				<text>{{orders.ordersSn}}</text>
			</view>
			<view class="detailData">
				<view>订单提交时间</view>
				<text>{{orders.createTime}}</text>
			</view>
		</view>
		<!-- #ifndef MP -->
		<view class="payMethods">
			<!-- #ifdef H5 -->
			<view v-if="wxFlag" @click="payMethods('alipay')" :class="payMethod == 'alipay'?'active':''">
				<image src="../../static/payImg/zfbzf.png"></image>
				<text>支付宝支付</text>
				<svg v-if="payMethod == 'alipay'" xmlns="http://www.w3.org/2000/svg" width="25" height="26"
					viewBox="0 0 25 26" fill="none">
					<path d="M0 26L25 0V21C25 23.7614 22.7614 26 20 26H0Z" fill="#1C9B64" />
					<path d="M21.3416 15L16.85 19.4546L14.2834 16.9091L13 18.1819L16.85 22L22.625 16.2728L21.3416 15Z"
						fill="white" />
				</svg>
			</view>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
			<view @click="payMethods('alipay')" :class="payMethod == 'alipay'?'active':''">
				<image src="../../static/payImg/zfbzf.png"></image>
				<text>支付宝支付</text>
				<svg v-if="payMethod == 'alipay'" xmlns="http://www.w3.org/2000/svg" width="25" height="26"
					viewBox="0 0 25 26" fill="none">
					<path d="M0 26L25 0V21C25 23.7614 22.7614 26 20 26H0Z" fill="#1C9B64" />
					<path d="M21.3416 15L16.85 19.4546L14.2834 16.9091L13 18.1819L16.85 22L22.625 16.2728L21.3416 15Z"
						fill="white" />
				</svg>
			</view>
			<!-- #endif -->

			<view @click="payMethods('wxh5')" :class="payMethod == 'wxh5'?'active':''">
				<image src="../../static/payImg/wxzf.png"></image>
				<text>微信支付</text>
				<svg v-if="payMethod == 'wxh5'" xmlns="http://www.w3.org/2000/svg" width="25" height="26"
					viewBox="0 0 25 26" fill="none">
					<path d="M0 26L25 0V21C25 23.7614 22.7614 26 20 26H0Z" fill="#1C9B64" />
					<path d="M21.3416 15L16.85 19.4546L14.2834 16.9091L13 18.1819L16.85 22L22.625 16.2728L21.3416 15Z"
						fill="white" />
				</svg>
			</view>

		</view>
		<!-- #endif -->
		<view class="payFont">
			<view>应付金额：</view>
			<view>{{orders.ordersType == '2' ? orders.integral+'积分+':''}}{{orders.moneyOrder}}<text>元</text></view>
			<!-- <view>支付即同意《支付协议》</view> -->
		</view>
		<view style="width: 100%;height: 160rpx;">
		</view>

		<view class="btnBox">
			<button @click="payment(true)">立即支付</button>
		</view>
		<view class="alipaysubmit" v-html="formContent"></view>
	</view>
</template>

<script setup>
	import {
		ref,
		nextTick
	} from "vue"
	import {
		onLoad,
		onPullDownRefresh,
		onReachBottom
	} from "@dcloudio/uni-app"
	import {
		memberOrdersGetOrders
	} from '@/api/order.js'
	import {
		payindex,
		wxpayindex,
		xcxpayindex,
		apppayindex,
		// pay
	} from '@/api/pay.js'
	import {
		order
	} from '@/store/order'
	const orderSn = ref('')
	const id = ref('')
	let payAmount = ref(0)
	const payMethod = ref('wxh5')
	let codes = ref('')
	const wxFlag = ref(false)
	let orderList = ref([])
	const orders = ref({})

	function payMethods(val) {
		payMethod.value = val
	}

	function getDetails() {
		console.log(1111);
		memberOrdersGetOrders({
			id: id.value
		}).then(res => {
			orderList.value = res.data.data.ordersProductList
			res.data.data.ordersProductList.forEach(item => {
				payAmount.value += Number(item.moneyAmount)
			})
			orders.value = res.data.data.orders
			orderSn.value = res.data.data.orders.ordersSn
		})
	}
	let formContent = ref('')
	const prev = ref(0)
	// 节流--时间戳版本
	function throttle(delay) {
		let now = Date.now(); //当前时间戳
		if (now - prev.value > delay) { //当前时间 - 上次时间 > 延时时间
			prev.value = now; //重置记录时间
			return true //执行函数 发送请求
		} else {
			return false
		}
	}

	function payment(flagPay) {
		// if (!throttle(2000)&&flagPay) {
		// 	return
		// }
		/*支付宝 h5网页支付，不支沙箱测试  uniapp的h5支付未做封装，核心原理是跳转到支付宝网页进行支付宝支付，根据支付宝官方，后台返回的数据唤醒支付宝（注意普通浏览器和微信内置浏览器的区别,因为微信浏览器不支持唤起支付宝）*/
		if (!isWeixin()) {
			console.log(1234)
			payindex({
				optionsRadios: payMethod.value,
				orderPaySn: orderSn.value
			}).then(res => {
				if (!res.data.success && res.data.message.indexOf('out_trade_no已经在其他合单中使用过') != -1) {
					payment()
					return
				}
				//#ifdef H5
				if (!isWeixin()) { //检测是否是微信环境
					if (payMethod.value == 'alipay') {
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
					optionsRadios: payMethod.value == 'wxh5' ? 'wxpay' : payMethod.value,
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
							provider: payMethod.value == 'wxh5' ? 'wxpay' : payMethod.value,
							orderInfo: res.data.data,
							success: (e) => {
								console.log('支付成功')
								if(orders.value.ordersType == '2'){
									uni.navigateTo({
										url: "/pages/shoppingCart/paySuccess?price=" +
											orders.value.moneyOrder + '&jifen=' + orders
												.value.integral 
									})
								}else{
									uni.navigateTo({
										url: "/pages/shoppingCart/paySuccess?price="+orders.value.moneyOrder
									})
								}
							},
							fail: (err) => {
								uni.navigateTo({
									url: "/pages/memberCenter/myOrder/myOrder?stateid=1"
								})
								console.log(err);
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
			orderSn.value = window.location.href.split('#')[1].split('?')[1].split('=')[1]
			wxpayindex({
				code: getUrlValue('code'),
				describe: '商品',
				money: payAmount.value,
				orderPaySn: window.location.href.split('#')[1].split('?')[1].split('=')[1],
				tokens: ''
			}).then(res => {
				if (!res.data.success && res.data.message.indexOf('out_trade_no已经在其他合单中使用过') != -1) {
					payment()
					return
				}
				wxH5Pay2(res.data.data, payAmount.value)
			})
			//#endif
			// } else {
			// #ifdef MP-WEIXIN
			uni.login({
				provider: 'weixin',
				success(res) {
					if (res.code) {
						//code: 用户登录凭证（有效期五分钟）使用 code 可以换取 openid、unionid、session_key 等核心信息
						codes.value = res.code
						xcxpayindex({
							code: res.code,
							orderPaySn: orderSn.value,
						}).then(result => {
							if (!result.data.success && result.data.message.indexOf(
									'out_trade_no已经在其他合单中使用过') != -1) {
										console.log('11111',result);
								payment()
								return
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
									if(orders.value.ordersType == '2'){
										uni.navigateTo({
											url: "/pages/shoppingCart/paySuccess?price=" +
												orders.value.moneyOrder + '&jifen=' + orders
													.value.integral 
										})
									}else{
										uni.navigateTo({
											url: "/pages/shoppingCart/paySuccess?price="+orders.value.moneyOrder
										})
									}
									
								},
								fail(res) {
									console.log('用户支付扣款失败', res)
									uni.navigateTo({
										url: "/pages/memberCenter/myOrder/myOrder?stateid=1"
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
						if(orders.value.ordersType == '2'){
							uni.navigateTo({
								url: "/pages/shoppingCart/paySuccess?price=" +
									orders.value.moneyOrder + '&jifen=' + orders
										.value.integral 
							})
						}else{
							uni.navigateTo({
								url: "/pages/shoppingCart/paySuccess?price="+orders.value.moneyOrder
							})
						}
					} else if (res.err_msg == "get_brand_wcpay_request:cancel") {
						// cancel && cancel();

						// alert ("用户取消支付！"); 
						window.location.href = window.location.href.split('#')[0] +
							'#/pages/memberCenter/myOrder/myOrder?stateid=1'
					} else {
						// no && no();
						// alert ("支付失败！");  
						uni.navigateTo({
							url: "/pages/memberCenter/myOrder/myOrder?stateid=1"
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

	onLoad((options) => {
		//#ifdef H5
		wxFlag.value = !isWeixin()
		//#endif
		id.value = options.id
		getDetails()
	})
</script>

<style lang="scss">
	.content {
		width: 100%;
		height: 100%;
		padding: 40rpx 10rpx;
		box-sizing: border-box;
		// position: relative;

		.payMethods {
			width: 100%;
			height: 120rpx;
			line-height: 120rpx;
			display: flex;
			justify-content: center;

			view {
				width: 348rpx;
				margin-left: 18rpx;
				height: 120rpx;
				background-color: white;
				display: flex;
				align-items: center;
				font-size: 34rpx;
				border-radius: 10rpx;
				position: relative;

				image {
					width: 80rpx;
					height: 80rpx;
					margin: 0rpx 30rpx;
				}

				svg {
					position: absolute;
					right: 0;
					bottom: 0;
					z-index: 99999;
				}
			}
		}

		.payFont {
			width: 100%;
			margin: 72rpx auto;
			text-align: center;

			>view:nth-child(1) {
				font-size: 32rpx;
				font-weight: 600;
				color: #323232;
			}

			>view:nth-child(2) {
				width: 100%;
				font-size: 54rpx;
				color: #1C9B64;
				margin: 8rpx 0;
				font-weight: 600;

				text {
					font-size: 32rpx;
					font-weight: 400;
					margin-left: 6rpx;
				}
			}

			>view:nth-child(3) {
				font-size: 22rpx;
				text-align: center;
				font-weight: 400;
				color: #999;
			}
		}

		.detailData {
			font-size: 26rpx;
			color: #333;
			display: flex;
			margin: 24rpx 30rpx;

			view {
				color: #999;
				width: 180rpx;
			}
		}

		.btnBox {
			width: 100%;
			height: 160rpx;
			position: fixed;
			bottom: 0rpx;
			left: 0rpx;
			background-color: #F5F5F7;

			button {
				width: 683rpx;
				height: 80rpx;
				background-color: #1C9B64;
				border-radius: 24rpx;
				color: white;
				font-size: 32rpx;
				margin: 0 auto;

			}
		}

		.active {
			border: 1px solid #1C9B64;
		}

		.orderDetail {
			height: 420rpx;
			padding: 40rpx 20rpx;
			box-sizing: border-box;
			background-color: white;
			border-radius: 24rpx;
			position: relative;
			margin-bottom: 24rpx;

			>view:nth-child(1) {
				font-size: 32rpx;
				font-weight: 600;
				color: #333;
			}

			>view:nth-child(2) {
				font-size: 26rpx;
				text-align: center;
				color: #999;
				margin: 20rpx 0;
			}

			>view:nth-child(3) {
				font-size: 72rpx;
				text-align: center;
				font-weight: 600;
				color: #333;
			}

			.detailData {
				font-size: 26rpx;
				color: #333;
				display: flex;
				margin: 24rpx 0;

				view {
					color: #999;
					width: 180rpx;
				}
			}

			button {
				width: 148rpx;
				height: 56rpx;
				border-radius: 34rpx;
				background: #1C9B64;
				font-size: 22rpx;
				color: #FFF;
				position: absolute;
				right: 10rpx;
				bottom: 20rpx;
			}
		}
	}
</style>