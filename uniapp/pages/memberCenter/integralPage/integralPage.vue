<template>
	<view class="pointsMall">
		<!-- 自定义导航栏 -->
		<HeadNav nav-background-color="#FFFFFF" backImageUrl="1" textContent="积分商城" fontSize="16" fontWeight="600"
			style="z-index: 999999;position: relative;"></HeadNav>
		<!-- 轮播图 -->
		<view class="swiperBox" v-if="bannerList.length != 0">
			<uni-swiper-dot :info="bannerList" :current="current" field="content" :mode="modes"
				:dots-styles="dotsStyles">
				<swiper class="swiper-box" autoplay circular @change="change" style="background-color: #00000000;">
					<swiper-item v-for="(item,index) in bannerList" :key="index">
						<image @click="pageJump(item.linkUrl)" :src="imageUrl+item.image"
							style="width: 100%;height: 100%;"></image>
					</swiper-item>
				</swiper>
			</uni-swiper-dot>
		</view>
		<view class="functionBlock">
			<view class="per">
				<view v-if="issignData.member" class="login">
					<text>{{issignData.member.integral}} </text>
					<text> 积分</text>
				</view>
				<view v-else class="nologin" @click="jumpLogin">
					<uni-icons type="person-filled" color="#1C9B64" size="30"></uni-icons>
					<text>登录</text>
				</view>
				<view>
					登录领积分
				</view>

			</view>
			<view class="border">

			</view>
			<view class="signin">
				<view @click="dosign">
					<view>
						<uni-icons type="calendar" color="#1C9B64" size="30"></uni-icons>
						<text>每日签到</text>
					</view>
					<view v-if="issignData.isSign == '0'">
						今日签到+10
					</view>
					<view v-else>
						已签到
					</view>
				</view>
				<image src="@/static/home/member.png" mode=""></image>
			</view>
		</view>
		<!-- 商品分类折叠面板 -->
		<view class="goodsContent">
			<view class="classification">
				<view :class="classificationFlag?'classificationEvery':'classificationAllEvery'"
					@click="classification($event)">
					<text :class="cateId == 0 ? 'active' : ''" id="0">全部</text>
					<text :class="cateId == item.id ? 'active' : ''" :id="item.id"
						v-for="item,index in shopCates">{{item.name}}</text>
				</view>
				<view class="classificationAll" v-if="!classificationFlag">
					全部分类
				</view>
				<uni-icons @click="open" :type="openFlag?'bottom':'top'" size="22"></uni-icons>
			</view>
		</view>
		<view class="goodsDetail">
			<view v-for="item in integrals" @click="jumpDetails(item.id)">
				<image :src="imageUrl + item.image" mode=""></image>
				<view>{{item.name}}</view>
				<view>
					<view>限<text v-if="item.gradeValue == 1">
							注册会员
						</text>
						<text v-if="item.gradeValue == 2">
							铜牌会员
						</text>
						<text v-if="item.gradeValue == 3">
							银牌会员
						</text>
						<text v-if="item.gradeValue == 4">
							金牌会员
						</text>
						<text v-if="item.gradeValue == 5">
							钻石会员
						</text>
					</view>
				</view>
				<view>
					<view>原价 ￥<text>{{item.marketPrice}}</text></view>
					<view>
						已兑换:
						<text>{{item.saleNum}}</text>
						人
					</view>
				</view>
				<view>
					<view>
						{{item.price}}积分<text v-if="item.isWithMoney == '1'">+￥{{item.priceMoney}}</text>
					</view>
					<button>兑换</button>
				</view>
			</view>
		</view>
		<view v-if="integrals.length == 0&&dataFlag" class="noData">
			<image src="@/static/noList.png" mode=""></image>
			<view>
				暂无更多数据
			</view>
		</view>
		<view v-if="loading"
			style="text-align: center;color: #999;width: 100%;height: 50rpx;line-height: 50rpx;font-size: 24rpx;">
			{{loadingText}}
		</view>
		<view style="width: 100%;height: 20rpx;">

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
		integralBanner,
		integralType,
		jifen,
		issign,
		sign
	} from '@/api/integralPage.js'
	const pageSize = ref()

	// 轮播图内容
	let bannerList = ref([])
	const current = ref(0)
	// 轮播图底部页面指示点
	let modes = ref('dot')
	const dotsStyles = reactive({
		backgroundColor: 'rgba(0, 0, 0,0.3)',
		border: '0px rgba(83, 200, 249,0.3) solid',
		color: '#fff',
		selectedBackgroundColor: '#1C9B64',
		selectedBorder: '2rpx solid #FFFFFF'
	})
	const openFlag = ref(false)
	const classificationFlag = ref(true)
	const cateId = ref('0')
	let shopCates = ref([])

	const page = ref(1)
	const loading = ref(false) //加载效果开关
	const loadingText = ref('加载中...') //加载文案
	let integrals = ref([])
	const dataFlag = ref(false)
	// 分类导航折叠面板
	function classification(e) {
		if (e.target.id) {
			cateId.value = e.target.id
			integrals.value = []
			page.value = 1
			loading.value = false
			getList()
		}
	}

	function open() {
		openFlag.value = !openFlag.value
		classificationFlag.value = !classificationFlag.value
	}

	function getIntegralType() {
		integralType().then(res => {
			shopCates.value = res.data.data
		})
	}

	function change(e) {
		current.value = e.detail.current;
	}

	function getBannerList() {
		integralBanner().then(res => {
			bannerList.value = res.data.data
		})
	}

	//获取分类商品列表
	function getList() {
		dataFlag.value = false
		jifen({
			type: cateId.value,
			sort: 0,
			page: page.value
		}).then(res => {
			pageSize.value = res.data.data.pageSize
			if (res.data.data.integrals.length == 0 && page.value > 1) {
				loadingText.value = '到底啦~'
			} else {
				integrals.value = [...integrals.value, ...res.data.data.integrals]
				loading.value = false
			}
			dataFlag.value = true
		})
	}
	let issignData = ref({})

	function getissign() {
		issign().then(res => {
			issignData.value = res.data.data
		})
	}

	function dosign() {
		sign().then(res => {
			if (res.data.success) {
				uni.showToast({
					icon: 'none',
					duration: 3000,
					title: `签到成功`
				});
				getissign()
			}
		})
	}

	function jumpLogin() {

		uni.navigateTo({
			url: '/pages/loginInterface/passwordLogin'
		})
	}
	// 跳转详情页
	function jumpDetails(val) {
		uni.navigateTo({
			url: "/pages/memberCenter/integralPage/integralDetails?id=" + val
		});
	}
	function pageJump(val){
		uni.navigateTo({
			url: val
		});
	}
	onShow(() => {
		page.value = 1
		cateId.value = 0
		integrals.value = []
		loading.value = false
		getList()
		getissign()
		getBannerList()
		getIntegralType()
	})
	//上拉加载
	onReachBottom(() => {
		if (integrals.value.length >= pageSize.value * page.value) {
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
			cateId.value = 0
			integrals.value = []
			getList()
			// getList()
			uni.stopPullDownRefresh()
		}, 800)
	})
