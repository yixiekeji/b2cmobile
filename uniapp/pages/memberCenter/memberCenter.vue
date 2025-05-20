<template>
	<view class="memberBox">
		<HeadNav nav-background-color="#FEE9A9" backImageUrl="0" @tests="test" textContent="用户中心" fontSize="15"
			fontWeight="600" style="z-index: 999999;position: relative;"></HeadNav>
		<!-- 用户个人信息 -->
		<view class="titleBox">
			<image v-if="data.image"
				@click="onPageJump('/pages/memberCenter/personalInformation/alterNikename?flag=headImg')"
				:src="data.image.indexOf('https') != -1 ? data.image : imageUrl + data.image" mode=""></image>
			<image v-else @click="onPageJump('/pages/memberCenter/personalInformation/alterNikename?flag=headImg')"
				src="@/static/user.png" mode=""></image>
			<view class="fontBox">
				<view>
					<view>
						<text>{{data.name?data.name:data.phone?data.phone.substr(-4):'登录/注册'}}</text>
						<button type="default" open-type="getPhoneNumber"
							class="btnbox login_button" @getphonenumber="wxLogin">
							手机号快速验证
						</button>
					</view>
					<view v-if="flag">
						<image v-if="data.grade == 1" src="@/static/member/zhuce.png"></image>
						<image v-if="data.grade == 2" src="@/static/member/tong.png"></image>
						<image v-if="data.grade == 3" src="@/static/member/yin.png"></image>
						<image v-if="data.grade == 4" src="@/static/member/jin.png"></image>
						<image v-if="data.grade == 5" src="@/static/member/zuan.png"></image>
						<view v-if="data.grade == 1">
							注册会员
						</view>
						<view v-if="data.grade == 2">
							铜牌会员
						</view>
						<view v-if="data.grade == 3">
							银牌会员
						</view>
						<view v-if="data.grade == 4">
							金牌会员
						</view>
						<view v-if="data.grade == 5">
							钻石会员
						</view>
					</view>
				</view>
				<view v-if="flag">注册时间：{{data.createTime?data.createTime:''}}</view>
			</view>
			<!-- 设置 -->
			<view class="setBox" @click="onPageJump('/pages/memberCenter/personalInformation/personalInformation')">
				<image src="@/static/member/setmember.png"></image>
				<text>设置</text>
			</view>
		</view>
		<view class="coupon">
			<view @click="onPageJump('/pages/memberCenter/integralPage/integralEXP')">
				<view v-if="!flag">
					-
				</view>
				<view v-else>
					{{data.integral?data.integral:0}}
				</view>
				<view>
					积分
				</view>
			</view>
			<view @click="onPageJump('/pages/memberCenter/myCoupon')">
				<view v-if="!flag">
					-
				</view>
				<view v-else>
					{{couponSize?couponSize:0}}
				</view>
				<view>
					优惠券
				</view>
			</view>
		</view>
		<view class="integral">
			<view>
				<uni-steps :options="list1" active-icon="circle-filled" :active="actived" />
			</view>
			<view style="color: #634310;text-align: center;font-size: 26rpx;line-height: 50rpx;">
				会员等级根据经验值来确定
			</view>
		</view>

		<!-- 内容主体 -->
		<view class="contentBox">
			<!-- 我的订单 -->
			<view class="myOrder">
				<view class="orderTitle">
					<view>我的订单</view>
					<text @click="orderJump('/pages/memberCenter/myOrder/myOrder')">全部订单<uni-icons type="forward"
							size="16" color="#CACACA"></uni-icons></text>
				</view>
				<!-- 订单状态 -->
				<view class="orderContent">
					<view @click="orderJump('/pages/memberCenter/myOrder/myOrder?stateid=1')">
						<image src="@/static/member/confirm.png"></image>
						<view>待付款</view>
					</view>
					<view @click="orderJump('/pages/memberCenter/myOrder/myOrder?stateid=2')">
						<image src="@/static/member/send.png"></image>
						<view>待发货</view>
					</view>
					<view @click="orderJump('/pages/memberCenter/myOrder/myOrder?stateid=3')">
						<image src="@/static/member/sended.png"></image>
						<view>已发货</view>
					</view>
					<view @click="orderJump('/pages/memberCenter/myOrder/myOrder?stateid=4')">
						<image src="@/static/member/success.png"></image>
						<view>已完成</view>
					</view>
					<view @click="orderJump('/pages/memberCenter/myOrder/myOrder?stateid=5')">
						<image src="@/static/member/cancel.png"></image>
						<view>已取消</view>
					</view>
				</view>
			</view>
			<!-- 用户信息查看 -->
			<view class="myList">
				<!-- 收货地址 -->
				<view class="list" @click="onPageJump('/pages/memberCenter/address/address')">
					<image src="@/static/member/position.png"></image>
					<view class="listFont">
						<view>收货地址</view>
						<uni-icons type="forward" size="20" color="#CACACA"></uni-icons>
					</view>
				</view>
				<!-- 优惠券 -->
				<view class="list" @click="onPageJump('/pages/memberCenter/myCoupon')">
					<image src="@/static/member/coupon1.png"></image>
					<view class="listFont">
						<view>优惠券</view>
						<uni-icons type="forward" size="20" color="#CACACA"></uni-icons>
					</view>
				</view>
				<!-- 我的评论 -->
				<view class="list" @click="onPageJump('/pages/memberCenter/commentPage/commentPage')">
					<image src="@/static/member/comment.png"></image>
					<view class="listFont">
						<view>我的评论</view>
						<uni-icons type="forward" size="20" color="#CACACA"></uni-icons>
					</view>
				</view>
				<!-- 退货 -->
				<view class="list" @click="onPageJump('/pages/memberCenter/returnsExchanges/returnsPage')">
					<image src="@/static/member/return.png"></image>
					<view class="listFont">
						<view>退换货</view>
						<uni-icons type="forward" size="20" color="#CACACA"></uni-icons>
					</view>
				</view>
				<!-- 换货 -->
				
				<!-- 发票 -->
				<view class="list" @click="onPageJump('/pages/memberCenter/invoice/alertInvoice')">
					<image src="@/static/member/price.png"></image>
					<view class="listFont">
						<view>发票</view>
						<uni-icons type="forward" size="20" color="#CACACA"></uni-icons>
					</view>
				</view>
				<!-- 收藏 -->
				<view class="list" @click="onPageJump('/pages/memberCenter/collectPage')">
					<image src="@/static/member/heart.png"></image>
					<view class="listFont" style="border: none;">
						<view>收藏</view>
						<uni-icons type="forward" size="20" color="#CACACA"></uni-icons>
					</view>
				</view>
			</view>
			<view class="myList">
				<!-- 个人资料 -->
				<view class="list" @click="onPageJump('/pages/memberCenter/personalInformation/personalInformation')">
					<image src="@/static/member/user.png"></image>
					<view class="listFont">
						<view>个人资料</view>
						<uni-icons type="forward" size="20" color="#CACACA"></uni-icons>
					</view>
				</view>
				<!-- 分享 -->
				<!-- #ifndef MP-WEIXIN -->
				<!-- <view class="list" @click="shares()"> -->
					<!-- #endif -->
					<!-- #ifdef MP-WEIXIN -->
					<!-- <view class="list"> -->
						<!-- #endif -->
						<!-- <image src="@/static/member/myshare.png"></image> -->
						<!-- <view class="listFont" style="position: relative;"> -->
							<!-- <view>分享</view> -->
							<!-- <uni-icons type="forward" size="20" color="#CACACA"></uni-icons> -->
							<!-- #ifdef MP-WEIXIN -->
							<!-- <button id="shareBtn" open-type="share"
								style="opacity: 0;position: absolute;z-index: 2;width: 100%;height: 100%;top: 0;left: 0;">购买分享(opicty透明)</button> -->
							<!-- #endif -->
						<!-- </view> -->

					<!-- </view> -->
					<!-- 联系我们 -->
					<view class="list" @click="onPageJump('/pages/memberCenter/findMe')">
						<image src="@/static/member/Group2142.png"></image>
						<view class="listFont">
							<view>联系我们</view>
							<uni-icons type="forward" size="20" color="#CACACA"></uni-icons>
						</view>
					</view>
					<!-- 更换绑定手机号 -->
					<!-- <view class="list" @click="onPageJumps('/pages/memberCenter/alertPhoneNumber?phone=')">
						<image src="@/static/member/lock.png"></image>
						<view class="listFont" style="border: none;">
							<view>更换绑定手机号</view>
							<uni-icons type="forward" size="20" color="#CACACA"></uni-icons>
						</view>
					</view> -->
					<!-- 重置密码 -->
					<view class="list" @click="onPageJumps('/pages/memberCenter/resetPassword?phone=')">
						<image src="@/static/member/lock.png"></image>
						<view class="listFont" style="border: none;">
							<view>重置密码</view>
							<uni-icons type="forward" size="20" color="#CACACA"></uni-icons>
						</view>
					</view>
				</view>


				<!-- 退出登录按钮 -->
				<view class="btnBox" @click="goOut" v-if="flag">退出登录</view>

				<!-- #ifdef H5 -->
				<view style="height: 100rpx;"></view>
				<!-- #endif -->
				<!-- #ifdef MP -->
				<!-- <view style="height: 10rpx;"></view> -->
				<!-- #endif -->
			</vieW>


			<uni-popup ref="alertDialog" type="dialog">
				<uni-popup-dialog :type="msgType" cancelText="取消" confirmText="确认" content="确认要退出登录吗?"
					@confirm="dialogConfirm" @close="dialogClose"></uni-popup-dialog>
			</uni-popup>
			<view class="dialogShare" v-if="shareFlag">
				<view class="sanjiao">

				</view>
				<view class="content">
					<view>
						喜欢这个页面？ 点击右上角的三个点，与你的朋友分享吧！
					</view>
					<uni-icons @click="shareFlag = false" type="closeempty" size="30" color="#fff"></uni-icons>

				</view>
			</view>

		</view>
