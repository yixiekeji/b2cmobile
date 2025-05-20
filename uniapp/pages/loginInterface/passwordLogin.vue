<template>
	<view class="loginBox">
		<!-- 自定义导航栏 -->
		<HeadNav nav-background-color="#fff" backImageUrl="2" textContent="登录" fontSize="15" fontWeight="600"
			style="z-index: 999999;position: relative;"></HeadNav>
		<!-- logo大图 -->
		<image class="imgbox" :src="shopLogo"></image>
		<!-- 表单 -->
		<uni-forms ref="form" :rules="rules" :modelValue="FormData">
			<!-- 手机号 -->
			<uni-forms-item name="phone">
				<uni-easyinput class="phoneIpt" type="number" v-model="FormData.phone" placeholder="请输入手机号码" />
			</uni-forms-item>
			<!-- 密码框 -->
			<view class="passwordBox">
				<uni-forms-item name="password">
					<uni-easyinput :type="iptType" v-model="FormData.password" placeholder="请输入密码" />
				</uni-forms-item>
			</view>
		</uni-forms>
		<!-- 我已阅读并同意《用户手册》和《隐私条款》 -->
		<view class="checkBox">
			<radio style="transform:scale(0.6)" value="r1" :checked="flag" @click="changed" color="#1C9B64" />
			<view>我已阅读并同意<text>《注册协议》</text>和<text>《隐私条款》</text></view>
		</view>
		<!-- 登录按钮 -->
		<button type="default" class="btnbox" :style="[{'background-color':flag?'#1C9B64':'#1C9B6488'}]"
		 @click="submit()">
			登录
		</button>

		<!-- 注册与快速登录 -->
		<view class="quickregis">
			<text @click="onPageJump('/pages/loginInterface/registerPage')">快速注册</text>
			<text @click="onPageJump('/pages/loginInterface/resetPassword')">忘记密码</text>
		</view>
		<!-- #ifdef MP-WEIXIN -->
		<view class="OtherBox">
			<button type="default" class="btnbox login_button"
				:style="[{'background-color':flag?'#1C9B64':'#1C9B6488'}]"
				@click="onPageJump('/pages/loginInterface/loginInterface')">
				手机号验证码登录
			</button>
			<button type="default" class="btnbox login_button"
				:style="[{'background-color':flag?'#1C9B64':'#1C9B6488'}]"
				v-if="!flag" @click="openTost">
				手机号快速验证
			</button>
			<button v-else type="default" :style="[{'background-color':flag?'#1C9B64':'#1C9B6488'}]"
				open-type="getPhoneNumber" class="btnbox login_button" @getphonenumber="wxLogin" v-show="!logged">
				手机号快速验证
			</button>
		</view>
		<!-- #endif -->
		<!-- 其他登录方式 -->
		<!-- #ifdef APP -->
		<view class="OtherLogin">
			<view class="otherFont">其他登录方式</view>
			<view class="changemtd">
				<image src="@/static/loginInterface/Frame2364.png"
					@click="onPageJump('/pages/loginInterface/loginInterface')"></image>


				<view style="position: relative;">
					<image @click="appWxLogin" src="@/static/loginInterface/wx.png"></image>
					<!-- <button style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;opacity: 0;"
						open-type="getPhoneNumber" class="login_button" @getphonenumber="wxLogin"
						v-show="!logged">登录</button> -->
				</view>

			</view>
		</view>
		<!-- #endif -->
		<!-- <uni-popup ref="alertDialog" background-color="#fff" border-radius="48rpx 48rpx 0px 0px" type="bottom">
			<view class="popup-content">
				<view class="title">
					<view></view>
					<view>协议</view>
					<view style="margin-right: 16rpx;"><uni-icons type="closeempty" size="18" color="#1E1E1F"
							@click="close()"></uni-icons>
					</view>
				</view>
				<view class="content">
					我已阅读并同意《注册协议》和《隐私条款》
				</view>
				<view class="button">
					<view><button @click="close()">取消</button></view>
					<view style="position: relative;">
						<button @click="closeParameter()">确认</button>
						<button style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;opacity: 0;"
							open-type="chooseAvatar" class="login_button" @chooseavatar="chooseavatar"
							v-show="!logged">登录</button>
					</view>
				</view>
				<view style="height: 24rpx;"></view>
			</view>
		</uni-popup> -->
		<uni-popup ref="alertDialog" :mask-click="false">
			<view style="height: 300rpx;width: 500rpx;background-color: #fff;border-radius: 12rpx;overflow: hidden;">
				<view style="padding: 83rpx 10rpx;text-align: center;line-height: 34rpx;">小程序将获取用户头像用于注册</view>
				<view class="button" style="display: flex;">
					<view
						style="width: 249rpx;height: 100rpx;border-top: 1rpx solid #ccc;border-right: 1rpx solid #ccc;">
						<view
							style="width: 100%;height: 100%;padding: 0 0;text-align: center;line-height: 100rpx;background-color: #fff;"
							@click="close()">取消</view>
					</view>
					<view style="width: 250rpx;height: 100rpx;border-top: 1rpx solid #ccc;position: relative;">
						<view
							style="width: 100%;height: 100%;border: none;padding: 0 0;text-align: center;line-height: 100rpx;background-color: #fff;"
							@click="closeParameter()">确认</view>
						<button style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;opacity: 0;"
							open-type="chooseAvatar" class="login_button" @chooseavatar="chooseavatar"
							v-show="!logged">登录</button>
					</view>
				</view>
			</view>

		</uni-popup>
		<uni-popup ref="phoneDialog" type="dialog">
			<uni-popup-dialog ref="phoneDialogs" mode="input" title="绑定手机号" :value="appPhone" placeholder="请录入手机号"
				@confirm="confimPhone" @close="closePhone" before-close></uni-popup-dialog>
		</uni-popup>
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
		verify,
		dologin,
		getOpenId,
		getPhoneNumber,
		dologinWx,
		getAppOpenId,
		getAppUserInfo
	} from '@/api/login.js';
	import {
		login
	} from '@/store/login'
	const homeUrl = ref('http =/ref(/m.hxg777.com/')
	const codeImg = ref('') //验证码图像
	const iptType = ref("password") //输入框type值
	const eyesimg = ref("../../static/loginInterface/eyes.png")
	const flag = ref(false)
	const alertDialog = ref()
	let FormData = ref({
		password: '', //密码
		phone: '', //手机号
	})
	const appPhone = ref('')
	// 对字段进行必填验证
	let rules = ref({
		// 验证手机号
		phone: {
			rules: [{
					required: true,
					errorMessage: '请输入手机号',
				},
				{
					pattern: "^[1][3,4,5,6,7,8,9][0-9]{9}$",
					errorMessage: '手机号格式不正确',
				}
			]
		},
		// 验证密码
		password: {
			rules: [{
					required: true,
					errorMessage: '请输入密码',
				},
				{
					minLength: 6,
					errorMessage: '至少需要六个字符',
				},
				{
					maxLength: 20,
					errorMessage: '最多需要二十个字符',
				}
			],

		},
	})
	const code = ref('')
	const shopLogo = ref('../../static/loginInterface/logo.png')
	const form = ref()
	const avatarUrl = ref('')
	const nickName = ref('')
	const encryptedData = ref('')
	const iv = ref('')
	const codes = ref('')

	//小程序联合微信登陆
	function wxLogin(e) {
		console.log(e)
		var detail = e.detail
		if (detail.errMsg == "getPhoneNumber:ok") {
			console.log("用户同意授权")
			var code = detail.code
			codes.value = detail.code
			wx.getUserInfo({
				success: function(res) {
					console.log(res);
					avatarUrl.value = res.userInfo.avatarUrl;
					nickName.value = res.userInfo.nickName;
					encryptedData.value = res.encryptedData;
					iv.value = res.iv;
					// getOpenid(code)
					// alertDialog.value.open()
					// getxcxphone(code)
					// 此时可以将用户的个人信息存储在本地缓存或发送到后台服务器进行保存
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
				},
				fail: function(res) {
					console.log('用户授权失败！' + res.errMsg);
				}
			})
		}
	}
	function openTost () {
		uni.showToast({
			icon: 'none',
			duration: 3000,
			title: '请先阅读并同意《注册协议》和《隐私条款》'
		});
	}
	
	function closeParameter() {
		alertDialog.value.close()
		getxcxphone(codes.value)
	}

	function chooseavatar(e) {
		console.log(e);
		uni.uploadFile({
			// #ifdef APP-PLUS || H5
			url: '/prod-api/api' + `/uploadFileImage`,
			// #endif
			// #ifdef MP
			url: 'https://b2c.yixiekeji.cn' + '/prod-api/api' + `/uploadFileImage`,
			// #endif
			filePath: e.detail.avatarUrl,
			name: 'imageFile',
			header: {},
			success: (res) => {
				avatarUrl.value = JSON.parse(res.data).data
				alertDialog.value.close()
				getxcxphone(codes.value)
			},
			fail: (err) => {
				uni.hideLoading()
				uni.showToast({
					title: '上传附件失败，请稍候再试！',
					duration: 1000,
					icon: 'none'
				});
				return;
			}
		})
	}

	function close() {
		alertDialog.value.close()
	}
	const openId = ref('')
	const sessionKey = ref('')

	function getOpenid(val) {
		getOpenId({
			jsCode: val
		}).then(res => {
			console.log(res);
			if (res.data.success) {
				openId.value = res.data.data.unionid
				sessionKey.value = res.data.data.sessionkey
				dologinWx({
					openId: openId.value,
					phone: xcxphone.value,
					headImage: avatarUrl.value
				}).then(result => {
					uni.setStorageSync("token", result.data.data.token)
					login().setToken(result.data.data.token)
					uni.showToast({
						icon: 'none',
						duration: 3000,
						title: '登录成功',
						success: () => {
							setTimeout(function() {
								uni.switchTab({
									url: '/pages/homePage/homepage'
								})
							}, 1000);
						}
					});
					console.log(result);
				})
			}
		})
	}
	const xcxphone = ref('')

	function getxcxphone(val) {
		getPhoneNumber({
			jsCode: val
		}).then(res => {
			console.log(res);
			xcxphone.value = res.data.data
			wx.login({
				success: function(result) {
					if (result.code) {
						var codes = result.code;
						getOpenid(codes)
					} else {
						console.log('登录失败！' + result.errMsg);
					}
				}
			})
		})
	}


	//app联合微信登录
	const phoneDialog = ref()

	function appWxLogin() {
		uni.login({
			"provider": "weixin",
			"onlyAuthorize": true, // 微信登录仅请求授权认证
			success: function(loginRes) {
				getAppOpenId({
					jsCode: loginRes.code
				}).then(res => {
					console.log(res);
					getInfoApp(res.data.data.accessToken, res.data.data.unionid, res.data.data.phone)
				})
			},
			fail: function(err) {
				console.log(err);
				setTimeout(() => {

					uni.showToast({
						title: '微信绑定失败',
						icon: 'none',
						duration: 3000
					});
				}, 500)
			}
		});

	}
	const unionids = ref('')
	const headImgUrl = ref('')

	function getInfoApp(accessToken, unionid, phone) {
		getAppUserInfo({
			accessToken: accessToken,
			openid: unionid
		}).then(res => {
			console.log(res);
			if (phone && phone != "") {
				loginApp(unionid, phone, res.data.data.headImgUrl)
			} else {
				unionids.value = unionid
				headImgUrl.value = res.data.data.headImgUrl
				appPhone.value = ''
				phoneDialog.value.open()
			}

		})
	}

	function closePhone() {
		phoneDialog.value.close()
	}

	function confimPhone(value) {
		const tests = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
		if (tests.test(value)) {
			console.log(value);
			loginApp(unionids.value, value, headImgUrl.value)
			phoneDialog.value.close()
		} else {
			uni.showToast({
				icon: 'none',
				duration: 3000,
				title: '手机号码不正确',
			});
		}

	}

	function loginApp(unionid, phone, headImgUrl) {
		dologinWx({
			openId: unionid,
			phone: phone,
			headImage: headImgUrl
		}).then(result => {
			uni.setStorageSync("token", result.data.data.token)
			login().setToken(result.data.data.token)
			uni.showToast({
				icon: 'none',
				duration: 3000,
				title: '登录成功',
				success: () => {
					setTimeout(function() {
						uni.switchTab({
							url: '/pages/homePage/homepage'
						})
					}, 1000);
				}
			});
			console.log(result);
		})
	}
	// 返回首页
	function goBack() {
		uni.switchTab({
			url: '/pages/homePage/homepage'
		});
	}

	// 改变checkBox选中状态
	function changed(val) {
		flag.value = !flag.value
	}
	// 登录按钮提交
	function submit() {
		
		form.value.validate().then(res => {
			if(flag.value){
				login().doLogin(FormData.value).then(() => {
					uni.showToast({
						icon: 'none',
						duration: 3000,
						title: '登录成功',
						success: () => {
							setTimeout(function() {
								uni.switchTab({
									url: "/pages/homePage/homepage"
								});
							}, 1000);
						}
					});
			
			
				})
			}else{
				uni.showToast({
					icon: 'none',
					duration: 3000,
					title: '请先阅读并同意《注册协议》和《隐私条款》'
				});
			}
		}).catch(err => {
			console.log('表单错误信息：', err);
		})
		
		
	}
	// 跳转指定页面
	function onPageJump(url) {
		uni.navigateTo({
			url: url
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
		shopLogo.value = '../../static/loginInterface/logo.png'
	})
</script>

<style lang="scss" scoped>
	.loginBox {
		width: 750rpx;
		height: 100%;
		padding: 0 32rpx;
		box-sizing: border-box;
		position: relative;
		background-color: #fff;

		.imgbox {
			width: 320rpx;
			height: 182rpx;
			margin-left: 180rpx;
			margin-top: 80rpx;
			margin-bottom: 60rpx;
		}

		.phoneIpt {
			input {
				height: 96rpx;
				background: #F5F5F7;
				border-radius: 48rpx;
				padding: 0 40rpx;
				box-sizing: border-box;
				margin-top: 48rpx;
			}
		}

		input {
			height: 96rpx;
			background: #F5F5F7;
			border-radius: 48rpx;
			padding: 0 40rpx;
			box-sizing: border-box;
			margin-top: 48rpx;
		}

		.passwordBox {
			width: 686rpx;
			margin-top: 48rpx;
			position: relative;

			.eyesimg {
				width: 40rpx;
				height: 26rpx;
				position: absolute;
				right: 28rpx;
				top: 34rpx;
				z-index: 99;
			}
		}

		.codeBox {
			width: 686rpx;
			display: flex;
			height: 96rpx;
			align-items: center;
			margin-top: 48rpx;

			.codeInp {
				width: 330rpx;
				height: 96rpx;
			}

			.codeImg {
				width: 150rpx;
				height: 76rpx;
				background: #F5F5F7;
				margin-left: 24rpx;
			}

			text {
				font-size: 20rpx;
				font-family: 'PingFang SC';
				color: #666666;
				margin-left: 10rpx;
			}
		}

		.checkBox {
			color: red;
			font-size: 22rpx;
			margin-top: 40rpx;
			display: flex;
			align-items: center;

			view {
				color: #88888C;
			}

			text {
				color: #588270;
			}
		}

		.btnbox {
			width: 686rpx;
			height: 96rpx;
			background: #1C9B64;
			border-radius: 24px;
			color: white;
			margin-top: 40rpx;
			font-size: 30rpx;
			line-height: 96rpx;
		}

		.btnbox.login_button {
			width: 50%;
			background: #fff !important;
			color: #1C9B64;
			height: initial;
			padding: 0 !important;
			height: 52rpx;
			line-height: 52rpx;
			border: 1px solid #1C9B64;
		}

		.OtherBox {
			margin-top: 78rpx;
		}

		.quickregis {
			width: 328rpx;
			height: 36rpx;
			font-family: 'PingFang SC';
			font-size: 26rpx;
			display: flex;
			justify-content: space-between;
			color: #88888C;
			margin-top: 34rpx;
			margin-left: 178rpx;
		}

		.OtherLogin {
			width: 230rpx;
			margin: 150rpx auto;

			.otherFont {
				font-size: 22rpx;
				color: #C6C6CC;
				text-align: center;
				margin-bottom: 30rpx;
			}

			.changemtd {
				display: flex;
				justify-content: space-evenly;

				image {
					width: 68rpx;
					height: 68rpx;
				}
			}

		}

		.popup-content {
			.title {
				width: 100%;
				display: flex;
				justify-content: space-between;
				margin: 30rpx 0 43rpx 0;

				>view {
					width: 30rpx;
				}

				>view:nth-child(2) {
					width: 300rpx;
					color: #010002;
					text-align: center;
					font-family: PingFang SC;
					font-size: 16px;
					font-style: normal;
					font-weight: 600;
					line-height: normal;
				}

				.uni-icons {
					float: right;
					margin-right: 14rpx;
				}
			}

			.content {
				width: 100%;
				height: 600rpx;
				display: flex;
				flex-wrap: wrap;
				justify-content: space-evenly;
				padding: 0 32rpx;
				box-sizing: border-box;
				overflow: auto;

				>view {
					display: flex;
					border-bottom: 2rpx solid #EBEBEB;
					padding: 22rpx 0 18rpx 0;

					>view:nth-child(1) {
						width: 274rpx;
						color: #999;
						font-family: PingFang SC;
						font-size: 28rpx;
						font-style: normal;
						font-weight: 400;
						line-height: normal;
					}

					>view:nth-child(2) {
						width: 412rpx;
						color: #333;
						font-family: PingFang SC;
						font-size: 28rpx;
						font-style: normal;
						font-weight: 400;
						line-height: normal;
					}
				}

			}

			.button {
				width: 100%;
				display: flex;
				justify-content: space-around;
				// margin: 82rpx 0;
				border-top: 1rpx solid #CACACC;
				padding-top: 14rpx;

				view {
					width: 300rpx;
				}

				button {
					width: 300rpx;
					height: 80rpx;
					flex-shrink: 0;
					border-radius: 24rpx;
					background: #1C9B64;
					color: #FFF;
					text-align: center;
					leading-trim: both;
					text-edge: cap;
					font-family: PingFang SC;
					font-size: 32rpx;
					font-style: normal;
					font-weight: 400;
				}
			}
		}
	}
</style>