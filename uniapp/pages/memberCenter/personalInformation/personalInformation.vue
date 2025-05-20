<template>
	<view class="personalPage">
		<!-- 自定义导航栏 -->
		<HeadNav nav-background-color="#fff" backImageUrl="1" textContent="个人资料" fontSize="15" fontWeight="600">
		</HeadNav>
		<!-- 用户头像 -->
		<view class="userImg">

			<image v-if="data.image.indexOf('http') != -1"
				@click="jumpEdit('/pages/memberCenter/personalInformation/alterNikename?flag=headImg')"
				:src="data.image" mode=""></image>
			<image v-else-if="data.image"
				@click="jumpEdit('/pages/memberCenter/personalInformation/alterNikename?flag=headImg')"
				:src="imageUrl + data.image" mode=""></image>
			<image v-else @click="jumpEdit('/pages/memberCenter/personalInformation/alterNikename?flag=headImg')"
				src="@/static/user.png" mode=""></image>
		</view>
		<!-- 用户基本信息 -->
		<uni-list :border="false">
			<uni-list-item showArrow clickable title="手机号" @click="jumpEdit('/pages/memberCenter/alertPhoneNumber')"
				:rightText="data.phone" :border="false" />
			<uni-list-item showArrow clickable title="邮箱"
				@click="jumpEdit('/pages/memberCenter/personalInformation/alterNikename?flag=email')"
				:rightText="data.email?data.email:''" :border="false" />
			<uni-list-item showArrow clickable title="昵称"
				@click="jumpEdit('/pages/memberCenter/personalInformation/alterNikename?flag=name')"
				:rightText="data.name?data.name:''" :border="false" />
			<uni-list-item showArrow clickable title="性别"
				@click="jumpEdit('/pages/memberCenter/personalInformation/alterNikename?flag=gender')"
				:rightText="gender(data.gender)" :border="false" />
			<uni-list-item showArrow clickable title="生日"
				@click="jumpEdit('/pages/memberCenter/personalInformation/alterNikename?flag=birthday')"
				:rightText="data.birthday?data.birthday:''" :border="false" />
			<uni-list-item showArrow clickable title="地区"
				@click="jumpEdit('/pages/memberCenter/personalInformation/alterNikename?flag=addAll')"
				:rightText="data.addAll?data.addAll:''" :border="false" />
		</uni-list>
	</view>
</template>

<script setup>
	import {
		onShow,
		onLoad
	} from "@dcloudio/uni-app";
	import {
		memberInfo
	} from '@/api/member.js'
	import {
		ref
	} from 'vue'

	let data = ref({})
	// 获取个人信息
	function getData() {
		memberInfo().then(res => {
			data.value = res.data.data
		})
	}
	// 修改性别
	function gender(data) {
		if (data == 0) {
			return '保密'
		} else if (data == 1) {
			return '男'
		} else if (data == 2) {
			return '女'
		}
	}
	// 页面跳转
	function jumpEdit(url) {
		uni.navigateTo({
			url: url
		});
	}
	onShow(() => {
		getData()
	})
</script>

<style lang="scss" scoped>
	.personalPage {
		width: 750rpx;
		height: 100%;

		.userImg {
			width: 750rpx;
			height: 294rpx;
			background-color: white;
			margin-bottom: 16rpx;

			image {
				margin-top: 74rpx;
				margin-left: 302rpx;
				width: 146rpx;
				height: 146rpx;
				border-radius: 50%;
			}
		}
	}
</style>