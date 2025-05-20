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
			<!-- 图像验证码 -->
			<uni-forms-item class="codeInp" name="verifyCode">
				<view class="codeBox">
					<uni-easyinput v-model="FormData.verifyCode" placeholder="图像验证码" />
					<view class="codeImg">
						<image :src="codeImg" style="width: 146rpx;height: 76rpx;"></image>
					</view>
					<text @click="toggle">看不清，换一张</text>
				</view>
			</uni-forms-item>
			<!-- 手机验证码 -->
			<view class="phoneCode">
				<uni-forms-item name="smsCode">
					<view style="width: 460rpx;">
						<uni-easyinput class="smsCodeIpt" type="number" v-model="FormData.smsCode"
							placeholder="测试环境默认:888888" />
					</view>
					<view class="getCode"><text v-if="resendFlag" @click="resendCode">获取验证码</text><text v-else
							@click="resendCodes" :style="{color:count != -1?'#ccc':'#1C9B64'}">重新发送<text
								v-if="!resendFlag&&count != -1">({{count}})</text></text></view>
				</uni-forms-item>
			</view>
		</uni-forms>
		<!-- 我已阅读并同意《用户手册》和《隐私条款》 -->
		<view class="checkBox">
			<radio style="transform:scale(0.6)" value="r1" :checked="flag" @click="changed" color="#1C9B64" />
			<view>我已阅读并同意<text>《注册协议》</text>和<text>《隐私条款》</text></view>
		</view>
		<!-- 获取验证码按钮 -->

		<button type="default" class="btnbox" :style="[{'background-color':flag?'#1C9B64':'#1C9B6488'}]" @click="submit()">
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
				@click="onPageJump('/pages/loginInterface/passwordLogin')">
				账号密码登录
			</button>
			<button v-if="!flag" type="default" class="btnbox login_button"
				:style="[{'background-color':flag?'#1C9B64':'#1C9B6488'}]"
				@click="openTost">
				手机号快速验证
			</button>
			<button v-else type="default" :style="[{'background-color':flag?'#1C9B64':'#1C9B6488'}]" open-type="getPhoneNumber"
				class="btnbox login_button" @getphonenumber="wxLogin" v-show="!logged">
				手机号快速验证
			</button>
		</view>


		<!-- #endif -->

		<!-- 其他登录方式 -->
		<!-- #ifdef APP -->
		<view class="OtherLogin">
			<view class="otherFont">其他登陆方式</view>
			<view class="changemtd">
				<image src="@/static/loginInterface/Group1918.png"
					@click="onPageJump('/pages/loginInterface/passwordLogin')"></image>

				<view style="position: relative;">
					<image @click="appWxLogin" src="@/static/loginInterface/wx.png"></image>
					<!-- <button style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;opacity: 0;"
						open-type="getPhoneNumber" class="login_button" @getphonenumber="wxLogin"
						v-show="!logged">登录</button> -->
				</view>


			</view>
		</view>
		<!-- #endif -->
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
		login
	} from '@/store/login'
	import {
		verify,
		sendVerifySMS,
		getOpenId,
		getPhoneNumber,
		dologinWx,
		getAppOpenId,
		getAppUserInfo
	} from '@/api/login.js';
	const form = ref()
	const flag = ref(false)
	const codeImg = ref('')
	let FormData = ref({
		phone: '', //手机号
		verifyCode: '', //验证码
		smsCode: '', //手机验证码
		verifyUUID: '',
		promoterPhone: ''
	})
	const alertDialog = ref()
	const resendFlag = ref(true) // 判断是否显示 ‘重新获取’按钮
	const timer = ref(null) // 定时器
	const count = ref(60) // 时间
	const appPhone = ref('')
	// 对字段进行必填验证
	let rules = ref({
		// 手机号
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
		// 验证码
		verifyCode: {
			rules: [{
				required: true,
				errorMessage: '请输入验证码',
			}]
		},
		// 手机验证码
		smsCode: {
			rules: [{
				required: true,
				errorMessage: '请输入手机验证码',
			}]
		},
	})
	const code = ref('')
	const shopLogo = ref('../../static/loginInterface/logo.png')
	//获取验证码图片
	function verifyCode() {
		verify().then(res => {
			codeImg.value = "data:image/jpg;base64," + res.data.data.base64Image
			FormData.value.verifyUUID = res.data.data.verifyUUID
		})
	}
	//切换验证码
	function toggle() {
		verifyCode()
	}
	//获取手机号验证码
	function resendCode() {
		console.log(1111);
		form.value.validateField(['phone', 'verifyCode']).then(res => {
			// this.resendFlag = false
			getSendVerifySMS()
			// this.count = 60
			// this.getTimer()
			console.log('表单数据信息：', res);
		}).catch(err => {
			console.log('表单错误信息：', err);
		})
	}
	//发送请求获取手机号验证码
	function getSendVerifySMS() {
		sendVerifySMS({
			phone: FormData.value.phone,
			verifycode: FormData.value.verifyCode,
			// verifycode:'1234'
			verifyUUID: FormData.value.verifyUUID,
			// type: 'reg'
		}).then(res => {
			console.log(res);
			if (res.data.success) {
				resendFlag.value = false
				count.value = 60
				getTimer()
				uni.showToast({
					icon: 'none',
					duration: 3000,
					title: '验证码已发送'
				});
			} else {
				uni.showToast({
					icon: 'none',
					duration: 3000,
					title: `${res.data.message}`
				});
			}

		})
	}
	//重新发送短信验证码
	function resendCodes() {
		if (count.value != -1) {
			return
		}
		form.value.validateField(['phone', 'verifyCode']).then(res => {
			// this.resendFlag = false
			getSendVerifySMS()
			// this.count = 60
			// this.getTimer()
			console.log('表单数据信息：', res);
		}).catch(err => {
			console.log('表单错误信息：', err);
		})
	}
	//获取短信验证码
	function getTimer() {
		timer.value = setInterval(() => {
			if (count.value == 0) {
				clearInterval(timer.value)
				count.value = -1
				return
			}
			count.value--
		}, 1000)
	}
	// 改变checkBox选中状态
	function changed(val) {
		flag.value = !flag.value
	}
	// 跳转指定页面
	function onPageJump(url) {
		uni.navigateTo({
			url: url
		});
	}
	
	function openTost () {
		uni.showToast({
			icon: 'none',
			duration: 3000,
			title: '请先阅读并同意《注册协议》和《隐私条款》'
		});
	}
	
	// 登录按钮提交
	function submit() {
		form.value.validate().then(res => {
			if(flag.value){
				logins()
			}else{
				uni.showToast({
					icon: 'none',
					duration: 3000,
					title: '请先阅读并同意《用户手册》和《隐私条款》'
				});
			}
			
			console.log('表单数据信息：', res);
		}).catch(err => {
			console.log('表单错误信息：', err);
		})
	}
	// 登录
	function logins() {
		login().doLoginPhone(FormData.value).then(() => {
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
	}

	const avatarUrl = ref('')
	const nickName = ref('')
	const encryptedData = ref('')
	const iv = ref('')
	const codes = ref('')

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

	function closeParameter() {
		alertDialog.value.close()
		getxcxphone(codes.value)
	}

	function chooseavatar(e) {
		console.log(e.detail.avatarUrl);
		// wx.downloadFile({
		// 	url: e.detail.avatarUrl,
		// 	success(res) {
		// 		if (res.statusCode === 200) {
		// 			const tempFilePath = res.tempFilePath
		// 提交到服务器接口，保存头像
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

	onShow(() => {
		verifyCode()
	})
	onLoad(() => {
		verifyCode()
		uni.setNavigationBarTitle({
			title: uni.getStorageSync("shopName") ? uni.getStorageSync("shopName") : '禾鲜谷'
		});
	})
</script>

<style lang="scss" scoped>
	.loginBox {
		width: 750rpx;
		padding: 0 28rpx;
		box-sizing: border-box;
		background-color: white;

		.imgbox {
			width: 320rpx;
			height: 180rpx;
			margin: 80rpx 174rpx;
		}

		input {
			height: 96rpx;
			background: #F5F5F7;
			border-radius: 48rpx;
			padding: 0 40rpx;
			box-sizing: border-box;
		}

		.phoneIpt {
			width: 686rpx;
			// margin-top: 142rpx;
		}

		.phoneCode {
			position: relative;
			width: 100%;
			margin-top: 52rpx;

			// height: 96rpx;
			.smsCodeIpt {
				width: 686rpx;
			}

			.getCode {
				height: 100rpx;
				position: absolute;
				top: 30rpx;
				right: 32rpx;
				font-size: 30rpx;
				color: #1C9B64;
				z-index: 99;
			}
		}

		.uni-forms {
			width: 100%;
			box-sizing: border-box;

			.uni-forms-item {
				margin-bottom: 48rpx;
			}

			.uni-forms-item:nth-child(2) {
				width: 100%;

				.codeBox {
					width: 100%;
					display: flex;

					.uni-easyinput__content-input {
						height: 96rpx !important;
					}

					.uni-input {
						width: 350rpx;
						min-height: 96rpx;
					}

					image {
						width: 150rpx;
						height: 76rpx;
						margin: 14rpx 0 0 20rpx;
					}

					text {
						margin: 34rpx 0 0 14rpx;
						font-size: 20rpx;
						color: #666;
					}
				}
			}

			.uni-forms-item:nth-child(3) {
				position: relative;
				width: 100%;

				.uni-easyinput__content {
					width: 340rpx;
					height: 96rpx !important;
				}

				.uni-input {
					width: 340rpx;
					height: 96rpx;
				}

				.obtainCode {
					height: 96rpx;
					line-height: 96rpx;
					position: absolute;
					top: 0rpx;
					right: 24rpx;
					color: #1C9B64;
					z-index: 999999;
				}
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
			padding-bottom: 32rpx;

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
			margin: 130rpx auto;

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
	}


	.codeBox .uni-forms-item__error.msg--active {
		transform: translateY(10%) !important;
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
</style>