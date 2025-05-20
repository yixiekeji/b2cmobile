<template>
  <view
    class="detailPage"
    :style="{
      background:
        data.orders.ordersState == 5
          ? 'linear-gradient(to bottom, #DC3A2F 0%, rgba(255,0,0,0) 30%)'
          : 'linear-gradient(to bottom, #1C9B64 0%, rgba(255,0,0,0) 30%)',
    }">
    <!-- 自定义导航栏 -->
    <HeadNav
      nav-background-color="#f7f7f5"
      backImageUrl="1"
      textContent="订单详情"
      fontSize="15"
      fontWeight="600"
      style="z-index: 999999; position: relative"></HeadNav>
    <!-- 商品详情 -->
    <view class="orderAddress">
      <view>
        <text v-if="data.orders.ordersState == 1">未付款</text>
        <text v-else-if="data.orders.ordersState == 2">待发货</text>
        <text v-else-if="data.orders.ordersState == 3">已发货</text>
        <text v-else-if="data.orders.ordersState == 4">已完成</text>
        <text v-else-if="data.orders.ordersState == 5">已取消</text>
      </view>
      <view>
        <image src="@/static/member/position.png" mode=""></image>
        <view>
          <view>{{ data.orders.name }} {{ data.orders.mobile }}</view>
          <text>{{ data.orders.addressAll }} {{ data.orders.addressInfo }}</text>
        </view>
      </view>
    </view>
    <view class="detailContent">
      <view
        class="detailBox"
        v-for="(item, index) in data.ordersProductList"
        @click="jumpDEtails(item.productId, data.orders.ordersType, item.integralId)">
        <view class="imgbox">
          <image :src="imageUrl + item.productImg"></image>
        </view>
        <view class="fontBox">
          <view class="font1">{{ item.productName }}</view>
          <view :class="item.specInfo ? 'font2' : 'font22'">{{ item.specInfo }}</view>
          <view class="font3">
            <view>￥{{ item.moneyPrice }}</view>
            <text>x{{ item.number }}</text>
          </view>
        </view>
      </view>
      <view class="btnbox">
        <button v-if="data.orders.ordersState == 1 || data.orders.ordersState == 2" @click="cancelOrder(data.orders.id, index)">取消</button>
        <button class="confirmOrder" v-if="data.orders.ordersState == 1" @click="confirmOrder(data.orders.id, index)">付款</button>
        <button v-if="data.orders.ordersState == 3 && !data.orders.dorpshoppingFlag" @click="confirmReceipt(data.orders.id, index)">确认收货</button>
        <button v-if="data.orders.ordersState == 4" @click="jumpComment(data.orders.id)">去评价</button>
        <button v-if="data.orders.ordersState == 4" @click="jump(data.orders.id)">退换货</button>
      </view>
    </view>
    <!-- 订单详细信息 -->
    <view class="detailList">
      <view class="list">
        <view>
          订单编号：
          <text>{{ data.orders.ordersSn }}</text>
        </view>
        <button @click="copyText(data.orders.ordersSn)">复制</button>
      </view>
      <view class="list">
        <view>
          订单类型：
          <text>{{ data.orders.ordersType == "2" ? "积分商城订单" : "普通订单" }}</text>
        </view>
      </view>
      <view class="list">
        <view>
          下单时间：
          <text>{{ data.orders.createTime }}</text>
        </view>
      </view>
      <view class="list">
        <view>
          商品价格：
          <text>￥{{ data.orders.moneyProduct }}</text>
        </view>
      </view>
      <view class="list">
        <view>
          运费价格：
          <text>￥{{ data.orders.moneyLogistics }}</text>
        </view>
      </view>
      <view class="list">
        <view>
          优惠券立减：
          <text>￥{{ data.orders.moneyCoupon }}</text>
        </view>
      </view>
      <view class="list" v-if="data.orders.ordersType == '2'">
        <view>
          扣除积分：
          <text>{{ data.orders.integral }}</text>
        </view>
      </view>
      <view class="list">
        <view>
          支付总额：
          <text>￥{{ data.orders.moneyOrder }}</text>
        </view>
      </view>
      <view class="list">
        <view style="white-space: nowrap">
          订单备注：
          <text>{{ data.orders.remark == "" ? "-" : data.orders.remark }}</text>
        </view>
      </view>
    </view>
    <!-- 发票详细信息 -->
    <view class="deliveryInformation" v-if="data.orders.invoiceState != 0">
      <view class="deliveryTitle">发票信息</view>
      <view v-if="data.orders.invoiceState && data.orders.invoiceState != 'undefined'" class="deliveryFont">
        <text style="white-space: nowrap">发票类型：</text>
        <view>
          {{
            data.orders.invoiceState == 1
              ? "普通发票"
              : data.orders.invoiceState == 2
              ? "个人"
              : data.orders.invoiceState == 3
              ? "增值税专用发票"
              : ""
          }}
        </view>
      </view>
      <view v-if="data.orders.invoiceTitle && data.orders.invoiceTitle != 'undefined'" class="deliveryFont">
        <text style="white-space: nowrap">发票抬头：</text>
        <view>{{ data.orders.invoiceTitle }}</view>
      </view>
      <view v-if="data.orders.invoiceNum && data.orders.invoiceNum != 'undefined'" class="deliveryFont">
        <text style="white-space: nowrap">纳税人识别号：</text>
        <view>{{ data.orders.invoiceNum }}</view>
      </view>
      <view v-if="data.orders.invoiceAddress && data.orders.invoiceAddress != 'undefined'" class="deliveryFont">
        <text style="white-space: nowrap">注册地址：</text>
        <view>{{ data.orders.invoiceAddress }}</view>
      </view>
      <view v-if="data.orders.invoicePhone && data.orders.invoicePhone != 'undefined'" class="deliveryFont">
        <text style="white-space: nowrap">注册电话：</text>
        <view>{{ data.orders.invoicePhone }}</view>
      </view>
      <view v-if="data.orders.invoiceBank && data.orders.invoiceBank != 'undefined'" class="deliveryFont">
        <text style="white-space: nowrap">开户行：</text>
        <view>{{ data.orders.invoiceBank }}</view>
      </view>
      <view v-if="data.orders.invoiceCode && data.orders.invoiceCode != 'undefined'" class="deliveryFont">
        <text style="white-space: nowrap">银行账户：</text>
        <view>{{ data.orders.invoiceCode }}</view>
      </view>
    </view>
    <view class="deliveryInformation" v-if="data.orders.invoiceState == 0">
      <view class="deliveryTitle">发票信息</view>
      <view class="deliveryFont">
        <text style="white-space: nowrap">发票类型：</text>
        <view>不要发票</view>
      </view>
    </view>
    <view class="deliveryInformation" v-if="data.ordersLogList">
      <view class="deliveryTitle">订单日志</view>
      <view class="orderLog" v-for="log in data.ordersLogList">
        <view>{{ log.createTime }}</view>
        <view>{{ log.content }}</view>
      </view>
    </view>
    <uni-popup ref="alertDialog" type="dialog">
      <uni-popup-dialog
        :type="msgType"
        cancelText="取消"
        confirmText="确认"
        content="确认取消此条订单吗?"
        @confirm="dialogConfirm"
        @close="dialogClose"></uni-popup-dialog>
    </uni-popup>
    <uni-popup ref="alertDialogCfm" type="dialog">
      <uni-popup-dialog
        :type="msgType"
        cancelText="取消"
        confirmText="确认"
        content="确认收货吗?"
        @confirm="dialogConfirmCfm"
        @close="dialogCloseCfm"></uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script setup>
