<template>
	<view class="goodsDetail">
		<!-- 自定义标题 -->
		<HeadNav nav-background-color="#f7f7f5" backImageUrl="1" @tests="test" textContent="积分商城详情" fontSize="16"
			fontWeight="600" style="z-index: 999999;position: relative;"></HeadNav>
		<!-- 商品主图 -->
		<view class="backPage">
			<uni-swiper-dot :info="masterImg" :current="current" field="content" :mode="mode" :dots-styles="dotsStyles"
				class="images">
				<swiper class="swiper-box" autoplay circular @change="change"
					style="background-color: aqua;width:  750rpx;height:  750rpx;">
					<swiper-item v-if="masterImg" v-for="(item,index) in masterImg" :key="index">
						<image :src="imageUrl+item.imagePath" style="width: 100%;height: 750rpx;"></image>
					</swiper-item>
					<swiper-item v-else>
						<image :src="imageUrl+masterImgs" style="width: 100%;height: 750rpx;"></image>
					</swiper-item>
				</swiper>
			</uni-swiper-dot>
		</view>
		<!-- 换购信息 -->
		<view class="exchangeIfm">
			<view>
				<view>换购价：<text>{{price}}积分<text
							v-if="integral.isWithMoney == '1'">+￥{{mallPrice}}</text></text></view>
				<view>已兑换：<text>{{integral.saleNum}}</text>人</view>
			</view>
			<view>
				<view>市场价：￥{{integral.marketPrice}}</view>
				<view>结束时间：<text>{{integral.endTime}}</text></view>
			</view>
		</view>
		<!-- 商品标题 -->
		<view class="goodsTitle">
			{{integral.name}}
		</view>
		<!-- 商品规格 -->
		<view class="goodsSpecs">
			<view>
				<view>
					<view>已选</view>
					<text>{{chooseValue}}</text>
					<view>{{stock}}</view>
				</view>
				<uni-icons type="right" size="17" color="#999999"></uni-icons>
			</view>
			<view class="specifications" v-if="norm2!=99">
				<view>
					<view>{{norm2}}</view>
					<text></text>
					<view>
						<uni-data-checkbox style="margin-top: 10rpx;" class="specificationsValue"
							selectedColor="rgba(28, 155, 100, 0.4)" selectedTextColor="#1C9B64" mode="tag"
							@change="norm2Change" v-model="norm2Value" :localdata="norm2s"></uni-data-checkbox>
					</view>
				</view>
			</view>
			<view class="specifications" v-if="norm1!=99">
				<view>
					<view>{{norm1}}</view>
					<text></text>
					<view>
						<uni-data-checkbox style="margin-top: 10rpx;" class="specificationsValue"
							selectedColor="rgba(28, 155, 100, 0.4)" selectedTextColor="#1C9B64" mode="tag"
							@change="norm1Change" v-model="norm1Value" :localdata="norm1s"></uni-data-checkbox>
					</view>
				</view>
			</view>
			<view class="integral">
				<view>
					<view>数量</view>
					<text>单次限购{{integral.purchase}}件</text>
				</view>
				<view>
					<uni-number-box v-model="count" min="1" :max="integral.purchase"
						@change="addShopCarts($event,count,item.id)" />
				</view>
			</view>
		</view>
		<!-- 图文详情 -->
		<view class="imgDetail">
			<view>—— 图文详情 ——</view>
			<rich-text :nodes="description"></rich-text>
		</view>
		<!-- 按钮 -->
		<view class="bthBox">
			<button @click="jumpDetails()">对比原商品</button>
			<button @click="confirmAddCart()">立即兑换</button>
		</view>
		<!-- 加入购物车弹窗 -->
		<uni-popup ref="popup" type="bottom" style="z-index: 999;">

			<view class="addCart">
				<view class="goodsDetail">
					<image :src="imageUrl+masterImgs" mode=""></image>
					<view>
						<view class="goodsTitle">
							{{name}}
						</view>
						<view class="goodsPrice">
							<text>￥</text>{{mallPrice}}
						</view>
					</view>
					<uni-icons class="close" type="closeempty" color="#999" size="18" @click="close"></uni-icons>
				</view>
				<view class="select selectValue" v-if="norm1Value != ''||norm2Value != ''">
					{{chooseValue}}
				</view>
				<view class="specifications" v-if="norm2!=99">
					<view class="title">
						{{norm2}}
					</view>
					<uni-data-checkbox style="margin-left: 24rpx;margin-top: 30rpx;" class="specificationsValue"
						selectedColor="rgba(28, 155, 100, 0.1)" selectedTextColor="#1C9B64" mode="tag"
						@change="norm2Change" v-model="norm2Value" :localdata="norm2s"></uni-data-checkbox>
				</view>
				<view class="colors" v-if="norm1!=99">
					<view class="title">
						{{norm1}}
					</view>
					<uni-data-checkbox style="margin-left: 24rpx;margin-top: 30rpx;" class="colorsValue"
						selectedColor="rgba(28, 155, 100, 0.1)" selectedTextColor="#1C9B64" mode="tag"
						@change="norm1Change" v-model="norm1Value" :localdata="norm1s"></uni-data-checkbox>
				</view>
				<view class="num">
					<view>
						<text>数量</text>
						<text>{{stock}}</text>
					</view>
					<uni-number-box v-model="numValue" :max="max" :min="min" />
				</view>
				<view style="border-top: 0.333px solid #CACACC;margin-top: 58rpx;"></view>
				<view class="confirmAddCart">
					<button @click="confirmAddCart(1)"
						:disabled="stock == '暂无库存'">{{stock == '暂无库存'?stock:'确定'}}</button>
				</view>
			</view>
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
		onLoad,
		onPullDownRefresh,
		onReachBottom
	} from "@dcloudio/uni-app";
	import {
		jifenDetail,
		detailgoods,
	} from '@/api/integralPage.js'
	import {
		comment
	} from '@/api/reviews.js'
	import {
		order
	} from "@/store/order";

	let dotsStyles = ref({
		backgroundColor: 'rgba(0, 0, 0,0.3)',
		border: '0px rgba(83, 200, 249,0.3) solid',
		color: '#fff',
		selectedBackgroundColor: '#1C9B64',
		selectedBorder: '2rpx solid #FFFFFF'
	})
	const mode = ref('default')
	let date = ref([])

	const current = ref(0)

	let details = ref({})
	let norm1s = ref([]) //颜色
	const norm1 = ref('') //颜色
	const norm1Value = ref('')
	let norm2s = ref([]) //规格
	const norm2 = ref('') //规格
	const norm2Value = ref('')
	const isNormVale = ref('')
	let masterImg = ref([]) //图片url
	const masterImgs = ref('') //图片url
	const mallPrice = ref('') //商品价格
	const name = ref('') //商品标题
	const description = ref('') //商品图文
	const stock = ref('') //库存
	const isCollenction = ref(false) //是否收藏
	const productId = ref('')
	const max = ref(1)
	const min = ref(0)
	const numValue = ref(1)
	const productGoodId = ref('') //货品id
	const id = ref('') //商品id
	const chooseValue = ref('') //已选参数
	const isAddCart = ref('') //判断是否加入购物车
	const isSelf = ref('')
	const report = ref('')
	const sales = ref('0')
	const popup = ref()
	let integral = ref({})
	const count = ref(1)
	let productCommentList = ref([])
	const price = ref('')
	const state = ref('')

	// 判断规格型号
	function norm2Change(val) {
		getinfor()
		choose()
	}

	function norm1Change(val) {
		getinfor()
		choose()
	}
	//获取已选择商品的价钱等
	function getinfor() {
		if (norm1.value == 99 && norm2.value == 99) {
			return
		} else if (norm2.value == 99) {
			setTimeout(() => {
				detailgoods({
					normName: chooseValue.value,
					integralId: id.value
				}).then(res => {
					mallPrice.value = res.data.data.mallPrice
					price.value = res.data.data.integralPrice
					if (res.data.data.stock == 0) {
						min.value = 0
						max.value = 0
						numValue.value = 0
					} else {
						min.value = 1
						max.value = res.data.data.stock
						numValue.value = 1
					}
					productGoodId.value = res.data.data.id
					stock.value = res.data.data.stock == 0 ? '暂无库存' : ('(剩余库存:' + res.data
						.data.stock + ')')
				})
			}, 100)
		} else if (norm1.value != 99 && norm2.value != 99) {
			if (norm1Value.value != '' && norm2Value.value != '') {
				setTimeout(() => {
					detailgoods({
						normName: chooseValue.value,
						integralId: id.value
					}).then(res => {
						console.log(res);
						mallPrice.value = res.data.data.mallPrice
						price.value = res.data.data.integralPrice
						if (res.data.data.stock == 0) {
							min.value = 0
							max.value = 0
							numValue.value = 0
						} else {
							min.value = 1
							max.value = res.data.data.stock
							numValue.value = 1
						}
						productGoodId.value = res.data.data.id
						stock.value = res.data.data.stock == 0 ? '暂无库存' : ('(剩余库存:' + res.data
							.data.stock + ')')
					})
				}, 100)

			}
		}
	}
	// 加入购物车
	function addCart() {
		productId.value = id.value
		norm1s.value = []
		norm2s.value = []
	
		// 获取商品详情
		jifenDetail({
			integralId: id.value
		}).then(res => {
			if (res.data.data.product.isNorm == 0) {
				norm1.value = 99
				norm2.value = 99
				// productId.value = res.data.data.integralGoods.id
				productGoodId.value = res.data.data.integralGoods.id
			} else if (res.data.data.product.isNorm == 1) {
				norm1.value = res.data.data.norm1
				res.data.data.norm1s.forEach(item => {
					norm1s.value.push({
						text: item,
						value: item,
					})
					norm1Value.value = norm1s.value[0].value
				})
				if (res.data.data.norm2) {
					norm2.value = res.data.data.norm2
					res.data.data.norm2s.forEach(item => {
						norm2s.value.push({
							text: item,
							value: item,
						})
						norm2Value.value = norm2s.value[0].value
					})

				} else {
					norm2.value = 99
				}
				choose()
				getinfor()
			}

			stock.value = res.data.data.integral.stock == 0 ? '暂无库存' : ('(剩余库存:' + res.data
				.data.integral.stock + ')')
			name.value = res.data.data.integral.name
			integral.value = res.data.data.integral
			description.value = formatRichText(res.data.data.integral.descinfo)
			masterImg.value = res.data.data.integral.productPictureList
			masterImgs.value = res.data.data.integral.image
			mallPrice.value = res.data.data.integral.priceMoney
			state.value = res.data.data.integral.state
			price.value = res.data.data.integral.price
			// sales.value = res.data.data.product.productGoodsList[0].sales
			details.value = res.data.data.product
			isSelf.value = res.data.data.product.isSelf
			report.value = res.data.data.report
		})

	}
	// 购物车弹框————选规格
	function getDailog(val) {
		isAddCart.value = val
		popup.value.open()
	}
	// 购物车弹框————点击导航栏按钮
	function buttonClick(val) {
		isAddCart.value = val
		popup.value.open()
	}
	//关闭加购
	function close() {
		popup.value.close()
	}

	// 确认添加到购物车
	function confirmAddCart(val) {
		if(state.value != 2){
			uni.showToast({
				icon: 'none',
				duration: 3000,
				title: `该商品已下架`
			});
			return
		}
		if (val == 1) {
			popup.value.close()
		} else {
			order().resize()
			order().setProductId(productId.value)
			order().setProductGoodId(productGoodId.value)
			order().setNumber(count.value)
			console.log(order().order);
			popup.value.close()
			if (uni.getStorageSync("token")) {
				uni.navigateTo({
					url: "/pages/memberCenter/integralPage/confirmOrder"
				});
			} else {
				uni.navigateTo({
					url: '/pages/loginInterface/passwordLogin'
				})
			}

		}

	}

	//返回上一页
	function back() {
		uni.navigateBack({
			delta: 1
		})
	}

	function jump() {
		uni.navigateTo({
			url: '/pages/homePage/reviewsPage?id=' + id.value
		});
	}

	function jumpDetails() {
		uni.navigateTo({
			url: "/pages/homePage/goodsDetail?id=" + id.value
		});
	}
	//选择参数
	function choose() {
		let aaa = ''
		if (norm1.value != 99 && norm1Value.value != '') {
			aaa = norm1.value + ','
		} else {
			aaa = ''
		}
		let bbb = ''
		if (norm1Value.value != '' && norm2Value.value != '') {
			bbb = ';'
		} else {
			bbb = ''
		}
		let ccc = ''
		if (norm2.value != 99 && norm2Value.value != '') {
			ccc = norm2.value + ','
		} else {
			ccc = ''
		}
		chooseValue.value = aaa + norm1Value.value + bbb + ccc + norm2Value.value
	}

	function getComment() {
		comment({
			productId: id.value,
		}).then(res => {
			console.log(res);
			let data = res.data.data
			data.forEach(item => {
				if (item.replyContent.length > 51) {
					item.textOpenFlag = true
				} else {
					item.textOpenFlag = null
				}
			})
			productCommentList.value = [...data]

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
		newContent = newContent.replace(/\<img/gi, '<img style="width:100%;height:auto;display:block;"');
		return newContent;
	}
	onLoad((options) => {
		id.value = options.id
		addCart()
		getComment()
	})
</script>
<style lang="scss" scoped>
	.goodsDetail {
		width: 750rpx;
		height: 100%;

		.backPage {
			width: 750rpx;
			height: 750rpx;
			position: relative;

			.images {
				width: 750rpx;
				height: 750rpx;
			}
		}

		.exchangeIfm {
			width: 750rpx;
			height: 118rpx;
			background: linear-gradient(135deg, #FEE9A9 0%, #FBC76C 100%);
			border-radius: 0rpx 0rpx 0rpx 0rpx;
			padding: 20rpx 26rpx;
			box-sizing: border-box;

			>view:nth-child(1) {
				display: flex;
				justify-content: space-between;
				align-items: center;

				>view:nth-child(1) {
					font-size: 28rpx;

					>text {
						color: #DC3A2F;
						font-weight: 700;
					}
				}

				>view:nth-child(2) {
					font-size: 24rpx;

					>text {
						color: #DC3A2F;
					}
				}
			}

			>view:nth-child(2) {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 14rpx;

				>view:nth-child(1) {
					font-size: 24rpx;
					color: #999999;
				}

				>view:nth-child(2) {
					font-size: 24rpx;

					>text {
						color: #DC3A2F;
					}
				}
			}
		}

		.goodsTitle {
			width: 714rpx;
			// height: 120rpx;
			background: #FFFFFF;
			border-radius: 24rpx 24rpx 24rpx 24rpx;
			margin: 18rpx;
			padding: 20rpx 19rpx;
			box-sizing: border-box;
			font-weight: 600;
			font-size: 30rpx;
			color: #111111;
			line-height: 46rpx;
			text-align: left;
		}

		.goodsSpecs {
			width: 714rpx;
			background: #FFFFFF;
			border-radius: 24rpx 24rpx 24rpx 24rpx;
			margin-left: 18rpx;
			padding: 26rpx 14rpx;
			box-sizing: border-box;

			>view:nth-child(1) {
				width: 100%;
				height: 34rpx;
				display: flex;
				justify-content: space-between;
				margin-bottom: 54rpx;

				>view:nth-child(1) {
					display: flex;
					font-size: 24rpx;
					color: #999999;

					>text {
						color: #111111;
						margin-left: 32rpx;
						margin-right: 6rpx;
					}
				}
			}

			.specifications {
				width: 100%;
				// height: 34rpx;
				display: flex;
				justify-content: space-between;

				margin-bottom: 54rpx;

				>view:nth-child(1) {
					width: 100%;
					display: flex;
					font-size: 24rpx;
					color: #999999;
					flex-wrap: wrap;

					>view:nth-child(1) {
						width: 100%;
					}

					>text {
						color: #111111;
						margin-left: 32rpx;
						margin-right: 6rpx;
					}

					>view:nth-child(2) {
						width: 100%;
					}
				}

			}

			.integral {
				display: flex;
				justify-content: space-between;

				>view:nth-child(1) {
					display: flex;
					font-size: 24rpx;
					color: #999999;

					>text {
						color: #111111;
						margin-left: 32rpx;
					}

				}
			}
		}

		.imgDetail {
			font-size: 28rpx;
			width: 750rpx !important;
			text-align: center;
			// height: 40rpx;
			color: #999999;
			box-sizing: border-box;
			padding-bottom: 100rpx;

			view {
				margin-top: 30rpx;
				margin-bottom: 22rpx;
			}

		}

		.bthBox {
			width: 750rpx;
			height: 120rpx;
			background: #FFFFFF;
			border: 1rpx solid #CACACC;
			display: flex;
			justify-content: space-around;
			align-items: center;
			position: fixed;
			bottom: 0;
			left: 0;

			>button:nth-child(1) {
				width: 303rpx;
				height: 80rpx;
				background: #FFFFFF;
				border-radius: 24rpx 24rpx 24rpx 24rpx;
				border: 4rpx solid #1C9B64;
				font-size: 32rpx;
				color: #1C9B64;
			}

			>button:nth-child(2) {
				width: 303rpx;
				height: 80rpx;
				background: #1C9B64;
				border-radius: 24rpx 24rpx 24rpx 24rpx;
				color: #FFFFFF;
				font-size: 32rpx;
			}
		}

		.addCart {
			height: auto;
			border-radius: 24rpx 24rpx 0 0;
			background-color: #fff;

			.goodsDetail {
				display: flex;
				padding-top: 56rpx;
				box-sizing: border-box;
				position: relative;

				image {
					width: 160rpx;
					height: 160rpx;
					margin-left: 24rpx;
				}

				view {
					// margin: 56rpx 0 9rpx 0;
					width: 452rpx;
					margin-left: 18rpx;

					.goodsTitle {
						font-size: 28rpx;
						// line-height: 40rpx;
						color: #111111;
						line-clamp: 2;
						overflow: hidden; //超出文本隐藏
						text-overflow: ellipsis; ///超出部分省略号显示
						display: -webkit-box; //弹性盒模型
						-webkit-box-orient: vertical; //上下垂直
						-webkit-line-clamp: 2; //自定义行数
					}

					.goodsPrice {
						margin-top: 32rpx;
						font-size: 28rpx;
						line-height: 34rpx;
						color: #DC3A2F;
						font-weight: 600;

						text {
							font-size: 24rpx;
						}
					}

				}

				.close {
					position: absolute;
					right: 22rpx;
					top: 24rpx;
				}
			}

			.select {
				color: #666666;
				font-size: 22rpx;
				line-height: 30rpx;
				background-color: #F5F5F7;
				border-radius: 10rpx;
				padding: 10rpx 17rpx;
				display: inline-block;
				margin: 40rpx 0 0 24rpx;
			}

			.specifications {
				.title {
					color: #333333;
					font-size: 24rpx;
					line-height: 28rpx;
					margin-top: 40rpx;
					margin-left: 24rpx;
					font-weight: 700;
				}
			}

			.colors {
				.title {
					color: #333333;
					font-size: 24rpx;
					line-height: 28rpx;
					margin-top: 40rpx;
					margin-left: 24rpx;
					font-weight: 700;
				}
			}

			.num {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin: 62rpx 24rpx 0;

				text:nth-child(1) {
					color: #333;
					font-weight: 700;
					font-size: 24rpx;
					line-height: 28rpx;
				}

				text:nth-child(2) {
					color: #E0462D;
					font-size: 18rpx;
					background: #F8E0DC;
					padding: 1rpx 5rpx;
					zoom: 0.8;
					border-radius: 6rpx;
				}
			}

			.confirmAddCart {
				padding-bottom: 12rpx;
				padding-top: 12rpx;

				button {
					width: 702rpx;
					height: 68rpx;
					background: #1C9B64;
					border-radius: 24rpx;
					color: #fff;
					font-size: 24rpx;
					font-weight: 600;
				}
			}
		}
	}
</style>