</template>

<script setup>
	import {
		ref,
		reactive,
	} from "vue";
	import {
		memberindex,
	} from '@/api/member.js'
	import {
		login
	} from '@/store/login'
	
	import {
		verify,
		getOpenId,
		getPhoneNumber,
		dologinWx,
	} from '@/api/login.js';
	import {
		onShow,
		onShareAppMessage,
		onTabItemTap
	} from '@dcloudio/uni-app'
	import {
		memberShare
	} from '@/api/homePage.js'

	// var jweixin = require('jweixin-module')
	// #ifndef MP-WEIXIN
	import jweixin from 'weixin-js-sdk'
	// #endif

	let data = ref({})
	const title = ref('Hello')
	const show = ref(false)
	const type = ref('rotate1')
	const shadowBg = ref('white')
	const animateTxt = ref(true)
	const actived = ref(0)
	let list1 = ref([{
		title: '注册会员',
		desc: 0
	}, {
		title: '铜牌会员',
		desc: 2000
	}, {
		title: '银牌会员',
		desc: 5000
	}, {
		title: '金牌会员',
		desc: 10000
	}, {
		title: '钻石会员',
		desc: 30000
	}])
	const couponSize = ref()
	const alertDialog = ref()
	const shareFlag = ref()
	let flag = ref(false)
	// 获取数据
	function getData() {
		memberindex().then(res => {
			console.log(res);
			if (res.data.success) {
				data.value = res.data.data.member
				couponSize.value = res.data.data.couponSize
				list1.value = [{
					title: '注册会员',
					desc: res.data.data.gradeConfig.grade1
				}, {
					title: '铜牌会员',
					desc: res.data.data.gradeConfig.grade2
				}, {
					title: '银牌会员',
					desc: res.data.data.gradeConfig.grade3
				}, {
					title: '金牌会员',
					desc: res.data.data.gradeConfig.grade4
				}, {
					title: '钻石会员',
					desc: res.data.data.gradeConfig.grade5
				}]
				if (data.value.grade == 1) {
					actived.value = 0
				} else if (data.value.grade == 2) {
					actived.value = 1
				} else if (data.value.grade == 3) {
					actived.value = 2
				} else if (data.value.grade == 4) {
					actived.value = 3
				} else if (data.value.grade == 5) {
					actived.value = 4
				}
				flag.value = true
			} else {
				data.value = {}
				actived.value = 0
				list1.value = [{
					title: '注册会员',
					desc: '-'
				}, {
					title: '铜牌会员',
					desc: '-'
				}, {
					title: '银牌会员',
					desc: '-'
				}, {
					title: '金牌会员',
					desc: '-'
				}, {
					title: '钻石会员',
					desc: '-'
				}]
				flag.value = false
			}

		})

	}
	// 退出登录
	function goOut() {
		alertDialog.value.open()
	}

	function dialogConfirm() {
		login().loginOut().then(() => {
			uni.switchTab({
				url: "/pages/homePage/homepage"
			});
		}).catch(() => {})
	}

	function dialogClose() {
		alertDialog.value.close()
	}
	
	function wxLogin(e) {
		console.log(e)
		var detail = e.detail
		if (detail.errMsg == "getPhoneNumber:ok") {
			console.log("用户同意授权")
			var code = detail.code
			codes.value = detail.code
			console.log(code);
			wx.login({
				success: function(result) {
					if (result.code) {
						getOpenId({
							jsCode: result.code
						}).then(res => {
							console.log(res);
							if (res.data.success) {
								openId.value = res.data.data.unionid
								xcxphone.value = res.data.data.phone
								console.log(res.data.data.phone);
								if (res.data.data.phone) {
									dologinWx({
										openId: openId.value,
										phone: res.data.data.phone,
										headImage: ''
									}).then(result => {
										uni.setStorageSync("token", result
											.data.data.token)
										login().setToken(result.data.data
											.token)
										uni.showToast({
											icon: 'none',
											duration: 3000,
											title: '登录成功',
											success: () => {
												setTimeout(
													function() {
														uni.switchTab({
															url: '/pages/homePage/homepage'
														})
													}, 1000
												);
											}
										});
										console.log(result);
									})
								} else {
									alertDialog.value.open()
								}
	
							}
						})
					} else {
						console.log('登录失败！' + result.errMsg);
					}
				}
			})
		
		}
	}
	
	// 页面跳转
	function orderJump(url) {
		if (uni.getStorageSync("token")) {
			uni.redirectTo({
				url: url
			});
		} else {
			uni.navigateTo({
				url: '/pages/loginInterface/passwordLogin'
			})
		}

	}
	// 页面跳转
	function onPageJump(url) {
		if (uni.getStorageSync("token")) {
			uni.navigateTo({
				url: url
			});
		} else {
			uni.navigateTo({
				url: '/pages/loginInterface/passwordLogin'
			})
		}

	}

	function onPageJumps(url) {
		if (uni.getStorageSync("token")) {
			uni.navigateTo({
				url: url + data.value.phone
			});
		} else {
			uni.navigateTo({
				url: '/pages/loginInterface/passwordLogin'
			})
		}

	}

	function jump() {
		if (flag.value) {
			uni.navigateTo({
				url: '/pages/memberCenter/personalInformation/personalInformation'
			})
		} else {
			uni.navigateTo({
				url: '/pages/loginInterface/passwordLogin'
			})
		}
	}
	onShow(() => {
		getData()
	})
	onTabItemTap(() => {
		getData()
	})
	onShareAppMessage((res) => {
		console.log(res);
		return {
			title: '禾鲜谷小程序',
			path: `/pages/homePage/homePage`,
			// imageUrl: '/static/imgs/mylogo.png'
		}
	})

	function getSignUrl() {
		var signLink = ''
		var ua = navigator.userAgent.toLowerCase();
		if (/iphone|ipad|ipod/.test(ua)) {
			signLink = uni.getStorageSync('WxCodeUrl');
			if (!signLink) signLink = location.href
		} else {
			signLink = location.href
		}
		return signLink;
	}
	// #ifndef MP-WEIXIN
	function shares() {
		const sign_url = getSignUrl().split('#')[0];
		let URL = window.encodeURIComponent(sign_url)
		shareFlag.value = true
		memberShare({
			url: 'http://b2c.yixiekeji.com/'
		}).then(res => {
			console.log(res.data.data)
			jweixin.config({ //这里是个函数，非对象
				debug: false, // 调试，发布的时候改为false
				appId: res.data.data.appId, //后端接口获取
				nonceStr: res.data.data.noncestr, //后端接口获取
				timestamp: res.data.data.timestamp, //后端接口获取
				signature: res.data.data.signature, //后端接口获取
				jsApiList: [ // 可能需要用到的能力 需要啥就写啥。多写也没有坏处
					'updateAppMessageShareData',
					'updateTimelineShareData',
					'onMenuShareAppMessage',
					'onMenuShareTimeline',
					'openLocation'
				]
			})
			let configComnSv = {};
			let userInfoCv = {};
			let referid = userInfoCv.id;
			let link_change = getSignUrl();
			if (location.search) { //避免重复添加referid
				if (link_change.includes('&referid')) {} else {
					link_change += `&referid=${referid}`
				}
			} else {
				if (link_change.includes('?referid')) {} else {
					link_change += `?referid=${referid}`
				}
			}
			let obj = {
				title: configComnSv.share_title ? configComnSv.share_title : '易写科技', // 分享标题
				desc: configComnSv.share_desc ? configComnSv.share_desc : '易写科技商城', // 分享描述
				// 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				// link: sign_url, //这里可带参数，必须是同配置的JS安全域名一致
				link: 'http://b2c.yixiekeji.com/#/', //这里可带参数，必须是同配置的JS安全域名一致，必须是全部url(不需要去除#),这个地址如果上面向后端置换的URL通过encodeURIComponent编译，后端配置的地址需要decode一下，例如php可以用urldecode函数
				imgUrl: configComnSv.share_pic ? configComnSv.share_pic : '', // 必须是同配置的JS安全域名一致
				success: function() {}
			}
			shareFlag.value = true
			jweixin.ready(function() {
				if (jweixin.onMenuShareAppMessage) {
					jweixin.onMenuShareAppMessage(obj); //1.0 分享到朋友
					jweixin.onMenuShareTimeline(obj); //1.0分享到朋友圈
				} else {
					jweixin.updateAppMessageShareData(obj); //1.4 分享到朋友
					jweixin.updateTimelineShareData(obj); //1.4分享到朋友圈
				}
			})
		})
	}
	// #endif
