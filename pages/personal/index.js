//index.js
//获取应用实例
import AV from '../../libs/av-weapp-min'

var app = getApp()
Page({
  data: {
    user: {}
  },
  onReady: function () {
  
  },
  onLoad: function () {
    const user = AV.User.current().toJSON();
    this.setData({user})
  },
  openOrderList(e) {
    wx.navigateTo({url: '../order/orderList'})
  },
  openOrderList(e) {
     const status = e.currentTarget.dataset.status
     wx.navigateTo({url: '../order/orderList?status=' + status})
  }
})
