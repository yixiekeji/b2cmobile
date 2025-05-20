<template>
	<view class="loginBox">
		<!-- 自定义导航栏 -->
		<HeadNav nav-background-color="#fff" backImageUrl="2" textContent="注册" fontSize="15" fontWeight="600"
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
					<uni-easyinput type="password" v-model="FormData.password" placeholder="请输入密码" />
				</uni-forms-item>
			</view>
			<!-- 确认密码框 -->
			<view class="passwordBox">
				<uni-forms-item name="repassword">
					<uni-easyinput type="password" v-model="FormData.repassword" placeholder="请确认密码" />
				</uni-forms-item>
			</view>
			<!-- 图像验证码 -->
			<view class="codeBox">
				<view class="codeInp">
					<uni-forms-item class="codeInp" name="verifyCode">
						<uni-easyinput v-model="FormData.verifyCode" placeholder="图像验证码" />
					</uni-forms-item>
				</view>
				<view class="codeImg">
					<image :src="codeImg" style="width: 146rpx;height: 76rpx;"></image>
				</view>
				<text @click="toggle">看不清，换一张</text>
			</view>
			<!-- 手机验证码 -->
			<view class="phoneCode">
				<uni-forms-item name="smsCode">
					<view style="width: 430rpx;">
						<uni-easyinput class="smsCodeIpt" v-model="FormData.smsCode" placeholder="测试环境默认:888888" />
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
		<button type="default" @click="submit()" class="btnbox"
			:style="[{'background-color':flag?'#1C9B64':'#1C9B6488'}]">注册</button>
		<!-- 登录盒子 -->
		<!-- <view class="logonBox" @click="submitAdd()">立即登录</view> -->
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
		sendVerifySMS,
		register
	} from '@/api/login.js';
	let codeImg = ref('')
	const flag = ref(false)
	let FormData = ref({
		password: '',
		repassword: '',
		phone: '',
		verifyCode: '',
		verifyUUID: '',
		promoterPhone: ''
	})
	const form = ref()
	const resendFlag = ref(true) // 判断是否显示 ‘重新获取’按钮
	const timer = ref(null) // 定时器
	const count = ref(60) // 时间
	// 对字段进行必填验证
	let rules = ref({
		// 手机号验证
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
		// 密码验证
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
			]
		},
		// 确认密码
		repassword: {
			rules: [{
					required: true,
					errorMessage: '请输入密码',
				},
				{
					validateFunction: (rule, value, data, callback) => {
						if (FormData.value.repassword != FormData.value.password) {
							callback('两次密码输入不一致')
						}
						return true
					}
				}
			]
		},
		// 验证码验证
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
	const shopLogo = ref('../../static/loginInterface/logo.png')
	// 跳转指定页面
	function onPageJump(url) {
		uni.navigateTo({
			url: url
		});
	}
	// 返回上一页
	function goBack() {
		uni.navigateBack({
			delta: 1
		})
	}
	//获取验证码图片
	function verifyCode() {
		verify().then(res => {
			codeImg.value = "data:image/jpg;base64," + res.data.data.base64Image
			FormData.value.verifyUUID = res.data.data.verifyUUID
		})

	}
	//获取手机号验证码
	function resendCode() {
		form.value.clearValidate()
		form.value.validateField(['phone', 'password', 'repassword', 'verifyCode']).then(res => {
			getSendVerifySMS()
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
			type: 'reg'
		}).then(res => {
			console.log(res);
			if (res.data.success) {
				uni.showToast({
					icon: 'none',
					duration: 3000,
					title: '验证码已发送'
				});
				resendFlag.value = false
				getTimer()
				count.value = 60
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
		form.value.clearValidate()
		form.value.validateField(['phone', 'password', 'repassword', 'verifyCode']).then(res => {
			// this.resendFlag = false
			// this.count = 60
			getSendVerifySMS()
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
	//切换验证码
	function toggle() {
		verifyCode()
	}
	// 改变checkBox选中状态
	function changed(val) {
		flag.value = !flag.value
	}
	// 注册按钮提交
	function submit() {
		form.value.validate().then(res => {
			if(flag.value){
				register(FormData.value).then(res => {
					uni.showToast({
						icon: 'none',
						duration: 3000,
						title: '注册成功',
						success: () => {
							setTimeout(function() {
								uni.navigateTo({
									url: "/pages/loginInterface/passwordLogin"
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
	onLoad(() => {
		shopLogo.value = '../../static/loginInterface/logo.png'
		verifyCode()
		uni.setNavigationBarTitle({
			title: uni.getStorageSync("shopName") ? uni.getStorageSync("shopName") : '易写科技注册'
		});
	})
</script>

<style lang="scss" scoped>
	.loginBox {
		width: 750rpx;
		height: 100%;
		padding: 0 32rpx;
		box-sizing: border-box;
		position: relative;
		background-color: white;

		.imgbox {
			width: 320rpx;
			height: 180rpx;
			margin-left: 174rpx;
			margin-top: 70rpx;
			margin-bottom: 112rpx;
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

		.confirmPasswordBox {
			width: 686rpx;
			margin-top: 48rpx;
			position: relative;

			.confirmEyesimg {
				width: 40rpx;
				height: 26rpx;
				position: absolute;
				right: 28rpx;
				top: 34rpx;
				z-index: 99;
			}
		}

		.phoneCode {
			position: relative;
			width: 100%;
			margin-top: 52rpx;

			.smsCodeIpt {
				width: 500rpx;
			}

			.getCode {
				height: 100rpx;
				position: absolute;
				top: 30rpx;
				right: 10rpx;
				font-size: 30rpx;
				color: #1C9B64;
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
				margin-left: 26rpx;
			}

			text {
				font-size: 20rpx;
				font-family: 'PingFang SC';
				color: #666666;
				margin-left: 14rpx;
			}
		}

		.uni-forms {
			width: 100%;
			box-sizing: border-box;

			.uni-forms-item:nth-child(5) {
				position: relative;

				.uni-easyinput__content {
					width: 340rpx;
					height: 96rpx !important;
				}

				.uni-input {
					width: 340rpx;
					min-height: 96rpx;
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

		.logonBox {
			font-family: 'PingFang SC';
			font-size: 13px;
			color: #88888C;
			margin: 34rpx 290rpx;
		}
	}
</style>