<template>
  <view class="body-view">
    <!-- 自定义导航栏 -->
    <HeadNav
      nav-background-color="#f7f7f5"
      backImageUrl="1"
      textContent="我的订单"
      fontSize="15"
      fontWeight="600"
      style="z-index: 999999; position: relative"></HeadNav>
    <!-- 商品状态 -->
    <view class="top-menu-view" :style="{ top: top }">
      <view class="menu-topic-view" v-for="item in tabs" :id="'tabNum' + item.id" @click="swichMenu(item.id)">
        <view :class="currentTab == item.id ? 'menu-topic-act' : 'menu-topic'">
          <text class="menu-topic-text">{{ item.name }}</text>
          <view class="menu-topic-bottom">
            <view class="menu-topic-bottom-color"></view>
          </view>
        </view>
      </view>
    </view>
    <view class="allOrders">
      <!-- 订单内容 -->
      <view class="content" v-for="(item, index) in data" v-if="data.length != 0">
        <view class="contentTitle">
          <view class="contentFont">
            <view>{{ item.name }}</view>
            <text>{{ item.mobile }}</text>
          </view>
          <text>{{ orderState(item.ordersState) }}</text>
        </view>
        <view class="goodsList">
          <view class="detailBox" v-for="items in item.ordersProductList">
            <image @click="jumpDEtails(items.productId, item.ordersType, item.integralId)" :src="imageUrl + items.productImg"></image>
            <view class="fontBox">
              <view class="font1" @click="jumpDEtails(items.productId, item.ordersType, item.integralId)">{{ items.productName }}</view>
              <view :class="items.specInfo ? 'font2' : 'font22'">{{ items.specInfo }}</view>
              <view class="font3">
                <view>￥{{ items.moneyPrice }}</view>
                <text>x{{ items.number }}</text>
              </view>
            </view>
          </view>
        </view>
        <!-- 金额 -->
        <view class="priceBox" v-if="item.ordersType == '1'">￥{{ item.moneyOrder }}</view>
        <view class="priceBox" v-if="item.ordersType == '2'">{{ item.integral }}积分{{ item.moneyOrder == 0 ? "" : "+￥" + item.moneyOrder }}</view>
        <!-- 按钮功能模块 -->
        <view class="btnBox">
          <text></text>
          <view>
            <button @tap="watchDetails(item.id)">查看</button>
            <button v-if="item.ordersState == 1 || item.ordersState == 2" @click="cancelOrder(item.id, index)">取消</button>
            <button class="confirmOrder" v-if="item.ordersState == 1" @click="confirmOrder(item, index)">付款</button>
            <button v-if="item.ordersState == 3 && !item.dorpshoppingFlag" @click="confirmReceipt(item.id, index)">确认收货</button>
            <button v-if="item.ordersState == 4" @click="jumpComment(item.id)">去评价</button>
            <button v-if="item.ordersState == 4" @click="jump(item.id)">退换货</button>
          </view>
        </view>
      </view>
      <view v-if="loading" style="text-align: center; color: #999; width: 100%; height: 50rpx; line-height: 50rpx; font-size: 24rpx">
        {{ loadingText }}
      </view>
      <!-- 没有数据显示 -->
      <view class="noData" v-if="data.length == 0 && dataFlag">
        <image src="@/static/noList.png" mode=""></image>
        <view>暂无更多数据</view>
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
import { memberOrdersList, memberOrdersCancelOrder, memberOrdersConfirmOrder } from "@/api/order.js";

//导航栏状态
let tabs = ref([
  {
    id: 0,
    name: "全部",
  },
  {
    id: 1,
    name: "未付款",
  },
  {
    id: 2,
    name: "待发货",
  },
  {
    id: 3,
    name: "已发货",
  },
  {
    id: 4,
    name: "已完成",
  },
  {
    id: 5,
    name: "已取消",
  },
]);
const currentTab = ref(0);
const tabCurrent = ref("tabNum1");
const statusBarHeight = ref(0);
const top = ref("20px");
let data = ref([]);
const loading = ref(false); //加载效果开关
const loadingText = ref("加载中..."); //加载文案
const id = ref("");
const index = ref("");
const idCfm = ref("");
const indexCfm = ref("");
const money = ref("");
const code = ref("");
const page = ref(1);
const dataFlag = ref(false);

