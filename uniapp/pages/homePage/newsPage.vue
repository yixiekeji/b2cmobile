<template>
	<!-- 自定义标题 -->
	<HeadNav nav-background-color="#FFFFFF" backImageUrl="1" @tests="test" textContent="新闻" fontSize="16"
		fontWeight="600" style="z-index: 999999;position: relative;"></HeadNav>

	<view class="newsPage">
		<view class="top-menu-view">
			<view class="menu-topic-view" v-for="item in tabs" :id="'tabNum'+item.id" :key="item.id"
				@click="swichMenu(item.id )">
				<view :class="currentTab==item.id ? 'menu-topic-act' : 'menu-topic'">
					<text class="menu-topic-text">{{item.name}}</text>
					<view class="menu-topic-bottom">
						<view class="menu-topic-bottom-color"></view>
					</view>
				</view>
			</view>

		</view>
		<view class="newsDetails" v-for="list in newsList" @click="newsDetails(list.id)">
			<view>
				<view>{{list.title}}</view>
				<text>{{list.updateTime}}</text>
			</view>
			<image :src="imageUrl + list.corverUrl" mode=""></image>
		</view>
		<view v-if="loading"
			style="text-align: center;color: #999;width: 100%;height: 50rpx;line-height: 50rpx;font-size: 24rpx;">
			{{loadingText}}
		</view>
		<!-- 更多弹窗 -->
		<uni-popup ref="popup" background-color="#fff" border-radius="48rpx 48rpx 0px 0px" @change="change"
			type="bottom">
			<view class="popup-content">
				<view class="title">
					<view></view>
					<view>全部板块</view>
					<view><uni-icons type="closeempty" size="18" color="#1E1E1F" @click="resize('close')"></uni-icons>
					</view>
				</view>
				<view class="content">
					<view v-for="items in tabs" @click="swichMore(items.id)"
						:class="currentTab == items.id?'active':''">
						{{items.name}}
					</view>
					<view v-if="tabs.length%3 == 1 || tabs.length%3 == 2" style="opacity: 0;"></view>
					<view v-if="tabs.length%3 == 1" style="opacity: 0;"></view>
				</view>
				<view class="button">
					<button @click="resize">重置</button>
					<button @click="determine">确定</button>
				</view>
			</view>
		</uni-popup>
		<!-- 没有数据显示 -->
		<view class="noData" v-if="newsList.length==0&&dataFlag">
			<image src="@/static/noList.png"></image>
			<view>暂无更多数据</view>
		</view>
	</view>
</template>

<script setup>
	import {
		reactive,
		ref
	} from "vue";
	import {
		onLoad,
		onPullDownRefresh,
		onReachBottom,
		onShareAppMessage
	} from "@dcloudio/uni-app";
	import {
		newslist,
		newstype
	} from '@/api/homePage.js'

	let tabs = ref([{
		id: 0,
		name: '全部'
	}])
	const currentTab = ref('0')
	const top = ref('0')
	const sort = ref(0)
	const loading = ref(false) //加载效果开关
	const loadingText = ref('加载中...') //加载文案
	const page = ref(1)
	const rows = ref(10)
	let newsList = ref([])
	const popup = ref()
	const dataFlag = ref(false)

	// 切换排序方式
	function swichMenu(id) {
		if (id == sort.value) {
			return
		} else {
			sort.value = id
			currentTab.value = id
			newsList.value = []
			page.value = 1
			loading.value = false
			getList()
		}
	}

	function getList() {
		dataFlag.value = false
		newslist({
			isHome: 0,
			page: page.value,
			typeId: currentTab.value
		}).then(res => {
			console.log(res);
			if (res.data.data.newslist.length == 0 && page.value > 1 && newsList.value.length > 10) {
				loadingText.value = '到底啦~'
			} else {
				newsList.value = [...newsList.value, ...res.data.data.newslist]
				loading.value = false
			}
			dataFlag.value = true
		})
	}

	function getType() {
		newstype().then(res => {
			tabs.value = [{
				id: 0,
				name: '全部'
			}, ...res.data.data]
		})
	}

	function more() {
		popup.value.open()
	}
	const type = ref('')

	function swichMore(val) {
		console.log(val);
		type.value = val
		currentTab.value = val
	}

	function determine() {
		sort.value = type.value
		currentTab.value = type.value
		newsList.value = []
		page.value = 1
		loading.value = false
		getList()
		popup.value.close()
	}

	function resize(val) {
		if (val == 'close') {
			currentTab.value = sort.value
			popup.value.close()
		} else {
			sort.value = 0
			currentTab.value = 0
			newsList.value = []
			page.value = 1
			loading.value = false
			getList()
			popup.value.close()
		}
	}

	function newsDetails(val) {
		uni.navigateTo({
			url: "/pages/homePage/newsDetails?id=" + val
		});
	}
	onLoad(() => {
		getType()
		getList()
	})
	//上拉加载
	onReachBottom(() => {
		if (newsList.value.length >= 10 * page.value) {
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
			sort.value = 0
			currentTab.value = 0
			newsList.value = []
			page.value = 1
			getList()
			uni.stopPullDownRefresh()
		}, 800)
	})