</script>

<style lang="scss" scoped>
	.pointsMall {
		width: 750rpx;
		height: 100%;

		.noData {
			margin-top: 250rpx;
			font-size: 22rpx;
			color: gray;
			text-align: center;

			image {
				width: 100%;
			}
		}

		.swiperBox {
			height: 360rpx;
			width: 702rpx;
			margin: 16rpx auto;
			border-radius: 20rpx;
			overflow: hidden;
			uni-swiper,.uni-swiper__warp,uni-swiper-item{
				height: 100%!important;
				border-radius: 20rpx;
			}
			.swiper-box{
				height: 360rpx!important;
			}
		}

		.functionBlock {
			width: 702rpx;
			height: 120rpx;
			margin: 16rpx auto;
			background: #FFFFFF;
			border-radius: 24rpx 24rpx 24rpx 24rpx;
			display: flex;

			.per {
				width: 350rpx;
				height: 120rpx;
				padding: 22rpx 24rpx;
				box-sizing: border-box;

				.nologin {
					display: flex;
					align-items: center;

					text {
						width: 72rpx;
						height: 50rpx;
						font-weight: 600;
						font-size: 36rpx;
						color: #1C9B64;
						line-height: 50rpx;
						text-align: left;

					}
				}

				.login {
					display: flex;
					align-items: center;

					text:nth-child(1) {
						height: 50rpx;
						font-weight: 600;
						font-size: 36rpx;
						color: #FFC25F;
						line-height: 50rpx;
						text-align: left;
						text-indent: 10rpx;
					}

					text:nth-child(2) {
						height: 50rpx;
						font-weight: 600;
						font-size: 36rpx;
						color: #000;
						line-height: 50rpx;
						text-align: left;

					}
				}

				>view:nth-child(2) {
					// width: 110rpx;
					height: 30rpx;
					font-size: 22rpx;
					color: #999999;
					line-height: 30rpx;
					text-align: left;
					text-indent: 10rpx;
				}
			}

			.border {
				width: 2rpx;
				height: 120rpx;
				background: #634310;
				border-radius: 0rpx 0rpx 0rpx 0rpx;
				opacity: 0.05;
			}

			.signin {
				width: 350rpx;
				height: 120rpx;
				padding: 22rpx 24rpx;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				justify-content: space-between;

				>view {
					width: 100%;
					height: 100%;

					>view:nth-child(1) {
						display: flex;
						align-items: center;

						text {
							height: 50rpx;
							font-weight: 600;
							font-size: 36rpx;
							color: #1C9B64;
							line-height: 50rpx;
							text-align: left;

						}
					}

					>view:nth-child(2) {
						// width: 110rpx;
						// height: 30rpx;
						font-size: 22rpx;
						color: #FF6565;
						// line-height: 30rpx;
						text-align: left;
						text-indent: 10rpx;
					}
				}

				image {
					width: 70rpx;
					height: 60rpx;
				}
			}
		}

		.goodsContent {
			background-image: linear-gradient(#fff, #f7f7f5);
			background-size: 100% 300rpx;
			background-repeat: no-repeat;
			background-color: #f7f7f5;
			border-top-left-radius: 30rpx;
			border-top-right-radius: 30rpx;

			// top:88rpx;
			.classification {
				height: 88rpx;
				width: 100%;
				display: flex;
				align-items: center;
				flex-wrap: nowrap;
				z-index: 99;
				background-color: #fff;
				position: relative;

				.classificationEvery {
					width: 90%;
					white-space: nowrap;
					// overflow-x: scroll;
					overflow: hidden;
					display: flex;
					flex-wrap: nowrap;

					text {
						background: #F5F5F7;
						border-radius: 20rpx;
						font-size: 28rpx;
						line-height: 30rpx;
						padding: 7rpx 17rpx;
						margin: 0 12rpx;
						color: #666;
						box-sizing: border-box;
						white-space: nowrap;
					}

					.active {
						background-color: #1C9B64;
						color: #fff;
					}
				}

				.classificationAllEvery {
					width: 100%;
					position: absolute;
					top: 88rpx;
					display: flex;
					flex-wrap: wrap;
					background-color: #fff;
					border-bottom-left-radius: 30rpx;
					border-bottom-right-radius: 30rpx;
					z-index: 99;

					text {
						background: #F5F5F7;
						border-radius: 30rpx;
						font-size: 30rpx;
						// line-height: 88rpx;
						padding: 7rpx 17rpx;
						margin: 12rpx 12rpx;
						color: #666;
						box-sizing: border-box;
					}

					.active {
						background-color: #1C9B64;
						color: #fff;
					}
				}

				.classificationAll {
					width: 90%;
					padding-left: 12rpx;
					font-size: 32rpx;
					color: #454545;
				}
			}
		}

		.goodsDetail {
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			overflow: auto;

			>view {
				width: 350rpx;
				background-color: white;
				margin: 14rpx 12rpx 0 12rpx;

				>image {
					width: 350rpx;
					height: 350rpx;
				}

				>view:nth-child(3) {
					display: flex;
					justify-content: space-between;
					width: 100%;
					padding: 8rpx 17rpx;
					box-sizing: border-box;
					align-items: center;

					>view:nth-child(1) {
						font-size: 28rpx;
						color: #DC3A2F;
						font-weight: 600;

						text {
							// font-size: 34rpx;
						}
					}

					>view:nth-child(2) {
						font-size: 26rpx;
						display: flex;
						color: #999;
					}

				}

				>view:nth-child(2) {
					height: 76.8rpx;
					padding: 0 17rpx;
					box-sizing: border-box;
					font-size: 30rpx;
					line-height: 38.4rpx;
					display: -webkit-box;
					/* 必须设置display属性为-webkit-box */
					overflow: hidden;
					/* 超出部分隐藏 */
					text-overflow: ellipsis;
					/* 显示省略号 */
					-webkit-line-clamp: 2;
					/* 限制显示两行 */
					-webkit-box-orient: vertical;
					/* 垂直方向上的换行 */
				}

				>view:nth-child(4) {
					padding: 10rpx 17rpx;
					box-sizing: border-box;
					font-size: 26rpx;
					color: #999999;
					display: flex;
					justify-content: space-between;

					view:nth-child(2) {
						// margin-right: 16rpx;
						text {
							color: #1C9B64;
						}
					}
				}

				>view:nth-child(5) {
					padding: 10rpx 17rpx;
					box-sizing: border-box;
					font-size: 26rpx;
					color: #999999;
					display: flex;
					align-items: center;
					justify-content: space-between;

					>view:nth-child(1) {
						font-size: 28rpx;
						color: #DC3A2F;
						font-weight: 600;

						text {
							// font-size: 34rpx;
						}
					}

					button {
						width: 106rpx;
						height: 48rpx;
						background: #1C9B64;
						border-radius: 36rpx 36rpx 36rpx 36rpx;
						font-size: 22rpx;
						color: #FFFFFF;
						display: flex;
						align-items: center;
						justify-content: center;
						float: left;
						margin: 10rpx 0 10rpx 17rpx;
					}
				}
			}
		}
	}
</style>