<template>

	<view class="resetPassword">
		<view style="background-color: #fff;padding: 10rpx 26rpx;box-sizing: border-box;">
			<!-- 自定义导航栏 -->
			<HeadNav nav-background-color="#fff" backImageUrl="2" textContent="忘记密码" fontSize="15" fontWeight="600">
			</HeadNav>
			<!-- logo大图 -->
			<image class="imgbox" :src="shopLogo"></image>
			<!-- 表单 -->
			<uni-forms ref="form" :rules="rules" :modelValue="FormData">
				<!-- 手机号码 -->
				<view class="newPassword">
					<view class="lable">手机号码</view>
					<view class="value passwordBox">
						<uni-forms-item name="phone">
							<uni-easyinput :disabled="disabledFlag" v-model="FormData.phone" placeholder="请输入手机号" />
						</uni-forms-item>
					</view>
				</view>
				<!-- 新密码 -->
				<view class="newPassword">
					<view class="lable">新密码</view>
					<view class="value passwordBox">
						<uni-forms-item name="password">
							<uni-easyinput type="password" v-model="FormData.password" placeholder="请输入新密码" />
						</uni-forms-item>
					</view>
				</view>
				<!-- 确认密码 -->
				<view class="newPassword ">
					<view class="lable">确认密码</view>
					<view class="value passwordBox">
						<uni-forms-item name="repassword">
							<uni-easyinput type="password" v-model="FormData.repassword" placeholder="请确认密码" />
						</uni-forms-item>
					</view>
				</view>
				<!-- 图像验证码 -->
				<view class="imgCodeBox">
					<view class="codeFont">图像验证码</view>
					<view class="value">
						<uni-forms-item class="codeInp" name="verifyCode">
							<uni-easyinput v-model="FormData.verifyCode" placeholder="图像验证码" />
						</uni-forms-item>
					</view>
					<view class="imgCode">
						<image :src="codeImg" style="width: 146rpx;height: 76rpx;"></image>
					</view>
					<text @click="toggle">看不清，换一张</text>
				</view>
				<!-- 短信验证码 -->
				<view class="newPassword">
					<view class="lable">短信验证码</view>
					<view class="value">
						<uni-forms-item name="smsCode">
							<view style="width: 380rpx;">
								<uni-easyinput class="smsCodeIpt" type="number" v-model="FormData.smsCode"
									placeholder="测试环境默认:888888" />
							</view>
							<view class="getCode"><text v-if="resendFlag" @click="resendCode">获取验证码</text><text v-else
									@click="resendCodes" :style="{color:count != -1?'#ccc':'#1C9B64'}">重新发送<text
										v-if="!resendFlag&&count != -1">({{count}})</text></text></view>
						</uni-forms-item>
					</view>
				</view>
			</uni-forms>
			<!-- 修改按钮 -->
			<button @click="submit">
				修改
			</button>
		</view>
	</view>
</template>