</script>

<style lang="scss" scoped>
	.newsPage {
		width: 100%;
		height: 100%;
		background-color: #FFFFFF;
		position: relative;

		/* 隐藏滚动条 */
		::-webkit-scrollbar {
			display: none;
		}

		.noData {
			text-align: center;
			margin-top: 250rpx;
			font-size: 26rpx;
			color: gray;

			image {
				width: 100%;
				// height: 190rpx;
			}
		}

		.more {
			position: absolute;
			width: 60rpx;
			height: 86rpx;
			right: 0;
			top: 0;
			background-color: #fff;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.top-menu-view {
			padding: 0 46rpx 0 26rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			overflow: auto;
			white-space: nowrap;
			width: 100%;
			background-color: #FFFFFF;
			height: 86rpx;
			line-height: 86rpx;

			.menu-topic-view {
				display: inline-block;
				white-space: nowrap;
				height: 86rpx;
				position: relative;
			}

			.menu-topic-text {
				font-size: 30rpx;
				color: #303133;
				padding: 10rpx 30rpx;
				position: relative;
				white-space: nowrap;
			}

			.menu-topic-bottom {
				position: absolute;
				bottom: 10rpx;
				width: 100%;

			}

			.menu-topic-bottom-color {
				width: 80rpx;
				height: 4rpx;
			}

			.menu-topic-act .menu-topic-bottom {
				display: flex;
				justify-content: center;
			}

			.menu-topic-act .menu-topic-bottom-color {
				background: #1C9B64;
			}

			.menu-topic-act .menu-topic-text {
				color: #1C9B64;
				font-family: PingFang SC;
				font-size: 32rpx;
				font-style: normal;
				font-weight: 600;
				line-height: normal;
			}
		}

		.newsDetails {
			width: 692rpx;
			height: auto;
			margin-left: 32rpx;
			display: flex;
			border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
			padding: 22rpx 0;
			box-sizing: border-box;

			>view {
				width: 408rpx;
				margin-right: 58rpx;

				>view {
					height: 122rpx;
					font-weight: 600;
					font-size: 30rpx;
					color: #333333;
					line-height: 40rpx;
					margin-bottom: 24rpx;
					overflow: hidden;
					-webkit-line-clamp: 3;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
				}


				>text {
					font-size: 26rpx;
					color: #88888C;
				}
			}

			>image {
				width: 228rpx;
				height: 177rpx;
				border-radius: 8rpx 8rpx 8rpx 8rpx;
			}
		}

		.popup-content {
			.title {
				width: 100%;
				display: flex;
				justify-content: space-between;
				margin: 30rpx 0 43rpx 0;

				>view {
					width: 160rpx;
				}

				>view:nth-child(2) {
					color: #010002;
					text-align: center;
					font-family: PingFang SC;
					font-size: 32rpx;
					font-style: normal;
					font-weight: 600;
					line-height: normal;
				}

				>view:nth-child(3) {
					text-align: right;
					padding-right: 24rpx;
					box-sizing: border-box;
				}
			}

			.content {
				width: 100%;
				display: flex;
				flex-wrap: wrap;
				justify-content: space-evenly;

				view {
					width: 220rpx;
					height: 80rpx;
					flex-shrink: 0;
					border-radius: 24rpx;
					background: #F6F6F8;
					line-height: 80rpx;
					color: #000;
					text-align: center;
					font-family: PingFang SC;
					font-size: 26rpx;
					font-style: normal;
					font-weight: 400;
					margin-bottom: 20rpx;
					border: 1px solid #1C9B6400;
				}

				.active {
					border: 1px solid #1C9B64;
					background: rgba(28, 155, 100, 0.10);
				}
			}

			.button {
				width: 100%;
				display: flex;
				justify-content: space-around;
				margin: 82rpx 0;

				>button:nth-child(1) {
					width: 340rpx;
					height: 80rpx;
					flex-shrink: 0;
					border-radius: 24rpx;
					border: 2rpx solid #1C9B64;
					background: #FFF;
					color: #1C9B64;
					text-align: center;
					leading-trim: both;
					text-edge: cap;
					font-family: PingFang SC;
					font-size: 32rpx;
					font-style: normal;
					font-weight: 400;
				}

				>button:nth-child(2) {
					width: 340rpx;
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