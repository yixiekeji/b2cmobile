<template>
	<view class="classification">
		<!-- 自定义导航栏 -->
		<HeadNav nav-background-color="#f5f5f7" backImageUrl="8" @tests="test" textAlign="left"
			style="position: relative;z-index: 999;">
		</HeadNav>
		<!-- 分类主体内容 -->
		<view class="classificationMall">
			<!-- 侧边分类栏 -->
			<view class="u-tab-view menu-scroll-view">
				<view class="u-tab-item" :class="[catePid == 0 ? 'u-tab-item-active' : '']" @tap.stop="swichMenu(0)">
					<text class="u-line-1">全部</text>
				</view>
				<view v-for="(item) in catesData" class="u-tab-item"
					:class="[catePid == item.id ? 'u-tab-item-active' : '']" @tap.stop="swichMenu(item.id)">
					<text class="u-line-1">{{item.name}}</text>
				</view>
			</view>
			<!-- 分类页右侧大图 -->
			<view class="content-scroll-view">
				<view class="swiperBox" v-if="catePid != 0 && switchImg">
					<image :src="imageUrl + switchImg" mode="" style="height: 252rpx;width: 526rpx;"></image>
				</view>

				<!-- 分类商品内容 -->
				<view class="goodsContent">
					<view class="classification" v-if="catePid != 0">
						<view :class="classificationFlag?'classificationEvery':'classificationAllEvery'"
							@click="classification($event)">
							<text :class="cateId == 0 ? 'active' : ''" id="0">全部</text>
							<text :class="cateId == item.id ? 'active' : ''" :id="item.id"
								v-for="item,index in shopCates">{{item.name}}</text>
						</view>
						<view class="classificationAll" v-if="!classificationFlag">
							全部分类
						</view>
						<uni-icons @click="open" :type="openFlag?'bottom':'top'" size="22"></uni-icons>
					</view>
					<!-- 分类排序展示方式 -->
					<view class="titleBox" @click="goodssort($event)">
						<view id="1" :class="sort == 1 ? 'active' : ''">综合</view>
						<view id="2" :class="sort == 2 ? 'active' : ''">销量</view>
						<view id="4" class="price" :class="sort == 4 || sort == 5? 'active' : ''">
							价格
							<view class="imgBox">
								<view :class="sort == 4 ? 'topActive' : 'top'"></view>
								<view :class="sort == 5 ? 'bottomActive' : 'bottom'"></view>
							</view>
						</view>
					</view>
					<!-- 商品列表 -->
					<view class="goodsList" v-if="productData.length!=0">
						<view class="everyGoods" v-for="item in productData" @click="jumpDetail($event,item.id)">
							<image :src="imageUrl+item.masterImg" mode=""></image>
							<view>
								<view class="goodsTitle">
									{{item.name}}
								</view>
								<view class="goodsPrice">
									<view>
										<text>￥{{item.mallPrice}}</text>
									</view>
									<image id="addCart" @click="addCart(item.id,item.state)" src="@/static/cart.png"
										mode="">
									</image>
								</view>
							</view>
						</view>
					</view>
					<view v-if="loading"
						style="text-align: center;color: #999;width: 100%;height: 50rpx;line-height: 50rpx;font-size: 24rpx;">
						{{loadingText}}
					</view>
					<!-- 没有数据显示 -->
					<view class="noData" v-if="productData.length==0&&dataFlag">
						<image mode="widthFix" src="@/static/noList.png"></image>
						<view>暂无更多数据</view>
						<view style="height: 200rpx;"></view>
					</view>
				</view>
			</view>
		</view>
		<!-- 加入购物车弹出框 -->
		<uni-popup ref="popup" type="bottom" style="z-index: 999;">
			<view class="addCart">
				<view class="goodsDetail">
					<image :src="imageUrl+masterImg" mode=""></image>
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
					{{chooseValue == '' ? '':chooseValue}}
				</view>
				<!-- <view class="select" v-if="norm1==99&&norm2 == 99">
					{{details.productGoodsList[0].normName}}
				</view> -->
				<view class="specifications" v-if="norm2!=99">
					<view class="title">
						{{norm2}}
					</view>
					<uni-data-checkbox style="margin-left: 24rpx;margin-top: 30rpx;display: inline-block;"
						class="specificationsValue" selectedColor="rgba(28, 155, 100, 0.4)" selectedTextColor="#1C9B64"
						mode="tag" @change="norm2Change" v-model="norm2Value" :localdata="norm2s"></uni-data-checkbox>
				</view>
				<view class="colors" v-if="norm1!=99">
					<view class="title">
						{{norm1}}
					</view>
					<uni-data-checkbox style="margin-left: 24rpx;margin-top: 30rpx;display: inline-block;"
						class="colorsValue" selectedColor="rgba(28, 155, 100, 0.4)" selectedTextColor="#1C9B64"
						mode="tag" @change="norm1Change" v-model="norm1Value" :localdata="norm1s"></uni-data-checkbox>
				</view>
				<view class="num">
					<view>
						<text style="padding: 0 12rpx 0 0;">数量</text>
						<text>{{stock}}</text>
					</view>
					<uni-number-box v-model="numValue" :max="max" :min="min" />
				</view>
				<view style="border-top: 0.333px solid #CACACC;margin-top: 58rpx;"></view>
				<view class="confirmAddCart">
					<button @click="confirmAddCart()"
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
		getIndexCate,
		productlist,
		productDetail,
		detailgoods,
		cartSave
	} from '@/api/classification.js'
	let catesData = ref([]) //分类数据
	let productData = ref([]) //商品列表
	const catePid = ref(0) //分类id
	const sort = ref(1) //排序id
	const page = ref(1) //页码
	let details = ref({})
	const scrollTop = ref(0) //tab标题的滚动条位置
	const oldScrollTop = ref(0)
	const scrollTopp = ref(0)
	const itemId = ref('')
	let tabbar = ref([])
	const current = ref(0)
	const mode = ref('dot')
	let dotsStyles = ref({
		backgroundColor: 'rgba(0, 0, 0,0.3)',
		border: '0px rgba(83, 200, 249,0.3) solid',
		color: '#fff',
		selectedBackgroundColor: '#1C9B64',
		selectedBorder: '2rpx solid #FFFFFF'
	})
	// const classificationFlag = ref(true)
	const statusBarHeight = ref(0)
	const top = ref(0)
	let norm1s = ref([]) //颜色
	const norm1 = ref('') //颜色
	const norm1Value = ref('')
	let norm2s = ref([]) //规格
	const norm2 = ref('') //规格
	const norm2Value = ref('')
	const isNormVale = ref('')
	const masterImg = ref('') //图片url
	const mallPrice = ref('') //商品价格
	const name = ref('') //商品标题
	const stock = ref('') //库存
	const productId = ref('')
	const max = ref(1)
	const min = ref(0)
	const numValue = ref(1)
	const productGoodId = ref('') //货品id
	const chooseValue = ref('') //已选参数
	const loading = ref(false) //加载效果开关
	const loadingText = ref('加载中...') //加载文案
	const popup = ref()

	const openFlag = ref(true)
	const classificationFlag = ref(true)
	const cateId = ref('0')
	const shopCates = ref([])

	const dataFlag = ref(false)

	function open() {
		openFlag.value = !openFlag.value
		classificationFlag.value = !classificationFlag.value
	}
	// 分类导航折叠面板
	function classification(e) {
		if (e.target.id) {
			cateId.value = e.target.id
			sort.value = 1
			page.value = 1;
			productData.value = []
			loading.value = false
			getProductList()
		}

	}

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
					productId: productId.value
				}).then(res => {
					mallPrice.value = res.data.data.mallPrice
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
					stock.value = res.data.data.stock == 0 ? '暂无库存' : ('剩余' + res.data
						.data.stock + '件')
				})
			}, 100)
		} else if (norm1.value != 99 && norm2.value != 99) {
			if (norm1Value.value != '' && norm2Value.value != '') {
				setTimeout(() => {
					detailgoods({
						normName: chooseValue.value,
						productId: productId.value
					}).then(res => {
						console.log(res);
						mallPrice.value = res.data.data.mallPrice
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
						stock.value = res.data.data.stock == 0 ? '暂无库存' : ('剩余' + res
							.data.data.stock + '件')
					})
				}, 100)

			}
		}
	}
	//获取商品分类
	function getProductCates() {
		getIndexCate().then(res => {
			catesData.value = res.data.data
			shopCates.value = []
			catesData.value.forEach(item => {
				shopCates.value = [...shopCates.value, ...item.children]
			})
		})
	}
	//获取商品列表
	function getProductList() {
		dataFlag.value = false
		productlist({
			catePid: catePid.value,
			cateId: cateId.value,
			page: page.value,
			sort: sort.value
		}).then(res => {

			if (res.data.data.products.length == 0 && page.value > 1 && productData.value.length > 20) {
				loadingText.value = '到底啦~'
			} else {
				productData.value = [...productData.value, ...res.data.data.products]
				loading.value = false
			}
			dataFlag.value = true
			console.log(productData.value.length);

		})
	}
	//商品排序
	function goodssort(e) {
		if (e.target.id && e.target.id != sort.value) {
			if (e.target.id == 1) {
				sort.value = 1
			} else if (e.target.id == 2) {
				sort.value = 2
			} else if (e.target.id == 4) {
				sort.value = 4
			}
			page.value = 1;
			productData.value = []
			loading.value = false
			getProductList()
		} else if (e.target.id == 4) {
			sort.value = 5
			page.value = 1;
			loading.value = false
			productData.value = []
			getProductList()
		}
	}
	//获取商品详情
	function addCart(id, val) {
		if (val != 2) {
			uni.showToast({
				icon: 'none',
				duration: 3000,
				title: `该商品已下架`
			});
			return
		}
		productId.value = id
		norm1s.value = []
		norm2s.value = []
		norm1.value = ''
		norm2.value = ''
		norm1Value.value = ''
		norm2Value.value = ''
		productDetail({
			productId: id
		}).then(res => {
			if (res.data.data.product.isNorm == 0) {
				norm1.value = 99
				norm2.value = 99
				productGoodId.value = res.data.data.product.productGoodsList[0].id
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

			stock.value = res.data.data.product.productGoodsList[0].stock == 0 ? '暂无库存' : ('剩余' + res.data
				.data.product.productGoodsList[0].stock + '件')
			name.value = res.data.data.product.name
			masterImg.value = res.data.data.product.masterImg
			mallPrice.value = res.data.data.product.mallPrice
			details.value = res.data.data.product
			if (res.data.data.product.productGoodsList[0].stock == 0) {
				min.value = 0
				max.value = 0
				numValue.value = 0
			} else {
				min.value = 1
				max.value = res.data.data.product.productGoodsList[0].stock
				numValue.value = 1
			}
			popup.value.open()
		})

	}
	//关闭加购
	function close() {
		popup.value.close()
	}
	//确认加入购物车
	function confirmAddCart() {
		cartSave({
			productId: productId.value,
			number: numValue.value,
			productGoodId: productGoodId.value
		}).then(res => {
			if (res.data.success) {
				uni.showToast({
					icon: 'none',
					duration: 3000,
					title: `加购成功`
				});
			}
			console.log(res);
		})
		popup.value.close()
		// success.value.open()
	}

	const switchImg = ref('')
	//分类筛选
	function swichMenu(index) {
		if (index == catePid.value) return;
		shopCates.value = []
		console.log(catesData.value);
		catesData.value.forEach(item => {
			if (item.id == index) {
				switchImg.value = item.image
				shopCates.value = [...shopCates.value, ...item.children]
			} else if (index == 0) {
				shopCates.value = [...shopCates.value, ...item.children]
			}
		})
		sort.value = 1
		page.value = 1;
		cateId.value = 0
		catePid.value = index;
		productData.value = []
		getProductList()
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

	function onPageScroll(e) {
		scrollTop.value = e.scrollTop;
	}

	function change(e) {
		current.value = e.detail.current;
	}

	function onPageJump(url) {
		uni.navigateTo({
			url: url
		});
	}

	function jumpDetail(e, id) {
		console.log(e.target);
		if (e.target.id != 'addCart') {
			uni.navigateTo({
				url: '/pages/homePage/goodsDetail?id=' + id
			});
		}
	}

	onShow(() => {
		sort.value = 1
		page.value = 1;
		cateId.value = 0;
		productData.value = []
		getProductList()
		getProductCates()
	})
	//上拉加载
	onReachBottom(() => {
		console.log(productData.value.length);
		if (productData.value.length >= 20 * page.value) {
			page.value += 1
			loading.value = true
			loadingText.value = '加载中...'
			setTimeout(() => {

				getProductList()
			}, 800)
		} else if (productData.value.length != 0) {
			console.log(1111222);
			loading.value = true
			loadingText.value = '到底啦~'
		}
	})
	//下拉刷新
	onPullDownRefresh(() => {
		setTimeout(() => {
			productData.value = []
			page.value = 1
			getProductList()
			uni.stopPullDownRefresh()
		}, 800)
	})
</script>

<style lang="scss">
	.classification {
		width: 750rpx;
		height: 100%;
		background-color: #f7f7f5;

		.noData {
			// background-color: red;
			height: 100%;
			text-align: center;
			margin-top: 250rpx;
			// margin-left: 70rpx;
			font-size: 26rpx;
			color: gray;

			image {
				width: 100%;
				// height: 190rpx;
			}
		}

		/* 隐藏滚动条 */
		::-webkit-scrollbar {
			display: none;
		}

		.classificationMall {
			width: 100%;
			// height: 100%;
			display: flex;
			box-sizing: border-box;
			padding-bottom: var(--window-bottom);

			.u-tab-view {
				width: 200rpx;
				height: 100%;
				flex: 1;
				left: 0;
				overflow: hidden;
				overflow-y: scroll;
				position: fixed;
				padding-bottom: 200rpx;
				box-sizing: border-box;

				.u-tab-item {
					height: 110rpx;
					width: 200rpx;
					background: #f6f6f6;
					box-sizing: border-box;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 28rpx;
					color: #444;
					font-weight: 400;
					line-height: 1;
				}

				.u-tab-item-active {
					position: relative;
					color: #1C9B64;
					font-size: 30rpx;
					font-weight: 600;
					background: #fff;
				}

				.u-tab-item-active::before {
					content: "";
					position: absolute;
					border-left: 3px solid #1C9B64;
					height: 52rpx;
					left: 0;
					top: 29rpx;
				}
			}

			.content-scroll-view {
				// height: 100%;
				overflow: auto;
				margin-left: 200rpx;
				// flex: 1;
				width: 550rpx;
				background-color: #FFFFFF;

				.swiperBox {
					height: 252rpx;
					width: 526rpx;
					margin: 12rpx auto;
					border-radius: 20rpx;
					overflow: hidden;

					image {
						height: 252rpx;
						width: 526rpx;
					}
				}

				.goodsContent {
					// height: 100%;
					position: relative;
					width: 526rpx;

					.titleBox {
						display: flex;
						font-size: 28rpx;
						color: #999;
						padding: 12rpx;
						box-sizing: border-box;
						border-bottom: 5rpx solid #eeeeee55;

						view {
							line-height: 34rpx;
							margin-right: 70rpx;
						}

						.price {
							display: flex;
							align-items: center;

							.imgBox {
								width: 12rpx;
								display: flex;
								flex-wrap: wrap;
								margin-left: 12rpx;
								height: 18.4rpx;

								.top {
									width: 0;
									height: 0;
									border-bottom: 10rpx solid #BDBDBD;
									border-left: 6rpx solid transparent;
									border-right: 6rpx solid transparent;
									margin-bottom: 2.5rpx;
								}

								.topActive {
									width: 0;
									height: 0;
									border-bottom: 10rpx solid #1C9B64;
									border-left: 6rpx solid transparent;
									border-right: 6rpx solid transparent;
									margin-bottom: 2.5rpx;
								}

								.bottom {
									width: 0;
									height: 0;
									border-top: 10rpx solid #BDBDBD;
									border-left: 6rpx solid transparent;
									border-right: 6rpx solid transparent;
								}

								.bottomActive {
									width: 0;
									height: 0;
									border-top: 10rpx solid #1C9B64;
									border-left: 6rpx solid transparent;
									border-right: 6rpx solid transparent;
								}
							}
						}

						.active {
							color: #1C9B64;
						}
					}

					.goodsList {
						padding: 0 12rpx;
						margin-top: 22rpx;
						height: 100%;

						.everyGoods {
							margin: 18rpx 0;
							display: flex;
							justify-content: space-between;

							image {
								width: 160rpx;
								height: 160rpx;
							}

							view {
								width: 348rpx;
								padding-left: 10rpx;

								box-sizing: border-box;

								.goodsTitle {
									padding-top: 20rpx;
									font-size: 30rpx;
									line-height: 40rpx;
									color: #111111;
									line-clamp: 2;
									overflow: hidden; //超出文本隐藏
									text-overflow: ellipsis; ///超出部分省略号显示
									display: -webkit-box; //弹性盒模型
									-webkit-box-orient: vertical; //上下垂直
									-webkit-line-clamp: 2; //自定义行数
								}

								.goodsPrice {
									display: flex;
									justify-content: space-between;
									margin-top: 32rpx;

									view {
										font-size: 34rpx;
										line-height: 34rpx;
										color: #DC3A2F;
										font-weight: 600;

										text {
											font-size: 32rpx;
										}
									}

									image {
										width: 38rpx;
										height: 38rpx;
									}
								}
							}
						}
					}
				}

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
					width: 452rpx;
					margin-left: 18rpx;

					.goodsTitle {
						font-size: 30rpx;
						line-height: 40rpx;
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
						font-size: 38rpx;
						line-height: 38rpx;
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
				font-size: 26rpx;
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
					font-size: 28rpx;
					line-height: 28rpx;
					margin-top: 40rpx;
					margin-left: 24rpx;
					font-weight: 700;
				}
			}

			.colors {
				.title {
					color: #333333;
					font-size: 28rpx;
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
					font-size: 28rpx;
					line-height: 28rpx;
				}

				text:nth-child(2) {
					color: #E0462D;
					font-size: 20rpx;
					background: #F8E0DC;
					padding: 1rpx 5rpx;
					zoom: 1;
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
					font-size: 28rpx;
					font-weight: 600;
					// margin: 12rpx auto;
				}
			}
		}

		.classification {
			height: 88rpx;
			width: 100%;
			display: flex;
			align-items: center;
			flex-wrap: nowrap;
			z-index: 99;
			background-color: #fff;
			position: relative;

			.classificationEvery {
				width: 90%;
				white-space: nowrap;
				// overflow-x: scroll;
				overflow: hidden;
				display: flex;
				flex-wrap: nowrap;

				text {
					background: #F5F5F7;
					border-radius: 10rpx;
					font-size: 28rpx;
					line-height: 30rpx;
					padding: 7rpx 17rpx;
					margin: 0 12rpx;
					color: #666;
					box-sizing: border-box;
					white-space: nowrap;
				}

				.active {
					background-color: #1C9B64;
					color: #fff;
				}
			}

			.classificationAllEvery {
				width: 100%;
				position: absolute;
				top: 88rpx;
				display: flex;
				flex-wrap: wrap;
				background-color: #fff;
				border-bottom-left-radius: 30rpx;
				border-bottom-right-radius: 30rpx;
				z-index: 99;

				text {
					background: #F5F5F7;
					border-radius: 10rpx;
					font-size: 30rpx;
					padding: 7rpx 17rpx;
					margin: 12rpx 12rpx;
					color: #666;
					box-sizing: border-box;
				}

				.active {
					background-color: #1C9B64;
					color: #fff;
				}
			}

			.classificationAll {
				width: 90%;
				padding-left: 12rpx;
				font-size: 32rpx;
				color: #454545;
			}
		}
	}
</style>