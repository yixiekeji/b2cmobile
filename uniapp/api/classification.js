import request from '@/utils/request.js'

//分类页
export function getIndexCate(data) {
  return request({
    url: '/index/getIndexCate.html',
    method: 'GET',
  })
}

//分类列表页
export function productlist(data) {
  return request({
    url: '/product/productlist.html',
    method: 'GET',
	data
  })
}

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