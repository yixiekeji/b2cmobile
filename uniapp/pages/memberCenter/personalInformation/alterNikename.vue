<template>
	<view>
		<!-- 自定义导航栏 -->
		<HeadNav nav-background-color="#F5F5F7" backImageUrl="1" :textContent="title(flag)" fontWeight="500"
			fontSize="15"></HeadNav>
		<!-- 修改昵称框 -->
		<input v-if="flag == 'name'" type="text" v-model="formData.name" placeholder="请输入昵称" class="userName">
		<view v-if="flag == 'name' && nameFlag" style="color: red;font-size: 26rpx;text-indent: 12rpx;">
			昵称最少2个字符，最多6个字符
		</view>
		<!-- 修改邮箱 -->
		<input v-if="flag == 'email'" type="text" v-model="formData.email" placeholder="请输入邮箱" class="userName">
		<view v-if="flag == 'email' && emailFlag" style="color: red;font-size: 26rpx;text-indent: 12rpx;">
			邮箱格式不正确
		</view>
		<!-- 修改生日 -->
		<uni-datetime-picker v-if="flag == 'birthday'" type="date" :clear-icon="false" v-model="formData.birthday"
			@maskClick="maskClick" />
		<!-- 修改地址 -->
		<pick-regions v-if="flag == 'addAll'" :defaultRegion="defaultRegionCode" @getRegion="handleGetRegion">
			<view style="background-color: #fff;height: 94rpx;margin-top: 16rpx;line-height: 94rpx;font-size: 26rpx;">
				{{regionName == '' ? '请选择':regionName}}
			</view>
		</pick-regions>
		<!-- 修改性别 -->
		<picker v-if="flag == 'gender'"
			style="background-color: #fff;height: 94rpx;margin-top: 16rpx;line-height: 94rpx;font-size: 26rpx;"
			@change="bindPickerChange" :value="index" :range="array">
			<view class="uni-input">{{array[formData.gender]}}</view>
		</picker>
		<view v-if="flag == 'headImg'"
			style="width:100%;display: flex;height: 200rpx;align-items: center;background-color: #fff;padding: 0 24rpx;box-sizing: border-box;">
			<uni-file-picker v-model="imageValue" file-mediatype="image" mode="grid" :limit="1" @progress="progress"
				@success="success" @fail="fail" @select="select" @delete="handleDelete"
				:image-styles="imageStyles"></uni-file-picker>
			<text style="width: calc(100% - 100px);color: #999;font-size: 28rpx;">请确保图片清晰，最好采用png，宽400，高400</text>
		</view>
		<view v-if="imgFlag"
			style="color: #f56c6c;font-size: 24rpx;padding: 0 24rpx;box-sizing: border-box;background-color: #fff;">
			请上传头像</view>
		<!-- 完成按钮 -->
		<button class="btnBox" @click="submit">完成</button>
	</view>
</template>

