<template>
	<view class="returnsExchanges">
		<HeadNav nav-background-color="#f7f7f5" backImageUrl="1" textContent="我的评论" fontSize="15" fontWeight="600"
			style="z-index: 999999;position: relative;"></HeadNav>
		<view class="content">
			<view class="itemGoods" v-for="item in productCommentList">
				<view class="goodsContent">
					<view class="goodsContentTop">
						<image :src="imageUrl + item.productImg" mode=""></image>
						<view>
							<view class="title">
								{{item.productName}}
							</view>
							<view :class="item.specInfo?'size':'font22'">
								{{item.specInfo}}
							</view>
							<view class="time">
								购买时间: {{item.createTime}}
							</view>
						</view>
					</view>

					<button @click="details(item.id)">{{flag == item.id?'关闭评论':'查看评论'}}</button>
					<button @click="delet(item.id)">删除评论</button>
				</view>
				<view :class="flag == item.id?'popAct':'pop'">
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
								<image v-for="itemImg in item.productCommentPictureList"
									@click="openPopup(itemImg.imagePath)" :src="imageUrl + itemImg.imagePath" mode="">
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
			</view>
		</view>
		<!-- 是否确认删除弹框 -->
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog :type="msgType" cancelText="取消" confirmText="确认" content="是否删除此条评价？"
				@confirm="dialogConfirm" @close="dialogClose"></uni-popup-dialog>
		</uni-popup>
		<view v-if="loading"
			style="text-align: center;color: #999;width: 100%;height: 50rpx;line-height: 50rpx;font-size: 24rpx;">
			{{loadingText}}
		</view>
		<!-- 没有数据显示 -->
		<view class="noData" v-if="productCommentList.length==0&&dataFlag">
			<image src="@/static/noList.png"></image>
			<view>暂无更多数据</view>
		</view>
		<uni-popup ref="popup" type="center">
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
		ref,
		reactive
	} from "vue";
	import {
		onShow,
		onHide,
		onReady,
		onLoad,
		onReachBottom,
		onPullDownRefresh
	} from '@dcloudio/uni-app'
	import {
		commentlist,
		deleted
	} from '@/api/member.js'
	const loading = ref(false) //加载效果开关
	const loadingText = ref('加载中...') //加载文案
	const flag = ref('')
	const page = ref(1)
	const id = ref('')
	const styles = ref({
		'borderColor': '#fff',
		'backgroundColor': '#fff',
		'height': '96rpx',
		'borderRadius': '14rpx'
	})
	const dataFlag = ref(false)

	function details(val) {
		if (val == flag.value) {
			flag.value = ''
		} else {
			flag.value = val
		}
	}
	let productCommentList = ref([])

	function getList() {
		dataFlag.value = false
		commentlist({
			page: page.value
		}).then(res => {
			if (res.data.data.productCommentList.length == 0 && page.value > 1 && productCommentList.value.length >
				30) {
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
	const alertDialog = ref()

	function delet(val) {
		id.value = val
		alertDialog.value.open()
	}
	//确认删除
	function dialogConfirm() {
		deleted({
			productCommentId: id.value
		}).then(res => {
			if (res.data.success) {
				uni.showToast({
					title: '操作成功',
					duration: 1000,
					icon: 'none'
				});
				productCommentList.value = []
				page.value = 1
				id.value = ''
				getList()
			}
		})
	}
	//取消
	function dialogClose() {
		id.value = ''
		alertDialog.value.close()
	}
	let popup = ref()
	let imgUrl = ref('')

	function openPopup(val) {
		imgUrl.value = val
		popup.value.open()
	}

	function closePopup() {
		popup.value.close()
	}

	onLoad(() => {
		productCommentList.value = []
		page.value = 1
		getList()

	})
	//上拉加载
	onReachBottom(() => {
		if (productCommentList.value.length >= 20 * page.value) {
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
			uni.stopPullDownRefresh()
			productCommentList.value = []
			loading.value = false
			page.value = 1
			getList()
		}, 800)
	})
</script>

<style lang="scss" scoped>
	.returnsExchanges {
		width: 750rpx;
		height: 100%;
		padding: 0 18rpx;
		box-sizing: border-box;

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

		.content {
			width: 100%;
			// height: 100%;

			.itemGoods {
				width: 100%;


				.goodsContent {
					width: 100%;
					height: 280rpx;
					padding: 18rpx 18rpx;
					box-sizing: border-box;
					border-radius: 24rpx 24rpx 24rpx 24rpx;
					background-color: #fff;
					position: relative;
					z-index: 99;

					.goodsContentTop {
						display: flex;

						image {
							width: 160rpx;
							height: 160rpx;
							border-radius: 24rpx 24rpx 24rpx 24rpx;
						}

						>view {
							width: 494rpx;
							margin-left: 20rpx;

							.title {
								width: 494rpx;
								// height: 36rpx;
								font-size: 30rpx;
								color: #111111;
								line-height: 30rpx;
								display: -webkit-box;
								/* 必须设置display属性为-webkit-box */
								overflow: hidden;
								/* 超出部分隐藏 */
								text-overflow: ellipsis;
								/* 显示省略号 */
								-webkit-line-clamp: 1;
								/* 限制显示两行 */
								-webkit-box-orient: vertical;
								/* 垂直方向上的换行 */
								margin-top: 10rpx;
							}

							.size {
								display: inline-block;
								// width: 252rpx;
								height: 36rpx;
								background: #F5F5F7;
								border-radius: 10rpx 10rpx 10rpx 10rpx;
								padding: 0 10rpx;
								font-size: 24rpx;
								color: #999999;
								line-height: 36rpx;
								text-align: center;
								margin: 24rpx 0 26rpx 0;
							}

							.font22 {
								// width: 252rpx;
								display: inline-block;
								padding: 0 10rpx;
								box-sizing: border-box;
								height: 36rpx;
								// background: #F5F5F7;
								border-radius: 10rpx;
								font-size: 26rpx;
								line-height: 36rpx;
								text-align: center;
								color: #999999;
								margin-top: 18rpx;
								margin-bottom: 26rpx;
							}

							.time {
								// width: 292rpx;
								height: 28rpx;
								font-size: 24rpx;
								color: #555555;
								line-height: 23rpx;
							}
						}
					}

					button {
						width: 160rpx;
						height: 56rpx;
						background: #FFFFFF;
						border-radius: 80rpx 80rpx 80rpx 80rpx;
						border: 2rpx solid #CACACC;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 24rpx;
						color: #333;
						padding: 0 0;
						float: right;
						margin-top: 24rpx;
						margin-left: 16rpx;
					}
				}

				.pop {
					width: 100%;
					height: 10rpx;
					overflow: hidden;
					background: rgba(28, 155, 100, 0.1);
					// display: none;
					transform: translateY(-200rpx);
					transition: all .2s linear;
					border-radius: 24rpx 24rpx 24rpx 24rpx;
				}

				.popAct {
					width: 100%;
					height: auto;
					background: rgba(28, 155, 100, 0.1);
					// display: block;
					transform: translateY(-20rpx);
					transition: all .2s linear;
					border-radius: 0rpx 0rpx 24rpx 24rpx;
					padding: 36rpx 18rpx 18rpx;
					box-sizing: border-box;

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
									// padding-left: 30rpx;
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

					.modeBox {
						display: flex;
						align-items: center;
						justify-content: right;

						button {
							width: 136rpx;
							height: 54rpx;
							background: #FFFFFF;
							border-radius: 10rpx 10rpx 10rpx 10rpx;
							border: 2rpx solid #CACACC;
							font-weight: 600;
							font-size: 20rpx;
							color: #999999;
							padding: 0 0;
							margin: 0 22rpx 0 0;
							display: flex;
							align-items: center;
							justify-content: center;
						}

						.active {
							background: rgba(28, 155, 100, 0.1);
							border: 2rpx solid #1C9B64;
							color: #1C9B64;
						}
					}

				}
			}
		}
	}
</style>