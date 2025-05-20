<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	page {
		// 设置整个项目的背景色
		background-color: #f7f7f5;
		// 设置项目高度
		height:100vh;
		// 设置项目字体
		font-family: 'PingFang SC';
	}
	checkbox .wx-checkbox-input,
	checkbox .uni-checkbox-input { // 复选框样式
		border-radius: 50%;
		border-color: #1C9B64 ;
		width: 13px;
		height: 13px;
	}
	checkbox .uni-checkbox-input:hover{
		border-color: #1C9B64 !important;
	}
	checkbox .uni-checkbox-input svg{
		transform:translate(-50%, -50%) scale(0.46);
	}
	uni-tabbar{
		z-index: 9 !important;
	}
	.uni-data-checklist .checklist-group .checklist-box{
		width: auto !important;
	}
	.uni-data-checklist .checklist-group.is-list{
		flex-direction: row !important;
	}
</style>
