import request from '@/utils/request.js'

//ali
export function payindex(data) {
  return request({
    url: '/pay/h5/payindex.html',
    method: 'POST',
    data
  })
}

//APP
export function apppayindex(data) {
  return request({
    url: '/pay/app/payindex.html',
    method: 'POST',
    data
  })
}

//公众号
export function wxpayindex(data) {
  return request({
    url: '/pay/wx/payindex.html',
    method: 'POST',
    data
  })
}


//小程序
export function xcxpayindex(data) {
  return request({
    url: '/pay/xcx/payindex.html',
    method: 'POST',
    data
  })
}

//离线
export function offlinelist(data) {
  return request({
    url: '/member/offlinelist.html',
    method: 'GET',
    data
  })
}

//上传支付凭证
export function saveoffline(data) {
  return request({
    url: '/member/saveoffline.html',
    method: 'GET',
    data
  })
}

//删除支付凭证
export function deloffline(data) {
  return request({
    url: '/member/deloffline.html',
    method: 'GET',
    data
  })
}