import request from '@/utils/request.js'

//评论列表页面
export function commentlist(data) {
  return request({
    url: '/product/commentlist.html',
    method: 'GET',
	data
  })
}

//商品单品页，取出推荐的5个评论
export function comment(data) {
  return request({
    url: '/product/comment.html',
    method: 'GET',
	data
  })
}