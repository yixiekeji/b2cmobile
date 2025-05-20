<template>
	<!-- 页面没有数据的时候展现 -->
	<view class="noData">
		<image src="../../static/home/noData.png" mode=""></image>
		<view>暂无内容，先不要慌返回到首页看看吧</view>
		<button @click="goHome">首页</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		methods: {
			// 跳转到首页
			goHome() {
				uni.switchTab({
					url: "/pages/homePage/homepage"
				});
			}
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: uni.getStorageSync("shopName")?uni.getStorageSync("shopName"):'禾鲜谷'
			});
		}
	}
</script>

<style lang="scss" scoped>
	.noData {
		width: 750rpx;
		height: 100%;
		background-color: white;
		padding: 90rpx 16rpx;

		image {
			width: 720rpx;
			height: 720rpx;
		}

		view {
			font-size: 14px;
			text-align: center;
			color: #999999;
		}

		button {
			width: 180rpx;
			height: 64rpx;
			margin-left: 270rpx;
			margin-top: 50rpx;
			background: #1C9B64;
			border-radius: 5px;
			font-size: 28rpx;
			color: white;
		}
	}
</style>