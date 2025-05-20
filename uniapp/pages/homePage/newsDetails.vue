<template>
	<!-- 自定义导航栏 -->
	<HeadNav nav-background-color="#F5F5F7" backImageUrl="1" :textContent="data.title" fontWeight="600" fontSize="15"
		style="position: relative; z-index: 999;">
	</HeadNav>
	<view class="content">
		<view>{{data.title}}</view>
		<view>{{data.updateTime}}</view>
		<rich-text style="width:750rpx;background-color: #fff;" :nodes="formatRichText(data.content)"></rich-text>
	</view>
</template>

<script setup>
	import {
		reactive,
		ref
	} from "vue";
	import {
		newsDetail
	} from '@/api/homePage.js'
	import {
		onLoad,
		onPullDownRefresh,
		onReachBottom,
		onShareAppMessage
	} from "@dcloudio/uni-app";
	const id = ref('')
	let data = ref()

	function getDetails() {
		newsDetail({id:id.value}).then(res => {
			console.log(res);
			data.value = res.data.data
		})
	}
	function formatRichText(html) {
		let newContent = html.replace(/<img[^>]*>/gi, function(match, capture) {
			match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
			match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
			match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
			return match;
		});
		newContent = newContent.replace(/style="[^"]+"/gi, function(match, capture) {
			match = match.replace(/width:[^;]+;/gi, 'width:100%;').replace(/width:[^;]+;/gi, 'width:100%;');
			return match;
		});
		newContent = newContent.replace(/<br[^>]*\/>/gi, '');
		newContent = newContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;"');
		return newContent;
	}
	onLoad((options) => {
		id.value = options.id
		getDetails()
	})
</script>
<style>
	p {
		width: 100%;
	}

	.wscnph {
		width: 100%;
	}
</style>
<style lang="scss" scoped>
	.content {
		width: 100%;
		height: 100%;
		padding: 24rpx 20rpx;
		box-sizing: border-box;
		background-color: #fff;
		>view:nth-child(1){
			width: 100%;
			text-align: center;
			font-size: 34rpx;
			font-weight: bold;
		}
		>view:nth-child(2){
			width: 100%;
			text-align: center;
			font-size: 24rpx;
			line-height: 60rpx;
			color: #666;
			border-bottom: 1rpx solid #ccc;
			margin-bottom: 20rpx;
		}
	}
</style>