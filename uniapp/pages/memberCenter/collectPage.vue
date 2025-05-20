<template>
	<view class="collectPage">
		<!-- 自定义导航栏 -->
		<HeadNav nav-background-color="#fff" backImageUrl="1" textContent="收藏" fontSize="15" fontWeight="600">
		</HeadNav>
		<!-- 收藏商品列表详情 -->
		<view class="detailBox" v-for="item in list" v-if="list.length!=0">
			<image :src="imageUrl + item.productImg" class="goodsImg" @click="jumpDetail(item.productId)"></image>
			<view class="fontBox" @click="jumpDetail(item.productId)">
				<view class="font1">{{item.productName}}</view>
				<view class="font2">
					<view>￥{{item.mallPrice}}</view>
				</view>
			</view>
			<!-- 取消收藏 -->
			<image @click="deleteCollect(item.productId)" src="../../static/member/heart(2).png" class="collectImg">
			</image>
		</view>
		<view v-if="loading"
			style="text-align: center;color: #999;width: 100%;height: 50rpx;line-height: 50rpx;font-size: 24rpx;">
			{{loadingText}}
		</view>
		<!-- 没有数据显示 -->
		<view class="noData" v-if="list.length==0&&dataFlag">
			<image src="@/static/noList.png" mode=""></image>
			<view>暂无更多数据</view>
		</view>
		<!-- 删除提示 -->
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog :type="msgType" cancelText="取消" confirmText="确认" content="确认要取消收藏吗?"
				@confirm="dialogConfirm" @close="dialogClose"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script setup>
	import {
		collectionList,
		shopCollectionCancel
	} from '@/api/member.js'
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
	const page = ref(1)
	let list = ref([])
	const loading = ref(false) //加载效果开关
	const loadingText = ref('加载中...') //加载文案
	const id = ref('')
	const alertDialog = ref()
	const dataFlag = ref(false)
	// 获取收藏列表
	function getList() {
		dataFlag.value = false
		collectionList({
			page: page.value
		}).then(res => {
			console.log(res);
			// this.list = [...this.list,...res.data.data.memberCollectionProductList]
			if (res.data.data.memberCollectionProductList.length == 0 && page.value > 1 && list.value.length > 10) {
				loadingText.value = '到底啦~'
			} else {
				list.value = [...list.value, ...res.data.data.memberCollectionProductList]
				loading.value = false
			}
			dataFlag.value = true
		})
	}
	// 跳转到商品详情
	function jumpDetail(val) {
		uni.navigateTo({
			url: '/pages/homePage/goodsDetail?id=' + val
		});
	}
	//删除收藏商品
	function deleteCollect(val) {
		alertDialog.value.open()
		id.value = val
	}
	//确认
	function dialogConfirm() {
		shopCollectionCancel({
			productId: id.value
		}).then(res => {
			list.value = []
			page.value = 1
			getList()
		})
	}
	function dialogClose() {
		alertDialog.value.close()
	}
	//上拉加载
	onReachBottom(() => {
		if (list.value.length >= 20*page.value) {
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
			list.value = []
			page.value = 1
			getList()
			uni.stopPullDownRefresh()
		}, 800)
	})
	onLoad(() => {
		getList()
		uni.setNavigationBarTitle({
			title: uni.getStorageSync("shopName") ? uni.getStorageSync("shopName") : '禾鲜谷'
		});
	})
</script>

<style lang="scss" scoped>
	.collectPage {
		width: 750rpx;
		height: 100%;
		padding: 0 18rpx 18rpx;
		box-sizing: border-box;

		.noData {
			text-align: center;
			margin-top: 250rpx;
			font-size: 26rpx;
			color: gray;

			image {
				width: 100%;
				
			}
		}

		.detailBox {
			display: flex;
			align-items: center;
			background-color: white;
			border-radius: 24rpx;
			margin-top: 16rpx;

			.goodsImg {
				margin: 10rpx;
				width: 160rpx;
				height: 160rpx;
			}

			.collectImg {
				width: 52rpx;
				height: 52rpx;
				margin-left: 30rpx;
			}

			.fontBox {
				width: 430rpx;
				height: 100%;

				.font1 {
					line-clamp: 1;
					overflow: hidden; //超出文本隐藏
					text-overflow: ellipsis; ///超出部分省略号显示
					display: -webkit-box; //弹性盒模型
					-webkit-box-orient: vertical; //上下垂直
					-webkit-line-clamp: 1; //自定义行数
					font-size: 30rpx;
					margin-bottom: 22rpx;
				}

				.font2 {
					display: flex;
					justify-content: space-between;
					align-items: center;

					view {
						font-weight: 600;
						font-size: 34rpx;
						color: #DC3A2F;
					}
				}
			}
		}
	}
</style>