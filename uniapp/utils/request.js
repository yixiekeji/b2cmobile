let token = ""; //凭证
import { login } from "@/store/login";

function service(options = {}) {
  let optionsApi = "";
  optionsApi = options.url;
  // #ifdef MP-WEIXIN
  options.url = "http://127.0.0.1/" + `${options.url}`;
  // #endif
  // #ifdef APP-PLUS
  options.url = "http://127.0.0.1" + `${options.url}`;
  // #endif
  // #ifdef H5
  // options.url = '/prod-api' +'/api'+ `${options.url}`
  options.url = "/prod-api" + `${options.url}`;
  // #endif
  console.log(login());
  //配置请求头
  options.header = {
    "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
    token: login().token, //Bearer
    // 'tokenId': uni.getStorageSync("s"),
    // 'tokenId':'1',
    //获取存储的cookie,仅在mp小程序环境运行
    // #ifdef MP
    // 'cookie': uni.getStorageSync("shiro")
    // #endif
  };
  options.withCredentials = true;
  return new Promise((resolved, rejected) => {
    //成功
    options.success = (res) => {
      console.log(res.data.success);
      if (Number(res.statusCode) == 200) {
        //请求成功
        if (res.data.success != false) {
          resolved(res);
          if (cookie == "" && res.cookies[0].indexOf("JSESSIONID") != -1) {
            uni.setStorageSync("cookieKey", res.cookies[0]);
            cookie = res.cookies[0];
          }
        } else {
          resolved(res);
          if (res.data.message == "亲爱的用户，请先登录后再操作") {
            if (optionsApi == "/member/info.html" || optionsApi == "/cart/list.html" || optionsApi == "/member/index.html") {
            } else {
              uni.redirectTo({
                url: "/pages/loginInterface/passwordLogin",
              });
              // uni.showToast({
              // 	icon: 'none',
              // 	duration: 3000,
              // 	title: `${res.data.message}`
              // });
            }
          } else if (optionsApi == "/orders/submit.html") {
            uni.showModal({
              title: "提示",
              content: res.data.message,
              cancelText: "取消", // 取消按钮的文字
              confirmText: "确认", // 确认按钮的文字
              showCancel: false, // 是否显示取消按钮，默认为 true
              confirmColor: "#000",
              success: (res) => {
                if (res.confirm) {
                  console.log("comfirm"); //点击确定之后执行的代码
                } else {
                  console.log("cancel"); //点击取消之后执行的代码
                }
              },
            });
          } else {
            uni.showToast({
              icon: "none",
              duration: 3000,
              title: `${res.data.message}`,
            });
          }
        }
      } else {
        if (res.data.msg) {
          uni.showToast({
            icon: "none",
            duration: 3000,
            title: `${res.data.msg}`,
          });
        }
        rejected(res.data.msg); //错误
      }
    };
    //错误
    options.fail = (err) => {
      rejected(err); //错误
    };
    uni.request(options);
  });
}
export default service;
