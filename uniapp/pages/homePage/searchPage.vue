<template>
	<view class="searchPage">
		<!-- 自定义导航栏 -->
		<HeadNav nav-background-color="" backImageUrl="3" @searched="search">

		</HeadNav>
		<!-- 历史搜索标题 -->
		<view class="titleBox"  v-if="searchLogsList.length != 0">
			<view>历史搜索</view>
			<image src="@/static/home/delete.png" mode="" @click="deletes"></image>
		</view>
		<!-- 搜索记录列表 -->
		<view class="searchList">
			<view @click="jumpSearchList(item.keyword,item.id)" v-for="item in searchLogsList">{{item.keyword}}</view>
		</view>
		<!-- 热门搜索标题 -->
		<view class="titleBox">
			<view>热门搜索</view>
		</view>
		<!-- 搜索记录列表 -->
		<view class="searchList">
			<view @click="jumpSearchList(item)" v-for="item in searchKeywordList">{{item}}</view>
		</view>
		<!-- 是否确认删除弹框 -->
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog :type="msgType" cancelText="取消" confirmText="确认" content="确认删除历史搜索记录吗？"
				@confirm="dialogConfirm" @close="dialogClose"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive
	} from 'vue'
	import {
		searchIndex,
		delSearch,
		searchList
	} from '@/api/search.js'
	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app";
	const alertDialog = ref()
	const searchLists = ref([])

	//搜索
	function search(val) {
		console.log(val);
		if (uni.getStorageSync("token")) {} else {
			let time = Date.now()
			searchLogsList.value.unshift({
				keyword: val,
				id: time
			})
			searchLists.value.unshift({
				keyword: val,
				id: time
			})
			uni.setStorageSync("searchLists", JSON.stringify(searchLists.value))
		}

		uni.navigateTo({
			url: "/pages/homePage/searchResult?data=" + val
		});
	}
	// 获取历史搜索数据
	let searchLogsList = ref([])
	//获取热门搜索列表
	let searchKeywordList = ref([])

	function getSearchKeyword() {
		searchIndex().then((res) => {
			console.log('!!!',uni.getStorageSync("token"));
			if (uni.getStorageSync("token")) {
				searchLogsList.value = res.data.data.logList
				searchKeywordList.value = res.data.data.keywords
			} else {
				searchLogsList.value = [...searchLists.value]
				searchKeywordList.value = res.data.data.keywords
			}
			
		})
	}

	// 删除历史搜索记录
	function deletes() {
		alertDialog.value.open()

	}
	//确认
	function dialogConfirm() {
		if (uni.getStorageSync("token")) {
			delSearch().then(res => {
				getSearchKeyword()
			})
		} else {
			searchLists.value = []
			uni.removeStorageSync("searchLists", '')
			getSearchKeyword()
		}
		
	}
	//取消
	function dialogClose() {
		alertDialog.value.close()
	}


	// 跳转到搜索商品列表
	function jumpSearchList(data,val) {
		if (data == '') return
		if(val && !uni.getStorageSync("token")){
			searchLogsList.value.forEach((item,index)=>{
				if(item.id == val){
					searchLogsList.value.splice(index, 1)
					searchLogsList.value.unshift(item)
				}
			})
			searchLists.value.forEach((item,index)=>{
				if(item.id == val){
					searchLists.value.splice(index, 1)
					searchLists.value.unshift(item)
				}
			})
			uni.setStorageSync("searchLists", JSON.stringify(searchLists.value))
		}else if(!uni.getStorageSync("token")){
			let time = Date.now()
			searchLogsList.value.unshift({
				keyword: data,
				id: time
			})
			searchLists.value.unshift({
				keyword: data,
				id: time
			})
			uni.setStorageSync("searchLists", JSON.stringify(searchLists.value))
		}
		getSearchKeyword()
		uni.navigateTo({
			url: "/pages/homePage/searchResult?data=" + data
		});

	}

	onShow(() => {
		if (uni.getStorageSync("searchLists") && uni.getStorageSync("token")) {
			const list = JSON.parse(uni.getStorageSync("searchLists"))
			for (let i = list.length - 1; i >= 0; i--) {
				searchList({
					keyword: list[i].keyword,
					page: 1,
					sort: 0
				}).then(res => {

				})
			}
			uni.removeStorageSync("searchLists", '')
			getSearchKeyword()
		} else if (uni.getStorageSync("searchLists")) {
			searchLists.value = JSON.parse(uni.getStorageSync("searchLists"))
			getSearchKeyword()
		} else {
			getSearchKeyword()
		}
	})
</script>

<style lang="scss" scoped>
	.searchPage {
		width: 750rpx;
		height: 100%;
		padding: 36rpx 24rpx;
		box-sizing: border-box;

		.searchBox {
			height: 68rpx;
			width: 100%;
			position: relative;
			display: flex;
			align-items: center;

			input {
				width: 650rpx;
				box-sizing: border-box;
				font-size: 28rpx;
				height: 60rpx;
				padding-left: 60rpx;
				line-height: 58rpx;
				background: #FFFFFF;
				border-radius: 29rpx;
				border: 1rpx solid #1C9B64;
			}

			view {
				width: 50rpx;
				font-size: 24rpx;
				margin-left: 10rpx;

			}

			.searchIcon {
				position: absolute;
				left: 18rpx;
				top: 14rpx;
			}
		}

		.titleBox {
			width: 702rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 40rpx;

			view {
				font-weight: 600;
				font-size: 28rpx;
			}

			image {
				width: 28rpx;
				height: 30rpx;
				font-size: 24rpx;
				color: #999999;

			}
		}

		.searchList {
			width: 680rpx;
			display: flex;
			flex-wrap: wrap;

			view {
				background-color: white;
				height: 52rpx;
				background: #FFFFFF;
				border: 1rpx solid #EEEEEE;
				border-radius: 10rpx;
				margin-right: 24rpx;
				margin-top: 18rpx;
				font-size: 24rpx;
				padding: 11rpx 23rpx;
				box-sizing: border-box;
			}
		}
	}
</style>