<script setup>
	import {
		verify,
		sendVerifySMS,
		resetPwd
	} from '@/api/login.js'
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
	const form = ref()
	const codeImg = ref('')
	let FormData = ref({
		smsCode: '', //手机验证码
		password: '', //密码
		repassword: '', //确认密码
		verifyCode: '', //验证码
		phone: '', //手机号
		verifyUUID: ''
	})
	const resendFlag = ref(true) // 判断是否显示 ‘重新获取’按钮
	const timer = ref(null) // 定时器
	const count = ref(60) // 时间
	const disabledFlag = ref(false)
	const rules = ref({
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
		// 验证新密码
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
		// 验证确认密码
		repassword: {
			rules: [{
					required: true,
					errorMessage: '请输入密码',
				},
				{
					validateFunction: (rule, value, data, callback) => {
						if (value != FormData.value.password) {
							callback('两次密码输入不一致')
						}
						return true
					}
				}
			]
		},
		// 验证验证码
		verifyCode: {
			rules: [{
				required: true,
				errorMessage: '请输入验证码',
			}]
		},
		// 验证手机验证码
		smsCode: {
			rules: [{
				required: true,
				errorMessage: '请输入手机验证码',
			}]
		},
	})
	const resendCodeRule = ref({
		password: {
			rules: [{
				required: true,
				errorMessage: '请输入密码',
			}]
		},
		repassword: {
			rules: [{
					required: true,
					errorMessage: '请输入密码',
				},
				{
					validateFunction: (rule, value, data, callback) => {
						if (value != FormData.value.password) {
							callback('两次密码输入不一致')
						}
						return true
					}
				}
			]
		},
		verifyCode: {
			rules: [{
				required: true,
				errorMessage: '请输入验证码',
			}]
		},
	})
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
	// 获取验证码
	function resendCode() {
		form.value.validateField(['phone', 'password', 'repassword', 'verifyCode']).then(res => {
			getSendVerifySMS()
			console.log('表单数据信息：', res);
		}).catch(err => {
			console.log('表单错误信息：', err);
		})
	}
	//获取手机号验证码
	function getSendVerifySMS() {
		sendVerifySMS({
			phone: FormData.value.phone,
			verifycode: FormData.value.verifyCode,
			verifyUUID: FormData.value.verifyUUID,
			// verifycode:'1234'
			type: ''
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
		form.value.clearValidate()
		// this.rules = this.resendCodeRule

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

	// 修改按钮提交
	function submit() {
		// this.rules = this.loginRule
		form.value.validate().then(res => {
			console.log('表单数据信息：', res);
			edit();
		}).catch(err => {
			uni.showToast({
				icon: 'none',
				duration: 3000,
				title: `${res.data.message}`
			});
			console.log('表单错误信息：', err);
		})
	}

	function edit() {
		resetPwd(FormData.value).then(res => {
			uni.showToast({
				icon: 'none',
				duration: 3000,
				title: '修改成功'
			});
			uni.navigateBack({
				delta: 1
			})
		}).catch(err => {
			uni.showToast({
				icon: 'none',
				duration: 3000,
				title: `${res.data.message}`
			});
			console.log('表单错误信息：', err);
		})
	}
	onLoad((options) => {
		if (options.phone) {
			FormData.value.phone = options.phone
			disabledFlag.value = true
		} else {
			FormData.value.phone = ''
			disabledFlag.value = false
		}
		verifyCode()
	})
</script>

<style lang="scss" scoped>
	.resetPassword {
		width: 750rpx;
		height: 100%;
		background-color: white;
		position: relative;

		.imgbox {
			width: 320rpx;
			height: 180rpx;
			margin: 80rpx 190rpx;
		}

		.phoneNum {
			font-size: 26rpx;
			display: flex;
			height: 80rpx;
			line-height: 80rpx;
			margin-bottom: 28rpx;

			text {
				color: #A1A1A6;
				margin-left: 30rpx;
			}
		}

		.newPassword {
			width: 714rpx;
			font-size: 26rpx;
			display: flex;
			align-items: center;
			margin-top: 60rpx;

			.lable {
				width: 138rpx;
			}

			.value {
				width: 554rpx;
				height: 80rpx;
				border-radius: 14rpx;
				position: relative;
			}
		}

		.imgCodeBox {
			width: 714rpx;
			font-size: 26rpx;
			display: flex;
			align-items: center;
			margin-top: 60rpx;

			.value {
				width: 220rpx;
				height: 80rpx;
				border-radius: 14rpx;
				margin-left: 14rpx;

				.codeInp {
					width: 100%;
				}
			}

			.imgCode {
				width: 150rpx;
				height: 76rpx;
				background: #F5F5F7;
				margin-left: 26rpx;
				margin-top: 10rpx;
			}

			text {
				font-size: 20rpx;
				line-height: 28rpx;
				color: #666666;
				margin-left: 6rpx;
			}
		}

		button {
			width: 315px;
			height: 46px;
			background: #1C9B64;
			border-radius: 12px;
			color: white;
			font-size: 36rpx;
			margin-top: 100rpx;
		}
	}

	.getCode {
		color: #1C9B64;
		position: absolute;
		top: 30rpx;
		right: 2rpx;
		margin: auto;
		z-index: 99;
	}
</style>