import request from '@/utils/request.js'

//保存和更新发票
export function shopInvoiceCreateOrUpdate(data) {
return request({
	  url: '/orders/invoice/createOrUpdate.html',
	  method: 'POST',
	  data
  })
}

//获取发票
export function shopInvoiceList(data) {
return request({
	  url: '/orders/invoice/list.html',
	  method: 'GET',
	  data
  })
}