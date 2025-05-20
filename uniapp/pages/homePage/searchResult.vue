<template>
	<view class="searchResult">
		<!-- 自定义导航栏 -->
		<HeadNav nav-background-color="#f5f5f7" backImageUrl="3" @searched="search" :searchValues="searchValues">

		</HeadNav>
		<!-- 商品排序方式 -->
		<view class="top-menu-view" :style="{top:top}">
			<view class="menu-topic-view" v-for="item in tabs" :id="'tabNum'+item.id" :key="(item.id - 1)"
				@click="swichMenu(item.id - 1)">
				<view :class="currentTab==(item.id - 1) ? 'menu-topic-act' : 'menu-topic'">
					<text class="menu-topic-text">{{item.name}}

					</text>
					<view class="imgBox" v-if="item.name == '价格'">
						<view :class="sort == 3 ? 'topActive' : 'top'"></view>
						<view :class="sort == 4 ? 'bottomActive' : 'bottom'"></view>
					</view>
					<view class="menu-topic-bottom">
						<view class="menu-topic-bottom-color"></view>
					</view>
				</view>
			</view>
		</view>
		<!-- 商品展示列表 -->
		<view class="goodsList" v-if="list.length!=0">
			<view class="goodsEvery" v-for="item in list" @click="jumpDetail(item.id)">
				<image :src="imageUrl + item.masterImg" mode=""></image>
				<text class="goodsTitle">
					{{ item.name }}
				</text>
				<text class="goodsPrice"><text>￥</text>{{ item.mallPrice }}</text>
			</view>
		</view>
		<view v-if="loading"
			style="text-align: center;color: #999;width: 100%;height: 50rpx;line-height: 50rpx;font-size: 24rpx;">
			{{loadingText}}
		</view>
		<!-- 没有数据显示 -->
		<view class="noData" v-if="list.length==0&&dataFlag">
			<image src="@/static/noList.png"></image>
			<view>暂无更多数据</view>
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
		searchList
	} from '@/api/search.js'

	// 商品排序状态栏
	const tabs = reactive([{
			id: 1,
			name: '综合'
		},
		{
			id: 2,
			name: '销量'
		},
		{
			id: 3,
			name: '上新'
		},
		{
			id: 4,
			name: '价格'
		}
	])
	const currentTab = ref(0) //当前排序方式
	const tabCurrent = ref('tabNum1')
	const statusBarHeight = ref(0) //排序状态栏高度
	const top = ref(0)
	const page = ref(1)
	const searchValue = ref('')
	const pageValue = ref(1)
	const sort = ref(0)
	let list = ref([])
	const sortId = ref('')
	const loading = ref(false) //加载效果开关
	const loadingText = ref('加载中...') //加载文案
	const searchValues = ref('')
	const dataFlag = ref(false)
	// 切换排序方式
	function swichMenu(id) {
		if (id == sort.value && id == 3) {
			sort.value = 4
		} else {
			sort.value = id
		}
		list.value = []
		pageValue.value = 1
		getList()
		currentTab.value = id
		tabCurrent.value = 'tabNum' + id
	}
	//获取搜索数据
	function getList() {
		dataFlag.value = false
		searchList({
			keyword: searchValue.value,
			page: pageValue.value,
			sort: sort.value
		}).then(res => {
			console.log(res.data.data.producList);
			// this.list = [...this.list, ...res.data.data.searchShopProducts]
			if (res.data.data.producList.length == 0 && pageValue.value > 1 && list.value.length > 10) {
				loadingText.value = '到底啦~'
			} else {
				list.value = [...list.value, ...res.data.data.producList]
				console.log(list.value.length);
				loading.value = false
			}
			dataFlag.value = true
		})
	}

	function search(val) {
		list.value = []
		pageValue.value = 1
		searchValue.value = val
		if (uni.getStorageSync("token")) {} else {
			let time = Date.now()
			let searchLists = JSON.parse(uni.getStorageSync("searchLists"))
			searchLists.unshift({
				keyword: val,
				id: time
			})
			uni.setStorageSync("searchLists", JSON.stringify(searchLists))
		}
		getList()
	}
	onLoad((option) => {
		console.log(option);
		searchValue.value = option.data
		searchValues.value = option.data
		getList()
	})
	// 跳转到商品详情页1
	function jumpDetail(id) {
		uni.navigateTo({
			url: '/pages/homePage/goodsDetail?id=' + id
		});
	}

	//上拉加载
	onReachBottom(() => {
		if (list.value.length >= 20 * pageValue.value) {
			pageValue.value += 1
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
			pageValue.value = 1
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
			text-align: center;
			margin-top: 250rpx;
			font-size: 26rpx;
			color: gray;

			image {
				width: 100%;
				// height: 190rpx;
			}
		}

		.searchBox {
			width: 100%;
			font-size: 24rpx;
			height: 56rpx;
			line-height: 56rpx;
			background: #FFFFFF;
			border-radius: 29rpx;
			border: 1rpx solid #1C9B64;
			margin-bottom: 10rpx;
			padding-left: 24rpx;
			box-sizing: border-box;
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
			height: 86rpx;
			line-height: 86rpx;
			border-top: 1rpx solid #d8dbe6;

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
			}

			.menu-topic-bottom {
				position: absolute;
				bottom: 0;
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
				font-weight: 600;
			}
		}

		.goodsList {
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			bottom: var(--window-bottom);

			.goodsEvery {
				width: 350rpx;
				height: 500rpx;
				background-color: #fff;
				border-radius: 20rpx;
				overflow: hidden;
				margin-top: 14rpx;
				margin-left: 18rpx;

				image {
					width: 350rpx;
					height: 350rpx;
					background-color: #00000000;
				}

				.goodsTitle {
					height: 76rpx;
					font-size: 28rpx;
					color: #333;
					line-height: 38rpx;
					line-clamp: 2;
					overflow: hidden; //超出文本隐藏
					text-overflow: ellipsis; ///超出部分省略号显示
					display: -webkit-box; //弹性盒模型
					-webkit-box-orient: vertical; //上下垂直
					-webkit-line-clamp: 2; //自定义行数

				}

				.goodsPrice {
					color: #DC3A2F;
					font-size: 34rpx;
					font-weight: 600;
					line-height: 56rpx;

					text {
						font-size: 24rpx;
						font-weight: 400;
					}
				}
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
		}

		.bottomActive {
			width: 0;
			height: 0;
			border-top: 10rpx solid #1C9B64;
			border-left: 6rpx solid transparent;
			border-right: 6rpx solid transparent;
		}
	}
</style>