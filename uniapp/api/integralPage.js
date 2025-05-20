import request from '@/utils/request.js'

//积分商城轮播图
export function integralBanner(data) {
  return request({
    url: '/integral-banner.html',
    method: 'GET',
	data
  })
}

//积分商城分类
export function integralType(data) {
  return request({
    url: '/integral-type.html',
    method: 'GET',
	data
  })
}

//积分商城列表
export function jifen(data) {
  return request({
    url: '/jifen.html',
    method: 'GET',
	data
  })
}

//积分商城列表
export function issign(data) {
  return request({
    url: '/is-sign.html',
    method: 'GET',
	data
  })
}

//签到
export function sign(data) {
  return request({
    url: '/member/sign.html',
    method: 'POST',
	data
  })
}

//商品详情页
export function jifenDetail(data) {
  return request({
    url: '/jifen/detail.html',
    method: 'GET',
	data
  })
}

//商品详细参数
export function detailgoods(data) {
  return request({
    url: '/detailgoods.html',
    method: 'GET',
	data
  })
}

//积分列表
export function integral(data) {
  return request({
    url: '/member/integral.html',
    method: 'GET',
	data
  })
}

//经验值列表
export function grade(data) {
  return request({
    url: '/member/grade.html',
    method: 'GET',
	data
  })
}

//积分换购提交订单页面取数据
export function ordersjifen(data) {
  return request({
    url: '/orders/jifen.html',
    method: 'GET',
	data
  })
}

//积分换购提交订单 10秒内不可重复提交
export function submitintegral(data) {
  return request({
    url: '/orders/submitintegral.html',
    method: 'POST',
	data
  })
}