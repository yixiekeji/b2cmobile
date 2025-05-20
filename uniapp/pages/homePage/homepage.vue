<template>
	<view class="homePage">
		<!-- 自定义导航栏 -->
		<HeadNav nav-background-color="#f5f5f7" backImageUrl="8" @tests="test" textAlign="left"
			style="position: relative;z-index: 999;">
		</HeadNav>
		<!-- 轮播图 -->
		<view class="swiperBox" v-if="bannerList.length != 0">
			<uni-swiper-dot :info="bannerList" :current="current" field="content" :mode="modes"
				:dots-styles="dotsStyles">
				<swiper class="swiper-box" autoplay circular @change="change" style="background-color: #00000000;height:360rpx">
					<swiper-item v-for="(item,index) in bannerList" :key="index" @click="pageJumps(item.linkUrl)">
						<image :src="imageUrl+item.image" style="width: 100%;height: 100%;"></image>
					</swiper-item>
				</swiper>
			</uni-swiper-dot>
		</view>
		<!-- 金刚区网格布局 -->
		<view class="grid">
			<uni-grid :column="4" :highlight="false" :showBorder="false" @change="change">
				<uni-grid-item>
					<view class="gridItemBox" @click="onTabbarJump('/pages/classification/classification')">
						<image class="imgBox" src="@/static/classification.png"></image>
						<text class="text">全部分类</text>
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="gridItemBox" @click="onTabbarJump('/pages/memberCenter/memberCenter')">
						<image class="imgBox" src="@/static/vipCenter.png"></image>
						<text class="text">会员中心</text>
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="gridItemBox" @click="pageJump('/pages/memberCenter/myOrder/myOrder')">
						<image class="imgBox" src="@/static/goddsOrder.png"></image>
						<text class="text">我的订单</text>
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="gridItemBox" @click="shareToggle">
						<image class="imgBox" src="@/static/share.png"></image>
						<text class="text">分享</text>
						<!-- #ifdef MP-WEIXIN -->
						<button id="shareBtn" open-type="share"
							style="opacity: 0;position: absolute;z-index: 2;width: 100%;height: 100%;top: 0;left: 0;">购买分享(opicty透明)</button>
						<!-- #endif -->
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="gridItemBox" @click="pageJumps('/pages/memberCenter/integralPage/integralPage')">
						<image class="imgBox" src="@/static/homeIntegral.png"></image>
						<text class="text">积分商城</text>
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="gridItemBox" @click="pageJumps('/pages/homePage/couponList')">
						<image class="imgBox" src="@/static/homeCoupon.png"></image>
						<text class="text">优惠券</text>
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="gridItemBox" @click="onTabbarJump('/pages/shoppingCart/ShoppingCart')">
						<image class="imgBox" src="@/static/homeCart.png"></image>
						<text class="text">购物车</text>
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="gridItemBox" @click="pageJump('/pages/memberCenter/collectPage')">
						<image class="imgBox" src="@/static/homeCollect.png"></image>
						<text class="text">我的收藏</text>
					</view>
				</uni-grid-item>
			</uni-grid>
		</view>
		<!-- 商品内容 -->
		<view class="goodsContent" v-for="item in floorList">
			<view class="title">
				<view></view>
				<view>{{item.name}}</view>
				<view></view>
			</view>
			<image :src="imageUrl+item.advImage" mode="" @click="jump(item.advLinkUrl)"></image>
			<!-- 商品详情 -->
			<view class="goodsDetail">
				<view v-for="itemGoods in item.floorDataList" @click="jumpDetails(itemGoods.product.id)">
					<image :src="imageUrl+itemGoods.product.masterImg" mode=""></image>
					<view>
						<view>￥<text>{{itemGoods.product.mallPrice}}</text></view>
						<view>
							<!-- <uni-icons type="location" size="16" color="#999"></uni-icons>
							<view>{{itemGoods.product.address}}</view> -->
						</view>
					</view>
					<view>{{itemGoods.product.name}}</view>
					<view>
						<view>{{itemGoods.product.keyword}}</view>
					</view>
					<view>
						<view>{{itemGoods.product.sellerName}}</view>
						<view style="background-color: #8fca21;" v-if="itemGoods.product.level === 1">A+</view>
						<view style="background-color: #28c5c3;" v-else-if="itemGoods.product.level === 2">A</view>
						<view style="background-color: #f99222;" v-else-if="itemGoods.product.level === 3">B</view>
						<view style="background-color: #c0005d;" v-else-if="itemGoods.product.level === 4">C</view>
						<view style="background-color: #f99222;" v-else-if="itemGoods.product.level === 5">B+</view>
						<view style="background-color: #c0005d;" v-else-if="itemGoods.product.level === 6">C+</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 为您推荐 -->
		<view class="recommend">
			<view class="title">
				<view></view>
				<view>
					<view>为你推荐</view>
					<view>海量货源 实时推荐</view>
				</view>
				<view></view>
			</view>
			<!-- 推荐商品详情 -->
			<view class="goodsDetail">
				<view v-for="itemGoods in LikeList" @click="jumpDetails(itemGoods.id)">
					<image :src="imageUrl + itemGoods.masterImg" mode=""></image>
					<view>
						<view>￥<text>{{itemGoods.mallPrice}}</text></view>
						<view>
							<!-- <uni-icons type="location" size="16" color="#999"></uni-icons> -->
							<!-- <view>{{itemGoods.address}}</view> -->
						</view>
					</view>
					<view>{{itemGoods.name}}</view>
					<view>
						<view>{{itemGoods.keyword}}</view>
					</view>
					<view>
						<view>{{itemGoods.sellerName}}</view>
						<view style="background-color: #8fca21;" v-if="itemGoods.level === 1">A+</view>
						<view style="background-color: #28c5c3;" v-else-if="itemGoods.level === 2">A</view>
						<view style="background-color: #f99222;" v-else-if="itemGoods.level === 3">B</view>
						<view style="background-color: #c0005d;" v-else-if="itemGoods.level === 4">C</view>
						<view style="background-color: #f99222;" v-else-if="itemGoods.level === 5">B+</view>
						<view style="background-color: #c0005d;" v-else-if="itemGoods.level === 6">C+</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 新闻资讯 -->
		<view class="newsInformation" v-if="newslists.length>0">
			<view class="newsTitle">
				<view>新闻资讯</view>
				<view @click="newsJump('/pages/homePage/newsPage')">
					<text>更多资讯</text>
					<uni-icons @click="jump()" type="right" size="17" color="#999999"></uni-icons>
				</view>
			</view>
			<view class="newsDetails" v-for="item in newslists" @click="newsDetails(item.id)">
				<view>
					<view>{{item.abstracts}}</view>
					<text>4浏览 {{item.createTime}}</text>
				</view>
				<image :src="imageUrl + item.corverUrl" mode=""></image>
			</view>
		</view>
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
		floor,
		banner,
		newslist,
		memberShare,
		indexLike
	} from '@/api/homePage.js'
	import {
		onLoad,
		onPullDownRefresh,
		onReachBottom,
		onShareAppMessage
	} from "@dcloudio/uni-app";
	// var jweixin = require('jweixin-module')
	// #ifndef MP-WEIXIN
	import jweixin from 'weixin-js-sdk'
	// #endif


	import {
		address
	} from '@/store/address'
	address().setAddress()

	function test(e) {
		console.log(e);
	}
	let textValue = ref('易写科技服务规则')
	const footer = ref([])
	let news = ref([])
	let newslists = ref([])
	//楼层数据
	let floorList = ref([])
	//为你推荐
	let productList = ref([])
	//分类
	let sellerTypeList = ref([])
	//公司
	let sellerApplyList = ref([])
	// 轮播图内容
	let bannerList = ref([])
	const current = ref(0)
	// 轮播图底部页面指示点
	let modes = ref('dot')
	const dotsStyles = reactive({
		backgroundColor: 'rgba(0, 0, 0,0.3)',
		border: '0px rgba(83, 200, 249,0.3) solid',
		color: '#fff',
		selectedBackgroundColor: '#1C9B64',
		selectedBorder: '2rpx solid #FFFFFF'
	})

	function change(e) {
		current.value = e.detail.current;
	}

	const openFlag = ref(true)
	const classificationFlag = ref(true)
	const cateId = ref('0')
	const shareFlag = ref(false)
	let LikeList = ref([])

	function open() {
		openFlag.value = !openFlag.value
		classificationFlag.value = !classificationFlag.value
	}
	getList()

	function getList() {
		floor({}).then(res => {
			floorList.value = res.data.data
		})
		indexLike({}).then(res => {
			LikeList.value = res.data.data
		})
		banner().then(res => {
			bannerList.value = res.data.data
		})
		newslist({
			isHome: 1,
			page: 1,
			typeId: 0
		}).then(res => {
			newslists.value = res.data.data.newslist
		})
	}
	let n = ref(-1)

	function timer() {
		if (n.value == footer.value.length - 1) {
			n.value = 0
		} else {
			n.value++
		}
		setTimeout(() => {
			// textValue.value = footer.value[n.value].name
			timer()
		}, 5000)
	}
	// 分类导航折叠面板
	function classification(e) {
		if (e.target.id) {
			cateId.value = e.target.id
			indexsellerList(e.target.id)
		}

	}

	function indexsellerList(val) {
		indexseller({
			sellerTypeId: val
		}).then(res => {
			console.log(res);
			sellerApplyList.value = res.data.data.sellerApplyList
		})
	}
	// 跳转详情页
	function jumpDetails(val) {
		uni.navigateTo({
			url: "/pages/homePage/goodsDetail?id=" + val
		});
	}
	// 跳转详情页
	function jump(val) {
		uni.navigateTo({
			url: val
		});
	}

	function newsDetails(val) {
		uni.navigateTo({
			url: "/pages/homePage/newsDetails?id=" + val
		});
	}

	function pageJumps(val) {
		uni.navigateTo({
			url: val
		});
	}

	function pageJump(val) {
		if (uni.getStorageSync("token")) {
			uni.navigateTo({
				url: val
			});
		} else {
			uni.navigateTo({
				url: '/pages/loginInterface/passwordLogin'
			})
		}

	}

	function newsJump(val) {
		uni.navigateTo({
			url: val
		});
	}

	function jumpSeller(val) {
		uni.navigateTo({
			url: "/pages/storeInformationPage/storeInformationPage?id=" + val
		});
	}

	function onTabbarJump(val) {
		uni.switchTab({
			url: val
		})
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
				console.log(res);
				if (res.data.success) {
					wx.config({
						debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						appId: res.data.data.appId, // 必填，公众号的唯一标识
						timestamp: res.data.data.timestamp, // 必填，生成签名的时间戳
						nonceStr: res.data.data.noncestr, // 必填，生成签名的随机串
						signature: res.data.data.signature, // 必填，签名，见附录1
						// surl: res.data.surl, //自己添加的，debug为true的时候可以网页打印出对应的URL是否正确
						jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'openLocation']
					})
					setTimeout(() => {
						wx.ready(() => {
							//自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）
							wx.updateAppMessageShareData({
								title: '易写科技', // 分享标题
								desc: '分享了一条内容', // 分享描述
								link: "http://b2c.yixiekeji.com/#/", // 该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
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

	function selected(item, index) {
		if (item.index == 0) {
			uni.share({
				provider: "weixin",
				scene: "WXSceneSession",
				type: 5,
				imageUrl: 'http://img.yixiekeji.com:8080/b2cimage/images/mobile/mobile/cad931d2-2bca-4195-8a1c-08ac29ee653b.png',
				title: "易写科技商城",
				miniProgram: {
					id: 'gh_1da0d5922daf', //微信小程序原始id
					path: 'pages/homePage/homepage', //点击链接进入的页面
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
	onShareAppMessage((res) => {
		console.log(res);
		return {
			title: '易写科技小程序',
			path: `/pages/homePage/homepage`,
			// imageUrl: '/static/imgs/mylogo.png'
		}
	})

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
</script>

<style lang="scss" scoped>
	.homePage {
		width: 750rpx;
		// height: 100%;
		box-sizing: border-box;
		padding-top: 16rpx;
		padding-bottom: 10rpx;
		position: relative;

		.swiperBox {
			height: 360rpx;
			width: 714rpx;
			margin: 0rpx auto 16rpx;
			border-radius: 20rpx;
			overflow: hidden;
			uni-swiper,.uni-swiper__warp,uni-swiper-item{
				height: 100%!important;
				border-radius: 20rpx;
			}
			
		}

		.grid {
			width: 714rpx;
			margin: 24rpx auto;
			border-radius: 20rpx;
			background-color: #fff;

			.gridItemBox {
				width: 186rpx;
				height: 164rpx;
				/* #ifndef APP-NVUE */
				display: flex;
				/* #endif */
				flex-direction: column;
				align-items: center;
				justify-content: space-evenly;

				>view {
					width: 88rpx;
					height: 88rpx;
					line-height: 88rpx;
					border-radius: 44rpx;
					background: rgb(255, 231, 191);
					text-align: center;
					font-size: 50rpx;
					font-weight: 600;
					color: rgb(255, 147, 33);
				}
			}

			.imgBox {
				width: 88rpx;
				height: 88rpx;
			}

			.imgBox2 {
				width: 44rpx;
				height: 44rpx;
			}

			.text {
				font-size: 30rpx;
				line-height: 30rpx;
				color: #666;
				margin-top: 12rpx;
			}
		}

		.goodsContent {
			width: 100%;
			margin-top: 20rpx;

			.title {
				width: 100%;
				height: 44rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				>view:nth-child(3) {
					width: 30px;
					height: 2px;
					background: linear-gradient(90deg, #1C9B64 -1.67%, rgba(28, 155, 100, 0.00) 101.67%);
				}

				>view:nth-child(2) {
					color: #1C9B64;
					font-family: PingFang SC;
					font-size: 18px;
					font-style: normal;
					font-weight: 600;
					line-height: normal;
					margin: 0 6rpx;
				}

				>view:nth-child(1) {
					width: 30px;
					height: 2px;
					transform: rotateZ(180deg);
					background: linear-gradient(90deg, #1C9B64 -1.67%, rgba(28, 155, 100, 0.00) 101.67%);
				}
			}

			>image {
				width: 716rpx;
				height: 150rpx;
				flex-shrink: 0;
				border-radius: 20rpx;
				margin: 10rpx 17rpx;
			}

			.goodsDetail {
				width: 100%;
				display: flex;
				flex-wrap: wrap;

				>view {
					width: 350rpx;
					background-color: white;
					margin: 14rpx 0rpx 0 14rpx;
					border-radius: 24rpx;
					overflow: hidden;

					>image {
						width: 350rpx;
						height: 350rpx;
					}

					>view:nth-child(2) {
						display: flex;
						justify-content: space-between;
						width: 100%;
						padding: 8rpx 17rpx;
						box-sizing: border-box;

						>view:nth-child(1) {
							font-size: 34rpx;
							color: #DC3A2F;
							font-weight: 600;

							text {
								font-size: 40rpx;
							}
						}

						>view:nth-child(2) {
							font-size: 24rpx;
							display: flex;
							color: #999;
						}

					}

					>view:nth-child(3) {
						height: 76.8rpx;
						padding: 0 17rpx;
						box-sizing: border-box;
						font-size: 30rpx;
						line-height: 38.4rpx;
						display: -webkit-box;
						/* 必须设置display属性为-webkit-box */
						overflow: hidden;
						/* 超出部分隐藏 */
						text-overflow: ellipsis;
						/* 显示省略号 */
						-webkit-line-clamp: 2;
						/* 限制显示两行 */
						-webkit-box-orient: vertical;
						/* 垂直方向上的换行 */
					}

					>view:nth-child(4) {
						padding: 10rpx 17rpx;
						box-sizing: border-box;
						font-size: 24rpx;
						color: #999999;
						display: flex;

						view {
							margin-right: 16rpx;
						}
					}

					>view:nth-child(5) {
						padding: 0rpx 17rpx 16rpx 17rpx;
						box-sizing: border-box;
						font-size: 24rpx;
						color: #999;
						display: flex;
						justify-content: space-between;
						align-items: center;

						>view:nth-child(2) {
							width: 32rpx;
							height: 32rpx;
							background-color: rgb(153, 204, 1);
							border-radius: 16rpx;
							color: white;
							font-weight: 700;
							font-size: 18rpx;
							text-align: center;
							line-height: 32rpx;
						}
					}
				}
			}
		}

		.newsInformation {
			width: 716rpx;
			background: #FFFFFF;
			border-radius: 24rpx;
			margin: 22rpx 16rpx;
			padding: 28rpx 12rpx;
			box-sizing: border-box;

			.newsTitle {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;

				>view:nth-child(1) {
					width: 128rpx;
					height: 44rpx;
					font-weight: 600;
					font-size: 32rpx;
					color: #1C9B64;
				}

				>view:nth-child(2) {
					width: 148rpx;
					height: 34rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;

					>text {
						font-size: 24rpx;
						color: #88888C;
					}
				}
			}

			.newsDetails {
				width: 100%;
				display: flex;
				margin-top: 46rpx;

				>view {
					width: 408rpx;
					margin-right: 58rpx;

					>view {
						height: 78rpx;
						font-weight: 600;
						font-size: 32rpx;
						color: #333333;
						line-height: 40rpx;
						margin-bottom: 34rpx;
						overflow: hidden;
						-webkit-line-clamp: 2;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
					}


					>text {
						font-size: 24rpx;
						color: #88888C;
					}
				}

				>image {
					width: 220rpx;
					height: 144rpx;
					background: #61B686;
					border-radius: 8rpx 8rpx 8rpx 8rpx;
				}
			}
		}

		.recommend {
			width: 100%;
			margin-top: 20rpx;

			.title {
				width: 100%;
				height: 72rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				>view:nth-child(3) {
					width: 30px;
					height: 2px;
					background: linear-gradient(90deg, #1C9B64 -1.67%, rgba(28, 155, 100, 0.00) 101.67%);
				}

				>view:nth-child(2) {
					width: 228rpx;
					text-align: center;
					margin: 0 6rpx;

					>view:nth-child(1) {
						color: #1C9B64;
						font-family: PingFang SC;
						font-size: 38rpx;
						font-style: normal;
						font-weight: 600;
						line-height: normal;

					}

					>view:nth-child(2) {
						color: #999;
						text-align: center;
						font-family: PingFang SC;
						font-size: 26rpx;
						font-style: normal;
						font-weight: 400;
						line-height: normal;
					}
				}

				>view:nth-child(1) {
					width: 30px;
					height: 2px;
					transform: rotateZ(180deg);
					background: linear-gradient(90deg, #1C9B64 -1.67%, rgba(28, 155, 100, 0.00) 101.67%);
				}
			}

			>image {
				width: 716rpx;
				height: 93rpx;
				flex-shrink: 0;
				border-radius: 20rpx;
				margin: 10rpx 17rpx;
			}

			.goodsDetail {
				width: 100%;
				display: flex;
				flex-wrap: wrap;

				>view {
					width: 350rpx;
					background-color: white;
					margin: 14rpx 12rpx 0 12rpx;

					>image {
						width: 350rpx;
						height: 350rpx;
					}

					>view:nth-child(2) {
						display: flex;
						justify-content: space-between;
						width: 100%;
						padding: 8rpx 17rpx;
						box-sizing: border-box;

						>view:nth-child(1) {
							font-size: 28rpx;
							color: #DC3A2F;
							font-weight: 600;

							text {
								font-size: 34rpx;
							}
						}

						>view:nth-child(2) {
							font-size: 26rpx;
							display: flex;
							color: #999;
						}

					}

					>view:nth-child(3) {
						height: 76.8rpx;
						line-height: 38.4rpx;
						padding: 0 17rpx;
						box-sizing: border-box;
						font-size: 30rpx;
						display: -webkit-box;
						/* 必须设置display属性为-webkit-box */
						overflow: hidden;
						/* 超出部分隐藏 */
						text-overflow: ellipsis;
						/* 显示省略号 */
						-webkit-line-clamp: 2;
						/* 限制显示两行 */
						-webkit-box-orient: vertical;
						/* 垂直方向上的换行 */
					}

					>view:nth-child(4) {
						padding: 10rpx 17rpx;
						box-sizing: border-box;
						font-size: 26rpx;
						color: #999;
						display: flex;

						view {
							margin-right: 16rpx;
						}
					}

					>view:nth-child(5) {
						padding: 0rpx 17rpx 16rpx 17rpx;
						box-sizing: border-box;
						font-size: 26rpx;
						color: #999;
						display: flex;
						justify-content: space-between;
						align-items: center;

						>view:nth-child(2) {
							width: 32rpx;
							height: 32rpx;
							background-color: rgb(153, 204, 1);
							border-radius: 16rpx;
							color: white;
							font-weight: 700;
							font-size: 18rpx;
							text-align: center;
							line-height: 32rpx;
						}
					}
				}
			}
		}

		.explanatory {
			color: #6F6F72;
			font-family: PingFang SC;
			font-size: 10px;
			text-transform: capitalize;
			padding: 34rpx 4rpx;
			box-sizing: border-box;
			line-height: 30rpx;
		}

		.dialogShare {
			height: 140rpx;
			width: 310rpx;
			position: fixed;
			top: 50rpx;
			right: 50rpx;
			z-index: 9999;

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