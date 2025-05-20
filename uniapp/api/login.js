import request from '@/utils/request.js'

//获取手机验证码
export function sendVerifySMS(data) {
  return request({
    url: '/sendVerifySMS.html',
    method: 'GET',
    data
  })
}

//获取图形验证码
export function verify(data) {
  return request({
    url: '/verifyBase64.html',
    method: 'GET',
  })
}

//注册
export function doregister(data) {
  return request({
    url: '/doregister.html',
    method: 'POST',
    data
  })
}

//重置密码
export function doforgetpassword(data) {
  return request({
    url: '/member/resetMemberPwd.html',
    method: 'POST',
    data
  })
}

//忘记密码
export function resetPwd(data) {
	// console.log(query);
  return request({
    url: '/resetPwd.html',
    method: 'POST',
    data
  })
}

//更改绑定手机号
export function updatephone(data) {
  return request({
    url: '/member/updatephone.html',
    method: 'POST',
    data
  })
}

//登陆
export function dologin(data) {
  return request({
    url: '/dologin.html',
    method: 'POST',
    data
  })
}

//手机号验证码，如果没有注册，自动完成注册
export function dologinPhone(data) {
  return request({
    url: '/dologinPhone.html',
    method: 'POST',
    data
  })
}

//获取openid
export function getOpenId(data) {
  return request({
    url: '/getOpenId.html',
    method: 'POST',
    data
  })
}

//小程序获取手机号
export function getPhoneNumber(data) {
  return request({
    url: '/getPhoneNumber.html',
    method: 'GET',
    data
  })
}

//手机号验证码，如果没有注册，自动完成注册（微信登录）
export function dologinWx(data) {
  return request({
    url: '/dologinWx.html',
    method: 'POST',
    data
  })
}

//获取appopenid
export function getAppOpenId(data) {
  return request({
    url: '/getAppOpenId.html',
    method: 'POST',
    data
  })
}

//获取appopenid
export function getAppUserInfo(data) {
  return request({
    url: '/getAppUserInfo.html',
    method: 'GET',
    data
  })
}

//注册
export function register(data) {
  return request({
    url: '/register.html',
    method: 'POST',
    data
  })
}

//退出登陆
export function logout(data) {
  return request({
    url: '/logout.html',
    method: 'GET',
    data
  })
}