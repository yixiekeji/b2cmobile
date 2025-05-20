import request from '@/utils/request.js'

export function productReport(data) {
  return request({
    url: '/product/productReport.html',
    method: 'GET',
    data
  })
}