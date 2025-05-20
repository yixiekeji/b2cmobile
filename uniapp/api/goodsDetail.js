import request from '@/utils/request.js'

//商品详情页
export function productDetail(data) {
  return request({
    url: '/product/detail.html',
    method: 'GET',
	data
  })
}

//加入购物车
export function cartSave(data) {
  return request({
    url: '/cart/save.html',
    method: 'post',
	data
  })
}

//商品详细参数
export function detailgoods(data) {
  return request({
    url: '/product/detailgoods.html',
    method: 'GET',
	data
  })
}

//商品可用优惠券
export function getEffectiveCoupon(data) {
  return request({
    url: '/product/getEffectiveCoupon.html',
    method: 'GET',
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

//获取商品运费价格
export function getTransportPrice(data) {
  return request({
    url: '/product/getTransportPrice.html',
    method: 'GET',
	data
  })
}