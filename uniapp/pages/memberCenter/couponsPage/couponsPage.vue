<template>
	<view class="collectPage">
		<!-- 自定义导航栏 -->
		<HeadNav nav-background-color="#fff" backImageUrl="1" textContent="优惠券适用商品" fontSize="15" fontWeight="600">
		</HeadNav>
		<view class="couponsContent">
			<view>
				<!-- <view>折扣卷<text>(部分商品/全部商品)</text></view> -->
				<view>{{couponName}}</view>
				<text>有效期至{{useEndTime}}</text>
			</view>
			<view>
				<view>{{couponValue}}<text>￥</text></view>
				<text>满{{minAmount}}可用</text>
			</view>
			<view class="couponsPos">
				优惠
			</view>
			<view style="width: 100%;display: flex;justify-content: space-between;">
				<view style="display: flex;align-items: center;color: #DC3A2F;font-size: 26rpx;">
					{{linkProduct == 1 ? '全部商品' : '部分商品'}}
				</view>
				<view>
					<button v-if="flag != '1'" class="choose" @click="getCoupon()">领取</button>
				</view>
			</view>
			<!-- <view v-if="item.timeout || item.use" class="mark"></view>
			<image v-if="item.timeout" src="@/static/member/couponsEd.png"></image>
			<image v-if="item.use" src="@/static/member/couponsUse.png"></image> -->
		</view>
		<!-- 收藏商品列表详情 -->
		<view class="detailBox" v-for="item in list" v-if="list.length!=0">
			<image :src="imageUrl + item.product.masterImg" class="goodsImg" @click="jumpDetail(item.productId)">
			</image>
			<view class="fontBox" @click="jumpDetail(item.product.id)">
				<view class="font1">{{item.product.name}}</view>
				<view class="font2">
					<view>￥{{item.product.mallPrice}}</view>
				</view>
			</view>
		</view>
		<!-- 没有数据显示 -->
		<view class="noData" v-if="list.length==0&&dataFlag">
			<image src="@/static/noList.png" mode=""></image>
			<view>暂无更多数据</view>
		</view>
	</view>
</template>

<script setup>
	import {
		couponProduct
	} from '@/api/coupon.js'
	import {
		reveivecoupon
	} from '@/api/goodsDetail.js'
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
	let list = ref([])
	const id = ref('')
	const couponName = ref('')
	const useEndTime = ref('')
	const couponValue = ref('')
	const minAmount = ref('')
	const linkProduct = ref('')
	const flag = ref('')
	const dataFlag = ref(false)
	// 获取收藏列表
	function getList() {
		dataFlag.value = false
		couponProduct({
			couponId: id.value
		}).then(res => {
			list.value = res.data.data
			dataFlag.value = true
		})
	}
	// 跳转到商品详情
	function jumpDetail(val) {
		uni.navigateTo({
			url: '/pages/homePage/goodsDetail?id=' + val
		});
	}
	function getCoupon() {
		reveivecoupon({
			couponId: id.value
		}).then(res => {
			if (res.data.success) {
				uni.showToast({
					icon: 'none',
					duration: 3000,
					title: `领取成功`
				});
				// list.value = []
				// page.value = 1
				// getList()
			}
		})
	}
	onLoad((options) => {
		id.value = options.id
		couponName.value = options.couponName
		useEndTime.value = options.useEndTime
		couponValue.value = options.couponValue
		minAmount.value = options.minAmount
		linkProduct.value = options.linkProduct
		if(options.flag){
			flag.value = options.flag
		}else{
			flag.value = ''
		}
		getList()
	})
</script>

<style lang="scss" scoped>
	.collectPage {
		width: 750rpx;
		height: 100%;
		padding: 18rpx;
		box-sizing: border-box;

		.noData {
			text-align: center;
			margin-top: 250rpx;
			font-size: 26rpx;
			color: gray;

			image {
				width: 100%;

			}
		}

		.detailBox {
			display: flex;
			align-items: center;
			background-color: white;
			border-radius: 24rpx;
			margin-top: 16rpx;

			.goodsImg {
				margin: 10rpx;
				width: 160rpx;
				height: 160rpx;
			}

			.collectImg {
				width: 52rpx;
				height: 52rpx;
				margin-left: 30rpx;
			}

			.fontBox {
				width: 430rpx;
				height: 100%;

				.font1 {
					line-clamp: 1;
					overflow: hidden; //超出文本隐藏
					text-overflow: ellipsis; ///超出部分省略号显示
					display: -webkit-box; //弹性盒模型
					-webkit-box-orient: vertical; //上下垂直
					-webkit-line-clamp: 1; //自定义行数
					font-size: 30rpx;
					margin-bottom: 22rpx;
				}

				.font2 {
					display: flex;
					justify-content: space-between;
					align-items: center;

					view {
						font-weight: 600;
						font-size: 34rpx;
						color: #DC3A2F;
					}
				}
			}
		}

		.couponsContent {
			width: 692rpx;
			height: 218rpx;
			background: #FFFFFF;
			box-shadow: 0rpx 8rpx 8rpx 0rpx rgba(0, 0, 0, 0.12);
			border-radius: 16rpx;
			margin: 0 auto;
			margin-top: 24rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex-wrap: wrap;
			padding: 0 24rpx;
			box-sizing: border-box;
			overflow: hidden;
			position: relative;

			>view:nth-child(1) {
				>view {
					height: 42rpx;
					font-weight: 600;
					font-size: 30rpx;
					color: #333333;
					line-height: 42rpx;

					>text {
						font-size: 22rpx;
						color: #999999;
						margin-left: 6rpx;
						font-weight: normal;
						line-height: 42rpx;
					}
				}

				>text {
					font-weight: 400;
					font-size: 22rpx;
					color: #999999;
				}
			}

			>view:nth-child(2) {
				color: #DC3A2F;

				>view {
					font-weight: 600;
					font-size: 62rpx;

					>text {
						font-size: 29rpx;
					}
				}

				>text {
					font-weight: 400;
					font-size: 24rpx;
				}
			}

			.couponsPos {
				width: 72rpx;
				height: 38rpx;
				background: #1C9B64;
				border-radius: 16rpx 0rpx 16rpx 0rpx;
				font-size: 22rpx;
				color: #FFFFFF;
				position: absolute;
				left: 0;
				top: 0;
				overflow: hidden;
				text-align: center;
				line-height: 38rpx;
			}

			.mark {
				width: 100%;
				height: 100%;
				background-color: #ffffff99;
				position: absolute;
				top: 0;
				left: 0;
				z-index: 9;
			}

			image {
				width: 155rpx;
				height: 116rpx;
				position: absolute;
				right: 0;
				bottom: 0;
				opacity: 1;
				z-index: 91;
			}
		}
	}
	.choose {
		width: 104rpx;
		height: 40rpx;
		background: #1C9B64;
		border-radius: 47rpx 47rpx 47rpx 47rpx;
		font-size: 24rpx;
		color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
	}
</style>