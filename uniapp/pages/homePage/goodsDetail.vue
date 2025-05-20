<template>
	<view class="goodsDetail">
		<HeadNav nav-background-color="#f7f7f5" backImageUrl="1" @tests="test" textContent="商品详情" fontSize="15"
			fontWeight="600" style="z-index: 999999;position: relative;"></HeadNav>
		<!-- 商品主图 -->
		<view class="backPage">
			<!-- <image :src="imageUrl + masterImg" mode=""></image> -->
			<uni-swiper-dot :info="masterImg" :current="current" field="content" :mode="mode" :dots-styles="dotsStyles"
				class="images">
				<swiper class="swiper-box" autoplay circular @change="change"
					style="background-color: aqua;width: 750rpx;height: 750rpx;">
					<swiper-item v-for="(item,index) in masterImg" :key="index">
						<image :src="imageUrl+item.imagePath" style="width: 100%;height: 750rpx;"></image>
					</swiper-item>
				</swiper>
			</uni-swiper-dot>
		</view>
		<!-- 商品详细介绍 -->
		<view class="goodsDescribe">
			<view class="describeBox">
				<view class="priceBox">
					<view class="font1">¥ {{mallPrice}}</view>
					<view class="font2">全渠道已售：{{sales}}件</view>
				</view>
				<view class="imgBox">
					<view class="imgBoxContent" @click="shareToggle">
						<image src="../../static/home/share.png"></image>
						<view>分享</view>
						<!-- #ifdef MP-WEIXIN -->
						<button id="shareBtn" open-type="share"
							style="opacity: 0;position: absolute;z-index: 2;width: 100%;height: 100%;top: 0;left: 0;">购买分享(opicty透明)</button>
						<!-- #endif -->
					</view>
					<view class="imgBoxContent">
						<view class="heartBox">
							<uni-icons @click="isCollenctions" :type="isCollenction?'heart-filled':'heart'" size="44rpx"
								color="#1C9B64"></uni-icons>
						</view>
						<view>{{isCollenction?'已收藏':'收藏'}}</view>
					</view>
				</view>
			</view>
			<view class="describeFont">{{name}}</view>
		</view>
		<!-- 优惠券 -->
		<view class="coupon" v-if="EffectiveCoupon.length>0">
			<view class="title">
				<text>领券</text>
				<text>共{{EffectiveCoupon.length}}张</text>
			</view>
			<view class="content">
				<view v-for="item in EffectiveCoupon">
					<view class="amount">
						<view>￥{{item.couponValue}}</view>
						<view @click="getCoupon(item.id)">领 取</view>
					</view>
					<view class="available">
						满{{item.minAmount}}元可用
					</view>
				</view>
			</view>
		</view>
		<!-- 选择商品规格 | 地址 -->
		<view class="goodsSpecs">
			<view class="specsDetail" v-if="!(norm1==99&&norm2 == 99)">
				<view class="detail1">已选</view>
				<view class="detail2" @click="getDailog(1)">
					<uni-list-item v-if="norm1==99&&norm2 == 99" :border="false" showArrow
						:title="details.productGoodsList[0].normName" />
					<uni-list-item v-else :border="false" showArrow :title="chooseValue == '' ? '未选择':chooseValue" />
				</view>
			</view>
			<view class="specsDetail" @click="chooseAddress">
				<view class="detail1">送至</view>
				<view class="detail2">
					<pick-regions :defaultRegion="defaultRegionCode" @getRegion="handleGetRegion">
						<uni-list-item showArrow :title="regionName == '' ? '请选择':regionName"
							:note="regionName == ''? '付款成功后，预计24小时内发货':free+'元起'" />
					</pick-regions>
				</view>
			</view>
			<view class="specsDetail" v-if="report">
				<view class="detail1">详细</view>
			</view>
			<view class="specsDetail" style="margin-bottom: 0;">
				<view class="detail1">参数</view>
				<view class="detail2a" @click="parameter">
					<view style="color: #999;">
						<view v-for="item,index in productAttrList" :style="{display:index>3?'none':''}">
							<view>

								<view>{{item.value }}</view>
								<view>{{item.name}}</view>
							</view>
							<text v-show="productAttrList.length>4?index<3:index<productAttrList.length-2">|</text>
						</view>
					</view>
					<uni-icons style="padding: 0 20rpx;" type="right" size="16" color="#999"></uni-icons>
				</view>

			</view>
		</view>
		<!-- 评价 -->
		<view class="evaluate" v-if="productCommentList.length != 0">
			<view class="title">
				<view>
					<text>评价</text>
					<text></text>
				</view>
				<view @click="jump()" style="font-size: 24rpx;display: flex;align-items: center;">
					好评率：{{favorableRate}}
					<uni-icons type="right" size="17" color="#999999"></uni-icons>
				</view>
			</view>
			<view class="content">
				<view v-for="item in productCommentList">
					<view class="score">
						<image v-if="item.memberHeadImg&&item.memberHeadImg.indexOf('http')!=-1"
							style="width: 50rpx;height: 50rpx;border-radius: 50%;margin-right: 14rpx;"
							:src="item.memberHeadImg" mode=""></image>
						<image v-else-if="item.memberHeadImg"
							style="width: 50rpx;height: 50rpx;border-radius: 50%;margin-right: 14rpx;"
							:src="imageUrl + item.memberHeadImg" mode=""></image>
						<uni-icons v-else type="contact" size="40" color="#1C9B64"
							style="margin-right: 14rpx;"></uni-icons>
						<view>
							<view class="name">
								{{item.memberName}}
							</view>
							<uni-rate size="18" :value="item.grade" color="#bbb" active-color="#1C9B64" />
						</view>
					</view>
					<view class="comment">
						{{item.content}}
					</view>
					<view class="photograph">
						<image v-for="itemImg in item.productCommentPictureList" :src="imageUrl + itemImg.imagePath"
							@click="openPopup(itemImg.imagePath)" mode="">
						</image>
					</view>
					<view class="enterprise" v-if="item.replyContent">
						<text :style="{'max-height': item.textOpenFlag ? '58rpx' : ''}"
							:class="{hiddenText: item.textOpenFlag}" class="textMore"
							ref="textContainer">商家回复：{{item.replyContent}}</text>
						<text v-if="item.textOpenFlag !== null" @click="item.textOpenFlag = !item.textOpenFlag"
							class="btnMore">{{item.textOpenFlag ? '【展开】':'【收起】'}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="imgDetail">
			<view>—— 图文详情 ——</view>
			<rich-text :nodes="description"></rich-text>
		</view>
		<!-- 商品底部导航 -->
		<uni-goods-nav style="position: fixed;bottom: 0;width: 100%;" :options="optiones" :fill="true"
			:button-group="customButtonGroup" @click="onClick" @buttonClick="buttonClick" />
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
				<view class="select" v-if="norm1==99&&norm2 == 99&&details.productGoodsList[0].normName">
					{{details.productGoodsList[0].normName}}
				</view>
				<view class="specifications" v-if="norm2!=99">
					<view class="title">
						{{norm2}}
					</view>
					<uni-data-checkbox style="margin-left: 24rpx;margin-top: 30rpx;" class="specificationsValue"
						selectedColor="rgba(28, 155, 100, 0.4)" selectedTextColor="#1C9B64" mode="tag"
						@change="norm2Change" v-model="norm2Value" :localdata="norm2s"></uni-data-checkbox>
				</view>
				<view class="colors" v-if="norm1!=99">
					<view class="title">
						{{norm1}}
					</view>
					<uni-data-checkbox style="margin-left: 24rpx;margin-top: 30rpx;" class="colorsValue"
						selectedColor="rgba(28, 155, 100, 0.4)" selectedTextColor="#1C9B64" mode="tag"
						@change="norm1Change" v-model="norm1Value" :localdata="norm1s"></uni-data-checkbox>
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
		<!-- 参数弹窗 -->
		<uni-popup ref="parameterPopup" background-color="#fff" border-radius="48rpx 48rpx 0px 0px" type="bottom">
			<view class="popup-content">
				<view class="title">
					<view></view>
					<view>产品参数</view>
					<view style="margin-right: 16rpx;"><uni-icons type="closeempty" size="18" color="#1E1E1F"
							@click="closeParameter()"></uni-icons>
					</view>
				</view>
				<view class="content">
					<view v-for="item in productAttrList">
						<view>{{item.name}}</view>
						<view>{{item.value}}</view>
					</view>
				</view>
				<view class="button">
					<button @click="closeParameter()">完成</button>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="popupImg" type="center">
			<view style="background-color: #fff;border-radius: 24rpx;overflow: hidden;">
				<view style="width: 100%;text-align: right;">
					<uni-icons style="line-height: 50rpx;margin-right: 10rpx;" class="close" type="closeempty"
						color="#999" size="18" @click="closePopup"></uni-icons>
				</view>
				<image :src="imageUrl + imgUrl" style="max-height: 1100rpx;" mode="widthFix"></image>
			</view>
		</uni-popup>
		<!-- 分享 -->
		<uni-popup ref="share" type="share" safeArea backgroundColor="#fff">
			<uni-popup-share @select="selected"></uni-popup-share>
		</uni-popup>
		<view class="dialogShare" v-if="shareFlag">
			<view class="sanjiao">
		
			</view>
			<view class="content">
				<view>
					喜欢这个页面？ 点击右上角的三个点，与你的朋友分享吧！
				</view>
				<uni-icons @click="shareFlag = false" type="closeempty" size="30" color="#fff"></uni-icons>
		
			</view>
		</view>
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
		productDetail,
		detailgoods,
		getEffectiveCoupon,
		reveivecoupon,
		cartSave,
		getTransportPrice
	} from '@/api/goodsDetail.js'
	import {
		memberShare
	} from '@/api/homePage.js'
	import {
		shopCollectionCreate,
		shopCollectionCancel
	} from '@/api/member.js'
	import {
		comment
	} from '@/api/reviews.js'
	import {
		order
	} from "@/store/order";
	// #ifndef MP-WEIXIN
	import jweixin from 'weixin-js-sdk'
	// #endif