</script>

<style lang="scss" scoped>
	.memberBox {
		width: 750rpx;
		height: 100%;
		background-color: #FEE9A9;
		display: flex;
		flex-direction: column;

		.titleBox {
			width: 750rpx;
			height:118rpx;
			display: flex;
			align-items: center;

			>image {
				width: 98rpx;
				height: 98rpx;
				margin-left: 38rpx;
				margin-right: 18rpx;
				border-radius: 50%;
			}

			.fontBox {
				width: 410rpx;
				height: 100%;
				position: relative;
				>view:nth-child(1) {
					height: 80rpx;
					display: flex;
					align-items: center;

					>view:nth-child(1) {
						// width: 108rpx;
						font-weight: 600;
						font-size: 36rpx;
						color: #333333;
						text-align: left;
					}

					>view:nth-child(2) {
						width: 208rpx;
						height: 60rpx;
						background: linear-gradient(133deg, #FDBA54 0%, #FFDE8D 100%);
						border-radius: 125rpx 125rpx 125rpx 125rpx;
						border: 1rpx solid #FFFFFF;
						display: flex;
						align-items: center;

						view {
							width: 148rpx;
							font-weight: 600;
							font-size: 28rpx;
							color: #966314;
							text-align: center;
						}

						image {
							width: 60rpx;
							height: 60rpx;
						}
					}
				}

				>view:nth-child(2) {
					line-height: 38rpx;
					// width: 200rpx;
					font-size: 20rpx;
					color: #333333;
					text-align: left;
				}
				::v-deep .login_button{
					position: absolute;
					left: 0;
					top: 0;
					opacity: 0;
				}
			}

			.setBox {
				width: 148rpx;
				height: 60rpx;
				border: 2rpx solid rgba(51, 51, 51, 0.16);
				border-radius: 109rpx;
				font-size: 26rpx;
				display: flex;
				align-items: center;

				image {
					width: 40rpx;
					height: 40rpx;
					margin: 0 16rpx;
				}
			}
		}

		.coupon {
			width: 714rpx;
			height: 120rpx;
			display: flex;
			justify-content: space-between;
			margin: 48rpx auto;
			box-sizing: border-box;

			>view {
				width: 355rpx;
				height: 120rpx;
				background-color: #FFFFFF22;

				>view:nth-child(1) {
					width: 100%;
					text-align: center;
					font-weight: 600;
					font-size: 44rpx;
					color: #634310;
					line-height: 52rpx;
					margin-top: 18rpx;
				}

				>view:nth-child(2) {
					width: 100%;
					text-align: center;
					font-size: 28rpx;
					color: #634310;
					line-height: 33rpx;
				}
			}

			>view:nth-child(1) {
				border-radius: 24rpx 0rpx 0rpx 24rpx;
			}

			>view:nth-child(2) {
				border-radius: 0rpx 24rpx 24rpx 0rpx;
			}
		}

		.integral {
			width: 728rpx;
			height: 158rpx;
			margin: 0 auto;

			>view {
				width: 728rpx;
				height: 158rpx;
			}
		}

		.contentBox {
			background-color: #f7f7f5;
			flex: 1;
			border-radius: 40rpx 40rpx 0 0;
			padding: 20rpx 20rpx 20rpx 20rpx;
			box-sizing: border-box;
			height: 100%;
			margin-top: 50rpx;

			.myOrder {
				width: 714rpx;
				height: 204rpx;
				background: #FFFFFF;
				border-radius: 24rpx;
				padding: 20rpx;
				box-sizing: border-box;

				.orderTitle {
					display: flex;
					align-items: center;
					justify-content: space-between;

					view {
						font-weight: 600;
						font-size: 30rpx;
					}

					text {
						font-size: 24rpx;
						color: #88888C;
					}
				}

				.orderContent {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-top: 26rpx;

					view {
						width: 100rpx;
						height: 90rpx;
						text-align: center;
						font-size: 28rpx;

						image {
							width: 48rpx;
							height: 48rpx;
							margin-bottom: 10rpx;
						}
					}
				}
			}


			.myList {
				width: 714rpx;
				background: #FFFFFF;
				border-radius: 24rpx;
				margin-top: 16rpx;

				.list {
					width: 704rpx;
					height: 92rpx;
					margin-left: 26rpx;
					display: flex;
					align-items: center;

					image {
						width: 52rpx;
						height: 52rpx;
					}

					.listFont {
						width: 626rpx;
						height: 92rpx;
						margin-left: 12rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						font-size: 30rpx;
						border-bottom: 1rpx solid #cccccc55;

						text {
							margin-right: 20rpx;
						}
					}
				}
			}

			.resetPas {
				width: 714rpx;
				height: 92rpx;
				background-color: white;
				margin-top: 16rpx;
				border-radius: 24rpx;
				display: flex;
				align-items: center;
				margin-bottom: 40rpx;

				image {
					margin-left: 26rpx;
					width: 52rpx;
					height: 52rpx;
				}

				.listFont {
					width: 626rpx;
					height: 92rpx;
					margin-left: 12rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 26rpx;
					border-bottom: 1rpx solid #ccc;

					text {
						color: #CACACA;
						font-size: 34rpx;
						margin-right: 20rpx;
					}
				}
			}

			.btnBox {
				width: 270rpx;
				height: 72rpx;
				border: 1rpx solid #DC3A2F;
				border-radius: 10rpx;
				margin: 50rpx auto;
				font-size: 28rpx;
				color: #DC3A2F;
				text-align: center;
				line-height: 72rpx;
			}
		}

		.dialogShare {
			height: 140rpx;
			width: 310rpx;
			position: fixed;
			top: 50rpx;
			right: 50rpx;
			z-index: 9999;

			.sanjiao {
				width: 0px;
				height: 0px;
				border-top: 26rpx solid #FFFFFF00;
				border-bottom: 26rpx solid #1C9B64;
				border-left: 26rpx solid #FFFFFF00;
				border-right: 26rpx solid #FFFFFF00;
				position: absolute;
				right: 0rpx;
				top: -52rpx;
				z-index: 9999;
			}

			.content {
				width: 310rpx;
				height: 120rpx;
				background: #1C9B64;
				border-radius: 16rpx 16rpx 16rpx 16rpx;
				display: flex;
				align-items: center;
				padding: 14rpx 24rpx;

				>view {
					width: 230rpx;
					height: 90rpx;
					font-size: 26rpx;
					color: #FFFFFF;
					line-height: 26rpx;
					text-align: left;
					margin-right: 20rpx;
				}
			}
		}
	}
</style>