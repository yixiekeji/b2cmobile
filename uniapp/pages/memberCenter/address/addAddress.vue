<template>
	<view class="addAddressBox">
		<!-- 自定义导航栏 -->
		<HeadNav nav-background-color="#fff" backImageUrl="1" textContent="收货地址" fontSize="15" fontWeight="600">
		</HeadNav>
		<!-- 地址详细信息表单、 -->
		<view class="addressMessage">
			<view class="phoneNum">收货人</view>
			<view class="inputBox">
				<input type="text" placeholder="名字" v-model="name" minlength='2' maxlength="20">
				<view v-if="nameFlag">{{nameplace}}</view>
			</view>
		</view>
		<view class="addressMessage">
			<view class="phoneNum">手机号码</view>
			<view class="inputBox">
				<input type="text" placeholder="手机号" v-model="mobile">
				<view v-if="phoneFlag">{{phonePlace}}</view>
			</view>
		</view>
		<view class="addressMessage">
			<view class="phoneNum">所在地区</view>
			<view style="position: relative;width: 554rpx;">
				<view class="inputBox">
					<pick-regions :defaultRegion="defaultRegionCode" @getRegion="handleGetRegion">
						<view style="position: relative;width: 100%;height: 100%;">
							<input style="font-size: 30rpx;color: #000;" placeholder="省、市、区" v-model="regionName" disabled>
							<view style="position: absolute;width: 100%;height: 100%;left: 0;top: 0;">
								
							</view>
						</view>
					</pick-regions>
					<view v-if="addressFlag">请选择所在地区</view>
				</view>
			</view>
		</view>
		<view class="addressMessage">
			<view class="phoneNum">详细地址</view>
			<view class="inputBox">
				<textarea cols="30" rows="10" placeholder="街道、小区楼栋" class="textareaBox"
					v-model="addressInfo"></textarea>
				<view v-if="addressDetailFlag">{{detailPlace}}</view>
			</view>
		</view>
		<!-- 是否设为详细地址 -->
		<view class="defaultAddress">
			<view>设为默认收货地址</view>
			<switch :checked="switchChecked" color="#1C9B64" style="transform:scale(0.7)" @change="swichChange" />
		</view>
		<!-- 保存按钮 -->
		<button class="adressBtn" @click="save">保存</button>
	</view>
</template>

