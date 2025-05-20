<template>
	<!-- 自定义标题 -->
	<HeadNav nav-background-color="#F5F5F7" backImageUrl="1" @tests="test" textContent="积分和经验值" fontSize="16"
		fontWeight="600" style="z-index: 999999;position: relative;"></HeadNav>
	<view class="integralEXPpage">
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
		<!-- 积分和经验值明细 -->
		<view class="other" v-for="item in memberGradeIntegralLogsList">
			<view>
				<view>时间：</view>
				<text>{{item.createTime}}</text>
			</view>
			<view>
				<view>描述：</view>
				<text>{{item.optDes}}</text>
			</view>
			<view>
				<view>{{currentTab == 0 ? '积分' : '经验值'}}：</view>
				<text>{{item.optType == '6' || item.optType == '9'|| item.optType == '7'? '-' : '+'}}{{item.value}}</text>
			</view>
			<view>
				<view>状态：</view>
				<text>{{item.optType == '6' || item.optType == '9'|| item.optType == '7'? '减少' : '增加'}}</text>
			</view>
		</view>
		<view v-if="loading"
			style="text-align: center;background-color: #ffffff00;color: #999;width: 100%;height: 50rpx;line-height: 50rpx;font-size: 24rpx;">
			{{loadingText}}
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive
	} from 'vue'
	import {
		onShow,
		onLoad,
		onPullDownRefresh,
		onReachBottom
	} from "@dcloudio/uni-app";
	import {
		integral,
		grade
	} from '@/api/integralPage.js'
	import {
		memberindex,
	} from '@/api/member.js'
	const page = ref(1)
	const loading = ref(false) //加载效果开关
	const loadingText = ref('加载中...') //加载文案
	// 商品排序状态栏
	let tabs = ref([{
			id: 1,
			name: '积分'
		},
		{
			id: 2,
			name: '经验值'
		}
	])
	const currentTab = ref(0) //当前排序方式
	const tabCurrent = ref('tabNum1')
	const statusBarHeight = ref(0) //排序状态栏高度
	const top = ref(0)
	let memberGradeIntegralLogsList = ref([])
	// 切换排序方式
	function swichMenu(id) {
		memberGradeIntegralLogsList.value = []
		page.value = 1
		currentTab.value = id
		tabCurrent.value = 'tabNum' + id
		getList()

	}
	//获取分类商品列表
	function getList() {
		if (currentTab.value == 0) {
			integral({
				page: page.value
			}).then(res => {
				if (res.data.data.memberGradeIntegralLogsList.length == 0 && pageValue.value > 1 && list.value
					.length >
					10) {
					loadingText.value = '到底啦~'
				} else {
					memberGradeIntegralLogsList.value = [...memberGradeIntegralLogsList.value, ...res.data.data
						.memberGradeIntegralLogsList
					]
					loading.value = false
				}
			})
		} else {
			grade({
				page: page.value
			}).then(res => {
				if (res.data.data.memberGradeIntegralLogsList.length == 0 && pageValue.value > 1 && list.value
					.length >
					10) {
					loadingText.value = '到底啦~'
				} else {
					memberGradeIntegralLogsList.value = [...memberGradeIntegralLogsList.value, ...res.data.data
						.memberGradeIntegralLogsList
					]
					loading.value = false
				}
			})
		}

	}
	let gradeIntegral = ref({})

	function getData() {
		memberindex().then(res => {
			console.log(res);
			tabs.value[0].name = '积分（' + res.data.data.member.integral + '）'
			tabs.value[1].name = '经验值（' + res.data.data.member.gradeValue + '）'
			gradeIntegral.value = res.data.data.member

		})

	}

	onShow(() => {
		page.value = 1
		memberGradeIntegralLogsList.value = []
		loading.value = false
		getData()
		getList()
	})
	//上拉加载
	onReachBottom(() => {
		if (memberGradeIntegralLogsList.value.length >= 20 * page.value) {
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
			page.value = 1
			memberGradeIntegralLogsList.value = []
			getList()
			getData()
			// getList()
			uni.stopPullDownRefresh()
		}, 800)
	})
</script>

<style lang="scss" scoped>
	.integralEXPpage {
		width: 100%;
		height: 100%;
		background-color: #F5F5F7;

		.top-menu-view {
			padding: 0 26rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: space-evenly;
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

		.other {
			width: 714rpx;
			background: #FFFFFF;
			border-radius: 24rpx 24rpx 24rpx 24rpx;
			padding: 24rpx 25rpx;
			box-sizing: border-box;
			margin: 16rpx auto 0;

			>view {
				display: flex;
				margin-bottom: 12rpx;

				>view {
					width: 132rpx;
					font-size: 24rpx;
					color: #999999;
					line-height: 28rpx;
					text-align: left;
				}

				>text {
					width: 542rpx;
					font-size: 26rpx;
					color: #333333;
					line-height: 30rpx;
					text-align: left;
				}
			}

		}
	}
</style>