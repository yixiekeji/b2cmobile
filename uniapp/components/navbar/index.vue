<template>
	<!-- #ifdef MP-WEIXIN -->
	<view :style="{height:navHeight+'rpx',position:'relative','zIndex':99}">
		<!-- #endif -->
		<!-- #ifndef MP-WEIXIN -->
		<view
			:style="{height:navHeight+'rpx',marginBottom:navHeightValue*scaleFactor+statusBarHeight+'rpx',position:'relative','z-index':99}">
			<!-- #endif -->
			<!-- 微信小程序头部导航栏 -->
			<!-- #ifdef MP-WEIXIN -->
			<view class="wx-head-mod" :style="{height:navHeight+'rpx',backgroundColor:navBackgroundColor}">
				<view class="wx-head-mod-nav" :style="{height:navigationBarHeight+'rpx',top:statusBarHeight+'rpx'}">
					<view class="wx-head-mod-nav-content"
						:style="{height:customHeight+'rpx',justifyContent:textAlign === 'center'?'center':'left'}"
						v-if="backImageUrl == '1'||backImageUrl == '2'||backImageUrl == '0'">
						<!-- 文本区 -->
						<view class="wx-head-mod-nav-content-mian"
							:style="{width:navTextWidth,lineHeight:customHeight + 'rpx',paddingLeft:textPaddingLeft*scaleFactor+'rpx',fontSize:fontSize*scaleFactor+'rpx',fontWeight:fontWeight,textAlign:'center',color:titleColor}">
							{{textContent}}
						</view>
						<!-- 返回按钮 -->
						<view class="wx-head-mod-nav-content-back" :style="{display:isBackShow?'flex':'none'}">
							<view class="wx-head-mod-nav-content-back-img"
								:style="{width:backImageWidth*scaleFactor+'rpx',height:backImageHeight*scaleFactor+'rpx'}">
								<uni-icons @click="backEvent(1)" v-if="backImageUrl == '1'"
									style="width: 100%;height: 100%;" type="left" size="17"></uni-icons>
								<uni-icons @click="backEvent(2)" v-if="backImageUrl == '2'"
									style="width: 100%;height: 100%;" type="closeempty" size="17"></uni-icons>
							</view>
						</view>
					</view>
					<view class="wx-head-mod-nav-content"
						:style="{height:customHeight+'rpx',justifyContent:textAlign === 'center'?'center':'left'}"
						v-if="backImageUrl == '3'||  backImageUrl == '4'">
						<view class="searchBox"
							:style="[{'margin-left':textAlign === 'center'?'':'20rpx'},{width:textAlign === 'center'?' calc(100% - 320rpx)':' calc(100% - 280rpx)'}]">

							<input class="inputs" type="text" confirm-type="search" @confirm="doSearch"
								v-model="searchValue" placeholder="请输入想要搜索的商品" />
							<view class="searchIconBox"><uni-icons class="searchIcon" type="search"
									size="18"></uni-icons></view>
						</view>
						<!-- 返回按钮 -->
						<view class="wx-head-mod-nav-content-back"
							:style="[{display:isBackShow?'flex':'none'},{width:backImageUrl == '4'?'0':'60rpx'}]"
							@click="backEvent">
							<view class="wx-head-mod-nav-content-back-img"
								:style="{width:backImageWidth*scaleFactor+'rpx',height:backImageHeight*scaleFactor+'rpx'}">
								<uni-icons v-if="backImageUrl == '3'" style="width: 100%;height: 100%;" type="left"
									size="17"></uni-icons>
							</view>
						</view>
					</view>
					<view class="wx-head-mod-nav-content"
						:style="{height:customHeight+'rpx',justifyContent:textAlign === 'center'?'center':'left'}"
						v-if="backImageUrl == '7'||  backImageUrl == '8'">
						<view class="searchBox" @click="focused"
							:style="[{'margin-left':textAlign === 'center'?'':'20rpx'},{width:textAlign === 'center'?' calc(100% - 320rpx)':' calc(100% - 280rpx)'}]">

							<view class="inputs">请输入想要搜索的商品</view>
							<view class="searchIconBox"><uni-icons class="searchIcon" type="search"
									size="18"></uni-icons></view>
						</view>
						<!-- 返回按钮 -->
						<view class="wx-head-mod-nav-content-back"
							:style="[{display:isBackShow?'flex':'none'},{width:backImageUrl == '4'?'0':'60rpx'}]"
							@click="backEvent">
							<view class="wx-head-mod-nav-content-back-img"
								:style="{width:backImageWidth*scaleFactor+'rpx',height:backImageHeight*scaleFactor+'rpx'}">
								<uni-icons v-if="backImageUrl == '7'" style="width: 100%;height: 100%;" type="left"
									size="17"></uni-icons>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- #endif -->


			<!-- 除微信小程序之外的其他设备 -->
			<!-- #ifndef MP-WEIXIN -->
			<view class="other-head-mod"
				:style="{height:navHeightValue*scaleFactor+statusBarHeight+'rpx',backgroundColor:navBackgroundColor}">

				<view class="other-head-mod-mian"
					:style="{height:navHeightValue*scaleFactor+'rpx',justifyContent:textAlign === 'center'?'center':'left'}"
					v-if="backImageUrl == '3'||  backImageUrl == '4'">
					<!-- 返回按钮 -->
					<view class="other-head-mod-mian-back" v-show="isBackShow" @click="backEvent">
						<view class="other-head-mod-mian-back-img"
							:style="{width:backImageWidth*scaleFactor+'rpx',height:backImageHeight*scaleFactor+'rpx'}">
							<uni-icons v-if="backImageUrl == '3'" style="width: 100%;height: 100%;" type="left"
								size="17"></uni-icons>
						</view>
					</view>
					<view class="searchBox">
						<input class="inputs" type="text" confirm-type="search" @confirm="doSearch"
							v-model="searchValue" placeholder="请输入想要搜索的商品"/>
						<view class="searchIconBox"><uni-icons class="searchIcon" type="search"
								size="18"></uni-icons></view>
					</view>

				</view>
				<view class="other-head-mod-mian"
					:style="{height:navHeightValue*scaleFactor+'rpx',justifyContent:textAlign === 'center'?'center':'left'}"
					v-if="backImageUrl == '7'||  backImageUrl == '8'">
					<!-- 返回按钮 -->
					<view class="other-head-mod-mian-back" v-show="isBackShow" @click="backEvent">
						<view class="other-head-mod-mian-back-img"
							:style="{width:backImageWidth*scaleFactor+'rpx',height:backImageHeight*scaleFactor+'rpx'}">
							<uni-icons v-if="backImageUrl == '7'" style="width: 100%;height: 100%;" type="left"
								size="17"></uni-icons>
						</view>
					</view>
					<view class="searchBox" @click="focused">
						<view class="inputs">请输入想要搜索的商品</view>
						<view class="searchIconBox"><uni-icons class="searchIcon" type="search" size="18"></uni-icons>
						</view>
					</view>

				</view>
				<view class="other-head-mod-mian"
					:style="{height:navHeightValue*scaleFactor+'rpx',justifyContent:textAlign === 'center'?'center':'left'}"
					v-if="backImageUrl == '1'||backImageUrl == '2'||backImageUrl == '0'">
					<!-- 返回按钮 -->
					<view class="other-head-mod-mian-back" v-show="isBackShow">
						<view class="other-head-mod-mian-back-img"
							:style="{width:backImageWidth*scaleFactor+'rpx',height:backImageHeight*scaleFactor+'rpx'}">
							<uni-icons @click="backEvent(1)" v-if="backImageUrl == '1'"
								style="width: 100%;height: 100%;" type="left" size="17"></uni-icons>
							<uni-icons @click="backEvent(2)" v-if="backImageUrl == '2'"
								style="width: 100%;height: 100%;" type="closeempty" size="17"></uni-icons>
						</view>
					</view>
					<!-- 标题 -->
					<view class="other-head-mod-mian-title" :style="{width:windowWidth+'rpx',lineHeight:navHeightValue*scaleFactor+'rpx',
					paddingLeft:textPaddingLeft*scaleFactor+'rpx',fontSize:fontSize*scaleFactor+'rpx',textAlign:'center',
					fontWeight:fontWeight,color:titleColor}">
						{{textContent}}
					</view>
				</view>
			</view>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
		</view>
		<!-- #endif -->
		<!-- #ifndef MP-WEIXIN -->
	</view>
	<!-- #endif -->
