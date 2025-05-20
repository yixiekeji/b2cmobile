<template>
	<view class="personalPage">
		<!-- 自定义导航栏 -->
		<HeadNav nav-background-color="#fff" backImageUrl="1" textContent="联系我们" fontSize="15" fontWeight="600">
		</HeadNav>
		<!-- 用户基本信息 -->
		<uni-list :border="false">
			<uni-list-item title="公司名称" rightText="北京易写科技有限公司" :border="false" />
			<uni-list-item title="联系电话" rightText="18612670879" :border="false" />
			<uni-list-item title="微 信 号" rightText="18612670879" :border="false" />
			<uni-list-item title="Q  Q  号" rightText="43006111" :border="false" />
			<uni-list-item :border="false" title="公司简介" 
			note="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;北京易写科技有限公司是国内最专注的电商服务的软件公司，公司位于北京市，是一家拥有自主知识产权的高新科技公司，并相聚获得中关村高新、国家高新认证。
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;核心成员均来自一线互联网电商公司，有阿里、京东、海尔电商等工作经历，对互联网、电子商务有深刻理解，有着丰富的电商运营经验，具有大型电商平台架构和技术开发经验。
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;北京易写科技有限公司旗下B2B2C、B2C、B2B、O2O拥有自主的知识产权。公司定位中高端电子商务提供商、适合二次开发的电子商务系统。
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;旗下采用Java作为开发语言，结合团队在阿里、京东、海尔电商的实际开发经验，不断开发完善，产品从丰富产品功能、提升用户体验、优化系统性能等方法入手，经过多次升级改版，多次为大型集团公司定制开发，我们的客户有国家电网、中信集团、中电普华、国电通、自然堂、桔子分期、报喜鸟、中能国际、武汉艺术品交易中心等，优质的服务得到客户的一致好评。
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;除此之外，我们还提供区块链溯源、在线教育、知识服务等各种类软件的开发服务，有需求随时联系我们。
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;官网：http://www.yixiekeji.com/
" />
		</uni-list>
	</view>
</template>

<script>

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
				margin: 74rpx 212rpx;
				width: 326rpx;
				height: 123rpx;
			}
		}
	}
	::v-deep .uni-list-item__extra-text{
		color: #000 !important;
		font-size: 28rpx !important;
	}
	::v-deep .uni-list-item__content-note{
		color: #000 !important;
		font-size: 28rpx !important;
		line-height: 36rpx;
	}
</style>