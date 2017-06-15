import AV from '../../libs/av-weapp-min'
import _  from '../../libs/lodash'
import {Address} from '../../models/address'
import {Order, ORDER_TABLENAME} from '../../models/order'
import { ORDER_STATUS_STRING , ORDER_STATUS} from '../../utils/constants'

var app = getApp()
Page({
  data: {
    order: {},
    buttonText: ORDER_STATUS_STRING[0],
    buttonColor: '',
  },
  onLoad: function(props) {
      wx.showLoading({title: '加载数据...'})
      new AV.Query(ORDER_TABLENAME).get(props.orderId)
            .then(result => {
                const order = result.toJSON()
                let buttonColor = 'red'
                if (order.status === ORDER_STATUS.WILL_FINFISH || order.status === ORDER_STATUS.CLOSED) {
                    buttonColor = 'gray'
                }
                let buttonText = order.status == 0 ? '支付' : ORDER_STATUS_STRING[order.status]
                this.setData({order, buttonText, buttonColor})
                wx.hideLoading()
            })

 
  },
  onReady: function() {
    //Do some when page ready.

  },
  onShow: function() {

  },
  onHide: function() {
    //Do some when page hide.

  },
  changeOrderStatus(e) {
    const formId = e.detail.formId
    const status = this.data.order.status
    switch(status){
         case ORDER_STATUS.WILL_PAY:
            this.wepayRequest(formId)
            break
         case ORDER_STATUS.WILL_SNED:
            break
         case ORDER_STATUS.WILL_RECIVER:
             wx.showModal({
                title: '提示',
                content: '确认收货吗？',
                confirmColor: 'red',
                success: (res) => {
                  if (res.confirm) {
                    this.okConfrimDialog()
                  } else if (res.cancel) {
                   
                  }
                }
            })
            break
    }
  },
  wepayRequest(formId) {
     wx.showLoading({title: '正在提交订单...'})
     AV.Cloud.run('order',  {orderId: this.data.order.objectId, amount:  this.data.order.freight +  this.data.order.totalPrice, formId}).then((data) => {
              data.success = () => {
                // 支付成功
                wx.hideLoading()
                this.onLoad({orderId: this.data.order.objectId})
              }
              data.fail = ({ errMsg }) => {
                // 错误处理
                wx.hideLoading()
              }
              wx.requestPayment(data);
            }).catch(error => {
              // 错误处理
              wx.hideLoading()
            })
  },
  okConfrimDialog() {
    wx.showLoading({title: '提交中...'})
    const orderObj = AV.Object.createWithoutData(ORDER_TABLENAME, this.data.order.objectId)
                orderObj.set('status', ORDER_STATUS.WILL_FINFISH)
                orderObj.save().then((order) => {
                  wx.hideLoading()
                  this.onLoad({orderId: this.data.order.objectId})
                }, (error) => {
                  wx.hideLoading()
                });
  }
 
})
