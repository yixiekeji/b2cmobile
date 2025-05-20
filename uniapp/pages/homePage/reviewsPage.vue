<template>
	<view class="reviewsPage">
		<HeadNav nav-background-color="#f7f7f5" backImageUrl="1" textContent="商品评价" fontSize="15" fontWeight="600"
			style="z-index: 999999;position: relative;"></HeadNav>
		<view class="top-menu-view" :style="{top:top}">
			<view class="menu-topic-view" v-for="item in tabs" :id="'tabNum'+item.id" :key="item.id"
				@click="swichMenu(item.id)">
				<view :class="currentTab==item.id ? 'menu-topic-act' : 'menu-topic'">
					<text class="menu-topic-text">{{item.name}}</text>
				</view>
			</view>
		</view>
		<!-- 评价 -->
		<view class="evaluate" v-for="item in productCommentList">
			<view class="content">
				<view>
					<view class="score">
						<image v-if="item.memberHeadImg&&item.memberHeadImg.indexOf('http')!=-1"
							style="width: 50rpx;height: 50rpx;border-radius: 50%;margin-right: 14rpx;"
							:src="item.memberHeadImg" mode=""></image>
						<image v-else-if="item.memberHeadImg"
							style="width: 50rpx;height: 50rpx;border-radius: 50%;margin-right: 14rpx;"
							:src="imageUrl + item.memberHeadImg" mode=""></image>
						<uni-icons v-else type="contact" size="40" color="#1C9B64"
							style="margin-right: 14rpx;"></uni-icons>
						<view>
							<view class="name">
								{{item.memberName}}
							</view>
							<uni-rate size="18" :value="item.grade" color="#bbb" active-color="#1C9B64" />
						</view>
					</view>
					<view class="comment">
						{{item.content}}
					</view>
					<view class="photograph">
						<image v-for="itemImg in item.productCommentPictureList" :src="imageUrl + itemImg.imagePath"
							@click="openPopup(itemImg.imagePath)" mode="">
						</image>
					</view>
					<view class="enterprise" v-if="item.replyContent">
						<text :style="{'max-height': item.textOpenFlag ? '58rpx' : ''}"
							:class="{hiddenText: item.textOpenFlag}" class="textMore"
							ref="textContainer">商家回复：{{item.replyContent}}</text>
						<text v-if="item.textOpenFlag !== null" @click="item.textOpenFlag = !item.textOpenFlag"
							class="btnMore">{{item.textOpenFlag ? '【展开】':'【收起】'}}</text>
					</view>
				</view>
			</view>
		</view>
		<view v-if="loading"
			style="text-align: center;color: #999;width: 100%;height: 50rpx;line-height: 50rpx;font-size: 24rpx;">
			{{loadingText}}
		</view>
		<view class="noData" v-if="productCommentList.length==0&&dataFlag">
			<image src="@/static/noList.png" mode=""></image>
			<view>
				暂无更多数据
			</view>
		</view>
		<uni-popup ref="popupImg" type="center">
			<view style="background-color: #fff;border-radius: 24rpx;overflow: hidden;">
				<view style="width: 100%;text-align: right;">
					<uni-icons style="line-height: 50rpx;margin-right: 10rpx;" class="close" type="closeempty"
						color="#999" size="18" @click="closePopup"></uni-icons>
				</view>
				<image :src="imageUrl + imgUrl" style="max-height: 1100rpx;" mode="widthFix"></image>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
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
	import {
		commentlist
	} from '@/api/reviews.js'
	const id = ref('')
	const page = ref(1)
	const loading = ref(false) //加载效果开关
	const loadingText = ref('加载中...') //加载文案
	let tabs = ref([{
			id: 0,
			name: '全部'
		},
		{
			id: 1,
			name: '有图'
		},
		{
			id: 2,
			name: '好评'
		},
		{
			id: 3,
			name: '中差评'
		}
	])
	const currentTab = ref('0')
	const top = ref('0')
	const productCommentList = ref([])
	const dataFlag = ref(false)

	function getList() {
		dataFlag.value = false
		commentlist({
			productId: id.value,
			page: page.value,
			type: currentTab.value
		}).then(res => {
			console.log(res);
			if (res.data.data.productCommentList.length == 0 && page.value > 1 && productCommentList.value.length >
				10) {
				loadingText.value = '到底啦~'
			} else {
				let data = res.data.data.productCommentList
				data.forEach(item => {
					if (item.replyContent.length > 51) {
						// item.textOpenFlag = true 隐藏展开按钮
						item.textOpenFlag = null
					} else {
						item.textOpenFlag = null
					}
				})
				productCommentList.value = [...productCommentList.value, ...data]
				loading.value = false
			}
			dataFlag.value = true
		})
	}
	function getCount(){
		tabs.value.forEach(item=>{
			commentlist({
				productId: id.value,
				page: page.value,
				type: item.id
			}).then(res => {
				item.name = item.name + '('+res.data.data.rowsCount +')'
				console.log(res);
				
			})
		})
		
	}
	// 切换排序方式
	function swichMenu(val) {
		page.value = 1
		productCommentList.value = []
		currentTab.value = val
		getList()
	}
	let popupImg = ref()
	let imgUrl = ref('')

	function openPopup(val) {
		imgUrl.value = val
		popupImg.value.open()
	}

	function closePopup() {
		popupImg.value.close()
	}
	onLoad((options) => {
		id.value = options.id
		page.value = 1
		currentTab.value = 0
		productCommentList.value = []
		getList()
		getCount()
	})
	//上拉加载
	onReachBottom(() => {
		if (productCommentList.value.length >= 30 * page.value) {
			page.value += 1
			loading.value = true
			loadingText.value = '加载中...'
			setTimeout(() => {
				getList()
			}, 800)
		} else if (productCommentList.value.length != 0) {
			loading.value = true
			loadingText.value = '到底啦~'
		}
	})
	//下拉刷新
	onPullDownRefresh(() => {
		setTimeout(() => {
			page.value = 1
			currentTab.value = 0
			productCommentList.value = []
			getList()
			uni.stopPullDownRefresh()
		}, 800)
	})
