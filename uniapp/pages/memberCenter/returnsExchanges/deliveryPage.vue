<template>
	<view class="returnsExchanges">
		<HeadNav nav-background-color="#f7f7f5" backImageUrl="1" textContent="发货" fontSize="15" fontWeight="600"
			style="z-index: 999999;position: relative;"></HeadNav>
		<view class="content">
			<view class="itemGoods">
				<view class="goodsContent">
					<view class="goodsContentTop">
						<image :src="imageUrl + memberProductBack.productImg" mode=""></image>
						<view>
							<view class="title">
								{{memberProductBack.productName}}
							</view>
							<view class="time">
								购买时间: {{memberProductBack.createTime}}
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="logistics">
				<view class="content">
					<uni-forms ref="form" :rules="rules" :modelValue="formData" label-width="73px"
						style="padding: 16rpx 0 0 0;">
						<uni-forms-item label="快递公司" name="logisticsId" required>
							<view
								style="border: 2rpx solid rgb(229, 229, 229);height: 80rpx;border-radius: 12px;display: flex;align-items: center;background-color: #fff;">
								<uni-data-select v-model="formData.logisticsId" :localdata="companyList"
									@change="change" style="width: 100%;"></uni-data-select>
							</view>
						</uni-forms-item>
						<uni-forms-item label="快递单号" name="logisticsNumber" required>
							<uni-easyinput v-model="formData.logisticsNumber" type="text" placeholder="请输入快递单号"
								:styles="styled" />
						</uni-forms-item>
					</uni-forms>
					<button @click="commit">提交</button>
				</view>
			</view>
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
		backDeliverGoods,
		doBackDeliverGoods,
		exchangeDeliverGoods,
		doExchangeDeliverGoods
	} from '@/api/order.js'
	const flag = ref('')
	const styled = reactive({
		color: '#333',
		backgroundColor: '#fff',
		disableColor: '#F7F6F6',
		borderColor: 'rgb(229, 229, 229)',
		height: '40px',
		borderRadius: '12px',
		fontSize: '12px'
	})
	const placeholderStyle = reactive({
		fontSize: '12px',
		color: '#555'
	})
	const form = ref()
	let formData = ref({
		logisticsNumber: '',
		logisticsId: '',
		deliverName: '',
		id: ''
	})
	let companyList = ref([])
	const id = ref('')
	let rules = ref({
		logisticsId: {
			rules: [{
				required: true,
				errorMessage: '物流公司必选',
			}]
		},
		logisticsNumber: {
			rules: [{
				required: true,
				errorMessage: '快递单号必填',
			}]
		},
	})
	const styles = ref({
		'borderColor': '#fff',
		'backgroundColor': '#fff',
		'height': '96rpx',
		'borderRadius': '14rpx'
	})

	let memberProductBack = ref()


	//获取退货列表
	function getBackList() {
		if(flag.value == 'back'){
			backDeliverGoods({
				memberProductBackId: id.value
			}).then(res => {
				console.log(res)
				companyList.value = []
				res.data.data.courierCompanyList.forEach(item => {
					companyList.value.push({
						value: item.id,
						text: item.companyName
					})
				})
				memberProductBack.value = res.data.data.memberProductBack
			
			})
		}else if(flag.value == 'exchange'){
			exchangeDeliverGoods({
				memberProductExchangeId	: id.value
			}).then(res => {
				console.log(res)
				companyList.value = []
				res.data.data.courierCompanyList.forEach(item => {
					companyList.value.push({
						value: item.id,
						text: item.companyName
					})
				})
				memberProductBack.value = res.data.data.memberProductExchange
			
			})
		}
	}

	function commit() {
		form.value.validate().then(res => {
			if(flag.value == 'back'){
				doBackDeliverGoods({
					logisticsId: formData.value.logisticsId,
					logisticsNumber: formData.value.logisticsNumber,
					memberProductBackId: id.value,
				}).then(res => {
				if(res.data.success){
					uni.showToast({
						title: '操作成功',
						duration: 2000,
						icon: 'none'
					});
					uni.navigateBack({
						delta: 1
					})
				}
				})
			}else if(flag.value == 'exchange'){
				doExchangeDeliverGoods({
					logisticsId: formData.value.logisticsId,
					logisticsNumber: formData.value.logisticsNumber,
					memberProductExchangeId: id.value,
				}).then(res => {
				if(res.data.success){
					uni.showToast({
						title: '操作成功',
						duration: 2000,
						icon: 'none'
					});
					uni.navigateBack({
						delta: 1
					})
				}
				})
			}
			
		}).catch(err => {})
	}
	onLoad((options) => {
		memberProductBack.value = []
		id.value = options.id
		flag.value = options.flag
		getBackList()

	})
</script>

<style lang="scss" scoped>
	.returnsExchanges {
		width: 750rpx;
		height: 100%;
		padding: 0 18rpx;
		box-sizing: border-box;

		.content {
			width: 100%;
			height: 100%;

			.itemGoods {
				width: 100%;


				.goodsContent {
					width: 100%;
					height: 190rpx;
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
								font-size: 26rpx;
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
								font-size: 20rpx;
								color: #999999;
								line-height: 36rpx;
								text-align: center;
								margin: 24rpx 0 26rpx 0;
							}

							.time {
								width: 292rpx;
								height: 28rpx;
								font-size: 20rpx;
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
			}

			.logistics {
				width: 100%;
				height: 400rpx;
				padding: 18rpx 18rpx;
				box-sizing: border-box;
				border-radius: 24rpx 24rpx 24rpx 24rpx;
				background-color: #fff;
				margin-top: 20rpx;

				.content {
					width: 100%;
					height: 100%;
					background-color: #edf9e5;
					border-radius: 12rpx 12rpx 12rpx 12rpx;
					padding: 18rpx 18rpx;
					box-sizing: border-box;

					button {
						width: 260rpx;
						height: 80rpx;
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
					}
				}
			}
		}
	}
</style>