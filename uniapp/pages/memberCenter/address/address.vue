<template>
	<view class="addressPage">
		<!-- 自定义导航栏 -->
		<HeadNav nav-background-color="#F5F5F7" backImageUrl="1" textContent="收货地址" fontWeight="600" fontSize="15">
				</HeadNav>
		<!-- 收货地址详细信息 -->
		<view class="addressList" v-for="item in list" v-if="list.length!=0">
			<view class="addressDetail" @click="jumpOrder(item.id)">
				<image src="@/static/member/position.png"></image>
				<view class="fontBox">
					<view>{{item.name}} {{item.mobile}}</view>
					<text>{{item.addAll+item.addressInfo}}</text>
				</view>
			</view>
			<!-- 地址的基本设置 -->
			<view class="handleAddress">
				<view class="checkBox">
					<!-- 这里有个单选框-->
					<radio v-if="radioFlag" :checked="item.state == 0?false:true" @click="changeState(item.id)"
						style="transform:scale(0.7)" color="green"></radio>
					<view>设为默认</view>
				</view>
				<view class="handlerAds">
					<view @click="edit(item)">编辑</view>
					<view @click="deletes(item)">删除</view>
				</view>
			</view>
		</view>
		<!-- 没有地址时展示 -->
		<view class="noAddress" v-if="list.length==0">
			<image src="../../../static/member/noaddress.jpg"></image>
			<view>暂时没有可用地址，快添加一个吧</view>
		</view>
		<!-- 添加收货地址按钮 -->
		<button class="adressBtn" @click="addAddress">+ 添加收货地址</button>
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog :type="msgType" cancelText="取消" confirmText="确认" content="确认取消此条地址吗?"
				@confirm="dialogConfirm" @close="dialogClose"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script setup>
	import {
		address,
		deleteaddress,
		auditaddress
	} from '@/api/member.js'
	import {
		ref
	} from "vue"
	import {
		order
	} from '@/store/order'
	import {
		onLoad,
		onPullDownRefresh,
		onReachBottom,
		onShow
	} from "@dcloudio/uni-app";
	let list = ref([]) //地址列表
	const radioFlag = ref(false) //是否点击radio
	const flag = ref(false) //是否显示地址框
	const orders = ref('')
	const deleteId = ref('')
	const alertDialog = ref()
	//获取地址列表数据
	function getList() {
		radioFlag.value = false
		address().then(res => {
			list.value = [...res.data.data]
			radioFlag.value = true
			// this.$forceUpdate()
			console.log(res);
		})
	}

	function changeState(id) {
		console.log(id);
		auditaddress({
			id: id
		}).then(res => {
			getList()
		})
	}
	//跳转到添加收货地址
	function addAddress() {
		uni.navigateTo({
			url: "/pages/memberCenter/address/addAddress"
		});
	}
	// 编辑收货地址
	function edit(item) {
		uni.navigateTo({
			url: "/pages/memberCenter/address/addAddress?id=" + item.id
		});
	}
	// 删除收货地址
	function deletes(item) {
		alertDialog.value.open()
		deleteId.value = item.id
	}
	//确认
	function dialogConfirm() {
		deleteaddress({
			id: deleteId.value
		}).then(res => {
			getList()
		})
	}

	function dialogClose() {
		alertDialog.value.close()
	}
	// 跳转到确认订单
	function jumpOrder(addressId) {
		if (orders.value == 'order') {
			order().setAddressId(addressId)
			uni.redirectTo({
				url: "/pages/shoppingCart/confirmOrder"
			});
		}else if(orders.value == 'jifenorder'){
			order().setAddressId(addressId)
			uni.redirectTo({
				url: "/pages/memberCenter/integralPage/confirmOrder"
			});
		}
	}
	onLoad((options) => {
		if (options.order) {
			orders.value = options.order
		}
		getList()
	})
	onShow(() => {
		getList()
	})
</script>

<style lang="scss" scoped>
	.addressPage {
		width: 750rpx;
		height: 100%;
		padding: 18rpx;
		box-sizing: border-box;
		position: relative;
		background-color: white;

		.addressList {
			width: 714rpx;
			height: 222rpx;
			background: #FFFFFF;
			border-radius: 24rpx;
			padding: 0rpx 10rpx;
			box-sizing: border-box;
			margin-bottom: 16rpx;

			.addressDetail {
				width: 674rpx;
				height: 136rpx;
				border-bottom: 2rpx solid #CACACC;
				margin-left: 10rpx;
				display: flex;
				align-items: center;

				image {
					width: 44rpx;
					height: 44rpx;
				}

				.fontBox {
					margin-left: 14rpx;
					line-height: 46rpx;

					view {
						font-weight: 600;
						font-size: 32rpx;
					}

					text {
						font-size: 28rpx;
						color: #999999;
					}
				}
			}

			.handleAddress {
				width: 100%;
				height: 84rpx;
				font-size: 26rpx;
				color: #88888C;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.checkBox {
					display: flex;

					view {
						margin-top: 6rpx;
					}
				}

				.handlerAds {
					display: flex;

					view {
						margin-left: 48rpx;
					}
				}
			}
		}

		.noAddress {
			width: 420rpx;
			margin-left: 160rpx;
			margin-top: 130rpx;
			font-size: 12px;
			color: #999999;
			text-align: center;

			image {
				width: 420rpx;
				height: 420rpx;
				margin-bottom: 20rpx;
			}
		}

		.adressBtn {
			width: 682rpx;
			height: 80rpx;
			background: #1C9B64;
			border-radius: 24rpx;
			color: white;
			line-height: 76rpx;
			position: fixed;
			bottom: 40rpx;
			left: 36rpx;
		}
	}
</style>