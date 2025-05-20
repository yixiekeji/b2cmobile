import request from '@/utils/request.js'

//获取首页楼层
export function floor(data) {
  return request({
    url: '/index/floor.html',
    method: 'GET',
    data
  })
}

//获取首页轮播图
export function banner(data) {
  return request({
    url: '/index/banner.html',
    method: 'GET',
    data
  })
}

//获取首页轮播图
export function indexLike(data) {
  return request({
    url: '/index/indexLike.html',
    method: 'GET',
    data
  })
}

//获取新闻列表
export function newslist(data) {
  return request({
    url: '/newslist.html',
    method: 'GET',
    data
  })
}

//获取新闻列表
export function newstype(data) {
  return request({
    url: '/news/type.html',
    method: 'GET',
    data
  })
}

//文章详细页面
export function newsDetail(data) {
  return request({
    url: '/newsDetail.html',
    method: 'GET',
    data
  })
}

//文章详细页面
export function memberShare(data) {
  return request({
    url: '/member/share.html',
    method: 'GET',
    data
  })
}