import { reactive, ref } from "vue";
import { onShow, onLoad, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app";
import { order } from "@/store/order";
import { memberOrdersGetOrders, memberOrdersCancelOrder, memberOrdersConfirmOrder } from "@/api/order.js";

let data = ref({});
const id = ref("");
const code = ref("");
const msgType = ref("");
const itemid = ref("");

function jumpDEtails(id, type, iid) {
  if (type == 1) {
    uni.navigateTo({
      url: "/pages/homePage/goodsDetail?id=" + id,
    });
  } else {
    uni.navigateTo({
      url: "/pages/memberCenter/integralPage/integralDetails?id=" + iid,
    });
  }
  console.log(id);
}

function jumpComment(val) {
  uni.navigateTo({
    url: "/pages/memberCenter/myOrder/commentList?id=" + val,
  });
}

function jump(val) {
  uni.navigateTo({
    url: "/pages/memberCenter/myOrder/returnsExchanges?id=" + val,
  });
}

function copyText(val) {
  uni.setClipboardData({
    data: val,
    success() {
      uni.showToast({
        title: "复制成功",
        icon: "success",
      });
    },
  });
}
// 商品详情数据
function getData(val) {
  memberOrdersGetOrders({
    id: val,
  }).then((res) => {
    console.log(res);
    data.value = res.data.data;
  });
}
const alertDialog = ref();
// 取消订单
function cancelOrder() {
  alertDialog.value.open();
}
//确认
function dialogConfirm() {
  memberOrdersCancelOrder({
    id: id.value,
  }).then((res) => {
    getData(id.value);
    if (res.data.success) {
      uni.showToast({
        icon: "none",
        duration: 3000,
        title: `操作成功`,
      });
    }
  });
}

function dialogClose() {
  alertDialog.value.close();
}
const alertDialogCfm = ref();
//确认收获
function confirmReceipt() {
  alertDialogCfm.value.open();
}

function confirmReceipts(val) {
  alertDialogCfm.value.open();
  itemid.value = val;
}

function dialogConfirmCfm() {
  if (itemid.value == "") {
    memberOrdersConfirmOrder({
      id: id.value,
    }).then((res) => {
      getData(id.value);
      if (res.data.success) {
        uni.showToast({
          icon: "none",
          duration: 3000,
          title: `操作成功`,
        });
      }
    });
  } else {
    memberOrdersConfirmOrder({
      id: itemid.value,
    }).then((res) => {
      getData(id.value);
      itemid.value = "";
      if (res.data.success) {
        uni.showToast({
          icon: "none",
          duration: 3000,
          title: `操作成功`,
        });
      }
    });
  }
}

function dialogCloseCfm() {
  alertDialogCfm.close();
  itemid.value = "";
}
// 订单状态栏数据
function orderState(data) {
  switch (data) {
    case 1:
      return "未付款";
      break;
    case 2:
      return "待确认";
      break;
    case 3:
      return "待发货";
      break;
    case 4:
      return "已发货";
      break;
    case 5:
      return "已完成";
      break;
    case 6:
      return "已取消";
      break;
  }
}
//付款
function confirmOrder(data) {
  // order().setOrderSn(orderSn)
  // #ifdef H5
  if (!isWeixin()) {
    uni.navigateTo({
      url: "/pages/shoppingCart/paymentMethod?id=" + data,
    });
  } else {
    let local = encodeURIComponent(
      (window.location.href.split("#")[0].indexOf("?") == -1
        ? window.location.href.split("#")[0]
        : window.location.href.split("#")[0].split("?")[0]) +
        "#/pages/shoppingCart/paymentMethod?id=" +
        data
    );
    let appid = "wx42a59bbf508e718d";
    window.location.href =
      "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
      appid +
      "&redirect_uri=" +
      local +
      "&response_type=code&scope=snsapi_base&state=1#wechat_redirect";
  }
  //#endif
  // #ifdef APP-PLUS || MP-WEIXIN
  uni.navigateTo({
    url: "/pages/shoppingCart/paymentMethod?id=" + data,
  });
  //#endif
}

function getUrlValue(value) {
  // 从第一个?开始，且不包括#之后，并截取掉?的部分
  var query = location.search.substring(1);
  // 从#开始的部分，并转换成数组
  var hash = location.hash.split("?");
  // query和hash均没有参数
  if (!query && hash.length < 2) {
    return "";
  }
  // 先取query部分的参数进行匹配
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == value) {
      return pair[1];
    }
  }
  // query没有参数，或者有参数但没找到，则取hash部分的参数
  if (!hash[1]) {
    return "";
  }
  vars = hash[1].split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == value) {
      return pair[1];
    }
  }
  return "";
}

