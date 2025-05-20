import request from '@/utils/request.js'

//搜索结果列表
export function searchList(data) {
  return request({
    url: '/search.html',
    method: 'GET',
    data
  })
}

//热门搜索
export function searchIndex(data) {
  return request({
    url: '/search-index.html',
    method: 'GET',
    data
  })
}

//删除搜索历史
export function delSearch(data) {
  return request({
    url: '/delSearch.html',
    method: 'GET',
    data
  })
}

