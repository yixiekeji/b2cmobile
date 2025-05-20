<template>
	<view class="returnsExchanges">
		<HeadNav nav-background-color="#f7f7f5" backImageUrl="1" textContent="商品评价" fontSize="15" fontWeight="600"
			style="z-index: 999999;position: relative;"></HeadNav>
		<view class="content">
			<view class="itemGoods" v-for="item,index in ordersProductList">
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
					<button @click="pingjia(item.id,index)">去评价</button>
				</view>
				<view :class="item.id == flag?'popAct':'pop'">
					<uni-forms ref="form" :rules="rules" :modelValue="formData" label-width="80px"
						style="padding: 26rpx 0 0 0;">
						<uni-forms-item label="服务类型" name="mode" required>
							<view class="modeBox">
								<button @click="chooseMode(1)" :class="formData.mode == 1 ? 'active' : ''">换货</button>
								<button @click="chooseMode(2)" :class="formData.mode == 2 ? 'active' : ''">退货</button>
							</view>
						</uni-forms-item>
						<uni-forms-item label="数量" name="number" :msgs="'可以退货数量为'+item.number" required>
							<uni-easyinput v-model="formData.number" type="number" placeholder="请输入数量" :styles="styles" />
						</uni-forms-item>
						<uni-forms-item label="问题描述" name="question" msgs="10-100字" required>
							<uni-easyinput v-model="formData.question" type="text" placeholder="请输入问题描述"
								:styles="styles" />
						</uni-forms-item>
					</uni-forms>
					<button @click="commit(item.id,item.number)">提交</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		onShow,
		onLoad,
		onPullDownRefresh,
		onReachBottom
	} from "@dcloudio/uni-app";
	import {
		backapply,
		canbackorexchange,
		doproductback,
		doproductexchange
	} from '@/api/order.js'
	const flag = ref('')
	const form = ref()
	let formData = ref({
		number: '',
		question: '',
		mode: '1'
	})
	const maxNum = ref(1)
	const id = ref('')
	let rules = ref({
		number: {
			rules: [{
					required: true,
					errorMessage: '数量必填',
				},
				{
					validateFunction: function(rule, value, data, callback) {
						console.log(data);
						if (Number(value) > maxNum.value) {
							callback('数量超出')
						}
						return true
					}
				}
			]
		},
		question: {
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
	const ordersProductList = ref([])

	function getList() {
		backapply({
			ordersId: id.value
		}).then(res => {
			console.log(res);
			ordersProductList.value = res.data.data.ordersProductList
		})
	}
	const indexid = ref('')
	function pingjia(val,index) {
		uni.navigateTo({
			url:'/pages/memberCenter/commentPage/addComment?ordersId='+ id.value+'&ordersProductId='+val
		})
	}
	
	function chooseMode(val){
		formData.value.mode = val
	}

	function commit(val,num) {
		maxNum.value = num
		console.log(form.value);
		form.value[indexid.value].validate().then(res => {
			if(formData.value.mode == 2){
				doproductback({
					ordersId: id.value,
					ordersProductId: val,
					number:formData.value.number,
					question:formData.value.question
				}).then(res => {
					if (res.data.success) {
						uni.showToast({
							title: '操作成功',
							icon: 'none'
						});
						flag.value = ''
					}
				})
			}else{
				doproductexchange({
					ordersId: id.value,
					ordersProductId: val,
					number:formData.value.number,
					question:formData.value.question
				}).then(res => {
					if (res.data.success) {
						uni.showToast({
							title: '操作成功',
							icon: 'none'
						});
						flag.value = ''
					}
				})
			}
		}).catch(err => {})

	}
	onLoad((options) => {
		id.value = options.id
		getList()
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

					button {
						width: 160rpx;
						height: 56rpx;
						background: #FFFFFF;
						border-radius: 80rpx 80rpx 80rpx 80rpx;
						border: 2rpx solid #CACACC;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 28rpx;
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
							font-size: 26rpx;
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