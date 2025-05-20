<template>
	<view class="returnsExchanges">
		<HeadNav nav-background-color="#f7f7f5" backImageUrl="1" textContent="换货" fontSize="15" fontWeight="600"
			style="z-index: 999999;position: relative;"></HeadNav>
		<view class="content">
			<view class="itemGoods" v-for="item in list">
				<view class="goodsContent">
					<view class="orderSn">
						<view>订单号:{{item.ordersSn}}</view>
						<view v-if="item.state == 1">未处理</view>
						<view v-if="item.state == 2">审核通过</view>
						<view v-if="item.state == 3">用户发回退件</view>
						<view v-if="item.state == 4">收到退件</view>
						<view v-if="item.state == 5">发出换件</view>
						<view v-if="item.state == 6">原件退还</view>
						<view v-if="item.state == 7">不处理</view>
						<view v-if="item.state == 8">用户收货</view>
					</view>
					<view class="createTime">
						申请时间:{{item.createTime}}
					</view>
					<view class="goodsContentTop">
						<image :src="imageUrl + item.productImg" mode=""></image>
						<view>
							<view class="title">
								{{item.productName}}
							</view>
							<!-- <view class="size">
								180/96A(52)、大理石灰
							</view> -->
							<view class="time">
								购买时间: {{item.createTime}}
							</view>
						</view>
					</view>
					<button @click="details(item.id)">{{flag == item.id?'关闭':'查看'}}</button>
					<button @click="logisticsDetails(item.id)"
						v-if="item.state != 1 && item.state != 2 && item.state != 7">换件跟踪</button>
					<button @click="delivery(item.id)" v-if="item.state == 2">发货</button>
				</view>
				<view :class="flag == item.id?'popAct':'pop'">
					<view>
						<view>问题描述：</view>
						<view><rich-text :nodes="ex(item.question)"></rich-text></view>
					</view>
					<view>
						<view>换货数量：</view>
						<view>{{item.number}}</view>
					</view>
					<view>
						<view>退货状态：</view>
						<view v-if="item.state == 1">未处理</view>
						<view v-if="item.state == 2">审核通过</view>
						<view v-if="item.state == 3">用户发回退件</view>
						<view v-if="item.state == 4">收到退件</view>
						<view v-if="item.state == 5">发出换件</view>
						<view v-if="item.state == 6">原件退还</view>
						<view v-if="item.state == 7">不处理</view>
						<view v-if="item.state == 8">用户收货</view>
					</view>
					<view>
						<view>换件收货地址：</view>
						<view>{{item.addressAll }}{{item.addressInfo}}</view>
					</view>
					<view>
						<view>换件收货人姓名：</view>
						<view>{{item.changeName }}</view>
					</view>
					<view>
						<view>换件收货人电话：</view>
						<view>{{item.phone }}</view>
					</view>
					<view>
						<view>换件物流公司：</view>
						<view>{{item.logisticsName?item.logisticsName:'-' }}</view>
					</view>
					<view>
						<view>换件物流单号：</view>
						<view>{{item.logisticsNumber?item.logisticsNumber:'-' }}</view>
					</view>
					<view>
						<view>退件收货地址：</view>
						<view>{{item.addressAll2 ?item.addressAll2:'-'}}{{item.addressInfo2}}</view>
					</view>
					<view>
						<view>退件收货人姓名：</view>
						<view>{{item.changeName2?item.changeName2:'-' }}</view>
					</view>
					<view>
						<view>退件收货人电话：</view>
						<view>{{item.phone2?item.phone2:'-' }}</view>
					</view>
					<view>
						<view>退件物流公司：</view>
						<view>{{item.logisticsName2?item.logisticsName2:'-' }}</view>
					</view>
					<view>
						<view>退件物流单号：</view>
						<view>{{item.logisticsNumber2?item.logisticsNumber2:'-' }}</view>
					</view>
					<view>
						<view>处理意见：</view>
						<view>{{item.remark?item.remark:'-'}}</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="list.length == 0&&dataFlag" class="noData">
			<image src="@/static/noList.png" mode=""></image>
			<view>
				暂无更多数据
			</view>
		</view>
		<view v-if="loading"
			style="text-align: center;color: #999;width: 100%;height: 50rpx;line-height: 50rpx;font-size: 24rpx;">
			{{loadingText}}
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive
	} from 'vue';
	import {
		onShow,
		onHide,
		onReady,
		onLoad,
		onReachBottom,
		onPullDownRefresh
	} from '@dcloudio/uni-app'
	import {
		back,
		exchange
	} from '@/api/order.js'
	const flag = ref(false)

	let formData = ref({
		num: '',
		de: '2',
		mode: '1'
	})
	const id = ref('')
	let rules = ref({
		num: {
			num: [{
					required: true,
					errorMessage: '数量必填',
				},
				{
					validateFunction: function(rule, value, data, callback) {
						if (Number(value) > 100) {
							callback('数量超出')
						}
						return true
					}
				}
			]
		},
		de: {
			rules: [{
					required: true,
					errorMessage: '问题描述必填',
				},
				{
					minLength: 10,
					errorMessage: '至少需要10字符',
				},
				{
					maxLength: 100,
					errorMessage: '问题描述字符长度超出',
				}
			]
		},
	})
	const styles = ref({
		'borderColor': '#fff',
		'backgroundColor': '#fff',
		'height': '96rpx',
		'borderRadius': '14rpx'
	})

	const top = ref('0')
	const page = ref(1)
	const loading = ref(false) //加载效果开关
	const loadingText = ref('加载中...') //加载文案
	let list = ref([])
	const dataFlag = ref(false)
	//获取退货列表
	function getBackList() {
		dataFlag.value = false
		exchange({
			page: page.value
		}).then(res => {
			console.log(res)
			if (res.data.data.memberProductExchangeList.length == 0 && page.value > 1 && list.value.length > 10) {
				loadingText.value = '到底啦~'
			} else {
				list.value = [...list.value, ...res.data.data.memberProductExchangeList]
				loading.value = false
			}
			dataFlag.value = true
		})
	}



	function details(val) {
		if (val == flag.value) {
			flag.value = ''
		} else {
			flag.value = val
		}
	}

	function logisticsDetails(val) {
		uni.navigateTo({
			url: '/pages/memberCenter/returnsExchanges/logisticsInformation?id=' + val + '&flag=' + 'exchange'
		})
	}

	function delivery(val) {
		uni.navigateTo({
			url: '/pages/memberCenter/returnsExchanges/deliveryPage?id=' + val + '&flag=' + 'exchange'
		})
	}

	function ex(html) {
		let newContent = html.replace(/<img[^>]*>/gi, function(match, capture) {
			match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
			match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
			match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
			return match;
		});
		newContent = newContent.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>');
		newContent = newContent.replace(/style="[^"]+"/gi, function(match, capture) {
			match = match.replace(/width:[^;]+;/gi, 'width:100%;').replace(/width:[^;]+;/gi, 'width:100%;');
			return match;
		});
		newContent = newContent.replace(/<br[^>]*\/>/gi, '');
		newContent = newContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;"');

		return newContent;
	}
	onShow(() => {
		list.value = []
		page.value = 1
		getBackList()

	})
	//上拉加载
	onReachBottom(() => {
		if (list.value.length >= 20 * page.value) {
			page.value += 1
			loading.value = true
			loadingText.value = '加载中...'
			setTimeout(() => {
				getBackList()
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
			list.value = []
			loading.value = false
			page.value = 1
			getBackList()

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
					height: 372rpx;
					padding: 18rpx 18rpx;
					box-sizing: border-box;
					border-radius: 24rpx 24rpx 24rpx 24rpx;
					background-color: #fff;
					position: relative;
					z-index: 99;

					.orderSn {
						display: flex;
						justify-content: space-between;

						view:nth-child(1) {
							height: 36rpx;
							font-size: 26rpx;
							color: #111111;
							line-height: 36rpx;
							text-align: left;
						}

						view:nth-child(2) {
							height: 40rpx;
							font-weight: 400;
							font-size: 28rpx;
							color: #A1A1A6;
							line-height: 40rpx;
							text-align: right;
						}
					}

					.createTime {
						height: 36rpx;
						font-size: 26rpx;
						color: #111111;
						line-height: 36rpx;
						text-align: left;
					}

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
								margin-top: 30rpx;
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

							.time {
								// width: 292rpx;
								height: 28rpx;
								font-size: 24rpx;
								color: #555555;
								line-height: 23rpx;
								margin-top: 30rpx;
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

					>view {
						width: 100%;
						line-height: 46rpx;
						display: flex;

						>view:nth-child(1) {
							width: 200rpx;
							font-size: 24rpx;
							color: #999999;
							text-align: left;
						}

						>view:nth-child(2) {
							// width: 368rpx;
							font-size: 24rpx;
							color: #333333;
							text-align: left;
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
						margin-top: 24rpx;
						margin-right: 0rpx;
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