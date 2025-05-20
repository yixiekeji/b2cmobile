<template>
	<view class="cartBox">
		<HeadNav nav-background-color="#f7f7f5" backImageUrl="0" @tests="test" textContent="购物车" fontSize="15"
			fontWeight="600" style="z-index: 999999;position: relative;"></HeadNav>
		<!-- 购物车商品列表 -->
		<view class="goodsList">
			<!-- 加购商品的信息 -->
			<view class="detailBox" v-for="item,index in goodList" v-if="goodList.length!=0">
				<!-- 多选框 -->
				<view style="width: 30rpx;height: 30rpx;margin-right: 15rpx;" @click="changeitem(item)">
					<image v-if="item.checked == 1" src="@/static/cart/yes.png" mode=""
						style="width: 100%;height: 100%;"></image>
					<image v-else src="@/static/cart/no.png" mode="" style="width: 100%;height: 100%;"></image>
				</view>
				<!-- 商品图 -->
				<image @click="jumpDetails(item.productId)" :src="imageUrl+item.masterImg"></image>
				<!-- 商品介绍 -->
				<view class="fontBox">
					<view class="font1">{{item.name}}</view>
					<view :class="item.specInfo?'font2':'font22'">{{item.specInfo}}</view>
					<view class="font3">
						<view>￥{{item.mallPrice}}</view>
						<uni-number-box v-model="item.count" @change="addShopCarts($event,item.count,item.id)" />
					</view>
				</view>
			</view>
		</view>
		<!-- 底部结算 -->
		<view class="summary" v-if="flag">
			<!-- 商品全选 -->
			<view class="checkbox" style="font-size: 30rpx;display: flex;align-items: center;" @click="selectAll">
				<view style="width: 30rpx;height: 30rpx;margin-right: 5rpx;">
					<image v-if="allChecked == 1" src="@/static/cart/yes.png" mode="" style="width: 100%;height: 100%;">
					</image>
					<image v-else src="@/static/cart/no.png" mode="" style="width: 100%;height: 100%;"></image>

				</view>
				全选
			</view>
			<!-- 商品总金额 -->
			<view class="totalBox">
				<view>
					<view class="total"><text>合计:</text><text>￥</text><text>{{totalPrice}}</text></view>
					<view>不含运费</view>
				</view>
				<button class="settlement" @click="settlement">结算</button>
			</view>
		</view>
		<view class="wdl" v-if="flag&&goodList.length==0&&dataFlag">
			<image src="@/static/wdl.png"></image>
			<view>
				您的购物车还没有任何商品哦，去逛逛~
			</view>
			<button @click="jumpHome()">去逛逛</button>
		</view>
		<view class="wdl" v-if="!flag">
			<image src="@/static/wdl.png"></image>
			<view>
				您还没有登录，去登录~
			</view>
			<button @click="jumpLogin('/pages/loginInterface/passwordLogin')">去登录</button>
		</view>
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog :type="msgType" cancelText="取消" confirmText="确认" content="确认删除此条商品吗?"
				@confirm="dialogConfirm" @close="dialogClose"></uni-popup-dialog>
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
		onTabItemTap
	} from "@dcloudio/uni-app";
	import {
		cartList,
		cartcheckedAll,
		cartchecked,
		reduceOrdersCart,
		addOrdersCart
	} from '@/api/cart.js'
	import {
		order
	} from "@/store/order";
	let goodList = ref([])
	let checkList = ref([]) //选中值
	const allChecked = ref(false) //是否全选
	const totalPrice = ref(0)
	const id = ref('')
	const alertDialog = ref()
	const flag = ref(false)
	const dataFlag = ref(false)
	// 获取购物车列表
	function getCartList() {
		dataFlag.value = false
		cartList().then(res => {
			console.log(res);
			if (res.data.success) {
				totalPrice.value = res.data.data.checkedCartAmount
				goodList.value = res.data.data.ordersCartList
				const cartList = goodList.value.every(item => {
					return item.checked == 1
				})
				if (cartList) {
					allChecked.value = 1
				} else {
					allChecked.value = 0
				}
				flag.value = true
			} else {
				goodList.value = []
				totalPrice.value = 0
				flag.value = false
			}
			dataFlag.value = true
		})
	}
	//单选
	function changeitem(item) {
		cartchecked({
			checked: item.checked == 0 ? 1 : 0,
			id: item.id
		}).then(res => {
			getCartList()
		})
	}
	//全选，全不选
	function selectAll() {
		cartcheckedAll({
			checked: allChecked.value == 0 ? 1 : 0
		}).then(res => {
			getCartList()
		})
	}
	// 购物车商品数量增减
	function addShopCarts(event, count, val) {
		console.log(event, count, val);
		// return
		if (count == 0) {
			alertDialog.value.open()
			id.value = val
		} else {
			if (event.type == 'plus') {
				addOrdersCart({
					id: val
				}).then(res => {
					getCartList()
				})
			} else {
				reduceOrdersCart({
					id: val
				}).then(res => {
					getCartList()
				})
			}
		}

	}
	//确认
	function dialogConfirm() {
		reduceOrdersCart({
			id: id.value
		}).then(res => {
			getCartList()
		})
	}

	function dialogClose() {
		getCartList()
		alertDialog.value.close()
	}

	function jumpDetails(val) {
		uni.navigateTo({
			url: '/pages/homePage/goodsDetail?id=' + val
		});
	}
	function jumpLogin(val){
		uni.navigateTo({
			url: val
		});
	}
	function jumpHome(){
		uni.switchTab({
			url: "/pages/homePage/homepage"
		});
	}
	//提交订单结算
	function settlement() {
		let result = goodList.value.some((item) => {
			return item.checked == 1
		});
		if (goodList.value.length == 0) {
			uni.showToast({
				icon: 'none',
				duration: 3000,
				title: '购物车没有商品哦~'
			});
		} else if (!result) {
			uni.showToast({
				icon: 'none',
				duration: 3000,
				title: '请选择要购买的商品~'
			});
		} else if (result) {

			// let local = encodeURIComponent((window.location.href.split('#')[0].indexOf('?') == -1 ? window.location
			// 		.href.split('#')[0] : window.location.href.split('#')[0].split('?')[0]) +
			// 	'#/pages/shoppingCart/confirmOrder')
			// let appid = "wx1874315b459ddf26"
			// window.location.href =
			// 	"https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
			// 	appid +
			// 	"&redirect_uri=" +
			// 	local +
			// 	"&response_type=code&scope=snsapi_base&state=1#wechat_redirect"
			order().resize()
			uni.navigateTo({
				url: "/pages/shoppingCart/confirmOrder"
			});
		}
	}

	onTabItemTap(() => {
		getCartList()
	})
	onShow(() => {
		getCartList()
	})
