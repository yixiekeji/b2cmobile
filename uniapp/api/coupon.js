import request from '@/utils/request.js'

//获取优惠券适用的商品
export function couponProduct(data) {
  return request({
    url: '/couponProduct.html',
    method: 'GET',
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

//用户兑换优惠券
export function convertCoupon(data) {
  return request({
    url: '/member/coupon/convertCoupon.html',
    method: 'POST',
	data
  })
}

//用户在线领取优惠券
export function reveivecoupon(data) {
  return request({
    url: '/member/coupon/reveivecoupon.html',
    method: 'POST',
	data
  })
}