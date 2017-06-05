import AV from '../../libs/av-weapp-min'
import _ from '../../libs/lodash'
import { Order, ORDER_TABLENAME } from '../../models/order' 
import { ORDER_STATUS_STRING, ORDER_STATUS } from '../../utils/constants'
import Loading from '../../components/loading/loading'
import Tab from '../../components/tab/index'

var app = getApp()

Page(Object.assign({}, Tab,{
  data: {
    items: [],
    tabs: {
      list: [
          {id: -1, title: '全部'}, 
          {id: 0, title: ORDER_STATUS_STRING[0]},
          {id: 1, title: ORDER_STATUS_STRING[1]},
          {id: 2, title: ORDER_STATUS_STRING[2]},
          {id: 3, title: ORDER_STATUS_STRING[3]},
      ],
      selectedId: -1,
      scroll: false
    },
    listLoading: true,
    showConfrimDialog: false,
  },
  status: -1,
  clickOrderId: '',

  onLoad: function(options) {
    //Do some initialize when page load.
    const tabs = _.cloneDeep(this.data.tabs)
    this.status = options.status
    tabs.selectedId = this.status
    this.setData({tabs})
    this.requestOrderList()

  },
  onReady: function() {
    //Do some when page ready.

  },
  onShow: function() {
    //Do some when page show.

  },
  onHide: function() {
    //Do some when page hide.

  },
  onUnload: function() {
    //Do some when page unload.

  },
  onPullDownRefresh: function() {
    //Do some when page pull down.
    this.requestOrderList()
  },

  requestOrderList() {
     this.setData({listLoading: true})
     const query = new AV.Query(ORDER_TABLENAME)
     if (this.status >= 0 ) {
         query.equalTo('status', this.status)
     }
     query.equalTo('user', AV.User.current())
     query.find()
        .then((results) => {
            const items = _.map(results, elem => {
                const order = elem.toJSON()
                const statusText = this.statusString(order.status)
            
                const isShowButtons = order.status === ORDER_STATUS.WILL_PAY || order.status === ORDER_STATUS.WILL_RECIVER
                const cancelButtonText = order.status === ORDER_STATUS.WILL_PAY ? '取消订单' : ''
                const comfrimButtonText = this.getConfrimButtonText(order.status)
                return {order, statusText, isShowButtons, cancelButtonText, comfrimButtonText} 
            })
            this.setData({items, listLoading: false})

        })
  },
  statusString(status) {
    return ORDER_STATUS_STRING[status]
  },
  getConfrimButtonText(status) {
    let text = ''
    switch(status){
        case ORDER_STATUS.WILL_PAY:
            text = '支付'
            break
        case ORDER_STATUS.WILL_RECIVER:
            text = '确认收货'
            break
    }
    return text
  },

  closeOrder(e) {
    Loading.show({text: '正在取消订单...'})
    const orderId = e.currentTarget.dataset.orderid
    const orderObj = AV.Object.createWithoutData(ORDER_TABLENAME, orderId)
    orderObj.set('status', ORDER_STATUS.CLOSED)
    orderObj.save().then((success) => {
       this.requestOrderList()
       Loading.hide()
    }, (error) => {
       Loading.hide()
    });
  },

  changeOrderStatus(e) {
    const orderId = e.currentTarget.dataset.orderid
    const status = e.currentTarget.dataset.status
    const amount = e.currentTarget.dataset.amount
    switch(status){
         case ORDER_STATUS.WILL_PAY:
            this.wepayRequest(orderId, amount)
            break
         case ORDER_STATUS.WILL_SNED:
            break
         case ORDER_STATUS.WILL_RECIVER:
            this.setData({showConfrimDialog: true})
            this.clickOrderId = orderId
            break
    }
  },
  
  handleZanTabChange(e) {
    var componentId = e.componentId;
    var selectedId = e.selectedId;
    this.status = selectedId;
    this.requestOrderList()
    const tabs = _.cloneDeep(this.data.tabs)
    tabs.selectedId = selectedId
    this.setData({tabs});
  },
  openOrderDetail(e) {
      const status = e.currentTarget.dataset.status
      if (_.isEmpty(status)) {
        const orderId = e.currentTarget.dataset.orderid
        wx.navigateTo({url: './orderDetail?orderId=' + orderId})
      }
  },

  wepayRequest(orderId, amount) {
     Loading.show({text: '正在提交订单...'})

     AV.Cloud.run('order', {orderId, amount}).then((data) => {
              data.success = () => {
                // 支付成功
                Loading.hide()
                this.onLoad({status: this.status})
              }
              data.fail = ({ errMsg }) => {
                // 错误处理
                Loading.hide()
                console.log(errMsg)
              }
              wx.requestPayment(data);
            }).catch(error => {
              // 错误处理
              Loading.hide()
              console.log(error)
            })
  },
  cancelConfrimDialog() {
    this.setData({showConfrimDialog: false})
  },

  okConfrimDialog(e) {
    this.setData({showConfrimDialog: false})
    if (!_.isEmpty(this.clickOrderId)) {
      Loading.show({text: '提交中...'})
      const orderObj = AV.Object.createWithoutData(ORDER_TABLENAME, this.clickOrderId)
      orderObj.set('status', ORDER_STATUS.WILL_FINFISH)
      orderObj.save().then((order) => {
        Loading.hide()
        this.onLoad({status: this.status})
      }, (error) => {
        Loading.hide()
      });
    }
  }

}))