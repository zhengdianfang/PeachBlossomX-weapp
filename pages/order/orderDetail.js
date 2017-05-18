import AV from '../../libs/av-weapp-min'
import _  from '../../libs/lodash'
import Address from '../../models/address'
import Loading from '../../components/loading/loading'
import {Order, ORDER_TABLENAME} from '../../models/order'
import { ORDER_STATUS_STRING , ORDER_STATUS} from '../../utils/constants'

var app = getApp()
Page({
  data: {
    order: {},
    buttonText: ORDER_STATUS_STRING[0],
    buttonColor: ''
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
                this.setData({order, buttonText: ORDER_STATUS_STRING[order.status], buttonColor})
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
  commitOrder(e) {
  }
 
})
