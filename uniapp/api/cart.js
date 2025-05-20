import request from '@/utils/request.js'

//获取购物车列表
export function cartList(data) {
  return request({
    url: '/cart/list.html',
    method: 'GET',
	data
  })
}

//购物车全选or全不选
export function cartcheckedAll(data) {
  return request({
    url: '/cart/cartcheckedAll.html',
    method: 'GET',
	data
  })
}

//购物车单品选中or不选
export function cartchecked(data) {
  return request({
    url: '/cart/cartchecked.html',
    method: 'GET',
	data
  })
}

//购物车+
export function addOrdersCart(data) {
  return request({
    url: '/cart/addOrdersCart.html',
    method: 'GET',
	data
  })
}

//购物车-
export function reduceOrdersCart(data) {
  return request({
    url: '/cart/reduceOrdersCart.html',
    method: 'GET',
	data
  })
}