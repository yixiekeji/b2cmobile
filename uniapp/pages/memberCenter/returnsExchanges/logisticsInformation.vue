<template>
	<view class="returnsExchanges">
		<HeadNav nav-background-color="#f7f7f5" backImageUrl="1" textContent="物流信息" fontSize="15" fontWeight="600"
			style="z-index: 999999;position: relative;"></HeadNav>
		<view class="content">
			<view>操作记录</view>
			<view class="logs" v-for="item in memberProductBackLogList">
				<view>{{item.createTime}}</view>
				<view>{{item.content}}</view>
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
	} from '@dcloudio/uni-app'
	import {
		lookBackLogistics,
		lookExchangeLogistics
	} from '@/api/order.js'
	const id = ref('')
	let memberProductBack = ref({})
	let memberProductBackLogList = ref([])
	const flag = ref('')
	//获取退货列表
	function getList() {
		if(flag.value == 'back'){
			lookBackLogistics({
				backid: id.value
			}).then(res => {
				memberProductBack.value = res.data.data.memberProductBack
				memberProductBackLogList.value = res.data.data.memberProductBackLogList
				console.log(res)
			})
		}else if(flag.value == 'exchange'){
			lookExchangeLogistics({
				exchangeid: id.value
			}).then(res => {
				memberProductBack.value = res.data.data.memberProductBack
				memberProductBackLogList.value = res.data.data.memberProductExchangeLogList
				console.log(res)
			})
		}
		
	}
	onLoad((options) => {
		id.value = options.id
		flag.value = options.flag
		console.log(options.flag);
		getList()
	
	})
</script>

<style lang="scss" scoped>
	.returnsExchanges {
		width: 750rpx;
		height: 100%;
		padding: 0 18rpx;
		box-sizing: border-box;
		background-color: #fff;
		.content {
			width: 100%;
			height: 100%;
			>view:nth-child(1){
				font-size: 28rpx;
				color: #999;
				font-weight: 700;
				line-height: 60rpx;
			}
			.logs{
				width: 100%;
				line-height: 60rpx;
				padding: 10rpx 20rpx;
				box-sizing: border-box;
				background-color: #f2f2f2;
				border-radius: 10rpx;
				margin-top: 16rpx;
				>view:nth-child(1){
					font-size: 28rpx;
					color: #707070;
				}
				>view:nth-child(2){
					font-size: 28rpx;
					color: #333;
				}
			}
		}
	}
</style>