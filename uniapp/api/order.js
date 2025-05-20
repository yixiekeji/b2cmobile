import request from '@/utils/request.js'

 //获取页面数据
 export function ordersInfo(data) {
   return request({
     url: '/orders/info.html',
     method: 'GET',
 	  data
   })
 }

 //提交页面数据
 export function ordersSubmit(data) {
   return request({
     url: '/orders/submit.html',
     method: 'POST',
 	  data
   })
 }
 
 //订单列表
 export function memberOrdersList(data) {
   return request({
     url: '/member/orders/list.html',
     method: 'GET',
 	  data
   })
 }
 
 //取消订单
 export function memberOrdersCancelOrder(data) {
   return request({
     url: '/member/orders/cancelOrder.html',
     method: 'POST',
 	  data
   })
 }
 
 //确认收货
 export function memberOrdersConfirmOrder(data) {
   return request({
     url: '/member/orders/confirmOrder.html',
     method: 'POST',
 	  data
   })
 }
 
 //根据ID取数据
 export function memberOrdersGetOrders(data) {
   return request({
     url: '/member/orders/getOrders.html',
     method: 'GET',
 	  data
   })
 }
 
 //获取用户当前可用的已绑定的优惠券
 export function getCoupon(data) {
   return request({
     url: '/orders/getCoupon.html',
     method: 'GET',
 	  data
   })
 }
 
 
 //跳转到退货申请页面，显示该订单的所有商品，然后可以对商品发起退货申请
 export function backapply(data) {
   return request({
     url: '/member/backapply.html',
     method: 'GET',
 	  data
   })
 }
 
 //判断是否可以发起退换货申请
 export function canbackorexchange(data) {
   return request({
     url: '/member/canbackorexchange.html',
     method: 'GET',
 	  data
   })
 }
 
 //退货申请信息提交
 export function doproductback(data) {
   return request({
     url: '/member/doproductback.html',
     method: 'POST',
 	  data
   })
 }
 
 //换货申请信息提交
 export function doproductexchange(data) {
   return request({
     url: '/member/doproductexchange.html',
     method: 'POST',
 	  data
   })
 }
 
 //用户中心-退货列表页面
 export function back(data) {
   return request({
     url: '/member/back.html',
     method: 'GET',
 	  data
   })
 }
 
 //用户中心-换货列表页面
 export function exchange(data) {
   return request({
     url: '/member/exchange.html',
     method: 'GET',
 	  data
   })
 }
 
 //退货发货页面取数据
 export function backDeliverGoods(data) {
   return request({
     url: '/member/backDeliverGoods.html',
     method: 'GET',
 	  data
   })
 }
 
 //退货发货
 export function doBackDeliverGoods(data) {
   return request({
     url: '/member/doBackDeliverGoods.html',
     method: 'POST',
 	  data
   })
 }
 
 //退货时退件查看物流消息
 export function lookBackLogistics(data) {
   return request({
     url: '/member/lookBackLogistics.html',
     method: 'GET',
 	  data
   })
 }
 
 //跳转到换货发货页面取数据
 export function exchangeDeliverGoods(data) {
   return request({
     url: '/member/exchangeDeliverGoods.html',
     method: 'GET',
 	  data
   })
 }
 
 //换货发货
 export function doExchangeDeliverGoods(data) {
   return request({
     url: '/member/doExchangeDeliverGoods.html',
     method: 'POST',
 	  data
   })
 }
 
 //用户收到换货的换件
 export function doReceiveExchangeGoods(data) {
   return request({
     url: '/member/doReceiveExchangeGoods.html',
     method: 'POST',
 	  data
   })
 }
 
 //换货时查看物流消息
 export function lookExchangeLogistics(data) {
   return request({
     url: '/member/lookExchangeLogistics.html',
     method: 'GET',
 	  data
   })
 }