</script>
<style lang="scss" scoped>
	.reviewsPage {
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

		.top-menu-view {
			display: flex;
			top: 0rpx;
			white-space: nowrap;
			width: 100%;
			height: 72rpx;
			line-height: 72rpx;
			z-index: 99;
			margin-top: 16rpx;
			box-sizing: border-box;
			padding: 0 24rpx;
			
			.menu-topic-view {
				display: inline-block;
				white-space: nowrap;
				height: 14rpx;
				position: relative;
				margin-right: 58rpx;
			}

			.menu-topic-text {
				color: #1A1A1A;
				font-family: PingFang SC;
				white-space: nowrap;
				font-size: 28rpx;
				font-style: normal;
				font-weight: 400;
				line-height: normal;
			}



			.menu-topic-act .menu-topic-text {
				color: #1C9B64;
				font-family: PingFang SC;
				font-size: 16px;
				font-style: normal;
				white-space: nowrap;
				font-weight: 600;
				line-height: normal;

			}
		}

		.evaluate {
			width: 714rpx;
			background: #FFFFFF;
			border-radius: 24rpx;
			margin-left: 18rpx;
			margin-bottom: 16rpx;
			box-sizing: border-box;
			padding: 24rpx 20rpx;

			.title {
				width: 100%;
				height: 72rpx;
				display: flex;
				justify-content: space-between;
				// padding: 18rpx 18rpx;
				box-sizing: border-box;

				>view {
					>text:nth-child(1) {
						width: 56rpx;
						height: 40rpx;
						font-family: PingFang SC, PingFang SC;
						font-weight: 600;
						font-size: 28rpx;
						color: #111111;
						line-height: 33rpx;
						text-align: left;
					}

					>text:nth-child(2) {
						width: 68rpx;
						height: 26rpx;
						font-family: PingFang SC, PingFang SC;
						font-weight: 600;
						font-size: 18rpx;
						color: #999999;
						line-height: 21rpx;
						text-align: left;
						font-style: normal;
						text-transform: none;
						margin-left: 6rpx;
					}
				}
			}

			.content {
				width: 100%;

				>view {
					width: 100%;
					margin-bottom: 40rpx;

					.score {
						display: flex;
						align-items: center;

						.name {
							// width: 46rpx;
							height: 28rpx;
							font-family: PingFang SC, PingFang SC;
							font-weight: 600;
							font-size: 20rpx;
							color: #1C9B64;
							line-height: 23rpx;
							text-align: left;
						}
					}

					.comment {
						width: 100%;
						font-size: 24rpx;
						color: #333333;
						line-height: 28rpx;
						margin-top: 18rpx;
					}

					.photograph {
						margin: 18rpx 0;

						image {
							width: 146rpx;
							height: 146rpx;
							margin-right: 16rpx;
						}
					}

					.enterprise {
						width: 100%;
						font-size: 22rpx;
						color: #333333;
						position: relative;
						background: #F5F5F7;
						border-radius: 16rpx 16rpx 16rpx 16rpx;
						padding: 20rpx 20rpx;
						box-sizing: border-box;

						.hiddenText {
							overflow: hidden;
							display: block;
						}

						.hiddenText:after {
							z-index: 3;
							content: "...";
							position: absolute;
							bottom: 20rpx;
							right: 100rpx;
							width: 16rpx;
							background: #F5F5F7;
							color: #1C9B64;
						}

						.btnMore {
							color: #1C9B64;
							position: absolute;
							right: 20rpx;
							bottom: 20rpx;
							background-color: #F5F5F7;
						}
					}
				}
			}
		}
	}
</style>