// 商品状态栏切换
function swichMenu(val) {
  currentTab.value = val;
  tabCurrent.value = "tabNum" + val;
  page.value = 1;
  data.value = [];
  getData();
}
// 商品列表数据
function getData() {
  dataFlag.value = false;
  memberOrdersList({
    state: currentTab.value,
    page: page.value,
  }).then((res) => {
    console.log(res);
    if (res.data.data.ordersList.length == 0 && page.value > 1 && data.value.length > 10) {
      loadingText.value = "到底啦~";
    } else {
      data.value = [...data.value, ...res.data.data.ordersList];
      loading.value = false;
    }
    dataFlag.value = true;
  });
}
// 查看商品详情
function watchDetails(id) {
  // alert(id)
  uni.navigateTo({
    url: "/pages/memberCenter/myOrder/orderDetail?id=" + id,
  });
}

function jumpComment(val) {
  uni.navigateTo({
    url: "/pages/memberCenter/myOrder/commentList?id=" + val,
  });
}
const alertDialog = ref();
// 取消订单
function cancelOrder(val, index) {
  alertDialog.value.open();
  id.value = val;
  index.value = index;
}
//确认
function dialogConfirm() {
  memberOrdersCancelOrder({
    id: id.value,
  }).then((res) => {
    if (currentTab.value != 0) {
      data.value.splice(index.value, 1);
    } else {
      page.value = 1;
      data.value = [];
      getData();
    }
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
function confirmReceipt(val, index) {
  alertDialogCfm.value.open();
  idCfm.value = val;
  indexCfm.value = index;
}

function dialogConfirmCfm() {
  memberOrdersConfirmOrder({
    id: idCfm.value,
  }).then((res) => {
    if (currentTab.value != 0) {
      data.value.splice(indexCfm.value, 1);
    } else {
      page.value = 1;
      data.value = [];
      getData();
    }
    if (res.data.success) {
      uni.showToast({
        icon: "none",
        duration: 3000,
        title: `操作成功`,
      });
    }
  });
}

function dialogCloseCfm() {
  alertDialogCfm.value.close();
}
// 订单状态栏数据
function orderState(data) {
  switch (data) {
    case 1:
      return "未付款";
      break;
    case 2:
      return "待发货";
      break;
    case 3:
      return "已发货";
      break;
    case 4:
      return "已完成";
      break;
    case 5:
      return "已取消";
      break;
  }
}
//付款
function confirmOrder(data) {
  // #ifdef H5
  if (!isWeixin()) {
    uni.navigateTo({
      url: "/pages/shoppingCart/paymentMethod?id=" + data.id,
    });
  } else {
    let local = encodeURIComponent(
      (window.location.href.split("#")[0].indexOf("?") == -1
        ? window.location.href.split("#")[0]
        : window.location.href.split("#")[0].split("?")[0]) +
        "#/pages/shoppingCart/paymentMethod?id=" +
        data.id
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
    url: "/pages/shoppingCart/paymentMethod?id=" + data.id,
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
//判断是否是微信浏览器

function isWeixin() {
  // #ifdef MP-WEIXIN
  return false;
  //#endif
  // #ifndef MP-WEIXIN
  let ua = window.navigator.userAgent.toLowerCase();

  if (ua.match(/MicroMessenger/i) == "micromessenger") {
    return true;
  }

  return false;
  //#endif
}

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

function jump(val) {
  uni.navigateTo({
    url: "/pages/memberCenter/myOrder/returnsExchanges?id=" + val,
  });
}
//上拉加载
onReachBottom(() => {
  if (data.value.length >= 20 * page.value) {
    page.value += 1;
    loading.value = true;
    loadingText.value = "加载中...";
    setTimeout(() => {
      getData();
    }, 800);
  } else {
    loading.value = true;
    loadingText.value = "到底啦~";
  }
});
//下拉刷新
onPullDownRefresh(() => {
  setTimeout(() => {
    data.value = [];
    page.value = 1;
    getData();
    uni.stopPullDownRefresh();
  }, 800);
});
onLoad((options) => {
  if (options.stateid) {
    swichMenu(options.stateid);
  } else {
    swichMenu(0);
  }
});
</script>

<style lang="scss" scoped>
.body-view {
  height: 100%;
  width: 100%;
  position: relative;

  /* 隐藏滚动条 */
  ::-webkit-scrollbar {
    display: none;
  }

  .noData {
    text-align: center;
    margin-top: 250rpx;
    font-size: 26rpx;
    color: gray;

    image {
      width: 100%;
      // height: 190rpx;
    }
  }

  .top-menu-view {
    display: flex;
    // justify-content: space-between;
    // position: fixed;
    top: 0rpx;
    white-space: nowrap;
    width: 100%;
    background-color: #ffffff;
    height: 86rpx;
    line-height: 86rpx;
    border-top: 1rpx solid #d8dbe6;
    overflow: auto;
    z-index: 99;

    .menu-topic-view {
      display: inline-block;
      white-space: nowrap;
      height: 86rpx;
      position: relative;
    }

    .menu-topic-text {
      font-size: 30rpx;
      white-space: nowrap;
      color: #303133;
      padding: 10rpx 30rpx;
    }

    .menu-topic-bottom {
      position: absolute;
      bottom: 0;
      width: 100%;
    }

    .menu-topic-bottom-color {
      width: 80rpx;
      height: 4rpx;
    }

    .menu-topic-act .menu-topic-bottom {
      display: flex;
      justify-content: center;
    }

    .menu-topic-act .menu-topic-bottom-color {
      background: #1c9b64;
    }

    .menu-topic-act .menu-topic-text {
      color: #1c9b64;
      font-weight: 600;
    }
  }

  .allOrders {
    width: 100%;
    // padding-top: 86rpx;

    .content {
      width: 714rpx;
      // height: 420rpx;
      background: #ffffff;
      border-radius: 24rpx;
      margin-top: 14rpx;
      margin-left: 18rpx;
      padding: 20rpx;
      box-sizing: border-box;

      .contentTitle {
        width: 680rpx;
        display: flex;
        height: 70rpx;
        line-height: 70rpx;
        align-items: center;
        justify-content: space-between;

        .contentFont {
          display: flex;

          view {
            font-size: 32rpx;
            color: #000000;
            font-weight: 600;
          }
        }

        text {
          font-size: 30rpx;
          color: #a1a1a6;
          margin-left: 12rpx;
        }
      }

      .goodsList {
        padding: 10rpx 0;
        box-sizing: border-box;
        width: 666rpx;
        background: #ffffff;
        border-radius: 24rpx;

        .detailBox {
          display: flex;
          align-items: center;

          image {
            margin: 10rpx;
            width: 160rpx;
            height: 160rpx;
          }

          .fontBox {
            // width: 100%;
            flex: 1;

            .font1 {
              line-clamp: 1;
              overflow: hidden; //超出文本隐藏
              text-overflow: ellipsis; ///超出部分省略号显示
              display: -webkit-box; //弹性盒模型
              -webkit-box-orient: vertical; //上下垂直
              -webkit-line-clamp: 1; //自定义行数
              font-size: 30rpx;
            }

            .font2 {
              // width: 252rpx;
              display: inline-block;
              padding: 0 10rpx;
              box-sizing: border-box;
              height: 36rpx;
              background: #f5f5f7;
              border-radius: 10rpx;
              font-size: 26rpx;
              line-height: 36rpx;
              text-align: center;
              color: #999999;
              margin-top: 18rpx;
              margin-bottom: 26rpx;
            }

            .font22 {
              // width: 252rpx;
              display: inline-block;
              padding: 0 10rpx;
              box-sizing: border-box;
              height: 36rpx;
              // background: #F5F5F7;
              border-radius: 10rpx;
              font-size: 26rpx;
              line-height: 36rpx;
              text-align: center;
              color: #999999;
            }

            .font3 {
              display: flex;
              justify-content: space-between;
              align-items: center;

              view {
                font-weight: 600;
                font-size: 36rpx;
                color: #dc3a2f;
              }

              text {
                font-size: 26rpx;
                color: #000;
              }
            }
          }
        }
      }

      .priceBox {
        font-weight: 600;
        font-size: 28rpx;
        text-align: right;
        color: #333333;
        margin-right: 10rpx;
      }

      .btnBox {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 714rpx;
        margin-top: 20rpx;

        text {
          font-size: 22rpx;
          color: #999999;
        }

        view {
          display: flex;
          margin-right: 40rpx;

          button {
            width: 138rpx;
            height: 56rpx;
            background: #ffffff;
            border: 2rpx solid #cacacc;
            border-radius: 34rpx;
            font-size: 24rpx;
            padding: 0;
            line-height: 56rpx;
            margin-left: 16rpx;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .confirmOrder {
            background: #1c9b64;
            border: 2rpx solid #1c9b64;
            color: #ffffff;
          }
        }
      }
    }
  }
}
</style>
