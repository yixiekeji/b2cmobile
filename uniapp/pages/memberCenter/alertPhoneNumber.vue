<template>
	<!-- 自定义导航栏 -->
	<HeadNav nav-background-color="#F5F5F7" backImageUrl="1" textContent="更换绑定手机号" fontWeight="500" fontSize="15">
	</HeadNav>
	<view class="resetPassword">
		<view class="phone">
			<view>原手机号码</view>
			<text>{{yphone}}</text>
		</view>
		<uni-forms :modelValue="formData" :rules="rules" ref="form" style="width: 100%;" label-width="166rpx">
			<!-- 输入密码 -->
			<uni-forms-item name="phone" label="新手机号码" required>
				<uni-easyinput
					:styles="{'borderColor': '#fff','backgroundColor':'#F5F5F7','height':'96rpx','borderRadius':'48rpx'}"
					type="number" v-model="formData.phone" placeholder="请输入新手机号"></uni-easyinput>
			</uni-forms-item>

			<!-- 图像验证码 -->
			<uni-forms-item name="verifyCode" label="图形验证码" required>
				<view>
					<uni-easyinput
						:styles="{'borderColor': '#fff','backgroundColor':'#F5F5F7','height':'96rpx','borderRadius':'48rpx'}"
						v-model="formData.verifyCode" placeholder="图像验证码"></uni-easyinput>
					<image :src="codeImg" mode=""></image>
					<text @click="getVerify" class="kbq">看不清，换一张</text>
				</view>
			</uni-forms-item>
			<!-- 获取验证码 -->
			<uni-forms-item name="smsCode" label="短信验证码" required>
				<uni-easyinput
					:styles="{'borderColor': '#fff','backgroundColor':'#F5F5F7','height':'96rpx','borderRadius':'48rpx','width': '500rpx'}"
					v-model="formData.smsCode" placeholder="短信验证码"></uni-easyinput>
				<view class="obtainCode"><text v-if="resendFlag" @click="resendCode">获取验证码</text><text v-else
						@click="resendCodes" :style="{color:count != -1?'#ccc':'#1C9B64'}">重新发送<text
							v-if="!resendFlag&&count != -1">({{count}})</text></text></view>
			</uni-forms-item>

		</uni-forms>
		<!-- 修改按钮 -->
		<button @click="register">
			修改
		</button>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive
	} from "vue";
	import {
		memberInfo
	} from '@/api/member.js'
	import {
		verify,
		sendVerifySMS,
		updatephone
	} from '@/api/login.js'
	import {
		onShow,
		onHide,
		onReady,
		onLoad
	} from '@dcloudio/uni-app'
	let member = ref({})
	const form = ref()
	const timer = ref()
	const codeImg = ref('')
	const resendFlag = ref(true)
	const count = ref(60)
	let yphone = ref('')
	let formData = ref({
		phone: "",
		smsCode: "",
		verifyCode: "",
		verifyUUID: ""
	})
	let rules = ref({
		phone: {
			rules: [{
					required: true,
					errorMessage: '手机号码必填'
				},
				{
					pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
					errorMessage: '手机号码格式不正确',
				}
			]
		},
		smsCode: {
			rules: [{
				required: true,
				errorMessage: '手机验证码必填'
			}]
		},
		verifyCode: {
			rules: [{
				required: true,
				errorMessage: '验证码必填'
			}]
		},
	})


	function getMemberInfo() {
		memberInfo().then(res => {
			console.log(res);
			yphone.value = res.data.data.phone
		})
	}

	function getVerify() {
		verify().then(res => {
			codeImg.value = "data:image/jpg;base64," + res.data.data.base64Image
			formData.value.verifyUUID = res.data.data.verifyUUID
		})
	}

	//获取手机号验证码
	function resendCode() {
		form.value.clearValidate()
		form.value.validateField(['phone', 'verifyCode']).then(res => {
			getSendVerifySMS()
		}).catch(err => {})
	}
	//发送请求获取手机号验证码
	function getSendVerifySMS() {
		sendVerifySMS({
			phone: formData.value.phone,
			verifycode: formData.value.verifyCode,
			verifyUUID: formData.value.verifyUUID,
			type: ''
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
				getVerify()
			}
		})
	}
	//重新发送短信验证码
	function resendCodes() {
		if (count.value != -1) {
			return
		}
		form.value.clearValidate()
		form.value.validateField(['phone', 'verifyCode']).then(res => {
			// this.resendFlag = false
			// this.count = 60
			getSendVerifySMS()
			// this.getTimer()
		}).catch(err => {})
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

	function register() {
		form.value.validate().then(res => {
			updatephone(formData.value).then(res => {
				if (res.data.success) {
					uni.showToast({
						title: '换绑成功',
						duration: 2000,
						icon: 'none'
					});
					getVerify()
					uni.switchTab({
						url: '/pages/memberCenter/memberCenter'
					})
				}

			})
		}).catch(err => {})
	}


	onShow(() => {
		if (uni.getStorageSync("token")) {
			getVerify()
			getMemberInfo()
		} else {
			uni.navigateTo({
				url: '/pages/loginPage/loginPage'
			})
		}
	})
</script>

<style lang="scss">
	.resetPassword {
		width: 750rpx;
		height: 100%;
		background-color: white;
		position: relative;
		padding: 24rpx 22rpx;
		box-sizing: border-box;

		.phone {
			width: 100%;
			height: 80rpx;
			display: flex;
			font-size: 26rpx;
			line-height: 80rpx;
			margin-bottom: 24rpx;

			view {
				width: 166rpx;
				height: 80rpx;
				font-weight: 600;
			}

			text {
				flex: 1;
				color: #A1A1A6;
				font-size: 28rpx;
			}

			input {
				background-color: #F5F5F7;
				width: 554rpx;
				height: 80rpx;
				border-radius: 14rpx;
			}

			image {
				width: 150rpx;
				height: 76rpx;
				margin-left: 38rpx;
				margin-right: 10rpx;
			}
		}

		button {
			width: 630rpx;
			height: 92rpx;
			position: absolute;
			left: 60rpx;
			bottom: 50rpx;
			background: #1C9B64;
			border-radius: 24rpx;
			color: white;
			font-size: 36rpx;
		}

		.getCode {
			width: 150rpx;
			height: 80rpx;
			color: #1C9B64;
			font-size: 26rpx;
			position: absolute;
			top: 442rpx;
			right: 30rpx;
		}

		.uni-forms {
			width: 100%;
			box-sizing: border-box;


			.uni-forms-item {
				margin-bottom: 48rpx;
			}

			.uni-forms-item:nth-child(2) {
				view {
					width: 100%;
					display: flex;

					.uni-easyinput__content-input {
						height: 96rpx !important;
					}

					.uni-input {
						width: 340rpx;
						min-height: 96rpx;
					}

					image {
						width: 150rpx;
						height: 76rpx;
						margin: 14rpx 0 0 20rpx;
					}

					.kbq {
						margin: 34rpx 0 0 14rpx;
						font-size: 22rpx;
						color: #666;
					}
				}
			}

			.uni-forms-item:nth-child(3) {
				position: relative;

				.uni-easyinput__content {
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
					z-index: 999;
				}
			}

			.checkBox {
				color: red;
				font-size: 22rpx;
				margin-top: -20rpx;
				display: flex;
				align-items: center;

				view {
					color: #88888C;
				}

				text {
					color: #588270;
				}
			}

		}

		button {
			width: 682rpx;
			height: 80rpx;
			background-color: #1C9B64;
			color: white;
			font-size: 32rpx;
			font-weight: 600;
			border-radius: 24rpx;
			position: fixed;
			bottom: 50rpx;
			left: 36rpx;
		}
	}
</style>