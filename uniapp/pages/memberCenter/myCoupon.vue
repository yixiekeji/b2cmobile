<template>
	<view class="searchResult">
		<!-- 自定义导航栏 -->
		<HeadNav nav-background-color="#FFFFFF" backImageUrl="1" textContent="优惠券" fontSize="16" fontWeight="600"
			style="z-index: 999999;position: relative;"></HeadNav>
		<!-- 商品排序方式 -->
		<view class="top-menu-view" :style="{top:top}">
			<view class="menu-topic-view" v-for="item in tabs" :id="'tabNum'+item.id" :key="(item.id - 1)"
				@click="swichMenu(item.id - 1)">
				<view :class="currentTab==(item.id - 1) ? 'menu-topic-act' : 'menu-topic'">
					<text class="menu-topic-text">{{item.name}}

					</text>
					<view class="menu-topic-bottom">
						<view class="menu-topic-bottom-color"></view>
					</view>
				</view>
			</view>
		</view>
		<view class="couponSn" v-if="currentTab == 1">
			<input type="text" placeholder="兑换优惠券" v-model="couponSn">
			<button @click="exchange">兑换</button>
		</view>
		<!-- 商品展示列表 -->
		
		<view class="couponsContent"
			style="display: flex;"
			v-for="item in list">
			<view>
				<view>{{item.couponName}}</view>
				<text>有效期至{{item.useEndTime}}</text>
			</view>
			<view>
				<view>{{item.couponValue}}<text>￥</text></view>
				<text>满{{item.minAmount}}可用</text>
			</view>
			<view class="couponsPos">
				优惠
			</view>
			<view style="width: 100%;display: flex;justify-content: space-between;">
				<view style="display: flex;align-items: center;color: #DC3A2F;font-size: 26rpx;">
					{{item.linkProduct == 1 ? '全部商品' : '部分商品'}}
					<button v-if="item.linkProduct != 1" class="watch" @click="jumpPage(item.couponId,item.couponName,item.useEndTime,item.couponValue,item.minAmount,item.linkProduct)">查看</button>
				</view>
				<view>
					<!-- <button class="choose" @click="getCoupon(item.id)">领取</button> -->
				</view>
			</view>
			<view v-if="item.timeout || item.use" class="mark"></view>
			<image v-if="item.timeout" src="@/static/member/couponsEd.png"></image>
			<image v-if="item.use" src="@/static/member/couponsUse.png"></image>
		</view>
		<view v-if="loading"
			style="text-align: center;color: #999;width: 100%;height: 50rpx;line-height: 50rpx;font-size: 24rpx;">
			{{loadingText}}
		</view>
		<!-- 没有数据显示 -->
		<view class="noData" v-if="list.length == 0&&dataFlag">
			<image src="@/static/member/coupon.png"></image>
			<view>{{currentTab == 1 ? '暂无可用的优惠券' : currentTab == 0 ? '暂无已经使用的优惠券' : '暂无过期的优惠券'}}</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive
	} from 'vue'
	import {
		onLoad,
		onPullDownRefresh,
		onReachBottom
	} from "@dcloudio/uni-app";
	import {
		couponList,
		convertCoupon
	} from '@/api/member.js'
	// 商品排序状态栏
	const tabs = reactive([{
			id: 2,
			name: '未使用'
		},
		{
			id: 1,
			name: '已经使用'
		},
		{
			id: 0,
			name: '已过期'
		}
	])
	const currentTab = ref(1) //当前排序方式
	const tabCurrent = ref('tabNum1')
	const statusBarHeight = ref(0) //排序状态栏高度
	const top = ref(0)
	const page = ref(1)
	const sort = ref(1)
	let list = ref([])
	const loading = ref(false) //加载效果开关
	const loadingText = ref('加载中...') //加载文案
	const couponSn = ref('')
	const flag = ref(false)
	const dataFlag = ref(false)
	// 切换排序方式
	function swichMenu(id) {
		if (id == sort.value && id == 3) {
			sort.value = 4
		} else {
			sort.value = id
		}
		list.value = []
		page.value = 1
		getList()
		currentTab.value = id
		tabCurrent.value = 'tabNum' + id
	}
	//获取数据
	function getList() {
		dataFlag.value = false
		couponList({
			page: page.value,
			canUse:sort.value
		}).then(res => {
			console.log(res);
			// this.list = [...this.list, ...res.data.data.searchShopProducts]
			if (res.data.data.couponUsers.length == 0 && page.value > 1 && list.value.length > 10) {
				loadingText.value = '到底啦~'
			} else {
				list.value = [...list.value, ...res.data.data.couponUsers]
				console.log(list.value.length);
				loading.value = false
			}
			flag.value = list.value.some(item => {
				if (currentTab.value == 0) {
					return !item.use && !item.timeout
				} else if (currentTab.value == 1) {
					return item.use
				} else if (currentTab.value == 2) {
					return item.timeout
				}
			})
			dataFlag.value = true
		})
	}

	function exchange() {
		if (!couponSn.value) {
			uni.showToast({
				title: '请填写兑换码',
				duration: 2000,
				icon: 'none'
			});
			return
		}
		convertCoupon({
			couponSn: couponSn.value
		}).then(res => {
			console.log(res);
			if (res.data.success) {
				uni.showToast({
					title: '兑换成功',
					duration: 2000,
					icon: 'none'
				});
				couponSn.value = ''
				search()
			}
		})
	}

	function search() {
		list.value = []
		page.value = 1
		getList()
	}
	function jumpPage(val,couponName,useEndTime,couponValue,minAmount,linkProduct) {
		uni.navigateTo({
			url: '/pages/memberCenter/couponsPage/couponsPage?id=' + val + '&couponName=' + couponName + '&useEndTime=' + useEndTime + '&couponValue=' + couponValue + '&minAmount=' + minAmount + '&linkProduct=' + linkProduct
		})
	}
	onLoad((option) => {
		getList()
	})

	//上拉加载
	onReachBottom(() => {
		if (list.value.length >= 20 * page.value) {
			page.value += 1
			loading.value = true
			loadingText.value = '加载中...'
			setTimeout(() => {

				getList()
			}, 800)
		} else {
			loading.value = true
			loadingText.value = '到底啦~'
		}
	})
	//下拉刷新
	onPullDownRefresh(() => {
		setTimeout(() => {
			list.value = []
			page.value = 1
			getList()
			uni.stopPullDownRefresh()
		}, 800)
	})
