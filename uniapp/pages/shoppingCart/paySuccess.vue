<template>
	<view class="payPage">
		<!-- 自定义导航栏 -->
		<HeadNav nav-background-color="#F5F5F7" backImageUrl="1" textContent="支付成功" fontWeight="600" fontSize="15">
		</HeadNav>
		<!-- 提交订单logo -->
		<image src="@/static/shoppingCart/paysuccess.png" mode=""></image>
		<!-- 提交订单文字 -->
		<view class="paySuccess">支付成功</view>
		<!-- 支付金额 -->
		<view class="payPrice">{{jifen?jifen+'积分':''}}{{jifen&&price&&price!=0?'+':''}}{{price&&price!=0?'￥'+price:''}}</view>
		<!-- 返回首页 | 查看订单按钮 -->
		<view class="btnbox">
			<button @click="jumpAddress('/pages/homePage/homepage')">返回首页</button>
			<button @click="onPageJump('/pages/memberCenter/myOrder/myOrder?stateid=0')">查看订单</button>
		</view>
		<!-- 完成按钮 -->
		<view v-if="!isWeixin()" style="height:100rpx">
		</view>
		<!-- #ifdef H5 -->
		<button class="successBtns" @click="jumpAddress('/pages/homePage/homepage')">完成</button>
		<!-- #endif -->
		<!-- #ifndef H5 -->
		<button class="successBtn" @click="jumpAddress('/pages/homePage/homepage')">完成</button>
		<!-- #endif -->
	</view>
</template>

<script setup>
	import {
		ref
	} from "vue"
	import {
		onLoad,
	} from "@dcloudio/uni-app"
	import {
		order
	} from '@/store/order'
	const price = ref('')
	const jifen = ref('')

	//跳转到指定页面
	function jumpAddress(url) {
		uni.switchTab({
			url: url
		});
	}

	function onPageJump(url) {
		uni.redirectTo({
			url: url
		});
		// window.location.href = window.location.href.split('?')[0] + '#' + url
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
	onLoad(options => {
		
		jifen.value = options.jifen?options.jifen:''
		if(options.money == '11'){
			price.value = uni.getStorageSync("money")
		}else{
			price.value = options.price
		}
	})
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
			margin-left: 344rpx;
		}

		.paySuccess {
			font-size: 38rpx;
			width: 100%;
			text-align: center;
			margin-top: 24rpx;
		}

		.payPrice {
			font-weight: 600;
			font-size: 54rpx;
			width: 100%;
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
		.successBtns {
			width: 630rpx;
			height: 92rpx;
			background: #1C9B64;
			border-radius: 24rpx;
			position: absolute;
			bottom: 120rpx;
			left: 60rpx;
			color: white;
		}
	}
</style>