const shareFlag = ref(false)
	let optiones = ref([
		{
		icon: 'home',
		text: '首页',

	}, {
		icon: 'heart',
		text: '收藏',
	}, {
		icon: 'cart',
		text: '购物车',
		// info: '1',
		infoBackgroundColor: '#1C9B64',
	},
	])
	let customButtonGroup = ref([{
			text: '加入购物车',
			backgroundColor: '#ff0000',
			color: '#fff'
		},
		{
			text: '立即购买',
			backgroundColor: '#ffa200',
			color: '#fff'
		}
	])
	let dotsStyles = ref({
		backgroundColor: 'rgba(0, 0, 0,0.3)',
		border: '0px rgba(83, 200, 249,0.3) solid',
		color: '#fff',
		selectedBackgroundColor: '#1C9B64',
		selectedBorder: '2rpx solid #FFFFFF'
	})
	const mode = ref('default')
	let date = ref([])
	const diqu = ref('请选择省市区')
	let info = ref({
		siteAddress: '',
	})
	const current = ref(0)
	let region = ref([])
	let regionName = ref('')
	let defaultRegion = ref(['广东省', '广州市', '番禺区'])
	const defaultRegionCode = ref('440113')
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

	let EffectiveCoupon = ref([])


	const qrcode = ref(false)
	const imgCode = ref('') // 后续保存到手机相册所需要用到的字段
	const dyLastImg = ref('')
	const fl = ref(true)
	const aaa = ref(1)
	const promoterPhone = ref(uni.getStorageSync("phone"))
	const names = ref(uni.getStorageSync("name"))
	const shopName = ref(uni.getStorageSync("shopName"))
	const title = ref('Hello')
	const show = ref(false)
	const type = ref('rotate1')
	const shadowBg = ref('white')
	const animateTxt = ref(true)
	const productCommentList = ref([])
	const state = ref('')

	let productAttrList = ref([])

	function change(e) {
		console.log(e);
		current.value = e.detail.current;
	}
	let free = ref('')
	// 获取选择的地区
	function handleGetRegion(region) {
		region.value = region
		regionName.value = region.value.map(item => item.regionName).join(' ')
		console.log(region.value, regionName.value)
		getTransportPrice({
			cityId: region.value[region.value.length - 1].id,
			num: 1,
			productId: id.value,
			productGoodsId: productGoodId.value
		}).then(res => {
			console.log(res);
			free.value = res.data.data
		})
	}
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
	const favorableRate = ref('')
	// 加入购物车
	function addCart() {
		productId.value = id.value
		norm1s.value = []
		norm2s.value = []
		// 获取商品详情
		productDetail({
			productId: id.value
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
			favorableRate.value = res.data.data.favorableRate * 100 + '%' 
			stock.value = res.data.data.product.productGoodsList[0].stock == 0 ? '暂无库存' : ('剩余' + res.data
				.data.product.productGoodsList[0].stock + '件')
			name.value = res.data.data.product.name

			isCollenction.value = res.data.data.isCollenction
			if (!isCollenction.value) {
				optiones.value[1].icon = 'heart'
				optiones.value[1].color = ''
				optiones.value[1].text = '收藏'
			} else {
				optiones.value[1].icon = 'heart-filled'
				optiones.value[1].color = '#1C9B64'
				optiones.value[1].text = '已收藏'
			}
			productAttrList.value = res.data.data.product.productAttrList
			description.value = formatRichText(res.data.data.product.description)
			masterImg.value = res.data.data.product.productPictureList
			masterImgs.value = res.data.data.product.masterImg
			mallPrice.value = res.data.data.product.mallPrice
			state.value = res.data.data.product.state
			sales.value = res.data.data.product.productGoodsList[0].sales
			details.value = res.data.data.product
			isSelf.value = res.data.data.product.isSelf
			report.value = res.data.data.report
			if (res.data.data.product.productGoodsList[0].stock == 0) {
				min.value = 0
				max.value = 0
				numValue.value = 0
			} else {
				min.value = 1
				max.value = res.data.data.product.productGoodsList[0].stock
				numValue.value = 1
			}
		})


		getEffectiveCoupon({
			productId: id.value
		}).then(res => {
			EffectiveCoupon.value = res.data.data
		})
	}
	// 购物车弹框————选规格
	function getDailog() {
		isAddCart.value = 2
		popup.value.open()
	}
	// 购物车弹框————点击导航栏按钮
	function buttonClick(e) {
		if(state.value != 2){
			uni.showToast({
				icon: 'none',
				duration: 3000,
				title: `该商品已下架`
			});
			return
		}
		if (e.index == 0) {
			isAddCart.value = 2
		} else {
			isAddCart.value = 1
		}

		popup.value.open()
	}
	//关闭加购
	function close() {
		popup.value.close()
	}
	//是否收藏
	function isCollenctions() {
		if (!uni.getStorageSync("token")) {
			uni.navigateTo({
				url: '/pages/loginInterface/passwordLogin'
			})
			return
		}
		if (isCollenction.value) {
			shopCollectionCancel({
				productId: id.value
			}).then(res => {
				optiones.value[1].icon = 'heart'
				optiones.value[1].color = ''
				optiones.value[1].text = '收藏'
				isCollenction.value = !isCollenction.value
			})
		} else {
			shopCollectionCreate({
				productId: id.value
			}).then(res => {
				optiones.value[1].icon = 'heart-filled'
				optiones.value[1].color = '#1C9B64'
				optiones.value[1].text = '已收藏'
				isCollenction.value = !isCollenction.value
			})
		}
	}
	// 确认添加到购物车
	function confirmAddCart() {
		if (isAddCart.value == 1) {
			order().resize()
			order().setProductId(id.value)
			order().setProductGoodId(productGoodId.value)
			order().setNumber(numValue.value)
			console.log(order().order);
			popup.value.close()
			uni.navigateTo({
				url: "/pages/shoppingCart/confirmOrder?integral=1"
			});
		} else if (isAddCart.value == 2) {

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
			})
		} else if (isAddCart.value == 3) {
			if (store.state.confims.productId && store.state.confims.productId != undefined && store.state.confims
				.productId != '') {
				alert(JSON.stringify(store.state.confims) + '++++')
				let local = encodeURIComponent((window.location.href.split('#')[0].indexOf('?') == -1 ? window
						.location
						.href.split('#')[0] : window.location.href.split('#')[0].split('?')[0]) +
					'#/pages/shoppingCart/confirmOrder')
				let appid = "wx1874315b459ddf26"
				window.location.href =
					"https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
					appid +
					"&redirect_uri=" +
					local +
					"&response_type=code&scope=snsapi_base&state=1#wechat_redirect"
			} else {

				store.commit('setConfim', {
					productId: productId.value,
					productGoodId: productGoodId.value,
					number: numValue.value,
				});
				uni.setStorageSync('confims', {
					productId: productId.value,
					productGoodId: productGoodId.value,
					number: numValue.value,
				});
				
				let local = encodeURIComponent((window.location.href.split('#')[0].indexOf('?') == -1 ? window
						.location
						.href.split('#')[0] : window.location.href.split('#')[0].split('?')[0]) +
					'#/pages/shoppingCart/confirmOrder')
				let appid = "wx1874315b459ddf26"
				window.location.href =
					"https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
					appid +
					"&redirect_uri=" +
					local +
					"&response_type=code&scope=snsapi_base&state=1#wechat_redirect"
			}

		}
		popup.value.close()
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

	// 判断点击的是底部导航的哪个功能
	function onClick(e) {
		if (e.index == 1) {
			isCollenctions()
		} else if (e.index == 2) {
			uni.switchTab({
				url: "/pages/shoppingCart/ShoppingCart",
			});
		} else if (e.index == 0) {
			uni.switchTab({
				url: "/pages/homePage/homepage"
			});
		}
	}

	function getComment() {
		comment({
			productId: id.value,
		}).then(res => {
			console.log(res);
			let data = res.data.data
			data.forEach(item => {
				if (item.replyContent.length > 51) {
					// item.textOpenFlag = true 隐藏展开按钮
					item.textOpenFlag = null
				} else {
					item.textOpenFlag = null
				}
			})
			productCommentList.value = [...data]

		})
	}

	function getCoupon(val) {
		reveivecoupon({
			couponId: val
		}).then(res => {
			if (res.data.success) {
				uni.showToast({
					icon: 'none',
					duration: 3000,
					title: `领取成功`
				});
				addCart()
			}
		})
	}

	//参数弹窗
	const parameterPopup = ref()

	function parameter() {
		parameterPopup.value.open()
	}

	function closeParameter(val) {
		parameterPopup.value.close()
	}
	let popupImg = ref()
	let imgUrl = ref('')

	function openPopup(val) {
		imgUrl.value = val
		popupImg.value.open()
	}

	function closePopup() {
		popupImg.value.close()
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
	
	const share = ref()
	function shareToggle() {
		// #ifdef APP-PLUS
		share.value.open()
		// #endif
		// #ifdef H5
		if (navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger") {
			//是
			shares({
				url: '/pages/homePage/homepage'
			}).then(res => {
				if (res.data.success) {
					wx.config({
						debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						appId: res.data.data.appId, // 必填，公众号的唯一标识
						timestamp: res.data.data.timestamp, // 必填，生成签名的时间戳
						nonceStr: res.data.data.noncestr, // 必填，生成签名的随机串
						signature: res.data.data.signature, // 必填，签名，见附录1
						jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'openLocation']
					})
					setTimeout(() => {
						wx.ready(() => {
							//自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）
							wx.updateAppMessageShareData({
								title: '易写科技', // 分享标题
								desc: '分享了一条内容', // 分享描述
								link: "http://b2c.yixiekeji.com/", // 该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
								imgUrl: '', // 分享图标
								success: res => {
		
								},
								cancel: function() {
									// 用户取消分享后执行的回调函数
								}
							})
						})
					}, 500)
				}
			})
		}
		// #endif
	}
	function getSignUrl() {
		var signLink = ''
		var ua = navigator.userAgent.toLowerCase();
		if (/iphone|ipad|ipod/.test(ua)) {
			signLink = uni.getStorageSync('WxCodeUrl');
			if (!signLink) signLink = location.href
		} else {
			signLink = location.href
		}
		return signLink;
	}
	// #ifndef MP-WEIXIN
	function shares() {
		const sign_url = getSignUrl().split('#')[0];
		let URL = window.encodeURIComponent(sign_url)
		shareFlag.value = true
		memberShare({
			url: 'http://b2c.yixiekeji.com/'
		}).then(res => {
			console.log(res.data.data)
			jweixin.config({ //这里是个函数，非对象
				debug: false, // 调试，发布的时候改为false
				appId: res.data.data.appId, //后端接口获取
				nonceStr: res.data.data.noncestr, //后端接口获取
				timestamp: res.data.data.timestamp, //后端接口获取
				signature: res.data.data.signature, //后端接口获取
				jsApiList: [ // 可能需要用到的能力 需要啥就写啥。多写也没有坏处
					'updateAppMessageShareData',
					'updateTimelineShareData',
					'onMenuShareAppMessage',
					'onMenuShareTimeline',
					'openLocation'
				]
			})
			let configComnSv = {};
			let userInfoCv = {};
			let referid = userInfoCv.id;
			let link_change = getSignUrl();
			if (location.search) { //避免重复添加referid
				if (link_change.includes('&referid')) {} else {
					link_change += `&referid=${referid}`
				}
			} else {
				if (link_change.includes('?referid')) {} else {
					link_change += `?referid=${referid}`
				}
			}
			let obj = {
				title: configComnSv.share_title ? configComnSv.share_title : '易写科技', // 分享标题
				desc: configComnSv.share_desc ? configComnSv.share_desc : '易写科技商城', // 分享描述
				// 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				// link: sign_url, //这里可带参数，必须是同配置的JS安全域名一致
				link: 'http://b2c.yixiekeji.com/#/', //这里可带参数，必须是同配置的JS安全域名一致，必须是全部url(不需要去除#),这个地址如果上面向后端置换的URL通过encodeURIComponent编译，后端配置的地址需要decode一下，例如php可以用urldecode函数
				imgUrl: configComnSv.share_pic ? configComnSv.share_pic : '', // 必须是同配置的JS安全域名一致
				success: function() {}
			}
			shareFlag.value = true
			jweixin.ready(function() {
				if (jweixin.onMenuShareAppMessage) {
					jweixin.onMenuShareAppMessage(obj); //1.0 分享到朋友
					jweixin.onMenuShareTimeline(obj); //1.0分享到朋友圈
				} else {
					jweixin.updateAppMessageShareData(obj); //1.4 分享到朋友
					jweixin.updateTimelineShareData(obj); //1.4分享到朋友圈
				}
			})
		})
	}
	// #endif
	
	function selected(item, index) {
		if (item.index == 0) {
			uni.share({
				provider: "weixin",
				scene: "WXSceneSession",
				type: 5,
				imageUrl: 'http://img.yixiekeji.com:8080/b2cimage' + masterImgs.value,
				title: name.value,
				miniProgram: {
					id: 'gh_1da0d5922daf', //微信小程序原始id
					path: 'pages/homePage/goodsDetail?id=' + id.value, //点击链接进入的页面
					type: 2, //微信小程序版本类型，可取值： 0-正式版； 1-测试版； 2-体验版。 默认值为0。
					webUrl: 'http://uniapp.dcloud.io' //兼容低版本的网页链接
				},
				success: function(res) {
					console.log("success:" + JSON.stringify(res));
				},
				fail: function(err) {
					console.log("fail:" + JSON.stringify(err));
				}
			});
		}
	}
	
	
	
	
	onLoad((options) => {
		id.value = options.id
		addCart()
		getComment()
	})
