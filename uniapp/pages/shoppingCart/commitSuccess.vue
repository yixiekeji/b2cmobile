<template>
	<view class="payPage">
		<!-- 自定义导航栏 -->
		<HeadNav nav-background-color="#f7f7f5" backImageUrl="1" textContent="支付成功" fontSize="15" fontWeight="600"
			style="z-index: 999999;position: relative;"></HeadNav>
		<!-- 支付成功logo -->
		<image src="@/static/shoppingCart/paysuccess.png" mode=""></image>
		<!-- 支付成功文字 -->
		<view class="paySuccess">支付成功</view>
		<!-- 支付金额 -->
		<view class="payPrice">￥{{money}}</view>
		<!-- 返回首页 | 查看订单按钮 -->
		<view class="btnbox">
			<button @click="jumpAddress('/pages/homePage/homepage')">返回首页</button>
			<button @click="onPageJump('/pages/memberCenter/myOrder/myOrder?stateid=0')">查看订单</button>
		</view>
		<!-- 完成按钮 -->
		<button class="successBtn" @click="jumpAddress('/pages/homePage/homepage')">完成</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				money: ''
			};
		},
		methods: {
			//跳转到指定页面
			jumpAddress(url) {
				uni.switchTab({
					url: url
				});
			},
			onPageJump(url) {
				window.location.href = window.location.href.split('?')[0] + '#' + url
			},
		},
		onLoad(e) {
			this.money = e.money
			uni.setNavigationBarTitle({
				title: uni.getStorageSync("shopName")?uni.getStorageSync("shopName"):'禾鲜谷'
			});
		}
	}
</script>

<style lang="scss" scoped>
	.payPage {
		width: 750rpx;
		height: 100%;
		background-color: white;

		image {
			width: 80rpx;
			height: 80rpx;
			margin-top: 162rpx;
			margin-left: 354rpx;
		}

		.paySuccess {
			font-size: 38rpx;
			margin-left: 314rpx;
			margin-top: 24rpx;
		}

		.payPrice {
			font-weight: 600;
			font-size: 54rpx;
			text-align: center;
			margin-top: 32rpx;
		}

		.btnbox {
			width: 364rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-left: 204rpx;
			margin-top: 40rpx;

			button {
				width: 166rpx;
				height: 56rpx;
				background: #FFFFFF;
				border: 2rpx solid #1C9B64;
				border-radius: 10rpx;
				color: #1C9B64;
				font-size: 24rpx;
				line-height: 52rpx;
			}

		}

		.successBtn {
			width: 630rpx;
			height: 92rpx;
			background: #1C9B64;
			border-radius: 24rpx;
			position: absolute;
			bottom: 40rpx;
			left: 60rpx;
			color: white;
		}
	}
</style>