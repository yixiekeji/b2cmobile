<template>
	<view class="addComment">
		<HeadNav nav-background-color="#f7f7f5" backImageUrl="1" textContent="商品评价" fontSize="15" fontWeight="600"
			style="z-index: 999999;position: relative;"></HeadNav>
		<view class="itemGoods" v-for="item in productCommentList">
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
			</view>
		</view>
		<uni-forms ref="form" :rules="rules" :modelValue="formData" label-width="66px" style="padding: 16rpx 0 0 0;">
			<uni-forms-item label="商品评价" name="image">
				<uni-rate size="22" :value="formData.grade" color="#bbb" active-color="#FF9500" @change="gradeChange" />
			</uni-forms-item>
			<uni-forms-item label="" name="content" msgs="" label-width="0px">
				<uni-easyinput v-model="formData.content" type="textarea" placeholder="感觉怎么样?和大家分享一下吧(2-100字符)"
					:styles="styles" />
			</uni-forms-item>
			<uni-forms-item label="" name="image" label-width="0px">
				<view style="color: #333;font-size: 26rpx;line-height: 50rpx;font-weight: bold;">图片/视频补充(选填)</view>
				<view style="display: flex;align-items: center;margin-bottom: 10rpx;">
					<uni-file-picker v-model="imageValue" file-mediatype="image" mode="grid" :limit="5"
						@progress="progress" @success="success" @fail="fail" @select="select" @delete="handleDelete"
						:image-styles="imageStyles"></uni-file-picker>
				</view>
			</uni-forms-item>
		</uni-forms>
		<button @click="commit">提交</button>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive
	} from "vue";
	import {
		onShow,
		onHide,
		onReady,
		onLoad,
		onReachBottom,
		onPullDownRefresh
	} from '@dcloudio/uni-app'
	import {
		savecomment,
		orderscomment,
		getProductComment
	} from '@/api/member.js'
	const form = ref()
	const imgFlag = ref(false)
	let formData = ref({
		grade: 5,
		content: '',
		imgs: '',
		ordersId: '',
		ordersProductId: '',
		productCommentId: ''
	})
	const id = ref('')
	let imageValue = ref([])
	const styles = reactive({
		color: '#999',
		backgroundColor: '#F5F5F7',
		disableColor: '#F7F6F6',
		borderColor: '#00000000',
		height: '109px',
		borderRadius: '12px',
		fontSize: '15px'
	})
	const imageStyles = reactive({
		width: 90,
		height: 90,
	})
	const commentid = ref('')
	//图片上传相关
	let upImg = ref([])
	
	let productCommentList = ref([])

	let rules = ref({
		content: {
			rules: [{
					required: true,
					errorMessage: '评价内容必填',
				},
				{
					minLength: 2,
					errorMessage: '至少需要2字符',
				},
				{
					maxLength: 100,
					errorMessage: '最多需要100字符',
				}
			]
		},
	})

	function getDetails() {
		orderscomment({
			ordersId: formData.value.ordersId
		}).then(res => {
			res.data.data.ordersProductList.forEach(item=>{
				if(item.id == formData.value.ordersProductId){
					productCommentList.value = []
					productCommentList.value.push(item)
				}
			})
			console.log(res.data.data.ordersProductList[0].id);
			// formData.value.ordersProductId = res.data.data.ordersProductList[0].id
			getProductComment({
				ordersId: formData.value.ordersId,
				ordersProductId: formData.value.ordersProductId
			}).then(result => {
				imageValue.value = []
				formData.value.content = result.data.data.content
				formData.value.grade = result.data.data.grade
				formData.value.productCommentId = result.data.data.id
				result.data.data.productCommentPictureList.forEach(item => {
					imageValue.value.push({
						url: 'http://img.yixiekeji.com:8080/b2cimage/' + item.imagePath,
						id: item.imagePath
					})
					upImg.value.push({
						path: item.imagePath,
						id: item.imagePath
					})
				})
				console.log(result);
			})
		})
	}

	function gradeChange(e) {
		formData.value.grade = e.value
	}

	function select(e) {
		uni.uploadFile({
			// #ifdef APP-PLUS || H5
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
			header: {},
			success: (res) => {
				upImg.value.push({
					id: e.tempFiles[0].uuid,
					path: JSON.parse(res.data).data
				})
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
		console.log(err);
		upImg.value.forEach((item, index) => {
			if (item.id == err.tempFile.uuid || item.id == err.tempFile.id) {
				upImg.value.splice(index, 1);
			}
		})
		// console.log(err);
		// formData.logo.value = ''
	}

	function commit() {
		form.value.validate().then(res => {
			formData.value.imgs = ''
			upImg.value.forEach(item => {
				formData.value.imgs += item.path + ','
			})
			savecomment(formData.value).then(res => {
				console.log(res);
				if (res.data.success) {
					uni.showToast({
						title: '上传评价成功',
						duration: 1000,
						icon: 'none'
					});
					uni.navigateBack({
						delta: 1
					})
				}
			})
		}).catch(err => {})

	}
	onLoad((options) => {
		formData.value.ordersId = options.ordersId
		formData.value.ordersProductId = options.ordersProductId
		getDetails()
	})
</script>

<style lang="scss" scoped>
	.addComment {
		width: 750rpx;
		height: 100%;
		padding: 18rpx 18rpx;
		box-sizing: border-box;
		background-color: #fff;

		button {
			width: 682rpx;
			height: 80rpx;
			background: #1C9B64;
			border-radius: 24rpx 24rpx 24rpx 24rpx;
			font-weight: 600;
			font-size: 32rpx;
			color: #FFFFFF;
			text-align: center;
			display: flex;
			align-items: center;
			justify-content: center;
			position: fixed;
			bottom: 26rpx;
			left: 0;
			right: 0;
			margin: 0 auto;
		}

		.itemGoods {
			width: 100%;


			.goodsContent {
				width: 100%;
				height: 260rpx;
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
			}
		}
	}
</style>