</template>

<script>
	const app = getApp()
	import {
		systemInfo
	} from './comon.js'
	import {
		navHeight
	} from '@/store/navHeight'
	export default {
		name: "HeadView",
		props: {
			// 文本区域位置 left：左  center：中  
			textAlign: {
				type: String,
				default: 'center'
			},
			// 文本区内容
			textContent: {
				type: String,
				default: ''
			},
			// 文本区离左边的距离
			textPaddingLeft: {
				type: Number,
				default: 16
			},
			// 是否需要返回按钮
			isBackShow: {
				type: Boolean,
				default: true
			},
			// 文本区字体大小
			fontSize: {
				type: Number,
				default: 20 //px
			},
			// 文本区字体粗细
			fontWeight: {
				type: Number,
				default: 700
			},
			// 文本区返回按钮图片宽
			backImageWidth: {
				type: Number,
				default: 12 //px
			},
			// 文本区返回按钮图片高
			backImageHeight: {
				type: Number,
				default: 24 //px
			},
			// 返回按钮图标路径
			backImageUrl: {
				type: String,
				default: '1'
			},
			// 导航栏整体背景颜色
			navBackgroundColor: {
				type: String,
				default: '#2476F9'
			},
			// 标题字体颜色
			titleColor: {
				type: String,
				default: '#000',
			},

			/******** h5端，app端需要传入自定义导航栏高度 *******/
			navHeightValue: {
				type: Number,
				default: 44 //px
			},
			searchValues: {
				type: String,
				default: '',
			},
		},
		computed: {
			// 文本区宽度
			navTextWidth() {
				if (this.textAlign === 'center') {
					return (this.windowWidth - (this.windowWidth - this.menubarLeft) * 2) + 'rpx'
				} else {
					return this.menubarLeft + 'rpx'
				}
			},
			// 文本区paddingLeft
			textPaddingleft() {
				if (this.textAlign === 'center') {
					return '0'
				} else {
					return this.textPaddingLeft + 'rpx'
				}
			}
		},
		data() {
			return {
				statusBarHeight: getApp().globalData.statusBarHeight, //状态栏高度
				navHeight: getApp().globalData.navHeight, //头部导航栏总体高度
				navigationBarHeight: getApp().globalData.navigationBarHeight, //导航栏高度
				customHeight: getApp().globalData.customHeight, //胶囊高度
				scaleFactor: getApp().globalData.scaleFactor, //比例系数
				menubarLeft: getApp().globalData.menubarLeft, //胶囊定位的左边left
				windowWidth: getApp().globalData.windowWidth * getApp().globalData.scaleFactor,
				searchValue: ''
			};
		},
		methods: {
			backEvent(val) {
				console.log(this.textContent);
				if (val == 2) {
					uni.switchTab({
						url: "/pages/homePage/homepage"
					});
				} else {
					if(this.textContent == '在线支付'){
						uni.navigateTo({
							url: "/pages/memberCenter/myOrder/myOrder?stateid=1"
						})
					}else if(this.textContent == '定金支付'){
						uni.navigateTo({
							url: "/pages/memberCenter/myOrder/myOrder?stateid=1"
						})
					}else if(this.textContent == '我的订单'){
						uni.switchTab({
							url: "/pages/memberCenter/memberCenter"
						})
					}else if(this.textContent == '支付成功'){
						uni.navigateTo({
							url: "/pages/memberCenter/myOrder/myOrder?stateid=0"
						})
					}else{
						uni.navigateBack({
							delta: 1
						})
					}
					
				}

			},
			doSearch() {
				console.log(this.searchValue);
				this.$emit("searched", this.searchValue);
			},
			focused() {
				console.log(111);
				uni.navigateTo({
					url: "/pages/homePage/searchPage"
				})
			}
		},
		mounted(){
			if (this.searchValues != '') {
				console.log(this.searchValues);
				this.searchValue = this.searchValues
			}
		},
		created() {
			
			/* 获取设备信息 */
			const SystemInfomations = systemInfo()
			/* 通用平台 */
			this.statusBarHeight = SystemInfomations.statusBarHeight //状态栏高度
			this.scaleFactor = SystemInfomations.scaleFactor //比例系数
			this.windowWidth = SystemInfomations.windowWidth //当前设备的屏幕宽度
			/* 微信小程序平台 */
			// #ifdef MP-WEIXIN
			this.navHeight = SystemInfomations.navHeight + SystemInfomations.statusBarHeight //头部导航栏总高度
			this.navigationBarHeight = SystemInfomations.navHeight //头部导航栏高度
			this.customHeight = SystemInfomations.menuButtonHeight //胶囊高度
			this.menubarLeft = SystemInfomations.menuButtonLeft //胶囊左边界距离左上角的距离
			navHeight().setHeight(this.navHeight)
			// #endif
		}
	}
