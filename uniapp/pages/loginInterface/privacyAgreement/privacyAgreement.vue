<template>
	<view>
		隐私政策内容
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods:{
			// 返回上一页
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
		},
		onLoad() {

		}
	}
</script>

<style lang="scss">

</style>