</script>

<style lang="scss" scoped>
	.uni-checkbox-input {
		&:hover {
			border-color: red !important;
		}
	}

	.cartBox {
		width: 100%;
		padding-bottom: 50rpx;

		.wdl {
			background-color: #f7f7f5;
			width: 100%;
			height: 100%;
		
			image {
				margin: 50rpx 175rpx;
				width: 400rpx;
				height: 400rpx;
			}
		
			view {
				color: #999;
				text-align: center;
			}
		
			button {
				width: 270rpx;
				height: 72rpx;
				border: 1rpx solid #DC3A2F;
				background-color: #DC3A2F;
				border-radius: 36rpx;
				margin: 0rpx auto;
				font-size: 32rpx;
				color: #fff;
				text-align: center;
				line-height: 72rpx;
				margin-top: 40rpx;
			}
		}
		.goodsList {
			padding-bottom: 180rpx;
			// padding-top: 50rpx;
			box-sizing: border-box;
			width: 714rpx;
			margin: 0 auto;

			.detailBox {
				display: flex;
				align-items: center;
				margin-top: 16rpx;
				background: #FFFFFF;
				border-radius: 24rpx;
				padding: 24rpx 20rpx;

				image {
					width: 160rpx;
					height: 160rpx;
				}

				.fontBox {
					width: 448rpx;
					margin-left: 20rpx;

					.font1 {
						line-clamp: 1;
						overflow: hidden; //超出文本隐藏
						text-overflow: ellipsis; ///超出部分省略号显示
						display: -webkit-box; //弹性盒模型
						-webkit-box-orient: vertical; //上下垂直
						-webkit-line-clamp: 1; //自定义行数
						font-size: 32rpx;
					}

					.font2 {
						// width: 252rpx;
						display: inline-block;
						padding: 0 10rpx;
						box-sizing: border-box;
						height: 36rpx;
						background: #F5F5F7;
						border-radius: 10rpx;
						font-size: 28rpx;
						line-height: 36rpx;
						text-align: center;
						color: #999999;
						margin-top: 18rpx;
						margin-bottom: 26rpx;
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

					.font3 {
						display: flex;
						justify-content: space-between;
						align-items: center;

						view {
							font-weight: 600;
							font-size: 36rpx;
							color: #DC3A2F;

							text {
								font-size: 24rpx;
								color: #DC3A2F;
							}
						}

						text {
							font-size: 24rpx;
							color: #999999;
						}
					}
				}
			}
		}

		.summary {
			width: 100%;
			border-top: 0.33px solid #CACACC;
			display: flex;
			justify-content: space-between;
			padding: 0 18rpx;
			align-items: center;
			height: 86rpx;
			background-color: #fff;
			position: fixed;
			bottom: var(--window-bottom);
			z-index: 9999;
			box-sizing: border-box;

			.totalBox {
				display: flex;
				align-items: center;

				view {
					margin-right: 10rpx;

					view:nth-child(1) {
						font-size: 36rpx;
						font-weight: 600;
						color: #1C9B64;

						text:nth-child(1) {
							color: #333;
							font-size: 32rpx;
						}

						text:nth-child(2) {
							font-size: 26rpx;
						}
					}

					view:nth-child(2) {
						font-size: 26rpx;
						color: #999;
						transform: scale(0.9);
						text-align: right;
					}
				}

				.settlement {
					background: #1C9B64;
					border-radius: 24rpx;
					width: 166rpx;
					height: 68rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					font-weight: 600;
					font-size: 32rpx;
					color: #fff;
				}
			}
		}
	}
</style>