</script>

<style lang="scss" scoped>
	.searchResult {
		width: 750rpx;
		height: 100%;

		.noData {
			margin-top: 250rpx;
			font-size: 22rpx;
			color: gray;
			text-align: center;

			image {
				width: 190rpx;
				height: 190rpx;
			}
		}

		.top-menu-view {
			padding: 0 26rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			position: sticky;
			position: -webkit-sticky;
			top: 0rpx;
			white-space: nowrap;
			width: 100%;
			background-color: #FFFFFF;
			height: 89rpx;
			line-height: 89rpx;

			.menu-topic-view {
				display: inline-block;
				white-space: nowrap;
				height: 89rpx;
				position: relative;
			}

			.menu-topic-text {
				font-size: 30rpx;
				color: #88888C;
				padding: 10rpx 30rpx;
				position: relative;
			}

			.menu-topic-bottom {
				position: absolute;
				bottom: 0;
				right: 0;
				left: 0;
				margin: auto;
				width: 20rpx;
				height: 8rpx;
				border-radius: 4rpx 4rpx 4rpx 4rpx;
			}

			.menu-topic-bottom-color {
				width: 80rpx;
				height: 8rpx;
				border-radius: 4rpx 4rpx 4rpx 4rpx;
			}

			.menu-topic-act .menu-topic-bottom {
				display: flex;
				justify-content: center;
			}

			.menu-topic-act .menu-topic-bottom-color {
				background: #000;
			}

			.menu-topic-act .menu-topic-text {
				color: #000;
				font-weight: 600;
			}
		}

		.couponSn {
			width: 692rpx;
			height: 87rpx;
			margin: 0 auto;
			margin-top: 24rpx;
			position: relative;
			background: #FFFFFF;
			border-radius: 44rpx 44rpx 44rpx 44rpx;

			input {
				width: 480rpx;
				height: 87rpx;
				margin-left: 20rpx;
			}

			button {
				position: absolute;
				right: 7rpx;
				top: 7rpx;
				width: 174rpx;
				height: 73rpx;
				background: #1C9B64;
				border-radius: 47rpx 47rpx 47rpx 47rpx;
				font-size: 32rpx;
				color: #FFFFFF;
				display: flex;
				align-items: center;
				justify-content: center;
				z-index: 999;
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

	.imgBox {
		width: 12rpx;
		display: flex;
		flex-wrap: wrap;
		margin-left: 12rpx;
		height: 18.4rpx;
		position: absolute;
		top: 35rpx;
		right: 10rpx;

		.top {
			width: 0;
			height: 0;
			border-bottom: 10rpx solid #BDBDBD;
			border-left: 6rpx solid transparent;
			border-right: 6rpx solid transparent;
			margin-bottom: 2.5rpx;
		}

		.topActive {
			width: 0;
			height: 0;
			border-bottom: 10rpx solid #1C9B64;
			border-left: 6rpx solid transparent;
			border-right: 6rpx solid transparent;
			margin-bottom: 2.5rpx;
		}

		.bottom {
			width: 0;
			height: 0;
			border-top: 10rpx solid #BDBDBD;
			border-left: 6rpx solid transparent;
			border-right: 6rpx solid transparent;
			// margin-top: 2.5rpx;
		}

		.bottomActive {
			width: 0;
			height: 0;
			border-top: 10rpx solid #1C9B64;
			border-left: 6rpx solid transparent;
			border-right: 6rpx solid transparent;
			// margin-top: 2.5rpx;
		}
	}
	.watch {
		width: 104rpx;
		height: 40rpx;
		background: #fff;
		border-radius: 47rpx 47rpx 47rpx 47rpx;
		border: 1rpx solid #ccc;
		font-size: 24rpx;
		color: #333333;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 10rpx;
		padding: 0;
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
	}
</style>