<script setup>
	import {
		memberUpdateInfo,
		memberInfo
	} from "@/api/member.js"
	import {
		ref,
		reactive
	} from "vue";
	import {
		onLoad
	} from '@dcloudio/uni-app'
	const flag = ref('')
	let region = ref([])
	let defaultRegion = ref(['广东省', '广州市', '番禺区'])
	const defaultRegionCode = ref('440113')
	let array = ref(['保密', '男', '女'])
	let formData = ref({
		name: '',
		email: '',
		birthday: '',
		gender: 0,
	})
	const nameFlag = ref(false)
	const emailFlag = ref(false)
	const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/

	let imageValue = ref([])
	const imgFlag = ref(false)
	const imageStyles = reactive({
		width: 90,
		height: 90,
	})
	//图片上传相关
	let upImg = ref('')
	let data = ref({})
	const index = ref('')
	const regionName = ref('')
	const regionId = ref('')
	// 获取选择的地区
	function handleGetRegion(region) {
		region.value = region
		regionId.value = region.value.map(item => item.id).join('-')
		regionName.value = region.value.map(item => item.regionName).join(' ')
	}
	//修改性别
	function bindPickerChange(e) {
		console.log(e.detail.value);
		formData.value.gender = Number(e.detail.value)
		console.log(formData.value.gender == '' && formData.value.gender != 0);
	}
	//获取个人信息
	function getData() {
		memberInfo().then(res => {
			console.log(res.data.data.name);
			res.data.data.name != undefined ? formData.value.name = res.data.data.name : formData.value.name = ''
			res.data.data.email != undefined ? formData.value.email = res.data.data.email : formData.value.email =
				''
			res.data.data.birthday != undefined ? formData.value.birthday = res.data.data.birthday : formData.value
				.birthday = ''
			res.data.data.gender != undefined ? formData.value.gender = res.data.data.gender : formData.value
				.gender = ''
			res.data.data.addAll != undefined ? getaddress(res.data.data) : ''
			data.value = res.data.data
		})
	}
	// 完成按钮
	function submit() {
		if (flag.value != 'addAll' && flag.value != 'headImg') {
			if (formData.value[flag.value] == '' && formData.value.gender != 0) {
				uni.showToast({
					icon: 'none',
					duration: 3000,
					title: '请填写内容'
				});
				return
			} else if (flag.value == 'name' && (2 > formData.value[flag.value].length || 6 < formData.value[flag.value]
					.length)) {
				nameFlag.value = true
				return
			} else if (flag.value == 'email' && !emailRegex.test(formData.value[flag.value])) {
				emailFlag.value = true
				return
			}
			let obj = {}
			obj[flag.value] = formData.value[flag.value]
			memberUpdateInfo({
				type: flag.value,
				value: formData.value[flag.value]
			}).then(res => {
				uni.navigateBack({
					delta: 1
				})
			})
		} else if (flag.value == 'headImg') {
			if (upImg.value == '') {
				imgFlag.value = true
				return
			} else {
				imgFlag.value = false
			}
			memberUpdateInfo({
				type: 'headimg',
				value: upImg.value
			}).then(res => {
				uni.navigateBack({
					delta: 1
				})
			})
		} else {
			let addALL = regionId.value + '-' +
				regionName.value
			let obj = {}
			obj[flag.value] = addALL
			memberUpdateInfo({
				type: 'addAll',
				value: addALL
			}).then(res => {
				uni.navigateBack({
					delta: 1
				})
			})
		}

	}
	// 获取地址
	function getaddress(data) {
		region.value = []
		regionName.value = data.addAll
		regions.value.push({
			id: data.provinceId,
			regionName: data.addAll.split(' ')[0]
		}, {
			id: data.areaId,
			regionName: data.addAll.split(' ')[1]
		}, {
			id: data.cityId,
			regionName: data.addAll.split(' ')[2]
		})
	}
	// 导航栏文字
	function title(data) {
		switch (data) {
			case 'name':
				return '修改昵称';
				break;
			case 'email':
				return '修改邮箱';
				break;
			case 'gender':
				return '修改性别';
				break;
			case 'birthday':
				return '修改生日';
				break;
			case 'addAll':
				return '修改地区';
				break;
		}
	}


	function select(e) {
		console.log(e.tempFiles[0].file);
		uni.uploadFile({
			// #ifdef H5
			url: '/prod-api/api' + `/uploadFileImage`,
			// #endif
			// #ifdef MP
			url: 'https://b2c.yixiekeji.cn' + '/prod-api/api' + `/uploadFileImage`,
			// #endif
			// #ifdef APP-PLUS
			url: 'https://b2c.yixiekeji.cn' + '/prod-api/api' + `/uploadFileImage`,
			// #endif
			filePath: e.tempFilePaths[0],
			name: 'imageFile',
			header: {
				// "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryHEkzvzS0GejAYXXA"
				// boundary=----WebKitFormBoundaryNKkJ14EwhaGBw4bW
				// 'token':'eb992333-034c-4b82-a446-06a137641f7a'
			},
			success: (res) => {
				console.log(JSON.parse(res.data).data);
				upImg.value = JSON.parse(res.data).data
			},
			fail: (err) => {
				uni.hideLoading()
				uni.showToast({
					title: '上传附件失败，请稍候再试！',
					duration: 1000,
					icon: 'none'
				});
				return;
			}
		})
	}
	//图片删除
	function handleDelete(err) {
		upImg.value = ''
	}
	onLoad((options) => {
		getData()
		flag.value = options.flag
	})
</script>

<style lang="scss" scoped>
	.userName {
		width: 750rpx;
		height: 94rpx;
		padding-left: 28rpx;
		background-color: white;
		margin-top: 16rpx;
		line-height: 94rpx;
		font-size: 26rpx;

	}

	.uni-input {
		padding-left: 30rpx;
		box-sizing: border-box;
	}

	.btnBox {
		width: 250rpx;
		height: 70rpx;
		background-color: white;
		margin-top: 30rpx;
		line-height: 70rpx;
		color: #1C9B64;
		border: 1rpx solid #1C9B64;
		font-size: 30rpx;
	}
</style>