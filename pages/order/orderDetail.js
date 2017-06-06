import AV from '../../libs/av-weapp-min'
import _  from '../../libs/lodash'
import {Address} from '../../models/address'
import Loading from '../../components/loading/loading'
import {Order, ORDER_TABLENAME} from '../../models/order'
import { ORDER_STATUS_STRING , ORDER_STATUS} from '../../utils/constants'

var app = getApp()
Page({
  data: {
    order: {},
    buttonText: ORDER_STATUS_STRING[0],
    buttonColor: '',
    showConfrimDialog: false,
  },
  onLoad: function(props) {
      Loading.show({text: '加载数据...'})
      new AV.Query(ORDER_TABLENAME).get(props.orderId)
            .then(result => {
                const order = result.toJSON()
                let buttonColor = 'red'
                if (order.status === ORDER_STATUS.WILL_FINFISH || order.status === ORDER_STATUS.CLOSED) {
                    buttonColor = 'gray'
                }
                let buttonText = order.status == 0 ? '支付' : ORDER_STATUS_STRING[order.status]
                this.setData({order, buttonText, buttonColor})
                Loading.hide()
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
  addMessage(e) {
      
  },
  changeOrderStatus(e) {
    const status = this.data.order.status
    switch(status){
         case ORDER_STATUS.WILL_PAY:
            this.wepayRequest()
            break
         case ORDER_STATUS.WILL_SNED:
            break
         case ORDER_STATUS.WILL_RECIVER:
            this.setData({showConfrimDialog: true})
            
            break
    }
  },
  wepayRequest() {
     Loading.show({text: '正在提交订单...'})
     AV.Cloud.run('order',  {orderId: this.data.order.objectId, amount:  this.data.order.freight +  this.data.order.totalPrice}).then((data) => {
              data.success = () => {
                // 支付成功
                Loading.hide()
                this.onLoad({orderId: this.data.order.objectId})
              }
              data.fail = ({ errMsg }) => {
                // 错误处理
                Loading.hide()
              }
              wx.requestPayment(data);
            }).catch(error => {
              // 错误处理
              Loading.hide()
            })
  },

  cancelConfrimDialog() {
    this.setData({showConfrimDialog: false})
  },

  okConfrimDialog(e) {
    this.setData({showConfrimDialog: false})
    Loading.show({text: '提交中...'})
    const orderObj = AV.Object.createWithoutData(ORDER_TABLENAME, this.data.order.objectId)
                orderObj.set('status', ORDER_STATUS.WILL_FINFISH)
                orderObj.save().then((order) => {
                  Loading.hide()
                  this.onLoad({orderId: this.data.order.objectId})
                }, (error) => {
                  Loading.hide()
                });
  }
 
})