onLoad((options) => {
  id.value = options.id;
  getData(options.id);
});
</script>

<style lang="scss" scoped>
.detailPage {
  width: 750rpx;
  height: 100%;
  padding: 14rpx;
  box-sizing: border-box;

  .orderAddress {
    width: 100%;
    height: 260rpx;
    // background-color: #DC3A2F;
    padding-top: 26rpx;
    box-sizing: border-box;
    margin-bottom: 20rpx;

    > view:nth-child(1) {
      width: 100%;
      height: 40rpx;
      text-align: center;
      line-height: 40rpx;
      color: white;
      font-weight: 700;
      font-size: 32rpx;
      margin-bottom: 50rpx;
    }

    > view:nth-child(2) {
      width: 100%;
      height: 146rpx;
      background: #ffffff;
      border-radius: 24rpx;
      padding: 20rpx;
      box-sizing: border-box;
      display: flex;
      align-items: center;

      > image {
        width: 60rpx;
        height: 60rpx;
        margin-right: 28rpx;
      }

      > view {
        width: 560rpx;
        height: 88rpx;
        line-height: 46rpx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

        > view {
          font-weight: 600;
          font-size: 32rpx;
        }

        > text {
          font-size: 28rpx;
          color: #999999;
        }
      }
    }
  }

  .detailContent {
    width: 100%;
    background: white;
    border-radius: 24rpx;
    padding: 10rpx;
    box-sizing: border-box;

    .detailBox {
      display: flex;
      align-items: center;

      .imgbox {
        width: 160rpx;
        height: 160rpx;
        margin-top: 10rpx;

        image {
          width: 160rpx;
          height: 160rpx;
        }
      }

      .fontBox {
        width: 100%;
        padding: 20rpx 10rpx;
        box-sizing: border-box;

        // flex: 1;
        // display: flex;
        // flex-direction: column;
        // justify-content: space-between;
        .font1 {
          line-clamp: 1;
          overflow: hidden; //超出文本隐藏
          text-overflow: ellipsis; ///超出部分省略号显示
          display: -webkit-box; //弹性盒模型
          -webkit-box-orient: vertical; //上下垂直
          -webkit-line-clamp: 1; //自定义行数
          font-size: 30rpx;
          margin-top: 18rpx;
          margin-bottom: 9rpx;
        }

        .font2 {
          display: inline;
          width: 200rpx;
          padding: 0 10rpx;
          height: 36rpx;
          background: #f5f5f7;
          border-radius: 10rpx;
          font-size: 24rpx;
          line-height: 36rpx;
          text-align: center;
          color: #999999;
        }

        .font22 {
          // width: 252rpx;
          display: inline-block;
          padding: 0 10rpx;
          box-sizing: border-box;
          height: 36rpx;
          // background: #F5F5F7;
          border-radius: 10rpx;
          font-size: 24rpx;
          line-height: 36rpx;
          text-align: center;
          color: #999999;
          // margin-top: 18rpx;
          // margin-bottom: 26rpx;
        }

        .font3 {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8rpx;

          view {
            font-weight: 600;
            font-size: 34rpx;
            color: #dc3a2f;

            text {
              font-size: 24rpx;
              color: #dc3a2f;
            }
          }
        }
      }
    }

    .btnbox {
      width: 100%;
      height: 80rpx;
      margin-top: 10rpx;

      // display: flex;
      // justify-content: end;
      // margin-left: 370rpx;
      // justify-items: end;
      // justify-content: flex-end;
      button {
        width: 138rpx;
        height: 56rpx;
        border: 2rpx solid #cacacc;
        border-radius: 34rpx;
        line-height: 56rpx;
        font-size: 24rpx;
        padding: 0;
        float: right;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 10rpx;
      }
      .confirmOrder {
        background: #1c9b64;
        border: 2rpx solid #1c9b64;
        color: #ffffff;
      }
    }
  }

  .detailList {
    width: 718rpx;
    background: white;
    border-radius: 24rpx;
    padding: 20rpx 24rpx;
    box-sizing: border-box;
    font-size: 28rpx;
    margin-top: 20rpx;
    line-height: 50rpx;

    .list {
      width: 700rpx;
      display: flex;
      margin: 8rpx 0;

      view {
        // width: 600rpx;
        color: #999999;

        text {
          color: black;
        }
      }

      button {
        width: 62rpx;
        height: 28rpx;
        font-size: 20rpx;
        line-height: 28rpx;
        color: #666666;
        padding: 0;
        background-color: #f5f5f7;
        border-radius: 15rpx;
        margin: 0;
        margin-top: 11rpx;
        margin-left: 26rpx;
      }
    }
  }

  .deliveryInformation {
    width: 714rpx;
    background: #ffffff;
    border-radius: 24rpx;
    margin-top: 20rpx;
    line-height: 50rpx;
    padding: 20rpx 24rpx;
    box-sizing: border-box;
    font-size: 28rpx;

    .deliveryTitle {
      font-weight: 600;
    }

    .deliveryFont {
      display: flex;
      margin: 8rpx 0;

      text {
        color: #999999;
      }
    }
    .orderLog {
      width: 670rpx;
      // height: 100rpx;
      font-size: 26rpx;
      color: #666;
      background-color: #f5f5f7;
      border-radius: 10rpx;
      padding: 14rpx;
      box-sizing: border-box;
      margin-top: 20rpx;
    }
  }

  .goodsPrice {
    width: 714rpx;
    height: 174rpx;
    background: #ffffff;
    border-radius: 24rpx;
    margin-top: 20rpx;
    padding: 20rpx 24rpx;
    box-sizing: border-box;
    line-height: 50rpx;
    font-size: 28rpx;

    .priceList {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      view {
        color: #999999;
      }

      text {
        font-size: 30rpx;
      }
    }

    .Disbursements {
      width: 100%;
      text-align: right;
      font-size: 34rpx;
      font-weight: 600;

      text {
        color: #1c9b64;
      }
    }
  }
}
</style>
