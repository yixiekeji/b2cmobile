import request from '@/utils/request.js'

//获取会员详细信息
export function memberInfo(data) {
  return request({
    url: '/member/info.html',
    method: 'GET',
    data
  })
}

//用户中心首页数据
export function memberindex(data) {
  return request({
    url: '/member/index.html',
    method: 'GET',
    data
  })
}

//更新用户信息
export function memberUpdateInfo(data) {
  return request({
    url: '/member/updateInfo.html',
    method: 'POST',
    data
  })
}

//商品收藏
export function shopCollectionCreate(data) {
  return request({
    url: '/member/collection/create.html',
    method: 'POST',
	data
  })
}

//商品取消收藏
export function shopCollectionCancel(data) {
  return request({
    url: '/member/collection/delete.html',
    method: 'POST',
	data
  })
}

//商品收藏列表
export function collectionList(data) {
  return request({
    url: '/member/collection/list',
    method: 'GET',
	data
  })
}

//获取所有收货地址
export function address(data) {
  return request({
    url: '/member/listAll.html',
    method: 'GET',
    data
  })
}

//删除收货地址
export function deleteaddress(data) {
  return request({
    url: '/member/delete.html',
    method: 'POST',
    data
  })
}

//收货地址信息编辑
export function updateaddress(data) {
  return request({
    url: '/member/update.html',
    method: 'POST',
    data
  })
}

//收货地址信息提交
export function createaddress(data) {
  return request({
    url: '/member/create.html',
    method: 'POST',
    data
  })
}

//获取地址详情
export function getMemberAddress(data) {
  return request({
    url: '/member/getMemberAddress.html',
    method: 'GET',
    data
  })
}

//收获地址设为默认
export function auditaddress(data) {
  return request({
    url: '/member/audit.html',
    method: 'POST',
    data
  })
}

//优惠券列表
export function couponList(data) {
  return request({
    url: '/member/coupon/list.html',
    method: 'GET',
    data
  })
}

//优惠券列表-未登录
export function wdlcoupon(data) {
  return request({
    url: '/coupon.html',
    method: 'GET',
    data
  })
}

//用户兑换优惠券
export function convertCoupon(data) {
  return request({
    url: '/member/coupon/convertCoupon.html',
    method: 'POST',
    data
  })
}

//根据订单ID跳转到添加或编辑商品评价页面
export function savecomment(data) {
  return request({
    url: '/member/savecomment.html',
    method: 'POST',
    data
  })
}

//根据订单ID跳转到添加或编辑商品评价页面
export function orderscomment(data) {
  return request({
    url: '/member/orderscomment.html',
    method: 'GET',
    data
  })
}

//根据订单ID和网单ID查询是否有过评论，有返回，没有返回空
export function getProductComment(data) {
  return request({
    url: '/member/getProductComment.html',
    method: 'GET',
    data
  })
}

//用户中心评论列表页面
export function commentlist(data) {
  return request({
    url: '/member/commentlist.html',
    method: 'GET',
    data
  })
}

//删除用户评论
export function deleted(data) {
  return request({
    url: '/member/delete.html',
    method: 'GET',
    data
  })
}

//获取所有地址
export function getAllPCA(data) {
  return request({
    url: '/system/getAllRegions.html',
    method: 'GET',
    data
  })
}