<script setup>
	import {
		createaddress,
		updateaddress,
		getMemberAddress
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
	let regions = ref([])
	let defaultRegion = ref(['广东省', '广州市', '番禺区'])
	const defaultRegionCode = ref('440113')
	const state = ref('') //收货地址默认
	const name = ref('') //收获人
	const mobile = ref('') //收获手机号
	const addressInfo = ref('') //收货地址
	const switchChecked = ref(false)
	const addressDetailFlag = ref(false)
	const addressFlag = ref(false)
	const phoneFlag = ref(false)
	const nameFlag = ref(false)
	const id = ref('')
	const nameplace = ref("请输入收货人名称")

	const phonePlace = ref("请输入收货手机号")

	const detailPlace = ref("请输入详细地址")

	let regionName = ref('')

	// 获取选择的地区
	function handleGetRegion(region) {
		regions.value = [...region]
		regionName.value = region.map(item => item.regionName).join(' ')
		console.log(regions.value);
	}
	//地址是否默认
	function swichChange(e) {
		state.value = e.detail.value
	}

	function save() {
		if (name.value == '') {
			nameFlag.value = true
			nameplace.value = "请输入收货人名称"
		} else if (name.value.length < 2) {
			nameFlag.value = true
			nameplace.value = "收货人名称至少为两位字符"
		} else {
			nameFlag.value = false
		}
		if (mobile.value == '') {
			phoneFlag.value = true
			phonePlace.value = "请输入收货手机号"
		} else if (!(/^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/.test(mobile.value))) {
			phoneFlag.value = true
			phonePlace.value = "手机号格式不正确"
		} else {
			phoneFlag.value = false
		}
		if (addressInfo.value == '') {
			addressDetailFlag.value = true
			detailPlace.value = "请输入详细地址"
		} else if (addressInfo.value.length < 2) {
			addressDetailFlag.value = true
			detailPlace.value = "详细收货地址至少为两位字符"
		} else {
			addressDetailFlag.value = false
		}
		regionName.value == '' ? addressFlag.value = true : addressFlag.value = false
		if (!nameFlag.value && !phoneFlag.value && !addressDetailFlag.value && !addressFlag.value) {
			if (id.value) {
				console.log(regions.value);
				updateaddress({
					addAll: regionName.value,
					addressInfo: addressInfo.value,
					mobile: mobile.value,
					name: name.value,
					state: state.value == true ? 1 : 0,
					provinceId: regions.value[0].id,
					areaId: regions.value[1].id,
					cityId: regions.value[2].id,
					id: id.value
				}).then(res => {
					id.value = ''
					uni.navigateBack({
						delta: 1
					})
				})
			} else {
				createaddress({
					addAll: regionName.value,
					addressInfo: addressInfo.value,
					mobile: mobile.value,
					name: name.value,
					state: state.value == true ? 1 : 0,
					provinceId: regions.value[0].id,
					areaId: regions.value[1].id,
					cityId: regions.value[2].id
				}).then(res => {
					id.value = ''
					uni.navigateBack({
						delta: 1
					})
				})
			}
		}
	}
	// 修改收货地址获取详情用来回显
	function getDetails(id) {
		getMemberAddress({
			id: id
		}).then(res => {
			regionName.value = res.data.data.addAll
			addressInfo.value = res.data.data.addressInfo
			mobile.value = res.data.data.mobile
			name.value = res.data.data.name
			state.value = res.data.data.state
			switchChecked.value = res.data.data.state == 0 ? false : true
			regions.value.push({
				id: res.data.data.provinceId,
				regionName: res.data.data.addAll.split(' ')[0]
			}, {
				id: res.data.data.areaId,
				regionName: res.data.data.addAll.split(' ')[1]
			}, {
				id: res.data.data.cityId,
				regionName: res.data.data.addAll.split(' ')[2]
			})
		})
	}
	onLoad((options) => {
		if (options.id) {
			id.value = options.id
			getDetails(options.id)
		}
	})
	
</script>

<style lang="scss" scoped>
	.addAddressBox {
		width: 750rpx;
		height: 2000rpx;
		background-color: white;
		padding: 22rpx 24rpx;
		box-sizing: border-box;

		image {
			width: 24rpx;
			height: 16rpx;
			position: absolute;
			top: 32rpx;
			right: 30rpx;
		}

		.addressMessage {
			width: 700rpx;
			height: 80rpx;
			display: flex;
			align-items: center;
			margin-bottom: 38rpx;

			.phoneNum {
				width: 146rpx;
				height: 80rpx;
				font-weight: 600;
				font-size: 26rpx;
				line-height: 80rpx;
			}

			.inputBox {
				height: 122rpx;
				margin-top: 50rpx;

				input {
					width: 554rpx;
					height: 80rpx;
					background: #F5F5F7;
					border-radius: 14rpx;
					padding: 0 22rpx;
					box-sizing: border-box;
				}

				view {
					font-size: 12rpx;
					color: red;
				}

				.textareaBox {
					width: 554rpx;
					background: #F5F5F7;
					border-radius: 14rpx;
					height: 169rpx;
					margin-top: 10rpx;
					padding: 20rpx 22rpx;
					box-sizing: border-box;
				}
			}

		}

		.defaultAddress {
			width: 700rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 140rpx;

			view {
				font-weight: 600;
				font-size: 26rpx;

			}
		}

		.adressBtn {
			width: 632rpx;
			height: 80rpx;
			background: #1C9B64;
			border-radius: 24rpx;
			color: white;
			line-height: 80rpx;
			position: fixed;
			bottom: 40rpx;
			left: 60rpx;
		}
	}
</style>