</script>
<style>
	p {
		width: 100%;
	}

	img {
		width: 200rpx;
	}
</style>
<style lang="scss" scoped>
	.goodsDetail {
		width: 750rpx;
		height: 100%;

		/* 隐藏滚动条 */
		::-webkit-scrollbar {
			display: none;
		}

		.backPage {
			width: 750rpx;
			height: 750rpx;
			position: relative;

			.images {
				width: 750rpx;
				height: 750rpx;
			}
		}



		.goodsDescribe {
			width: 714rpx;
			// height: 246rpx;
			background: #FFFFFF;
			border-radius: 24rpx;
			margin: 18rpx;
			padding: 14rpx 18rpx;
			box-sizing: border-box;

			.describeBox {
				width: 100%;
				height: 122rpx;
				display: flex;
				justify-content: space-between;

				.priceBox {
					width: 210px;
					margin-right: 120rpx;

					.font1 {
						font-weight: 600;
						font-size: 52rpx;
						color: #DC3A2F;
					}

					.font2 {
						font-size: 22rpx;
						color: #999999;
						margin-top: 8rpx;
					}
				}

				.imgBox {
					display: flex;
					align-items: center;

					.imgBoxContent {
						width: 120rpx;
						text-align: center;
						position: relative;

						.heartBox {
							width: 52rpx;
							height: 52rpx;
							background-color: #F5F5F7;
							border-radius: 50%;
							line-height: 58rpx;
							margin: 0 auto;
							margin-bottom: 14rpx;
						}

						image {
							width: 52rpx;
							height: 52rpx;
							margin-bottom: 6rpx;
						}

						view {
							width: 120rpx;
							font-size: 22rpx;
							color: #1C9B64;
						}
					}

				}
			}

			.describeFont {
				font-weight: 600;
				font-size: 30rpx;
				margin-top: 16rpx;
			}
		}

		.coupon {
			width: 714rpx;
			height: 232.42rpx;
			background: #FFFFFF;
			border-radius: 24rpx;
			margin-left: 18rpx;
			margin-bottom: 16rpx;

			.title {
				width: 100%;
				height: 72rpx;
				display: flex;
				justify-content: space-between;
				padding: 18rpx 18rpx;
				box-sizing: border-box;

				>text:nth-child(1) {
					width: 52rpx;
					height: 36rpx;
					font-family: PingFang SC, PingFang SC;
					font-weight: 600;
					font-size: 26rpx;
					color: #1C9B64;
					line-height: 36rpx;
					text-align: left;
				}

				>text:nth-child(2) {
					width: 68rpx;
					height: 36rpx;
					font-family: PingFang SC, PingFang SC;
					font-weight: 400;
					font-size: 26rpx;
					color: #999999;
					line-height: 36rpx;
					text-align: left;
				}
			}

			.content {
				width: 100%;
				overflow-x: auto;
				display: flex;
				flex-wrap: nowrap;

				>view {
					width: 208rpx;
					height: 124rpx;
					background: #FFFFFF;
					border-radius: 16rpx 16rpx 16rpx 16rpx;
					border: 2rpx solid #1C9B64;
					overflow: hidden;
					margin-left: 18rpx;
					flex-shrink: 0;

					.amount {
						width: 100%;
						height: 86rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;

						>view:nth-child(1) {
							width: 100rpx;
							height: 62rpx;
							font-family: PingFang SC, PingFang SC;
							font-weight: 600;
							font-size: 30rpx;
							color: #1C9B64;
							line-height: 62rpx;
							text-align: left;
							margin-left: 26rpx;
						}

						>view:nth-child(2) {
							width: 20rpx;
							font-family: PingFang SC, PingFang SC;
							font-weight: 400;
							font-size: 20rpx;
							color: #999999;
							line-height: 33rpx;
							text-align: left;
							margin-right: 10rpx;
						}
					}

					.available {
						width: 208rpx;
						height: 38rpx;
						background: #1C9B64;
						border-radius: 0rpx 0rpx 0rpx 0rpx;
						font-family: PingFang SC, PingFang SC;
						font-weight: 600;
						font-size: 20rpx;
						color: #FFFFFF;
						line-height: 38rpx;
						text-align: left;
						text-indent: 26rpx;
					}
				}
			}
		}

		.goodsSpecs {
			width: 714rpx;
			// height: 200rpx;
			background: #FFFFFF;
			border-radius: 24rpx;
			margin-left: 18rpx;
			overflow: hidden;
			margin-bottom: 16rpx;

			.specsDetail {
				display: flex;

				.detail1 {
					font-size: 28rpx;
					color: #999999;
					margin-top: 24rpx;
					margin-left: 26rpx;
				}

				.detail2 {
					width: 630rpx;
				}

				.detail2a {
					width: 630rpx;
					height: 80rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					border-top: 1px solid #eeeeee66;

					>view {
						padding-right: 0;
						width: 558rpx;
						color: #333;
						font-family: PingFang SC;
						font-size: 30rpx;
						font-style: normal;
						font-weight: 400;
						line-height: normal;
						// margin-right: 24rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;

						>view {
							display: flex;
							align-items: center;
							text-align: center;

							>view {
								width: 112rpx;
								text-align: center;
								margin-right: 11rpx;

								>view:nth-child(1) {
									white-space: nowrap;
									overflow: hidden;
									text-overflow: ellipsis;
									color: #333;
									text-align: center;
									font-family: PingFang SC;
									font-size: 28rpx;
									font-style: normal;
									font-weight: 400;
									line-height: normal;
								}

								>view:nth-child(2) {
									white-space: nowrap;
									overflow: hidden;
									text-overflow: ellipsis;
									overflow: hidden;
									color: #999;
									text-align: center;
									text-overflow: ellipsis;
									font-family: PingFang SC;
									font-size: 26rpx;
									font-style: normal;
									font-weight: 400;
									line-height: normal;
								}

							}

							text {
								color: #999;
								font-family: PingFang SC;
								font-size: 24rpx;
								font-style: normal;
								font-weight: 400;
								line-height: normal;
							}
						}
					}


				}
			}
		}

		.evaluate {
			width: 714rpx;
			background: #FFFFFF;
			border-radius: 24rpx;
			margin-left: 18rpx;
			margin-bottom: 16rpx;
			box-sizing: border-box;
			padding: 24rpx 20rpx;

			.title {
				width: 100%;
				height: 72rpx;
				display: flex;
				justify-content: space-between;
				// padding: 18rpx 18rpx;
				box-sizing: border-box;

				>view {
					>text:nth-child(1) {
						width: 56rpx;
						height: 40rpx;
						font-family: PingFang SC, PingFang SC;
						font-weight: 600;
						font-size: 28rpx;
						color: #111111;
						line-height: 33rpx;
						text-align: left;
					}

					>text:nth-child(2) {
						width: 68rpx;
						height: 26rpx;
						font-family: PingFang SC, PingFang SC;
						font-weight: 600;
						font-size: 18rpx;
						color: #999999;
						line-height: 21rpx;
						text-align: left;
						font-style: normal;
						text-transform: none;
						margin-left: 6rpx;
					}
				}
			}

			.content {
				width: 100%;

				>view {
					width: 100%;
					margin-bottom: 40rpx;

					.score {
						display: flex;
						align-items: center;

						.name {
							// width: 46rpx;
							height: 28rpx;
							font-family: PingFang SC, PingFang SC;
							font-weight: 600;
							font-size: 20rpx;
							color: #1C9B64;
							line-height: 23rpx;
							text-align: left;
						}
					}

					.comment {
						width: 100%;
						font-size: 24rpx;
						color: #333333;
						line-height: 28rpx;
						margin-top: 18rpx;
					}

					.photograph {
						margin: 18rpx 0;

						image {
							width: 146rpx;
							height: 146rpx;
							margin-right: 16rpx;
						}
					}

					.enterprise {
						width: 100%;
						font-size: 22rpx;
						color: #333333;
						position: relative;
						background: #F5F5F7;
						border-radius: 16rpx 16rpx 16rpx 16rpx;
						padding: 20rpx 20rpx;
						box-sizing: border-box;

						.hiddenText {
							overflow: hidden;
							display: block;
						}

						.hiddenText:after {
							z-index: 3;
							content: "...";
							position: absolute;
							bottom: 20rpx;
							right: 100rpx;
							width: 16rpx;
							// padding-left: 30rpx;
							background: #F5F5F7;
							color: #1C9B64;
						}

						.btnMore {
							color: #1C9B64;
							position: absolute;
							right: 20rpx;
							bottom: 20rpx;
							background-color: #F5F5F7;
						}
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

			p {
				width: 100%;
			}

			img {
				width: 100%;
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
						font-size: 28rpx;
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

		.popup-content {
			.title {
				width: 100%;
				display: flex;
				justify-content: space-between;
				margin: 30rpx 0 43rpx 0;

				>view {
					width: 30rpx;
				}

				>view:nth-child(2) {
					width: 300rpx;
					color: #010002;
					text-align: center;
					font-family: PingFang SC;
					font-size: 16px;
					font-style: normal;
					font-weight: 600;
					line-height: normal;
				}

				.uni-icons {
					float: right;
					margin-right: 14rpx;
				}
			}

			.content {
				width: 100%;
				height: 600rpx;
				display: flex;
				flex-wrap: wrap;
				justify-content: space-evenly;
				padding: 0 32rpx;
				box-sizing: border-box;
				overflow: auto;

				>view {
					display: flex;
					border-bottom: 2rpx solid #EBEBEB;
					padding: 22rpx 0 18rpx 0;

					>view:nth-child(1) {
						width: 274rpx;
						color: #999;
						font-family: PingFang SC;
						font-size: 28rpx;
						font-style: normal;
						font-weight: 400;
						line-height: normal;
					}

					>view:nth-child(2) {
						width: 412rpx;
						color: #333;
						font-family: PingFang SC;
						font-size: 28rpx;
						font-style: normal;
						font-weight: 400;
						line-height: normal;
					}
				}

			}

			.button {
				width: 100%;
				display: flex;
				justify-content: space-around;
				// margin: 82rpx 0;
				border-top: 1rpx solid #CACACC;
				padding-top: 14rpx;

				button {
					width: 700rpx;
					height: 80rpx;
					flex-shrink: 0;
					border-radius: 24rpx;
					background: #1C9B64;
					color: #FFF;
					text-align: center;
					leading-trim: both;
					text-edge: cap;
					font-family: PingFang SC;
					font-size: 32rpx;
					font-style: normal;
					font-weight: 400;
				}
			}
		}
		.dialogShare {
			height: 140rpx;
			width: 310rpx;
			position: fixed;
			top: 50rpx;
			right: 50rpx;
			z-index: 9999999999;
		
			.sanjiao {
				width: 0px;
				height: 0px;
				border-top: 26rpx solid #FFFFFF00;
				border-bottom: 26rpx solid #1C9B64;
				border-left: 26rpx solid #FFFFFF00;
				border-right: 26rpx solid #FFFFFF00;
				position: absolute;
				right: 0rpx;
				top: -52rpx;
				z-index: 9999;
			}
		
			.content {
				width: 310rpx;
				height: 120rpx;
				background: #1C9B64;
				border-radius: 16rpx 16rpx 16rpx 16rpx;
				display: flex;
				align-items: center;
				padding: 14rpx 24rpx;
		
				>view {
					width: 230rpx;
					height: 90rpx;
					font-size: 26rpx;
					color: #FFFFFF;
					line-height: 26rpx;
					text-align: left;
					margin-right: 20rpx;
				}
			}
		}
	}
</style>