</script>

<style>
	/* #ifdef MP-WEIXIN */
	.wx-head-mod {
		box-sizing: border-box;
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
	}

	.wx-head-mod-nav {
		box-sizing: border-box;
		width: 100%;
		position: absolute;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;

	}

	.wx-head-mod-nav-content {
		box-sizing: border-box;
		width: 100%;
		display: flex;
		justify-content: left;
		align-items: center;
		position: relative;
	}

	/* 文本区 */
	.wx-head-mod-nav-content-mian {
		box-sizing: border-box;
		height: 100%;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	/* 返回按钮 */
	.wx-head-mod-nav-content-back {
		box-sizing: border-box;
		width: 60rpx;
		height: 100%;
		/* background-color: aqua; */
		position: absolute;
		top: 6rpx;
		left: 22.5rpx;
		display: flex;
		align-items: center;
		justify-content: left;
	}

	.wx-head-mod-nav-content-back-img {
		box-sizing: border-box;
	}

	.searchBox {
		width: calc(100% - 280rpx);
		position: relative;
		margin-right: 120rpx;
	}

	.inputs {
		width: 100%;
		box-sizing: border-box;
		font-size: 28rpx;
		height: 54rpx;
		padding-left: 60rpx;
		line-height: 52rpx;
		background: #FFFFFF;
		border-radius: 29rpx;
		border: 1rpx solid #1C9B64;
		color: #88888C;
	}

	.searchIconBox {
		height: 100%;
		display: flex;
		align-items: center;
		position: absolute;
		left: 18rpx;
		top: 0rpx;
		bottom: 0rpx;
		margin: auto 0;

	}

	.searchIcon {}

	/* #endif */

	/* #ifndef MP-WEIXIN */
	.other-head-mod {
		box-sizing: border-box;
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
	}

	.other-head-mod-mian {
		box-sizing: border-box;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: left;
		position: absolute;
		left: 0;
		bottom: 0;
	}

	/* 返回按钮 */
	.other-head-mod-mian-back {
		box-sizing: border-box;
		height: 100%;
		width: 60rpx;
		position: absolute;
		left: 22.5rpx;
		top: 6rpx;
		display: flex;
		align-items: center;
	}

	/* 标题 */
	.other-head-mod-mian-title {
		box-sizing: border-box;
		height: 100%;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.searchBox {
		width: calc(100% - 40rpx);
		position: relative;
		display: flex;
		align-items: center;
		margin: 0 auto;
	}

	.inputs {
		width: 100%;
		box-sizing: border-box;
		font-size: 28rpx;
		height: 54rpx;
		padding-left: 60rpx;
		line-height: 58rpx;
		background: #FFFFFF;
		border-radius: 29rpx;
		border: 1rpx solid #1C9B64;
		color: #88888C;
	}

	.searchIconBox {
		height: 100%;
		display: flex;
		align-items: center;
		position: absolute;
		left: 18rpx;
		top: 0rpx;
		bottom: 0rpx;
		margin: auto 0;

	}


	.searchIcon {}

	/* #endif */
</style>