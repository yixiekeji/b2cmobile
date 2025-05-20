import request from '@/utils/request.js'

//获取发票信息
export function vatinvoice(data) {
  return request({
    url: '/member/vatinvoice.html',
    method: 'GET',
    data
  })
}

//添加发票信息
export function createvatinvoice(data) {
  return request({
    url: '/member/createvatinvoice.html',
    method: 'POST',
    data
  })
}

//修改发票信息
export function updatevatinvoice(data) {
  return request({
    url: '/member/updatevatinvoice.html',
    method: 'POST',
    data
  })
}